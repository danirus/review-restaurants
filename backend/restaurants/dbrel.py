from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, Column, DateTime, Numeric, String
from sqlalchemy_utils import UUIDType

from backend.db import Base


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(UUIDType, primary_key=True, default=uuid4)
    name = Column(String(50))
    description = Column(String(350))
    country = Column(String(2), index=True)
    postal_code = Column(String(10), index=True)
    address = Column(String(120))
    webpage = Column(String(50))
    phone_number = Column(String(20))
    disabled = Column(Boolean)
    avg_rating = Column(Numeric(precision=2, scale=1))
    created_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )
