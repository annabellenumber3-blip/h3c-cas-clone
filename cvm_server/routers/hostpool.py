"""
Host Pool router: /hostpool endpoints.
Mirrors HostpoolResource.java.
"""
from fastapi import APIRouter, Response

from .. import xml_utils
from ..store import store

router = APIRouter()


@router.get("/hostpool/all")
async def hostpool_all():
    """GET /hostpool/all — list all host pools."""
    pools = list(store.hostpools.values())
    xml = xml_utils.xml_hostpool_list(pools)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.get("/hostpool/{pool_id}/allChildNode")
async def hostpool_children(pool_id: str):
    """GET /hostpool/{id}/allChildNode — list hosts in a host pool."""
    # Filter hosts by pool_id
    hosts = [h for h in store.hosts.values() if h.get("hostPoolId") == pool_id]
    if not hosts:
        # If no specific match, return all online hosts
        hosts = store.get_online_hosts()
    xml = xml_utils.xml_host_list(hosts)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})
