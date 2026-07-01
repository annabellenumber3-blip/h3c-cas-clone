"""
CVK Agent Daemon — main agent process that runs on each CVK hypervisor host.

This is the main orchestrator that wires together:
  - CvkFeignClient:   REST client for CVM communication
  - CvkThreadPool:    Command execution thread pool
  - ScpClient:        SCP file transfer
  - HostRegistrar:    Host registration with CVM
  - DomainManager:    VM lifecycle management via libvirt
  - StorageManager:   Storage pool/volume management
  - NetworkManager:   OVS networking
  - MigrationCoordinator: VM live/cold migration
  - HeartbeatService: Health reporting to CVM
  - EventBus:         RabbitMQ event publishing

The agent runs as a systemd service (cvkagentd) and listens for commands
from the CVM management server. The CVM calls the CVK agent's /compute/*
REST endpoints to execute operations.

Startup sequence:
  1. Load configuration from /etc/cvk/cvk_agent.conf
  2. Initialize all subsystems
  3. Register with CVM (report host hardware info)
  4. Start heartbeat service
  5. Connect to RabbitMQ event bus
  6. Start REST API server for CVM commands
  7. Enter event loop

Shutdown sequence:
  1. Stop heartbeat
  2. Disconnect RabbitMQ
  3. Stop REST server
  4. Shutdown thread pool
  5. Close libvirt connection
  6. Close storage connections
"""

from __future__ import annotations

import logging
import signal
import sys
import threading
import time
from typing import Any, Dict, Optional

from .config import CvkConfig
from .feign import CvkFeignClient
from .threadpool import CvkThreadPool
from .scp import ScpClient
from .host import HostRegistrar
from .domain import DomainManager
from .storage import StorageManager
from .network import NetworkManager
from .migration import MigrationCoordinator
from .heartbeat import HeartbeatService
from .eventbus import (
    EventBus, NoopEventBus, HttpEventBus, RabbitMqEventBus,
    EventPublisher, CvkEvent,
)

log = logging.getLogger(__name__)


