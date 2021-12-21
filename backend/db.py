from contextlib import asynccontextmanager
from os import getenv

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


engine = create_async_engine(getenv("DATABASE_URI"))

async_session = sessionmaker(
    engine,
    autocommit=False,
    autoflush=False,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()


# @asynccontextmanager
async def get_db():
    # async with async_session() as session:
    session = async_session()
    try:
        yield session
    finally:
        await session.close()
