import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from backend.main import app
from backend.tests.conftest import load_users

pytestmark = pytest.mark.asyncio


async def test_login_returns_200() -> None:
    async with AsyncClient(app=app, base_url="http://test") as ac:
        body = {"username": "sadmin", "password": "secret"}
        response = await ac.post("/api/v1/login", json=body)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data


async def test_login_returns_401() -> None:
    async with AsyncClient(app=app, base_url="http://test") as ac:
        body = {"username": "foo", "password": "bar"}
        response = await ac.post("/api/v1/login", json=body)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        data = response.json()
        assert data["detail"] == "Incorrect username or password"
