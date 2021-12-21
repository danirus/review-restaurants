from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi_jwt_auth import AuthJWT
from passlib.context import CryptContext

from backend.config import get_settings

oauth2_access_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/token_form")
oauth2_refresh_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/refresh_token_form",
    scheme_name="OAuth2PasswordBearerRefresh"
)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@AuthJWT.load_config
def get_config():
    return get_settings().jwt_auth_setting


class AuthJWTScoped(AuthJWT):
    def jwt_required(self, *required_scopes: "unicode", **kwargs):
        """
        Overrides `jwt_required` to check for scopes in user claims.
        """
        super().jwt_required(**kwargs)
        user_scopes = self.get_raw_jwt()["scopes"]
        missing_scopes = [
            required_scope
            for required_scope in required_scopes
            if required_scope not in user_scopes
        ]
        if missing_scopes:
            msg = f"Not enough permissions! Missing scopes: {missing_scopes}"
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                headers={"WWW-Authenticate": "Bearer"},
                                detail=msg)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
