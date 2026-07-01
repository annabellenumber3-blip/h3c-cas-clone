"""
Console router: VNC and SPICE endpoints.
Mirrors DomainSpiceResource.java and VNC endpoints.
"""
from fastapi import APIRouter, Response

router = APIRouter()


@router.get("/vmvnc/vnc/{vm_id}")
async def vmvnc_vnc(vm_id: str):
    """GET /vmvnc/vnc/{vmId} — get VNC connection info. Returns plain text."""
    info = f"host=192.168.1.100\nport=5901\npassword=vncpwd_{vm_id}\n"
    return Response(content=info, media_type="text/plain;charset=UTF-8", headers={"Server": "CVM"})


@router.get("/spice/info/{vm_id}")
async def spice_info(vm_id: str):
    """GET /spice/info/{vmId} — get SPICE connection info. Returns plain text."""
    info = f"host=192.168.1.100\nport=5902\ntlsPort=5903\npassword=spicepwd_{vm_id}\n"
    return Response(content=info, media_type="text/plain;charset=UTF-8", headers={"Server": "CVM"})
