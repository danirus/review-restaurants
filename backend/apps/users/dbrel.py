from uuid import uuid4

from sqlalchemy import Boolean, Column, ForeignKey, String, Table
from sqlalchemy.orm import relationship
from sqlalchemy_utils import UUIDType

from backend.db import Base


association_table = Table(
    "user_security_scopes",
    Base.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True),
    Column(
        "security_scope_id", ForeignKey("security_scopes.id"), primary_key=True
    ),
)


class User(Base):
    __tablename__ = "users"

    id = Column(UUIDType, primary_key=True, default=uuid4)
    username = Column(String, unique=True)
    hashed_password = Column(String)
    disabled = Column(Boolean)
    scopes = relationship(
        "SecurityScope",
        secondary=association_table,
        back_populates="users",
        lazy="selectin",
    )


class SecurityScope(Base):
    __tablename__ = "security_scopes"

    id = Column(UUIDType, primary_key=True, default=uuid4)
    name = Column(String, unique=True)
    description = Column(String)
    users = relationship(
        "User",
        secondary=association_table,
        back_populates="scopes",
        lazy="selectin",
    )
