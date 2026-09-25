import time
from collections import defaultdict, deque
from fastapi import HTTPException, Request, status

from core.settings import settings

# Guarda timestamps por key (ip + bucket)
_hits: dict[str, deque[float]] = defaultdict(deque)

def _get_client_ip(request: Request) -> str:
    if request.client:
        return request.client.host
    return "unknown"

def rate_limit(bucket: str, limit_per_minute: int):
    """
    Dependency factory: rate_limit("webhook", 120)
    """
    window = 60.0

    async def _dep(request: Request):
        now = time.time()
        ip = _get_client_ip(request)
        key = f"{bucket}:{ip}"

        dq = _hits[key]
        # drop old
        while dq and (now - dq[0]) > window:
            dq.popleft()

        if len(dq) >= limit_per_minute:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded",
            )

        dq.append(now)

    return _dep

