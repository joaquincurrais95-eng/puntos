import base64
import hashlib
import hmac
from fastapi import Header, HTTPException, Request, status

from core.settings import settings

HMAC_HEADER = "x-linkedstore-hmac-sha256"

async def verify_tiendanube_hmac(
    request: Request,
    x_linkedstore_hmac_sha256: str | None = Header(default=None),
):
    """
    Verifica firma HMAC SHA256 del body RAW.
    Tiendanube envía la firma en header: x-linkedstore-hmac-sha256
    Esperado: base64(hmac_sha256(APP_SECRET, raw_body))
    """
    secret = settings.TIENDANUBE_APP_SECRET
    if not secret:
        # Fail-fast: no queremos "webhook abierto" por error de config.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="TIENDANUBE_APP_SECRET not configured",
        )

    if not x_linkedstore_hmac_sha256:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Missing {HMAC_HEADER}",
        )

    raw_body = await request.body()  # bytes (cacheado por Starlette)
    expected = base64.b64encode(
        hmac.new(secret.encode("utf-8"), raw_body, hashlib.sha256).digest()
    ).decode("utf-8")

    # compare_digest evita timing attacks
    if not hmac.compare_digest(expected, x_linkedstore_hmac_sha256):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid webhook signature",
        )

    return True