class CvkAgent:
    """Main CVK agent daemon.

    Runs on each CVK hypervisor host and manages all local virtualization
    operations (VM lifecycle, storage, networking) under the direction of
    the CVM management server.

    Usage:
        agent = CvkAgent()
        agent.initialize()
        agent.start()
        # ... agent is running ...
        agent.shutdown()
    """

    def __init__(self, config: Optional[CvkConfig] = None,
                 config_path: str = "/etc/cvk/cvk_agent.conf"):
        """Initialize the CVK agent.

        Args:
            config: Optional pre-built config (for testing)
            config_path: Path to cvk_agent.conf
        """
        self._config = config or CvkConfig.from_file(config_path)
        self._running = False
        self._shutdown_event = threading.Event()

        # Subsystems (initialized in initialize())
        self.feign: Optional[CvkFeignClient] = None
        self.threadpool: Optional[CvkThreadPool] = None
        self.scp: Optional[ScpClient] = None
        self.host_registrar: Optional[HostRegistrar] = None
        self.domain_mgr: Optional[DomainManager] = None
        self.storage_mgr: Optional[StorageManager] = None
        self.network_mgr: Optional[NetworkManager] = None
        self.migration: Optional[MigrationCoordinator] = None
        self.heartbeat: Optional[HeartbeatService] = None
        self.event_bus: Optional[EventBus] = None
        self.event_publisher: Optional[EventPublisher] = None

    @property
    def config(self) -> CvkConfig:
        return self._config

    @property
    def is_running(self) -> bool:
        return self._running

    # ---- Initialization ----

    def initialize(self, mock_mode: bool = False) -> bool:
        """Initialize all agent subsystems.

        Args:
            mock_mode: If True, use mock backends for all subsystems
                       (suitable for testing without hardware/KVM/OVS)

        Returns:
            True if initialization succeeded
        """
        log.info("Initializing CVK agent v1.0.0 (host=%s, mock=%s)",
                 self._config.host_name, mock_mode)

        try:
            # 1. Feign REST client (HTTP transport to CVM)
            self.feign = CvkFeignClient(self._config)
            log.info("Feign REST client initialized (CVM=%s:%d)",
                     self._config.cvm_host, self._config.cvm_port)

            # 2. Thread pool
            self.threadpool = CvkThreadPool(self._config)
            self.threadpool.start()
            log.info("Thread pool started")

            # 3. SCP client
            self.scp = ScpClient(self._config)
            if mock_mode:
                self.scp.set_mock_mode(True)

            # 4. Host registrar
            self.host_registrar = HostRegistrar(self._config, self.feign)

            # 5. Domain manager (VM lifecycle via libvirt)
            self.domain_mgr = DomainManager(
                self._config, self.feign, self.threadpool,
            )
            if mock_mode:
                self.domain_mgr.set_mock_mode(True)

            # 6. Storage manager
            self.storage_mgr = StorageManager(self._config)
            if mock_mode:
                self.storage_mgr.set_mock_mode(True)

            # 7. Network manager
            self.network_mgr = NetworkManager(self._config)
            if mock_mode:
                self.network_mgr.set_mock_mode(True)

            # 8. Migration coordinator
            self.migration = MigrationCoordinator(
                self._config, self.domain_mgr, self.storage_mgr,
                self.network_mgr, self.scp, self.threadpool,
            )

            # 9. Heartbeat service
            self.heartbeat = HeartbeatService(
                self._config, self.feign, self.domain_mgr, self.storage_mgr,
            )

            # 10. Event bus (RabbitMQ or HTTP callback)
            if mock_mode:
                self.event_bus = NoopEventBus()
            else:
                # Try RabbitMQ first, fall back to HTTP callback
                rmq = RabbitMqEventBus(self._config)
                if rmq.connect():
                    self.event_bus = rmq
                    log.info("Connected to RabbitMQ event bus")
                else:
                    log.warning("RabbitMQ not available, using HTTP event bus")
                    self.event_bus = HttpEventBus(self._config, self.feign)

            self.event_publisher = EventPublisher(self._config, self.event_bus)

            log.info("CVK agent initialization complete")
            return True

        except Exception as exc:
            log.error("CVK agent initialization failed: %s", exc)
            return False

    # ---- Start / Stop ----

    def start(self) -> None:
        """Start the CVK agent daemon.

        This starts the heartbeat service, registers with CVM, and
        enters the main event loop.
        """
        if self._running:
            return

        if self.feign is None:
            raise RuntimeError("Agent not initialized — call initialize() first")

        self._running = True
        self._shutdown_event.clear()

        # Register with CVM
        try:
            self.host_registrar.register_with_cvm()
            log.info("Registered with CVM: %s", self._config.host_name)
        except Exception as exc:
            log.warning("CVM registration failed (will retry): %s", exc)

        # Start heartbeat
        self.heartbeat.start()
        log.info("Heartbeat service started")

        # Connect event bus
        if not self.event_bus.is_connected():
            self.event_bus.connect()

        # Publish host UP event
        self.event_publisher.host_up()

        # Install signal handlers for graceful shutdown
        signal.signal(signal.SIGTERM, self._signal_handler)
        signal.signal(signal.SIGINT, self._signal_handler)

        log.info("CVK agent started and running")

        # Enter main loop (block until shutdown)
        self._main_loop()

    def _main_loop(self) -> None:
        """Main event loop. Runs until shutdown is requested."""
        while not self._shutdown_event.is_set():
            try:
                self._shutdown_event.wait(timeout=1.0)

                # Check CVM connectivity
                if not self.heartbeat.cvm_connected:
                    # Try to reconnect to event bus
                    if not self.event_bus.is_connected():
                        self.event_bus.connect()

            except Exception as exc:
                log.error("Main loop error: %s", exc)

    def shutdown(self) -> None:
        """Shutdown the CVK agent gracefully."""
        if not self._running:
            return

        log.info("Shutting down CVK agent...")
        self._running = False
        self._shutdown_event.set()

        # Publish host DOWN event before stopping services
        if self.event_publisher:
            try:
                self.event_publisher.host_down("Agent shutdown")
            except Exception:
                pass

        # Stop heartbeat
        if self.heartbeat:
            try:
                self.heartbeat.stop()
            except Exception:
                pass

        # Disconnect event bus
        if self.event_bus:
            try:
                self.event_bus.disconnect()
            except Exception:
                pass

        # Stop thread pool
        if self.threadpool:
            try:
                self.threadpool.stop(wait=False)
            except Exception:
                pass

        # Close domain manager
        if self.domain_mgr:
            try:
                self.domain_mgr.close()
            except Exception:
                pass

        # Close storage
        if self.storage_mgr:
            try:
                self.storage_mgr.close()
            except Exception:
                pass

        # Close Feign client
        if self.feign:
            try:
                self.feign.close()
            except Exception:
                pass

        log.info("CVK agent shutdown complete")

    def _signal_handler(self, signum: int, frame: Any) -> None:
        """Handle shutdown signals."""
        log.info("Received signal %d, shutting down...", signum)
        self.shutdown()

    # ---- Status ----

    def get_status(self) -> Dict[str, Any]:
        """Get agent status report."""
        return {
            "version": "1.0.0",
            "hostId": self._config.host_id,
            "hostName": self._config.host_name,
            "hostIp": self._config.host_ip,
            "running": self._running,
            "cvmConnected": self.heartbeat.cvm_connected if self.heartbeat else False,
            "eventBusConnected": self.event_bus.is_connected() if self.event_bus else False,
            "heartbeatStats": self.heartbeat.get_stats() if self.heartbeat else {},
            "threadPoolStats": self.threadpool.stats() if self.threadpool else {},
            "vmCount": len(self.domain_mgr.list_domains()) if self.domain_mgr else 0,
            "migrations": {
                "active": len(self.migration.list_active_migrations()) if self.migration else 0,
            },
            "storage": self.storage_mgr.get_pool_summary() if self.storage_mgr else {},
            "network": self.network_mgr.get_network_summary() if self.network_mgr else {},
        }
