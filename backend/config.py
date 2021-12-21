from functools import lru_cache
from os import getenv
from typing import Dict

from pydantic import BaseModel, BaseSettings


class JWTAuthSettings(BaseModel):
    authjwt_secret_key: str = getenv("SECRET_KEY")
    authjwt_algorithm: str = getenv("JWT_ALGORITHM", "HS256")
    authjwt_access_token_expires: int = getenv(
        key="ACCESS_TOKEN_EXPIRE_S",
        default=f"{5 * 60}",  # 5 minutes
    )
    authjwt_refresh_token_expires: int = getenv(
        key="REFRESH_TOKEN_EXPIRE_S",
        default=f"{7 * 24 * 60 * 60}",  # one week
    )


class Settings(BaseSettings):
    app_name: str = "Review Restaurants"
    jwt_auth_setting = JWTAuthSettings()
    security_scopes: Dict[str, str] = {
        "users:me": "Read data about the currently logged in user.",
        "users:read": "Read data about users.",
        "users:write": "Create, update and delete users.",
    }


@lru_cache()
def get_settings():
    return Settings()
