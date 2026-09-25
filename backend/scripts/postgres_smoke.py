"""Run after Alembic against a disposable PostgreSQL database."""
import os
import sys
from pathlib import Path
from uuid import uuid4
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from fastapi.testclient import TestClient
from main import app

with TestClient(app) as client:
    assert client.get("/db-health").status_code == 200
    headers = {"Authorization": "Bearer " + os.environ["TENANT_API_KEY"]}
    tx = "smoke-" + str(uuid4())
    body = {"external_customer_id":"smoke", "external_transaction_id":tx,
            "amount":1250, "currency":"ARS", "timestamp":"2026-01-01T12:00:00Z"}
    assert client.post("/v1/ingest/events/transaction",headers=headers,json=body).json() == {"status":"ok"}
    assert client.post("/v1/ingest/events/transaction",headers=headers,json=body).json() == {"status":"duplicate"}
    response = client.get("/v1/admin/events",headers=headers)
    assert response.status_code == 200
    assert any(row["external_transaction_id"] == tx for row in response.json())
print("PostgreSQL migration and event round trip passed")
