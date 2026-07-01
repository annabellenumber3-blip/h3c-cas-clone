"""
Resource Pool router: /resPool endpoints.
Mirrors ResPoolResource.java.
"""
from fastapi import APIRouter, Response

from .. import xml_utils
from ..store import store

router = APIRouter()


@router.get("/resPool/queryResPool")
async def query_respool():
    """GET /resPool/queryResPool — list resource pools."""
    pools = [
        {"id": c["id"], "name": c["name"], "type": "cluster",
         "clusterId": c["id"], "num": 2, "vmNum": 3}
        for c in store.clusters.values()
    ]
    xml = xml_utils.xml_respool_list(pools)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.get("/resPool/queryResPoolGpuList")
async def query_respool_gpu_list():
    """GET /resPool/queryResPoolGpuList — list GPUs in resource pools."""
    gpus = [
        {"bus": "0000:3b:00.0", "producers": "NVIDIA", "clusterId": "cluster-001",
         "hostId": "host-001", "hostName": "cvk-node-1", "isUsed": "false", "type": "GPU"},
    ]
    xml = xml_utils.xml_gpu_list(gpus)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.get("/resPool/queryResPoolVgpuList")
async def query_respool_vgpu_list():
    """GET /resPool/queryResPoolVgpuList — list vGPUs in resource pools."""
    vgpus = [
        {"bus": "0000:3b:00.0", "type": "GRID", "name": "NVIDIA GRID vGPU",
         "maxInstance": 8, "framebuffer": 4096, "maxResolution": "3840x2160",
         "heads": 2, "uuid": "vgpu-001", "hostId": "host-001",
         "hostName": "cvk-node-1", "clusterId": "cluster-001",
         "isUsed": "false", "title": "GRID vGPU"},
    ]
    xml = xml_utils.xml_vgpu_list(vgpus)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.get("/resPool/queryBusinessTem")
async def query_business_templates():
    """GET /resPool/queryBusinessTem — list business templates."""
    xml = xml_utils.xml_business_templates(store.business_templates)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})
