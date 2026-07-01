"""
SCP File Transfer Client — mirrors Java SecureShellManager + scp config.

The CVK agent uses SCP (Secure Copy Protocol) for file transfer between
CVK hosts and the CVM management server. This mirrors the Java
SecureShellManager and SSH client used in the CVM codebase.

Key timeouts (from cvk_agent.conf):
  - SCP wait time:        43200s (12 hours) — total wait for SCP operation
  - Default cmd wait time: 600s   (10 minutes)
  - Connect timeout:       30s
  - Server alive interval: 60s

Uses paramiko (if available) for SSH/SCP operations, with a mock
implementation for environments without SSH libraries.
"""

from __future__ import annotations

import logging
import os
import subprocess
import time
from typing import Optional, Tuple

from .config import CvkConfig

log = logging.getLogger(__name__)

# Try to import paramiko for real SCP
try:
    import paramiko
    HAS_PARAMIKO = True
except ImportError:
    HAS_PARAMIKO = False
    log.warning("paramiko not installed — SCP will use subprocess/mock")


class ScpResult:
    """Result of an SCP operation."""
    def __init__(self, success: bool, stdout: str = "", stderr: str = "",
                 exit_code: int = 0, duration: float = 0.0):
        self.success = success
        self.stdout = stdout
        self.stderr = stderr
        self.exit_code = exit_code
        self.duration = duration

    def __repr__(self) -> str:
        return f"ScpResult(success={self.success}, exit={self.exit_code}, " \
               f"duration={self.duration:.1f}s)"


