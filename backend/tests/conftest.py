import asyncio
import json
from os import getenv
from typing import Generator

import pytest
from fastapi_jwt_auth import AuthJWT
from httpx import AsyncClient
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.future import select
from sqlalchemy.orm import sessionmaker

from backend.db import Base, get_db
from backend.main import app
from backend.users import dbrel as dbrel_users
from backend.users.auth import get_password_hash


engine = create_async_engine(getenv("DATABASE_TEST_URI"))

TestSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def override_get_db():
    try:
        db = TestSessionLocal()
        yield db
    finally:
        await db.close()


@pytest.fixture(scope="session")
def event_loop(request) -> Generator:
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    await load_users()


@pytest.fixture(autouse=True)
def inject_fake_db():
    app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def mock_jwtauth_config():
    class JWTAuthSettingsTest(BaseModel):
        authjwt_secret_key: str = "SECRET_KEY"
        authjwt_algorithm: str = "HS256"
        authjwt_access_token_expires: int = 5 * 60  # 5 minutes
        authjwt_refresh_token_expires: int = 7 * 24 * 60 * 60  # one week

    @AuthJWT.load_config
    def get_config():
        return JWTAuthSettingsTest()


def load_fixture(file_name: str):
    if file_name is None:
        return {}

    with open(file_name, mode="r") as file:
        data = json.load(file)

    return data


async def load_users():
    data = load_fixture("tests/fixtures/users.json")

    if data:
        db = TestSessionLocal()
        async with db.begin():
            for user in data["db"].get("users", []):
                hashed_password = get_password_hash(user["password"])

                scopes_result = await db.stream(
                    select(dbrel_users.SecurityScope)
                )
                user_scopes = [
                    scope
                    async for scope, in scopes_result
                    if scope.name in user["scopes"]
                ]
                db_user = dbrel_users.User(
                    id=user["id"],
                    username=user["username"],
                    hashed_password=hashed_password,
                    disabled=False,
                    scopes=user_scopes,
                )
                db.add(db_user)

        await db.commit()
        await db.close()


@pytest.fixture
async def access_token():
    await load_users()
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/token", json={"username": "admin", "password": "secret"}
        )
        response_json = response.json()
        return response_json["access_token"]
