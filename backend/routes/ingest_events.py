from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from core.settings import settings
from security.rate_limit import rate_limit
from deps.deps import get_db
from models.models import Event
from schemas.schemas import TransactionEventIn
from auth.auth import require_api_key

router = APIRouter(prefix="/v1/ingest", tags=["ingest"])

@router.post("/events/transaction")
def create_transaction_event(
    payload: TransactionEventIn,
    _rl: None = Depends(rate_limit("ingest_transaction", settings.RATE_LIMIT_INGEST_PER_MIN)),
    tenant_id: str = Depends(require_api_key),
    db: Session = Depends(get_db),
):
    event = Event(
        tenant_id=tenant_id,
        external_customer_id=payload.external_customer_id,
        external_transaction_id=payload.external_transaction_id,
        amount=payload.amount,
        currency=payload.currency,
        timestamp=payload.timestamp,
    )

    db.add(event)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        return {"status": "duplicate"}

    return {"status": "ok"}

