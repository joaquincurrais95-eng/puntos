import os
from fastapi import Header, HTTPException

TENANT_API_KEY = os.getenv("TENANT_API_KEY")

def require_api_key(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = authorization.removeprefix("Bearer ").strip()
    if token != TENANT_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")

    return "demo-tenant"

