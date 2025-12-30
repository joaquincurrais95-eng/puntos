from sqlalchemy import String, Integer, DateTime, func, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from db.db import Base

class Event(Base):
  __tablename__ = "events"
  __table_args__ = (
    UniqueConstraint("tenant_id", "external_transaction_id", name="uq_tenant_tx"),
  )

  id: Mapped[int] = mapped_column(primary_key=True)
  tenant_id: Mapped[str] = mapped_column(String, index=True)

  external_customer_id: Mapped[str] = mapped_column(String, index=True)
  external_transaction_id: Mapped[str] = mapped_column(String, index=True)

  amount: Mapped[int] = mapped_column(Integer)
  currency: Mapped[str] = mapped_column(String(8))

  timestamp: Mapped[DateTime] = mapped_column(DateTime(timezone=True))
  created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

