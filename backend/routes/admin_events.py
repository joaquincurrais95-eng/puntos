from fastapi import Depends, APIRouter, Query
from sqlalchemy.orm import Session

from deps.deps import get_db
from models.models import Event
from schemas.schemas import EventOut
from auth.auth import require_api_key

router = APIRouter(prefix="/v1/admin", tags=["admin"])

@router.get("/events", response_model=list[EventOut])
def list_events(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    tenant_id: str = Depends(require_api_key),
    db: Session = Depends(get_db),
):
    events = (
        db.query(Event)
        .filter(Event.tenant_id == tenant_id)
        .order_by(Event.timestamp.desc(), Event.id.desc())
        .limit(limit)
        .offset(offset)
        .all()
    )
    return events

