"""
HTTP Digest Authentication (RFC 2617) middleware for CVM server.
Mirrors the Tomcat DigestAuthenticator + CAS SecurityContext.

Uses MD5 hashing, realm="CAS", qop="auth".
Nonces are time-based with HMAC to prevent replay.
"""
from __future__ import annotations

import hashlib
import hmac
import time
import uuid
from typing import Dict, Optional, Tuple

from fastapi import HTTPException, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import PlainTextResponse

from .config import DIGEST_ALGORITHM, DIGEST_QOP, DIGEST_REALM, NONCE_TIMEOUT, USERS

# Nonce secret key (rotated periodically in production)
_NONCE_SECRET = hashlib.sha256(str(uuid.uuid4()).encode()).digest()


def _generate_nonce() -> str:
    """Generate time-based nonce: base64(timestamp || hmac(timestamp, secret))."""
    ts = int(time.time())
    ts_bytes = str(ts).encode()
    mac = hmac.new(_NONCE_SECRET, ts_bytes, hashlib.sha256).hexdigest()[:16]
    return f"{ts}:{mac}"


def _validate_nonce(nonce: str) -> bool:
    """Check nonce is valid and not expired."""
    try:
        ts_str, mac = nonce.split(":", 1)
        ts = int(ts_str)
        expected = hmac.new(_NONCE_SECRET, ts_str.encode(), hashlib.sha256).hexdigest()[:16]
        if not hmac.compare_digest(mac, expected):
            return False
        if abs(int(time.time()) - ts) > NONCE_TIMEOUT:
            return False
        return True
    except (ValueError, AttributeError):
        return False


def parse_digest_auth(auth_header: str) -> Optional[Dict[str, str]]:
    """Parse 'Digest ...' header value into dict."""
    if not auth_header or not auth_header.lower().startswith("digest "):
        return None
    auth_header = auth_header[7:]
    result: Dict[str, str] = {}
    parts: list[str] = []
    cur = ""
    in_quote = False
    for ch in auth_header:
        if ch == '"':
            in_quote = not in_quote
            cur += ch
        elif ch == ',' and not in_quote:
            parts.append(cur.strip())
            cur = ""
        else:
            cur += ch
    if cur.strip():
        parts.append(cur.strip())
    for p in parts:
        if '=' in p:
            k, v = p.split('=', 1)
            result[k.strip()] = v.strip().strip('"')
    return result


def verify_digest(method: str, uri: str, auth: Dict[str, str]) -> bool:
    """Verify HTTP Digest auth response. Returns True if valid."""
    username = auth.get("username", "")
    if username not in USERS:
        return False
    password = USERS[username]

    realm = auth.get("realm", DIGEST_REALM)
    nonce = auth.get("nonce", "")
    qop = auth.get("qop", "")
    nc = auth.get("nc", "")
    cnonce = auth.get("cnonce", "")
    response = auth.get("response", "")

    # Validate nonce
    if not _validate_nonce(nonce):
        return False

    # HA1 = MD5(username:realm:password)
    ha1 = hashlib.md5(f"{username}:{realm}:{password}".encode()).hexdigest()

    # HA2 = MD5(method:uri)
    ha2 = hashlib.md5(f"{method}:{uri}".encode()).hexdigest()

    if qop in ("auth", "auth-int"):
        expected = hashlib.md5(
            f"{ha1}:{nonce}:{nc}:{cnonce}:{qop}:{ha2}".encode()
        ).hexdigest()
    else:
        expected = hashlib.md5(f"{ha1}:{nonce}:{ha2}".encode()).hexdigest()

    return hmac.compare_digest(response, expected)


def build_www_authenticate_header(stale: bool = False) -> str:
    """Build WWW-Authenticate header for 401 response."""
    nonce = _generate_nonce()
    header = (
        f'Digest realm="{DIGEST_REALM}", '
        f'nonce="{nonce}", '
        f'qop="{DIGEST_QOP}", '
        f'algorithm={DIGEST_ALGORITHM}'
    )
    if stale:
        header += ', stale=true'
    return header


class DigestAuthMiddleware(BaseHTTPMiddleware):
    """ASGI middleware that enforces HTTP Digest auth on all /cas/casrs requests."""

    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        # Only protect /cas/casrs paths
        if not path.startswith("/cas/casrs"):
            return await call_next(request)

        # Allow OPTIONS for CORS
        if request.method == "OPTIONS":
            return await call_next(request)

        auth_header = request.headers.get("Authorization", request.headers.get("authorization", ""))

        if not auth_header:
            nonce = _generate_nonce()
            resp = Response(status_code=401)
            resp.headers["WWW-Authenticate"] = build_www_authenticate_header()
            resp.headers["Server"] = "CVM"
            resp.headers["Content-Length"] = "0"
            return resp

        auth = parse_digest_auth(auth_header)
        if not auth:
            resp = PlainTextResponse(
                '<?xml version="1.0"?><error><code>403</code><message>Invalid auth header</message></error>',
                status_code=403,
                media_type="application/xml",
            )
            resp.headers["Server"] = "CVM"
            return resp

        # Extract URI from auth header (or use request path)
        uri = auth.get("uri", request.url.path)
        if not verify_digest(request.method, uri, auth):
            resp = PlainTextResponse(
                '<?xml version="1.0"?><error><code>403</code><message>Authentication failed</message></error>',
                status_code=403,
                media_type="application/xml",
            )
            resp.headers["Server"] = "CVM"
            return resp

        # Store authenticated user in request state
        request.state.username = auth.get("username", "")

        response = await call_next(request)
        response.headers["Server"] = "CVM"
        return response
