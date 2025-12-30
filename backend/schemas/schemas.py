from pydantic import BaseModel
from datetime import datetime

class TransactionEventIn(BaseModel):
    external_customer_id: str
    external_transaction_id: str
    amount: int
    currency: str
    timestamp: datetime

class EventOut(BaseModel):
    id: int
    tenant_id: str
    external_customer_id: str
    external_transaction_id: str
    amount: float
    currency: str
    timestamp: datetime
    created_at: datetime | None = None

    class Config:
        from_attributes = True
