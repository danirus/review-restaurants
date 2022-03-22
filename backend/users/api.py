from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import UUID4
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db import get_db
from backend.users import auth, crud, models


router = APIRouter()


async def create_tokens(
    user: models.UserLogin,
    db: AsyncSession,
    Authorize: auth.AuthJWTScoped,
):
    user_db = await crud.authenticate_user(db, user)
    if not user_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = Authorize.create_access_token(
        subject=user_db.username,
        user_claims={"scopes": [scope.name for scope in user_db.scopes]},
    )
    refresh_token = Authorize.create_refresh_token(subject=user_db.username)
    return {"access_token": access_token, "refresh_token": refresh_token}


@router.post(
    "/api/v1/token_form",
    response_model=models.Token,
    summary="Login form mainly used by the Swagger UI.",
)
async def login_form(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    user = models.UserLogin(
        username=form_data.username,
        password=form_data.password,
    )
    Authorize = auth.AuthJWTScoped()
    return await create_tokens(user, db, Authorize)


@router.post(
    "/api/v1/signup",
    response_model=models.User,
    status_code=status.HTTP_201_CREATED,
    summary='Signup for regular users (they get security scope "users:me").',
)
async def signup_user(
    user: models.UserLogin,
    db: AsyncSession = Depends(get_db),
):
    try:
        return await crud.signup_user(db=db, user=user)
    except crud.UserDoesExistException as exc:
        raise HTTPException(status_code=403, detail=exc.args)
    except Exception as exc:
        raise HTTPException(status_code=405, detail=exc.args)


@router.post(
    "/api/v1/login",
    response_model=models.Token,
    summary="Login with username and password.",
)
async def login(
    user: models.UserLogin,
    Authorize: auth.AuthJWTScoped = Depends(),
    db: AsyncSession = Depends(get_db),
):
    return await create_tokens(user, db, Authorize)


@router.post(
    "/api/v1/refresh",
    response_model=models.Token,
    summary="Refresh logged in user's access_token using refresh_token.",
)
async def refresh(
    Authorize: auth.AuthJWTScoped = Depends(),
    db: AsyncSession = Depends(get_db),
    _token: str = Depends(auth.oauth2_refresh_scheme),
):
    Authorize.jwt_refresh_token_required()

    username = Authorize.get_jwt_subject()
    user_db = await crud.get_user(db, username)
    if user_db is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user_db.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )

    new_access_token = Authorize.create_access_token(
        subject=user_db.username,
        fresh=True,
        user_claims={"scopes": [scope.name for scope in user_db.scopes]},
    )
    return {"access_token": new_access_token}


@router.get(
    "/api/v1/user",
    response_model=models.User,
    summary="Get current logged in user (from the access_token).",
)
async def get_current_user(
    Authorize: auth.AuthJWTScoped = Depends(),
    db: AsyncSession = Depends(get_db),
    _token: str = Depends(auth.oauth2_access_scheme),
):
    Authorize.jwt_required("users:me")
    username = Authorize.get_jwt_subject()
    user_db = await crud.get_user(db, username=username)

    if user_db is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user_db.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )

    return user_db


@router.post(
    "/api/v1/user",
    response_model=models.User,
    summary='Create or update a user (requires security scope "users:write").',
)
async def create_or_update_user(
    user: models.UserCreate,
    Authorize: auth.AuthJWTScoped = Depends(),
    db: AsyncSession = Depends(get_db),
    _token: str = Depends(auth.oauth2_access_scheme),
):
    Authorize.jwt_required("users:write")
    try:
        return await crud.create_or_update_user(db=db, user=user)
    except Exception as exc:
        raise HTTPException(status_code=405, detail=exc.args)


@router.get("/api/v1/users", summary="List all users.")
async def list_users(
    offset: Optional[int] = 0,
    limit: Optional[int] = 100,
    Authorize: auth.AuthJWTScoped = Depends(),
    db: AsyncSession = Depends(get_db),
    _token: str = Depends(auth.oauth2_access_scheme),
):
    Authorize.jwt_required("users:read")
    try:
        user_list = await crud.get_users(db, offset, limit)
        user_count = await crud.get_count(db)
        return {
            'data': user_list,
            'count': user_count
        }
    except Exception as exc:
        raise HTTPException(status_code=405, detaul=exc.args)


@router.get("/api/v1/users/count", summary="Returns the total number of users.")
async def get_count(
    Authorize: auth.AuthJWTScoped = Depends(),
    db: AsyncSession = Depends(get_db),
    _token: str = Depends(auth.oauth2_access_scheme),
):
    Authorize.jwt_required("users:read")
    count = await crud.get_count(db)
    return {"count": count}


@router.get(
    "/api/v1/scopes",
    response_model=List[models.SecurityScope],
    summary="List of security scopes to associate to users.",
)
async def get_security_scopes(
    offset: int = 0,
    limit: int = 100,
    Authorize: auth.AuthJWTScoped = Depends(),
    db: AsyncSession = Depends(get_db),
    _token: str = Depends(auth.oauth2_access_scheme),
):
    Authorize.jwt_required("users:read")
    return await crud.get_security_scopes(db, offset, limit)


@router.get(
    "/api/v1/user/{user_id}",
    response_model=models.User,
    summary="Get user by ID.",
)
async def get_user_by_id(
    user_id: UUID4,
    Authorize: auth.AuthJWTScoped = Depends(),
    db: AsyncSession = Depends(get_db),
    _token: str = Depends(auth.oauth2_access_scheme),
):
    Authorize.jwt_required("users:read")

    db_user = await crud.get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.delete(
    "/api/v1/user/{user_id}",
    response_model=models.User,
    summary="Delete user by ID.",
)
async def delete_user_by_id(
    user_id: UUID4,
    Authorize: auth.AuthJWTScoped = Depends(),
    db: AsyncSession = Depends(get_db),
    _token: str = Depends(auth.oauth2_access_scheme),
):
    Authorize.jwt_required("users:write")

    user = await crud.delete_user(db=db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
