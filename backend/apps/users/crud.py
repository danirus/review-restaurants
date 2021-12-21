import logging
from typing import List

from pydantic import UUID4
from sqlalchemy import func
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.orm.exc import NoResultFound

from backend.apps.users import dbrel, models
from backend.apps.users.auth import get_password_hash, verify_password
from backend.utils import sa_orm_object_as_dict

LOGGER = logging.getLogger()


class UserDoesExistException(Exception):
    pass


async def authenticate_user(db: AsyncSession, user: models.UserLogin):
    db_user = await get_user(db, user.username)
    if not db_user:
        return None
    if not verify_password(
        user.password.get_secret_value(), db_user.hashed_password
    ):
        return None
    return db_user


async def create_or_update_user(db: AsyncSession, user: models.UserCreate):
    hashed_password = get_password_hash(user.password.get_secret_value())
    db_user = await get_user(db, user.username)
    try:
        async with db.begin():
            if not db_user:
                db_user = dbrel.User(
                    username=user.username,
                    hashed_password=hashed_password,
                    disabled=False,
                )
            else:
                db_user.hashed_password = hashed_password
                db_user.disabled = db_user.disabled

            scopes_result = await db.stream(select(dbrel.SecurityScope))
            user_scopes = [
                scope
                async for scope, in scopes_result
                if scope.name in user.scopes
            ]
            db_user.scopes = user_scopes
            db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user
    except IntegrityError:
        LOGGER.exception(
            "Failed to create user '%s' that already exists!", user.username
        )
        return None


async def signup_user(db: AsyncSession, user: models.UserLogin):
    db_user = await get_user(db, user.username)
    if db_user != None:
        raise UserDoesExistException(
            "Username '%s' already exist." % user.username
        )

    hashed_password = get_password_hash(user.password.get_secret_value())
    try:
        async with db.begin():
            db_user = dbrel.User(
                username=user.username,
                hashed_password=hashed_password,
                disabled=False,
            )
            scopes_result = await db.stream(
                select(dbrel.SecurityScope).where(
                    dbrel.SecurityScope.name == "users:me"
                )
            )
            (scope,) = await scopes_result.one()
            db_user.scopes = [scope]
            db.add(db_user)

        await db.commit()
        await db.refresh(db_user)
        return db_user

    except IntegrityError as exc:
        LOGGER.exception(
            "IntegrityError: Failed to create user '%s'", user.username
        )
        raise Exception(exc)


async def get_count(db: AsyncSession):
    async with db.begin():
        result = await db.execute(select(func.count(dbrel.User.id)))
        return result.scalars().one()


async def get_user(db: AsyncSession, username: str):
    async with db.begin():
        result = await db.execute(
            select(dbrel.User)
            .options(selectinload(dbrel.User.scopes))
            .where(dbrel.User.username == username)
        )
        try:
            (user,) = result.one()
            return user
        except NoResultFound:
            return None


async def get_user_by_id(db: AsyncSession, user_id: UUID4):
    async with db.begin():
        result = await db.execute(
            select(dbrel.User)
            .options(selectinload(dbrel.User.scopes))
            .where(dbrel.User.id == user_id)
        )
        try:
            (user,) = result.one()
            return user
        except NoResultFound:
            return None


async def get_users(
    db: AsyncSession,
    offset: int = 0,
    limit: int = 100,
):
    async with db.begin():
        result = await db.stream(
            select(dbrel.User)
            .options(selectinload(dbrel.User.scopes))
            .offset(offset)
            .limit(limit)
        )
        return [item async for item, in result.unique()]


async def delete_user(db: AsyncSession, user_id: UUID4):
    async with db.begin():
        result = await db.execute(
            select(dbrel.User).where(dbrel.User.id == user_id)
        )
        try:
            (user,) = result.one()
            await db.delete(user)
        except NoResultFound:
            return None
    await db.commit()
    return user


async def create_security_scopes(
    db: AsyncSession, scopes: List[models.SecurityScopeCreate]
):
    try:
        async with db.begin():
            db_scopes = [
                dbrel.SecurityScope(
                    name=scope.name,
                    description=scope.description,
                )
                for scope in scopes
            ]
            values = [
                sa_orm_object_as_dict(db_scope, ["id"])
                for db_scope in db_scopes
            ]
            result = await db.execute(
                insert(dbrel.SecurityScope)
                .values(values)
                .on_conflict_do_nothing()
            )
        await db.commit()
        return result
    except IntegrityError:
        LOGGER.exception(
            "Failed to create security scope(s) because of an IntegrityError"
        )
        return None


async def get_security_scopes(
    db: AsyncSession, offset: int = 0, limit: int = 100
):
    async with db.begin():
        result = await db.stream(
            select(dbrel.SecurityScope)
            .options(selectinload(dbrel.SecurityScope.users))
            .offset(offset)
            .limit(limit)
        )
        return [item async for item, in result]
