import time
import uuid
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
        start = time.perf_counter()

        request.state.request_id = request_id

        try:
            response = await call_next(request)
        except Exception as e:
            elapsed = (time.perf_counter() - start) * 1000
            print(
                f"[{request_id}] {request.method} {request.url.path} -> 500 "
                f"({elapsed:.1f}ms) EXC={type(e).__name__}"
            )
            raise

        elapsed = (time.perf_counter() - start) * 1000
        print(
            f"[{request_id}] {request.method} {request.url.path} "
            f"-> {response.status_code} ({elapsed:.1f}ms)"
        )

        response.headers["x-request-id"] = request_id
        return response

