"""
Operator router: Health check and operator endpoints.
GET /operator/test -> 204 No Content
"""
from fastapi import APIRouter, Request, Response

router = APIRouter()


@router.api_route("/operator/test", methods=["GET", "POST"])
async def operator_test(request: Request):
    """Health check endpoint. Returns 204 No Content.
    Mirrors OperatorResource.test() in the Java CVM.
    """
    return Response(status_code=204, headers={"Server": "CVM"})
