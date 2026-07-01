"""
H3C CAS CVM REST API Server — 1:1 Clone
========================================
Production-grade FastAPI server implementing the complete CAS REST API.
Matches the original Tomcat + casserver.jar behavior exactly.

Run:
    python -m cvm_server.main --port 8080
    uvicorn cvm_server.main:app --host 0.0.0.0 --port 8080

Architecture:
  - FastAPI + Uvicorn (replaces Tomcat)
  - HTTP Digest Auth middleware (replaces Tomcat DigestAuthenticator)
  - In-memory data store (mirrors vservice PostgreSQL + cas_cic MySQL)
  - Async task model with /message/{taskId} polling
  - XML responses matching the original format exactly
  - Server header: "CVM"
  - Context path: /cas/casrs
"""
from __future__ import annotations

import argparse
import logging
import os
import sys

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, Response
from starlette.middleware.base import BaseHTTPMiddleware

from .auth import DigestAuthMiddleware
from .config import (
    HTTP_PORT, HTTPS_PORT, SERVER_HEADER, URI_PREFIX,
    SSL_KEYSTORE_FILE, SSL_KEYSTORE_PASS,
)
from .routers import (
    operator,
    hostpool,
    cluster,
    respool,
    nova,
    vm as vm_router,
    storage,
    message,
    events,
    console,
)

# ============================================================================
# Server header middleware
# ============================================================================
class ServerHeaderMiddleware(BaseHTTPMiddleware):
    """Add 'Server: CVM' header to all responses (matching Tomcat)."""
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["Server"] = SERVER_HEADER
        return response


# ============================================================================
# Create FastAPI app
# ============================================================================
app = FastAPI(
    title="H3C CAS CVM REST API",
    version="R0785P03",
    docs_url=None,      # No OpenAPI docs (original has none)
    redoc_url=None,
    openapi_url=None,
)

# Add Server header middleware (runs BEFORE auth so 401s also get the header)
app.add_middleware(ServerHeaderMiddleware)

# Add Digest auth middleware
app.add_middleware(DigestAuthMiddleware)

# ============================================================================
# Mount all routers under /cas/casrs prefix
# ============================================================================
# Create a sub-application for the /cas/casrs prefix
cas_app = FastAPI(
    title="CAS RS",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)

# Register all routers
cas_app.include_router(operator.router, tags=["operator"])
cas_app.include_router(hostpool.router, tags=["hostpool"])
cas_app.include_router(cluster.router, tags=["cluster"])
cas_app.include_router(respool.router, tags=["respool"])
cas_app.include_router(nova.router, tags=["nova"])
cas_app.include_router(vm_router.router, tags=["vm"])
cas_app.include_router(storage.router, tags=["storage"])
cas_app.include_router(message.router, tags=["message"])
cas_app.include_router(events.router, tags=["events"])
cas_app.include_router(console.router, tags=["console"])

# Mount under /cas/casrs
app.mount(URI_PREFIX, cas_app)


# ============================================================================
# Fallback handler for unmatched /cas/casrs paths
# ============================================================================
@app.middleware("http")
async def fallback_handler(request: Request, call_next):
    """Return proper XML error for unknown /cas/casrs endpoints."""
    response = await call_next(request)
    if response.status_code == 404 and request.url.path.startswith(URI_PREFIX):
        from .xml_utils import xml_error
        xml = xml_error(404, f"Unknown endpoint: {request.url.path}")
        return Response(
            content=xml,
            status_code=404,
            media_type="application/xml;charset=UTF-8",
            headers={"Server": SERVER_HEADER},
        )
    return response


# ============================================================================
# Exception handler
# ============================================================================
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all exception handler — returns XML error."""
    from .xml_utils import xml_error
    logging.getLogger("cvm").error(f"Unhandled error: {exc}", exc_info=True)
    xml = xml_error(500, str(exc))
    return Response(
        content=xml,
        status_code=500,
        media_type="application/xml;charset=UTF-8",
        headers={"Server": SERVER_HEADER},
    )


# ============================================================================
# CLI entry point
# ============================================================================
def main():
    parser = argparse.ArgumentParser(description="H3C CAS CVM REST API Server")
    parser.add_argument("--port", type=int, default=HTTP_PORT, help=f"HTTP port (default: {HTTP_PORT})")
    parser.add_argument("--host", default="0.0.0.0", help="Listen address")
    parser.add_argument("--ssl", action="store_true", help="Enable HTTPS")
    parser.add_argument("--ssl-port", type=int, default=HTTPS_PORT, help=f"HTTPS port (default: {HTTPS_PORT})")
    parser.add_argument("--workers", type=int, default=1, help="Number of worker processes")
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [CVM] %(levelname)s %(message)s",
    )
    logger = logging.getLogger("cvm")
    logger.info(f"H3C CAS CVM Server starting on http://{args.host}:{args.port}{URI_PREFIX}/")
    logger.info(f"Users: admin/Cloud@123, root/h3cadmin")
    logger.info(f"Test: curl -u admin:Cloud@123 --digest http://localhost:{args.port}{URI_PREFIX}/operator/test -v")

    import uvicorn

    uvicorn.run(
        "cvm_server.main:app",
        host=args.host,
        port=args.port,
        workers=args.workers,
        log_level="info",
        access_log=True,
        server_header=False,  # We set our own
    )


if __name__ == "__main__":
    main()
