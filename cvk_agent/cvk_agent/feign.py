"""
CVK Feign REST Client — 1:1 clone of Java FeignConfiguration + FeignClient

Mirrors:
  - FeignConfiguration.java: OkHttpClient builder, timeout options
  - FeignClient.java: Cached client builder with IP:port URL formatting
  - CvkComputeCmd.java: Feign REST interface for CVK-side endpoints

Provides the HTTP transport layer that the CVK agent uses to call the
CVM management server. Uses HTTP Digest auth (same as the casframe
CasClient). This is the CVM→CVK direction — the CVM calls the CVK agent
via this client.

Key timeouts:
  - connect: 10s (default) or configurable
  - read:    600s (default, 10 min) — for normal API calls
  - slow task read: 172800s (48h) — for long-running operations
  - write:   600s

Connection pooling:
  - Max idle connections: 200
  - Keep-alive duration: 50s
  - Client cache: up to 1024 entries (or host count, whichever larger)
"""

from __future__ import annotations

import hashlib
import logging
import os
import time
from typing import Any, Callable, Dict, Optional, Tuple
from urllib.parse import urlencode

import urllib3
from urllib3.util.retry import Retry
from urllib3.util.timeout import Timeout

from .config import CvkConfig

log = logging.getLogger(__name__)


class HttpDigestAuth:
    """HTTP Digest authentication handler (RFC 2617).

    Mirrors the DigestAuth in casframe/client.py and the Java
    HttpClient Digest scheme used by cvk-agent.
    """

    def __init__(self, username: str, password: str):
        self.username = username
        self.password = password
        self._chal: Dict[str, str] = {}
        self._nc = 0

    @property
    def challenge(self) -> Dict[str, str]:
        return self._chal

    @challenge.setter
    def challenge(self, chal: Dict[str, str]) -> None:
        self._chal = chal
        self._nc = 0

    def _compute_response(self, method: str, uri: str) -> Tuple[str, Optional[str], Optional[str], Optional[str]]:
        """Compute Digest response per RFC 2617 Section 3.2.2."""
        realm = self._chal.get("realm", "")
        nonce = self._chal.get("nonce", "")
        qop = self._chal.get("qop", "")
        opaque = self._chal.get("opaque", "")

        ha1 = hashlib.md5(f"{self.username}:{realm}:{self.password}".encode()).hexdigest()
        ha2 = hashlib.md5(f"{method}:{uri}".encode()).hexdigest()

        if qop in ("auth", "auth-int"):
            self._nc += 1
            nc_value = f"{self._nc:08x}"
            cnonce = hashlib.md5(os.urandom(16)).hexdigest()[:16]
            response = hashlib.md5(
                f"{ha1}:{nonce}:{nc_value}:{cnonce}:{qop}:{ha2}".encode()
            ).hexdigest()
            return response, cnonce, nc_value, qop
        else:
            response = hashlib.md5(f"{ha1}:{nonce}:{ha2}".encode()).hexdigest()
            return response, None, None, None

    def build_header(self, method: str, uri: str) -> str:
        """Build 'Authorization: Digest ...' header value."""
        response, cnonce, nc_val, qop = self._compute_response(method, uri)
        realm = self._chal.get("realm", "")
        nonce = self._chal.get("nonce", "")
        opaque = self._chal.get("opaque", "")

        parts = [
            f'Digest username="{self.username}"',
            f'realm="{realm}"',
            f'nonce="{nonce}"',
            f'uri="{uri}"',
            f'response="{response}"',
            f'algorithm=MD5',
        ]
        if qop:
            parts.append(f'qop={qop}')
            parts.append(f'nc={nc_val}')
            parts.append(f'cnonce="{cnonce}"')
        if opaque:
            parts.append(f'opaque="{opaque}"')
        return ", ".join(parts)


