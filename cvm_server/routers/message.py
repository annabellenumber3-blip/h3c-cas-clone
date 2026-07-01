"""
Message router: Async task polling.
GET /message/{taskId} -> XML task status
"""
from fastapi import APIRouter, Response
from fastapi.responses import PlainTextResponse

from ..store import store
from .. import xml_utils

router = APIRouter()


@router.get("/message/{task_id}")
async def get_message(task_id: str):
    """Poll async task status. Returns XML with completed, result, targetId, etc."""
    task = store.get_task(task_id)
    xml = xml_utils.xml_task_response(
        msg_id=task_id,
        completed=task.get("completed", True),
        result=task.get("result", 0),
        target_id=task.get("targetId", ""),
        target_name=task.get("targetName", ""),
        fail_msg=task.get("failMsg", ""),
        old_task=task.get("oldTask", ""),
    )
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})
