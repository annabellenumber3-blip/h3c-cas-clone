"""
Events & System router: /events and /system endpoints.
Mirrors event-driven architecture with RabbitMQ messages.
"""
from fastapi import APIRouter, Query, Response

from .. import config
from ..store import store

router = APIRouter()


@router.get("/events")
async def events_get(type: str = Query(None), progress: str = Query(None)):
    """GET /events?type=<eventType>&progress=<bool> — get recent events."""
    events = store.events
    if type:
        events = [e for e in events if e.get("type") == type]
    # Return as XML
    root = __import__('xml.etree.ElementTree', fromlist=['ElementTree']).Element("events")
    for evt in events[-20:]:  # last 20
        e = __import__('xml.etree.ElementTree', fromlist=['ElementTree']).SubElement(root, "event")
        if evt.get("type"):
            __import__('xml.etree.ElementTree', fromlist=['ElementTree']).SubElement(e, "type").text = evt["type"]
        if evt.get("vmId"):
            __import__('xml.etree.ElementTree', fromlist=['ElementTree']).SubElement(e, "vmId").text = evt["vmId"]
        if evt.get("progress") is not None:
            __import__('xml.etree.ElementTree', fromlist=['ElementTree']).SubElement(e, "progress").text = str(evt["progress"])
    xml = __import__('xml.etree.ElementTree', fromlist=['ElementTree']).tostring(root, encoding="unicode")
    return Response(content=f'<?xml version="1.0" encoding="UTF-8"?>\n{xml}',
                    media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.get("/system/rabbitmq")
async def system_rabbitmq():
    """GET /system/rabbitmq — get RabbitMQ config. Returns plain text."""
    info = (
        f"host={config.RMQ_HOST}\n"
        f"port={config.RMQ_PORT}\n"
        f"vhost={config.RMQ_VHOST}\n"
        f"exchange={config.RMQ_EXCHANGE}\n"
        f"queue={config.RMQ_QUEUE}\n"
    )
    return Response(content=info, media_type="text/plain;charset=UTF-8", headers={"Server": "CVM"})
