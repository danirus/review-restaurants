from fastapi import Depends

from backend.apps.users.auth import AuthJWTScoped, oauth2_access_scheme


async def check_jwt(
    Authorize: AuthJWTScoped = Depends(),
    _token: str = Depends(oauth2_access_scheme),
):
    Authorize.jwt_required()
