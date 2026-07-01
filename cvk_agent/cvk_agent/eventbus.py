"""
CVK Event Bus — mirrors CasEventBus + RabbitMQ integration.

The CVK agent publishes events to the CVM management server's RabbitMQ
event bus. Events are used for:
  - VM state changes (power on/off, pause/resume, migration)
  - Host health status changes
  - Storage pool changes
  - Network events
  - Alarm/alert conditions

RabbitMQ configuration (from cvk_agent.conf / driver.py CAS opts):
  - vhost:    cloudMsgHost
  - exchange: cloud_vm_exchange_direct  (type: direct)
  - queue:    cas_vm_event_nova_compute
  - port:     5672
  - user:     cloud / Cl@oud13
  - queue max length: 256 MB
  - queue mode: lazy

Event format (JSON):
  {
    "eventId": "uuid",
    "timestamp": "ISO8601",
    "eventType": "VM_STARTED|VM_STOPPED|VM_PAUSED|VM_RESUMED|HOST_UP|HOST_DOWN|...",
    "hostId": "host-001",
    "hostName": "cvk-node-1",
    "payload": { ... event-specific data ... }
  }
"""

from __future__ import annotations

import json
import logging
import threading
import time
import uuid as uuid_lib
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional

from .config import CvkConfig

log = logging.getLogger(__name__)

# Try to import pika for RabbitMQ
try:
    import pika
    HAS_PIKA = True
except ImportError:
    HAS_PIKA = False
    log.warning("pika not installed — RabbitMQ events will use mock/noop")


# ============================================================================
# Event Types (matching CAS event types)
# ============================================================================
EVENT_VM_STARTED = "VM_STARTED"
EVENT_VM_STOPPED = "VM_STOPPED"
EVENT_VM_PAUSED = "VM_PAUSED"
EVENT_VM_RESUMED = "VM_RESUMED"
EVENT_VM_SUSPENDED = "VM_SUSPENDED"
EVENT_VM_MIGRATED = "VM_MIGRATED"
EVENT_VM_CREATED = "VM_CREATED"
EVENT_VM_DELETED = "VM_DELETED"
EVENT_VM_ERROR = "VM_ERROR"

EVENT_HOST_UP = "HOST_UP"
EVENT_HOST_DOWN = "HOST_DOWN"
EVENT_HOST_MAINTENANCE = "HOST_MAINTENANCE"
EVENT_HOST_OVERLOAD = "HOST_OVERLOAD"

EVENT_STORAGE_LOW = "STORAGE_LOW"
EVENT_STORAGE_FULL = "STORAGE_FULL"
EVENT_STORAGE_ERROR = "STORAGE_ERROR"

EVENT_NETWORK_UP = "NETWORK_UP"
EVENT_NETWORK_DOWN = "NETWORK_DOWN"
EVENT_NETWORK_ERROR = "NETWORK_ERROR"


class CvkEvent:
    """A CVK event for publication on the event bus."""

    def __init__(self, event_type: str, host_id: str, host_name: str,
                 payload: Optional[Dict[str, Any]] = None):
        self.event_id = str(uuid_lib.uuid4())
        self.timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        self.event_type = event_type
        self.host_id = host_id
        self.host_name = host_name
        self.payload = payload or {}

    def to_json(self) -> str:
        """Serialize to JSON for RabbitMQ."""
        return json.dumps({
            "eventId": self.event_id,
            "timestamp": self.timestamp,
            "eventType": self.event_type,
            "hostId": self.host_id,
            "hostName": self.host_name,
            "payload": self.payload,
        })

    def to_dict(self) -> Dict[str, Any]:
        return {
            "eventId": self.event_id,
            "timestamp": self.timestamp,
            "eventType": self.event_type,
            "hostId": self.host_id,
            "hostName": self.host_name,
            "payload": self.payload,
        }


class EventBus(ABC):
    """Abstract event bus for CVK events.

    Can be backed by RabbitMQ (production), HTTP callback (simple),
    or no-op (testing).
    """

    @abstractmethod
    def publish(self, event: CvkEvent) -> bool:
        """Publish an event to the bus."""
        ...

    @abstractmethod
    def connect(self) -> bool:
        """Connect to the event bus."""
        ...

    @abstractmethod
    def disconnect(self) -> None:
        """Disconnect from the event bus."""
        ...

    @abstractmethod
    def is_connected(self) -> bool:
        """Check if connected to the event bus."""
        ...


class NoopEventBus(EventBus):
    """No-op event bus for testing/environments without RabbitMQ."""

    def __init__(self):
        self._events: List[CvkEvent] = []
        self._connected = False

    def publish(self, event: CvkEvent) -> bool:
        log.debug("Noop event: %s - %s", event.event_type, event.payload)
        self._events.append(event)
        return True

    def connect(self) -> bool:
        self._connected = True
        return True

    def disconnect(self) -> None:
        self._connected = False

    def is_connected(self) -> bool:
        return self._connected

    def get_events(self) -> List[CvkEvent]:
        return list(self._events)

    def clear(self) -> None:
        self._events.clear()


