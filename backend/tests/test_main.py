import pytest
from httpx import AsyncClient
from starlette import status

from backend.main import app


pytestmark = pytest.mark.asyncio


async def test_main() -> None:
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/")
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == {"status": "ok"}