class ScpClient:
    """SCP client for file transfer between CVK hosts and CVM.

    Mirrors the Java SecureShellManager and SSH client used in the
    CVM codebase for transferring VM images, snapshots, and config files.

    Supports two backends:
      1. paramiko (Python SSH library) — preferred
      2. subprocess (system scp/ssh commands) — fallback
      3. Mock backend — for testing without SSH
    """

    def __init__(self, config: CvkConfig):
        self._config = config
        self._mock_mode: bool = False

    def set_mock_mode(self, enabled: bool = True) -> None:
        """Enable mock mode for testing without real SSH."""
        self._mock_mode = enabled

    # ---- SCP Upload (CVK → Remote) ----

    def upload(self, local_path: str, remote_host: str, remote_path: str,
               remote_user: str = "root", remote_port: int = 22,
               timeout: Optional[int] = None,
               ) -> ScpResult:
        """Upload a file via SCP.

        Args:
            local_path: Local file path
            remote_host: Remote host IP
            remote_path: Remote destination path
            remote_user: SSH username
            remote_port: SSH port
            timeout: Override SCP wait time

        Returns:
            ScpResult with success/failure and output
        """
        timeout = timeout or self._config.scp_wait_time
        start = time.monotonic()

        if self._mock_mode:
            return self._mock_transfer("upload", local_path, remote_host, remote_path,
                                       duration=0.1)

        if HAS_PARAMIKO:
            return self._paramiko_upload(local_path, remote_host, remote_path,
                                         remote_user, remote_port, timeout, start)
        else:
            return self._subprocess_scp("upload", local_path, remote_host,
                                        remote_path, remote_user, remote_port,
                                        timeout, start)

    # ---- SCP Download (Remote → CVK) ----

    def download(self, remote_host: str, remote_path: str, local_path: str,
                 remote_user: str = "root", remote_port: int = 22,
                 timeout: Optional[int] = None,
                 ) -> ScpResult:
        """Download a file via SCP.

        Args:
            remote_host: Remote host IP
            remote_path: Remote source path
            local_path: Local destination path
            remote_user: SSH username
            remote_port: SSH port
            timeout: Override SCP wait time

        Returns:
            ScpResult with success/failure and output
        """
        timeout = timeout or self._config.scp_wait_time
        start = time.monotonic()

        if self._mock_mode:
            return self._mock_transfer("download", remote_path, local_path, remote_host,
                                       duration=0.1)

        if HAS_PARAMIKO:
            return self._paramiko_download(remote_host, remote_path, local_path,
                                           remote_user, remote_port, timeout, start)
        else:
            return self._subprocess_scp("download", local_path, remote_host,
                                        remote_path, remote_user, remote_port,
                                        timeout, start)

    # ---- SSH Command Execution ----

    def execute_command(self, remote_host: str, command: str,
                        remote_user: str = "root", remote_port: int = 22,
                        timeout: Optional[int] = None,
                        ) -> ScpResult:
        """Execute a command on a remote host via SSH.

        Mirrors the Java SSHSession execute pattern.

        Args:
            remote_host: Remote host IP
            command: Shell command to execute
            remote_user: SSH username
            remote_port: SSH port
            timeout: Override default cmd wait time

        Returns:
            ScpResult with stdout, stderr, exit code
        """
        timeout = timeout or self._config.scp_default_cmd_wait_time
        start = time.monotonic()

        if self._mock_mode:
            return self._mock_execute(remote_host, command)

        if HAS_PARAMIKO:
            return self._paramiko_execute(remote_host, command, remote_user,
                                          remote_port, timeout, start)
        else:
            return self._subprocess_ssh(remote_host, command, remote_user,
                                        remote_port, timeout, start)

    # ---- Paramiko implementation ----

    def _paramiko_upload(self, local_path: str, remote_host: str,
                         remote_path: str, remote_user: str, remote_port: int,
                         timeout: int, start: float) -> ScpResult:
        """Upload using paramiko."""
        try:
            client = paramiko.SSHClient()
            client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            client.connect(
                hostname=remote_host,
                port=remote_port,
                username=remote_user,
                timeout=self._config.scp_connect_timeout,
            )
            sftp = client.open_sftp()
            sftp.put(local_path, remote_path)
            sftp.close()
            client.close()
            duration = time.monotonic() - start
            return ScpResult(success=True, duration=duration)
        except Exception as exc:
            duration = time.monotonic() - start
            log.error("SCP upload failed: %s -> %s:%s: %s",
                      local_path, remote_host, remote_path, exc)
            return ScpResult(success=False, stderr=str(exc), duration=duration)

    def _paramiko_download(self, remote_host: str, remote_path: str,
                           local_path: str, remote_user: str, remote_port: int,
                           timeout: int, start: float) -> ScpResult:
        """Download using paramiko."""
        try:
            client = paramiko.SSHClient()
            client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            client.connect(
                hostname=remote_host,
                port=remote_port,
                username=remote_user,
                timeout=self._config.scp_connect_timeout,
            )
            sftp = client.open_sftp()
            sftp.get(remote_path, local_path)
            sftp.close()
            client.close()
            duration = time.monotonic() - start
            return ScpResult(success=True, duration=duration)
        except Exception as exc:
            duration = time.monotonic() - start
            log.error("SCP download failed: %s:%s -> %s: %s",
                      remote_host, remote_path, local_path, exc)
            return ScpResult(success=False, stderr=str(exc), duration=duration)

    def _paramiko_execute(self, remote_host: str, command: str,
                          remote_user: str, remote_port: int,
                          timeout: int, start: float) -> ScpResult:
        """Execute command using paramiko."""
        try:
            client = paramiko.SSHClient()
            client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            client.connect(
                hostname=remote_host,
                port=remote_port,
                username=remote_user,
                timeout=self._config.scp_connect_timeout,
            )
            _, stdout, stderr = client.exec_command(command, timeout=timeout)
            out = stdout.read().decode("utf-8", "replace")
            err = stderr.read().decode("utf-8", "replace")
            exit_code = stdout.channel.recv_exit_status()
            client.close()
            duration = time.monotonic() - start
            return ScpResult(
                success=(exit_code == 0),
                stdout=out, stderr=err,
                exit_code=exit_code, duration=duration,
            )
        except Exception as exc:
            duration = time.monotonic() - start
            log.error("SSH command failed on %s: %s: %s", remote_host, command, exc)
            return ScpResult(success=False, stderr=str(exc), duration=duration)

    # ---- Subprocess fallback (system scp/ssh) ----

    def _subprocess_scp(self, direction: str, local_path: str,
                        remote_host: str, remote_path: str,
                        remote_user: str, remote_port: int,
                        timeout: int, start: float) -> ScpResult:
        """Use system scp command as fallback."""
        remote = f"{remote_user}@{remote_host}:{remote_path}"
        if direction == "upload":
            src, dst = local_path, remote
        else:
            src, dst = remote, local_path

        cmd = [
            "scp", "-o", f"ConnectTimeout={self._config.scp_connect_timeout}",
            "-o", f"ServerAliveInterval={self._config.scp_server_alive}",
            "-o", "StrictHostKeyChecking=no",
            "-P", str(remote_port),
            "-r", src, dst,
        ]
        try:
            result = subprocess.run(cmd, capture_output=True, text=True,
                                    timeout=timeout)
            duration = time.monotonic() - start
            return ScpResult(
                success=(result.returncode == 0),
                stdout=result.stdout, stderr=result.stderr,
                exit_code=result.returncode, duration=duration,
            )
        except subprocess.TimeoutExpired:
            duration = time.monotonic() - start
            return ScpResult(success=False, stderr="SCP timed out", duration=duration)
        except Exception as exc:
            duration = time.monotonic() - start
            return ScpResult(success=False, stderr=str(exc), duration=duration)

    def _subprocess_ssh(self, remote_host: str, command: str,
                        remote_user: str, remote_port: int,
                        timeout: int, start: float) -> ScpResult:
        """Use system ssh command as fallback."""
        cmd = [
            "ssh", "-o", f"ConnectTimeout={self._config.scp_connect_timeout}",
            "-o", "StrictHostKeyChecking=no",
            "-p", str(remote_port),
            f"{remote_user}@{remote_host}",
            command,
        ]
        try:
            result = subprocess.run(cmd, capture_output=True, text=True,
                                    timeout=timeout)
            duration = time.monotonic() - start
            return ScpResult(
                success=(result.returncode == 0),
                stdout=result.stdout, stderr=result.stderr,
                exit_code=result.returncode, duration=duration,
            )
        except subprocess.TimeoutExpired:
            duration = time.monotonic() - start
            return ScpResult(success=False, stderr="SSH command timed out", duration=duration)
        except Exception as exc:
            duration = time.monotonic() - start
            return ScpResult(success=False, stderr=str(exc), duration=duration)

    # ---- Mock implementations ----

    def _mock_transfer(self, direction: str, path1: str, host: str,
                       path2: str, duration: float = 0.0) -> ScpResult:
        """Mock SCP transfer for testing."""
        log.info("Mock SCP %s: %s -> %s:%s", direction, path1, host, path2)
        return ScpResult(success=True, duration=duration,
                         stdout=f"Mock SCP {direction} complete")

    def _mock_execute(self, remote_host: str, command: str) -> ScpResult:
        """Mock SSH command execution for testing."""
        log.info("Mock SSH on %s: %s", remote_host, command)
        return ScpResult(success=True, stdout="mock output",
                         stderr="", exit_code=0, duration=0.0)
