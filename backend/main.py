from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import engine
from sqlalchemy import text

from routes.admin_events import router as admin_router
from routes.ingest_events import router as ingest_router
from routes.webhooks_tiendanube import router as tiendanube_webhooks_router
from core.logging_middleware import RequestLoggingMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(RequestLoggingMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# NEW: routers separados
app.include_router(admin_router)
app.include_router(ingest_router)
app.include_router(tiendanube_webhooks_router)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/db-health")
def db_health():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"db": "ok"}

