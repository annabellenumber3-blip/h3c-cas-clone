"""
Cluster router: /cluster endpoints.
Mirrors ClusterResource.java.
"""
from fastapi import APIRouter, Request, Response

from .. import xml_utils
from ..store import store

router = APIRouter()


@router.get("/cluster/rules")
async def cluster_rules():
    """GET /cluster/rules — list DRS rules."""
    xml = xml_utils.xml_cluster_rules(store.cluster_rules)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/cluster/addVMHostRule")
async def cluster_add_vm_host_rule(request: Request):
    """POST /cluster/addVMHostRule — add VM-host affinity rule."""
    # In production, parse XML body and create rule
    task_id = store.create_task("rule", "vm-host-rule-added")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/cluster/editVMHostRule")
async def cluster_edit_vm_host_rule(request: Request):
    """POST /cluster/editVMHostRule — edit VM-host affinity rule."""
    task_id = store.create_task("rule", "vm-host-rule-edited")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})