class CvkFeignClient:
    """Feign REST client for CVK↔CVM communication.

    Mirrors:
      - FeignConfiguration.java: OkHttpClient builder + Request.Options
      - FeignClient.java:  Cached client builder with IP:port URL format
      - CvkComputeCmd.java: Feign interface for REST calls

    Dual-direction:
      - CVM→CVK: The CVM calls the CVK agent's REST endpoints.
        The CVK agent exposes /compute/* endpoints that CVM hits.
      - CVK→CVM: The CVK agent calls CVM REST endpoints (/cas/casrs/*)
        to report health, register, request tasks, etc.
    """

    def __init__(self, config: CvkConfig):
        self._config = config
        self._auth = HttpDigestAuth(config.cvm_username, config.cvm_password)
        self._pool: Optional[urllib3.PoolManager] = None

        # Client cache (host_ip + class_name -> proxy instance)
        # Mirrors FeignClient cache (Guava Cache, 24h expiry)
        self._client_cache: Dict[str, Any] = {}
        self._cache_created: Dict[str, float] = {}
        self._cache_ttl: float = 86400  # 24 hours

    @property
    def base_url(self) -> str:
        """CVM base URL: http(s)://host:port"""
        return f"{self._config.cvm_protocol}://{self._config.cvm_host}:{self._config.cvm_port}"

    def _get_pool(self, connect_timeout: int | None = None,
                  read_timeout: int | None = None) -> urllib3.PoolManager:
        """Get or create an OkHttp3-equivalent connection pool.

        Mirrors the OkHttpClient.Builder in FeignConfiguration.a.h().
        """
        if self._pool is None:
            connect = connect_timeout or self._config.feign_connect_timeout
            read = read_timeout or self._config.feign_read_timeout

            # SSL: trust all certificates (mirrors FeignConfiguration.b)
            import ssl
            ssl_ctx = ssl.create_default_context()
            ssl_ctx.check_hostname = False
            ssl_ctx.verify_mode = ssl.CERT_NONE

            timeout = Timeout(
                connect=float(connect),
                read=float(read),
                total=None,
            )

            retries = Retry(
                total=0,  # Feign retryer NEVER_RETRY
                connect=0,
                read=0,
                redirect=3,
                status=0,
            )

            self._pool = urllib3.PoolManager(
                num_pools=16,
                maxsize=self._config.feign_okhttp_max_idle_connection,
                timeout=timeout,
                retries=retries,
                ssl_context=ssl_ctx if self._config.cvm_protocol == "https" else None,
                cert_reqs="CERT_NONE" if self._config.cvm_protocol == "https" else None,
                assert_hostname=False,
            )

        return self._pool

    def reset_pool(self) -> None:
        """Reset the connection pool. Mirrors FeignConfiguration.resetConnectionPool()."""
        if self._pool:
            self._pool.clear()
        self._pool = None

    def _get_cached_client(self, cache_key: str, builder: Callable) -> Any:
        """Get or create a cached client. Mirrors FeignClient.a()."""
        now = time.monotonic()
        if cache_key in self._client_cache:
            if (now - self._cache_created.get(cache_key, 0)) < self._cache_ttl:
                return self._client_cache[cache_key]

        client = builder()
        self._client_cache[cache_key] = client
        self._cache_created[cache_key] = now
        return client

    def invalidate_cache(self, host_ip: str) -> None:
        """Invalidate cached clients for a host. Mirrors FeignClient.deleteCache()."""
        to_remove = [k for k in self._client_cache if k.startswith(host_ip)]
        for key in to_remove:
            del self._client_cache[key]
            self._cache_created.pop(key, None)

    def clean_cache(self) -> None:
        """Clean all cached clients. Mirrors FeignClient.clean()."""
        self._client_cache.clear()
        self._cache_created.clear()
        self.reset_pool()

    # ---- REST call methods (CVM→CVK direction) ----

    def _build_url(self, path: str) -> str:
        """Build full URL for a CVK-side endpoint.

        Format: http://{cvk_ip}:{cvk_port}{path}
        Mirrors FeignClient URL format: String.format(this.b, IpUtil.getIPUrl(host), port)
        """
        return f"{self._config.cvm_protocol}://{self._config.host_ip}:{self._config.cvm_port}{path}"

    def request(self, method: str, path: str,
                body: Optional[str] = None,
                headers: Optional[Dict[str, str]] = None,
                connect_timeout: Optional[int] = None,
                read_timeout: Optional[int] = None,
                slow_task: bool = False,
                ) -> Tuple[int, Dict[str, str], Optional[str]]:
        """Make an HTTP request with Digest auth.

        Mirrors Feign client + Digest auth flow:
          1. Send request without auth
          2. On 401, parse challenge, build Digest response
          3. Retry with Authorization header
          4. On 403, retry up to api_retry_count

        Args:
            method: HTTP method
            path: URL path (e.g., /compute/cpuInfo)
            body: Request body (XML string)
            headers: Extra headers
            connect_timeout: Override connect timeout
            read_timeout: Override read timeout
            slow_task: If True, use slow task timeouts (48h read)

        Returns:
            (status_code, response_headers, response_body)
        """
        if slow_task:
            connect_timeout = connect_timeout or self._config.feign_slow_task_connect_timeout
            read_timeout = read_timeout or self._config.feign_slow_task_read_timeout
        else:
            connect_timeout = connect_timeout or self._config.feign_connect_timeout
            read_timeout = read_timeout or self._config.feign_read_timeout

        pool = self._get_pool(connect_timeout=connect_timeout,
                              read_timeout=read_timeout)

        url = self._build_url(path)
        request_headers = {
            "Accept": "application/xml",
            "Content-Type": "application/xml",
            "User-Agent": "CVK-Agent/1.0 (Python Feign)",
        }
        if headers:
            request_headers.update(headers)

        body_bytes = body.encode("utf-8") if body else None

        max_retry = self._config.api_retry_count
        while max_retry > 0:
            # Add auth header if we have a challenge
            if self._auth.challenge:
                auth_hdr = self._auth.build_header(method, path)
                request_headers["Authorization"] = auth_hdr

            try:
                response = pool.request(
                    method=method,
                    url=url,
                    body=body_bytes,
                    headers=request_headers,
                    redirect=False,
                )
            except Exception as exc:
                log.error("HTTP request failed: %s %s: %s", method, url, exc)
                raise

            status = response.status
            resp_headers = dict(response.headers)
            resp_body = response.data.decode("utf-8", "replace") if response.data else None

            # On 401, parse challenge and retry
            if status == 401:
                www_auth = resp_headers.get("WWW-Authenticate", "")
                if www_auth:
                    self._auth.challenge = self._parse_digest_challenge(www_auth)
                auth_hdr = self._auth.build_header(method, path)
                request_headers["Authorization"] = auth_hdr
                continue

            # On 403, retry with delay (CAS auth expired)
            if status == 403:
                max_retry -= 1
                if max_retry > 0:
                    time.sleep(1)
                    if self._auth.challenge:
                        auth_hdr = self._auth.build_header(method, path)
                        request_headers["Authorization"] = auth_hdr
                    continue
                else:
                    log.error("403 Forbidden after max retries: %s %s", method, url)

            return status, resp_headers, resp_body

        # Should not reach here
        return 403, {}, None

    def get(self, path: str, **kwargs) -> Tuple[int, Dict[str, str], Optional[str]]:
        return self.request("GET", path, **kwargs)

    def post(self, path: str, body: Optional[str] = None, **kwargs) -> Tuple[int, Dict[str, str], Optional[str]]:
        return self.request("POST", path, body=body, **kwargs)

    def put(self, path: str, body: Optional[str] = None, **kwargs) -> Tuple[int, Dict[str, str], Optional[str]]:
        return self.request("PUT", path, body=body, **kwargs)

    def delete(self, path: str, **kwargs) -> Tuple[int, Dict[str, str], Optional[str]]:
        return self.request("DELETE", path, **kwargs)

    @staticmethod
    def _parse_digest_challenge(header: str) -> Dict[str, str]:
        """Parse 'WWW-Authenticate: Digest ...' header."""
        out: Dict[str, str] = {}
        idx = header.lower().find("digest ")
        if idx < 0:
            return out
        header = header[idx + 7:]
        parts = []
        current = ""
        in_quote = False
        for ch in header:
            if ch == '"':
                in_quote = not in_quote
                current += ch
            elif ch == ',' and not in_quote:
                parts.append(current.strip())
                current = ""
            else:
                current += ch
        if current.strip():
            parts.append(current.strip())
        for part in parts:
            if '=' in part:
                k, v = part.split('=', 1)
                k = k.strip()
                v = v.strip().strip('"')
                out[k] = v
        return out

    def close(self) -> None:
        """Close all connections."""
        if self._pool:
            self._pool.clear()
            self._pool = None
        self._client_cache.clear()
