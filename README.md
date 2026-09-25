# Puntos — transaction event ingestion prototype

Python/FastAPI API with SQLAlchemy, Alembic and PostgreSQL, plus a React/TypeScript UI prototype. The implemented slice accepts authenticated transaction events, stores them and lists them without duplicating the same tenant/transaction pair.

**Status:** local development prototype. Authentication currently maps one configured API key to `demo-tenant`. This is not a completed multi-tenant loyalty platform.

## Run the API and database
Install Docker with Compose, then from the repository root:
```sh
cp .env.example .env
docker compose up --build -d
```
On PowerShell, replace `cp` with `Copy-Item`. Compose waits for PostgreSQL, runs migrations and starts the API.
- API documentation: http://localhost:8000/docs
- Health: http://localhost:8000/health
- Database check: http://localhost:8000/db-health

The example keys/passwords are public, local-only demo values. Services bind to localhost. Do not expose this configuration as a hosted production service.

## Demonstrate the implemented flow
Use Swagger UI at `/docs`, or:
```sh
curl -X POST http://localhost:8000/v1/ingest/events/transaction \
  -H "Authorization: Bearer local-demo-key" -H "Content-Type: application/json" \
  -d '{"external_customer_id":"customer-1","external_transaction_id":"tx-1","amount":1250,"currency":"ARS","timestamp":"2026-01-01T12:00:00Z"}'
curl http://localhost:8000/v1/admin/events -H "Authorization: Bearer local-demo-key"
```
The first POST returns `ok`; repeating it returns `duplicate`. Amounts are stored as integers; callers must agree on units.

## Frontend
Requires Node.js 22.12+.
```sh
cd frontend
cp .env.example .env
npm ci
npm run dev
```
Events use the real API when `VITE_DATA_SOURCE=api`. Dashboard statistics, rules and integration status are demonstration data; the UI labels this limitation. A Vite API key is visible in the browser and is suitable only for this local demo.

## Backend without Docker
Python 3.12+, a PostgreSQL database, and:
```sh
cd backend
python -m venv .venv
# Activate .venv using your shell's activation command.
pip install -r requirements-dev.txt
cp .env.example .env
alembic upgrade head
uvicorn main:app --reload
```
Adjust DATABASE_URL to your database. Compose uses host port 6565.

## Checks
```sh
cd backend
pytest -q
```
The API regression suite uses isolated SQLite databases. CI additionally applies migrations and runs a smoke flow against PostgreSQL 16, and builds the frontend.

## Architecture and limits
- Routes → Pydantic validation → SQLAlchemy sessions → events table.
- Unique constraint on `tenant_id + external_transaction_id`.
- One demonstration tenant; no user signup or per-store key management.
- Webhook endpoint verifies the existing signature scheme and acknowledges JSON; it does not ingest orders. Provider interoperability is not certified.
- No points calculation, redemption, rule persistence or production deployment.
- Rate limiting is in memory and does not coordinate multiple workers.
- No production security or scalability claim.

## Repository hygiene
Environments, bytecode, backup files and local .env files are excluded. Use the example files for setup. Earlier Git history predates this cleanup; removing tracked files does not remove historical copies.

## License
No reuse license has been selected yet.