class HttpEventBus(EventBus):
    """HTTP callback-based event bus.

    Sends events to CVM via REST API instead of RabbitMQ.
    Uses the Feign client for transport.
    """

    def __init__(self, config: CvkConfig, feign: "CvkFeignClient"):
        self._config = config
        self._feign = feign
        self._connected = False

    def connect(self) -> bool:
        """Check CVM connectivity."""
        try:
            status, _, _ = self._feign.get("/cas/casrs/operator/test")
            self._connected = (status == 204)
            return self._connected
        except Exception:
            self._connected = False
            return False

    def disconnect(self) -> None:
        self._connected = False

    def is_connected(self) -> bool:
        return self._connected

    def publish(self, event: CvkEvent) -> bool:
        """Publish event via HTTP POST to CVM.

        CVM events endpoint: /cas/casrs/events
        """
        try:
            event_xml = self._event_to_xml(event)
            status, _, _ = self._feign.post(
                "/cas/casrs/events",
                body=event_xml,
            )
            success = status in (200, 201, 204)
            if not success:
                log.warning("Event publish failed: HTTP %d for %s",
                            status, event.event_type)
            return success
        except Exception as exc:
            log.error("Event publish error: %s", exc)
            return False

    @staticmethod
    def _event_to_xml(event: CvkEvent) -> str:
        """Convert event to CAS XML format."""
        xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml += '<event>\n'
        xml += f'  <eventId>{event.event_id}</eventId>\n'
        xml += f'  <timestamp>{event.timestamp}</timestamp>\n'
        xml += f'  <eventType>{event.event_type}</eventType>\n'
        xml += f'  <hostId>{event.host_id}</hostId>\n'
        xml += f'  <hostName>{event.host_name}</hostName>\n'
        xml += '  <payload>\n'
        for key, value in event.payload.items():
            xml += f'    <{key}>{value}</{key}>\n'
        xml += '  </payload>\n'
        xml += '</event>\n'
        return xml


class RabbitMqEventBus(EventBus):
    """RabbitMQ event bus — mirrors CasEventBus + RabbitMQ integration.

    RabbitMQ configuration (from cvk_agent.conf):
      - vhost:    cloudMsgHost
      - exchange: cloud_vm_exchange_direct (type: direct)
      - queue:    cas_vm_event_nova_compute
      - port:     5672
      - user:     cloud / Cl@oud13
      - queue max length: 256 MB
      - queue mode: lazy

    The exchange type is 'direct' with routing key matching the queue name.
    """

    def __init__(self, config: CvkConfig):
        self._config = config
        self._connection: Any = None
        self._channel: Any = None
        self._connected = False
        self._reconnect_lock = threading.Lock()

        # Determine RabbitMQ host (default to CVM host)
        self._rmq_host = config.rmq_host or config.cvm_host

    def connect(self) -> bool:
        """Connect to RabbitMQ and declare exchange/queue."""
        if not HAS_PIKA:
            log.warning("pika not installed — cannot connect to RabbitMQ")
            return False

        with self._reconnect_lock:
            if self._connected:
                return True

            try:
                credentials = pika.PlainCredentials(
                    self._config.rmq_user,
                    self._config.rmq_password,
                )
                parameters = pika.ConnectionParameters(
                    host=self._rmq_host,
                    port=self._config.rmq_port,
                    virtual_host=self._config.rmq_vhost,
                    credentials=credentials,
                    heartbeat=60,
                    connection_attempts=3,
                    retry_delay=5,
                )
                self._connection = pika.BlockingConnection(parameters)
                self._channel = self._connection.channel()

                # Declare exchange (direct type)
                self._channel.exchange_declare(
                    exchange=self._config.rmq_exchange,
                    exchange_type="direct",
                    durable=True,
                    auto_delete=False,
                )

                # Declare queue with lazy mode and max length
                args = {
                    "x-queue-mode": self._config.rmq_queue_mode,
                    "x-max-length-bytes": self._config.rmq_queue_max_length_mb * 1024 * 1024,
                }
                self._channel.queue_declare(
                    queue=self._config.rmq_queue,
                    durable=True,
                    auto_delete=False,
                    arguments=args,
                )

                # Bind queue to exchange
                self._channel.queue_bind(
                    queue=self._config.rmq_queue,
                    exchange=self._config.rmq_exchange,
                    routing_key=self._config.rmq_queue,
                )

                self._connected = True
                log.info("Connected to RabbitMQ at %s:%d (vhost=%s, exchange=%s)",
                         self._rmq_host, self._config.rmq_port,
                         self._config.rmq_vhost, self._config.rmq_exchange)
                return True

            except Exception as exc:
                log.error("Failed to connect to RabbitMQ: %s", exc)
                self._connected = False
                return False

    def disconnect(self) -> None:
        """Disconnect from RabbitMQ."""
        with self._reconnect_lock:
            try:
                if self._channel:
                    self._channel.close()
            except Exception:
                pass
            try:
                if self._connection:
                    self._connection.close()
            except Exception:
                pass
            self._channel = None
            self._connection = None
            self._connected = False
            log.info("Disconnected from RabbitMQ")

    def is_connected(self) -> bool:
        """Check if connected."""
        if not self._connected:
            return False
        if self._connection and self._connection.is_open:
            return True
        return False

    def publish(self, event: CvkEvent) -> bool:
        """Publish an event to the RabbitMQ exchange.

        Event format: JSON string
        Routing key: queue name (direct exchange)
        """
        if not self.is_connected():
            if not self.connect():
                log.warning("Cannot publish event: not connected to RabbitMQ")
                return False

        try:
            message = event.to_json()
            self._channel.basic_publish(
                exchange=self._config.rmq_exchange,
                routing_key=self._config.rmq_queue,
                body=message,
                properties=pika.BasicProperties(
                    delivery_mode=2,  # persistent
                    content_type="application/json",
                    message_id=event.event_id,
                    timestamp=int(time.time()),
                ),
            )
            log.debug("Published event: %s (%s)", event.event_type, event.event_id)
            return True
        except Exception as exc:
            log.error("Failed to publish event: %s", exc)
            self._connected = False
            return False


class EventPublisher:
    """High-level event publisher for the CVK agent.

    Provides convenience methods for publishing common event types.
    """

    def __init__(self, config: CvkConfig, event_bus: EventBus):
        self._config = config
        self._bus = event_bus

    def connect(self) -> bool:
        return self._bus.connect()

    def disconnect(self) -> None:
        self._bus.disconnect()

    # VM events
    def vm_started(self, vm_name: str, vm_uuid: str) -> bool:
        return self._bus.publish(CvkEvent(
            EVENT_VM_STARTED, self._config.host_id, self._config.host_name,
            {"vmName": vm_name, "vmUuid": vm_uuid},
        ))

    def vm_stopped(self, vm_name: str, vm_uuid: str) -> bool:
        return self._bus.publish(CvkEvent(
            EVENT_VM_STOPPED, self._config.host_id, self._config.host_name,
            {"vmName": vm_name, "vmUuid": vm_uuid},
        ))

    def vm_paused(self, vm_name: str, vm_uuid: str) -> bool:
        return self._bus.publish(CvkEvent(
            EVENT_VM_PAUSED, self._config.host_id, self._config.host_name,
            {"vmName": vm_name, "vmUuid": vm_uuid},
        ))

    def vm_resumed(self, vm_name: str, vm_uuid: str) -> bool:
        return self._bus.publish(CvkEvent(
            EVENT_VM_RESUMED, self._config.host_id, self._config.host_name,
            {"vmName": vm_name, "vmUuid": vm_uuid},
        ))

    def vm_migrated(self, vm_name: str, vm_uuid: str,
                    source_host: str, target_host: str) -> bool:
        return self._bus.publish(CvkEvent(
            EVENT_VM_MIGRATED, self._config.host_id, self._config.host_name,
            {"vmName": vm_name, "vmUuid": vm_uuid,
             "sourceHost": source_host, "targetHost": target_host},
        ))

    def vm_error(self, vm_name: str, vm_uuid: str, error: str) -> bool:
        return self._bus.publish(CvkEvent(
            EVENT_VM_ERROR, self._config.host_id, self._config.host_name,
            {"vmName": vm_name, "vmUuid": vm_uuid, "error": error},
        ))

    # Host events
    def host_up(self) -> bool:
        return self._bus.publish(CvkEvent(
            EVENT_HOST_UP, self._config.host_id, self._config.host_name,
        ))

    def host_down(self, reason: str = "") -> bool:
        return self._bus.publish(CvkEvent(
            EVENT_HOST_DOWN, self._config.host_id, self._config.host_name,
            {"reason": reason},
        ))

    # Storage events
    def storage_low(self, pool_name: str, free_bytes: int) -> bool:
        return self._bus.publish(CvkEvent(
            EVENT_STORAGE_LOW, self._config.host_id, self._config.host_name,
            {"poolName": pool_name, "freeBytes": free_bytes},
        ))

    def storage_full(self, pool_name: str) -> bool:
        return self._bus.publish(CvkEvent(
            EVENT_STORAGE_FULL, self._config.host_id, self._config.host_name,
            {"poolName": pool_name},
        ))

    # Network events
    def network_down(self, interface: str) -> bool:
        return self._bus.publish(CvkEvent(
            EVENT_NETWORK_DOWN, self._config.host_id, self._config.host_name,
            {"interface": interface},
        ))
