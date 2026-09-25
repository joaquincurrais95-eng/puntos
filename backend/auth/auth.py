import secrets
from fastapi import Header, HTTPException
from core.settings import settings

def require_api_key(authorization: str | None = Header(default=None)):
    if not settings.TENANT_API_KEY:
        raise HTTPException(status_code=503, detail="API authentication is not configured")
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")
    token = authorization.removeprefix("Bearer ").strip()
    if not secrets.compare_digest(token, settings.TENANT_API_KEY):
        raise HTTPException(status_code=401, detail="Invalid API key")
    return "demo-tenant"
