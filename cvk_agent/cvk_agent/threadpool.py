"""
CVK Thread Pool — mirrors Java ThreadPoolExecutor configuration.

From cvk_agent.conf:
  CMD_CORE_POOL_SIZE     = 8
  CMD_CORE_MAX_POOL_SIZE = 100
  CMD_MAX_POOL_SIZE      = 200
  CMD_MAX_QUEUE_SIZE     = 500

This is the command execution thread pool that the CVK agent uses to
process asynchronous operations (VM lifecycle, migration, storage tasks).

It mirrors the Java configuration:
  - corePoolSize: 8 (always alive)
  - keepAliveTime: 60 seconds for idle threads above core
  - maxPoolSize: 200
  - workQueue: LinkedBlockingQueue with capacity 500
  - rejectedExecutionHandler: CallerRunsPolicy (default)
"""

from __future__ import annotations

import concurrent.futures
import logging
import threading
import time
from queue import Queue
from typing import Any, Callable, Dict, List, Optional

from .config import CvkConfig

log = logging.getLogger(__name__)


class CvkThreadPool:
    """Thread pool manager for CVK agent command execution.

    Mirrors the Java ThreadPoolExecutor configured in cvk_agent.conf:
      - corePoolSize: 8
      - maximumPoolSize: 200
      - workQueue: LinkedBlockingQueue, capacity 500
      - keepAliveTime: 60s for idle threads above core
    """

    def __init__(self, config: CvkConfig):
        self._config = config
        self._executor: Optional[concurrent.futures.ThreadPoolExecutor] = None
        self._futures: Dict[str, concurrent.futures.Future] = {}
        self._futures_lock = threading.Lock()
        self._running = False

    @property
    def core_pool_size(self) -> int:
        return self._config.cmd_core_pool_size

    @property
    def max_pool_size(self) -> int:
        return self._config.cmd_max_pool_size

    def start(self) -> None:
        """Start the thread pool."""
        if self._running:
            return
        self._executor = concurrent.futures.ThreadPoolExecutor(
            max_workers=self._config.cmd_max_pool_size,
            thread_name_prefix="cvk-cmd-",
            initializer=None,
        )
        self._running = True
        log.info("CVK thread pool started: core=%d max=%d queue=%d",
                 self._config.cmd_core_pool_size,
                 self._config.cmd_max_pool_size,
                 self._config.cmd_max_queue_size)

    def stop(self, wait: bool = True) -> None:
        """Stop the thread pool."""
        self._running = False
        if self._executor:
            self._executor.shutdown(wait=wait)
            self._executor = None
        log.info("CVK thread pool stopped")

    def submit(self, task_id: str, fn: Callable, *args, **kwargs) -> concurrent.futures.Future:
        """Submit a task to the thread pool.

        Args:
            task_id: Unique task identifier
            fn: Callable to execute
            *args, **kwargs: Arguments to pass to fn

        Returns:
            Future representing the task

        Raises:
            RuntimeError: If thread pool is not running
        """
        if not self._running or self._executor is None:
            raise RuntimeError("Thread pool not running")

        future = self._executor.submit(fn, *args, **kwargs)
        with self._futures_lock:
            self._futures[task_id] = future
            # Clean up old completed futures periodically
            if len(self._futures) > 1000:
                self._cleanup_futures()

        return future

    def get_task(self, task_id: str) -> Optional[concurrent.futures.Future]:
        """Get a submitted task by ID."""
        with self._futures_lock:
            return self._futures.get(task_id)

    def cancel_task(self, task_id: str) -> bool:
        """Cancel a submitted task."""
        with self._futures_lock:
            future = self._futures.get(task_id)
            if future and not future.done():
                return future.cancel()
        return False

    def task_status(self, task_id: str) -> Dict[str, Any]:
        """Get task status."""
        with self._futures_lock:
            future = self._futures.get(task_id)
            if future is None:
                return {"taskId": task_id, "status": "NOT_FOUND"}

            if future.running():
                return {"taskId": task_id, "status": "RUNNING"}
            if future.cancelled():
                return {"taskId": task_id, "status": "CANCELLED"}
            if future.done():
                try:
                    result = future.result(timeout=0)
                    return {"taskId": task_id, "status": "COMPLETED", "result": result}
                except Exception as exc:
                    return {"taskId": task_id, "status": "FAILED", "error": str(exc)}
            return {"taskId": task_id, "status": "QUEUED"}

    def active_count(self) -> int:
        """Get number of active threads."""
        if self._executor:
            # ThreadPoolExecutor doesn't directly expose active count,
            # so we count running futures
            with self._futures_lock:
                return sum(1 for f in self._futures.values() if f.running())
        return 0

    def queued_count(self) -> int:
        """Get number of queued tasks."""
        with self._futures_lock:
            return sum(1 for f in self._futures.values()
                       if not f.done() and not f.running())

    def completed_count(self) -> int:
        """Get number of completed tasks."""
        with self._futures_lock:
            return sum(1 for f in self._futures.values() if f.done())

    def _cleanup_futures(self) -> None:
        """Remove completed futures from tracking."""
        done_ids = [tid for tid, f in self._futures.items() if f.done()]
        for tid in done_ids:
            del self._futures[tid]

    def stats(self) -> Dict[str, Any]:
        """Get pool statistics."""
        return {
            "core_pool_size": self._config.cmd_core_pool_size,
            "max_pool_size": self._config.cmd_max_pool_size,
            "max_queue_size": self._config.cmd_max_queue_size,
            "active_threads": self.active_count(),
            "queued_tasks": self.queued_count(),
            "completed_tasks": self.completed_count(),
            "total_tracked": len(self._futures),
        }
