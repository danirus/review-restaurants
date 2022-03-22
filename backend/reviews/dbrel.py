from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy_utils import UUIDType

from backend.db import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(UUIDType, primary_key=True, default=uuid4)
    restaurant_id = Column(UUIDType, ForeignKey("restaurants.id"))
    user_id = Column(UUIDType, ForeignKey("users.id"))
    created_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )
    review = Column(String(1024))
    rating = Column(Integer)
