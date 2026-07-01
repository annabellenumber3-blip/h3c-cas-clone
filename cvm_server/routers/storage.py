"""
Storage router: /storage endpoints.
Mirrors RsStorageResource.java.
"""
from fastapi import APIRouter, Query, Response

from ..store import store

router = APIRouter()


@router.post("/storage/refresh")
async def storage_refresh(id: str = Query(None), poolName: str = Query(None)):
    """POST /storage/refresh?id=<hostId>&poolName=<name> — refresh storage pool."""
    return Response(status_code=204, headers={"Server": "CVM"})


@router.get("/storage/volume")
async def storage_volume(hostId: str = Query(None), poolName: str = Query(None),
                         volumeName: str = Query(None)):
    """GET /storage/volume?hostId=<id>&poolName=<name>&volumeName=<name> — get volume info."""
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<volume>
  <name>{volumeName or 'unknown'}</name>
  <poolName>{poolName or 'default'}</poolName>
  <hostId>{hostId or '0'}</hostId>
  <size>10737418240</size>
  <allocation>5368709120</allocation>
  <format>qcow2</format>
  <type>file</type>
</volume>"""
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})
