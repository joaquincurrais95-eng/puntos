from fastapi import APIRouter, Request, Depends

from core.settings import settings
from security.tiendanube_hmac import verify_tiendanube_hmac
from security.rate_limit import rate_limit

router = APIRouter(prefix="/v1/webhooks/tiendanube", tags=["webhooks"])

@router.post("/orders")
async def tiendanube_orders_webhook(
    request: Request,
    _rl: None = Depends(rate_limit("webhook_tiendanube", settings.RATE_LIMIT_WEBHOOK_PER_MIN)),
    _ok: bool = Depends(verify_tiendanube_hmac),
):
    payload = await request.json()
    return {"status": "ok"}

