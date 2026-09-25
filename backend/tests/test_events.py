import os
os.environ.setdefault("DATABASE_URL", "sqlite://")
os.environ["TENANT_API_KEY"] = "test-key"
os.environ["TIENDANUBE_APP_SECRET"] = "test-webhook-secret"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from main import app
from db.db import Base
from deps.deps import get_db
from models.models import Event
from security.rate_limit import _hits

@pytest.fixture
def client():
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    sessions = sessionmaker(bind=engine)
    def db():
        with sessions() as session:
            yield session
    app.dependency_overrides[get_db] = db
    _hits.clear()
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
    engine.dispose()

HEADERS = {"Authorization": "Bearer test-key"}
PAYLOAD = {"external_customer_id":"customer-1", "external_transaction_id":"tx-1",
           "amount":1250, "currency":"ARS", "timestamp":"2026-01-01T12:00:00Z"}

def test_ingest_duplicate_and_list(client):
    url = "/v1/ingest/events/transaction"
    assert client.post(url, headers=HEADERS, json=PAYLOAD).json() == {"status":"ok"}
    assert client.post(url, headers=HEADERS, json=PAYLOAD).json() == {"status":"duplicate"}
    response = client.get("/v1/admin/events", headers=HEADERS)
    assert response.status_code == 200
    rows = response.json()
    assert len(rows) == 1
    assert rows[0]["external_transaction_id"] == "tx-1"
    assert rows[0]["tenant_id"] == "demo-tenant"

@pytest.mark.parametrize("headers", [{}, {"Authorization":"Bearer wrong"}])
def test_auth_required(client, headers):
    assert client.get("/v1/admin/events", headers=headers).status_code == 401

def test_invalid_event_rejected(client):
    assert client.post("/v1/ingest/events/transaction", headers=HEADERS, json={}).status_code == 422

def test_pagination_validated(client):
    assert client.get("/v1/admin/events?limit=0",headers=HEADERS).status_code == 422

def test_webhook_requires_valid_signature(client):
    assert client.post("/v1/webhooks/tiendanube/orders", json={}).status_code == 401
