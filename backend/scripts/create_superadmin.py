import asyncio
import logging
from os import getenv

from backend import db
from backend.config import get_settings
from backend.users import models
from backend.users.crud import create_or_update_user, create_security_scopes


LOGGER = logging.getLogger()

SUPERADMIN_USER = getenv("SUPERADMIN_USER", "sadmin")
SUPERADMIN_PASS = getenv("SUPERADMIN_PASS", "secret")


async def init_security_scopes():
    async with db.async_session() as session:
        await create_security_scopes(
            session,
            [
                models.SecurityScopeCreate(name=name, description=description)
                for name, description in get_settings().security_scopes.items()
            ],
        )
        await session.close()


async def init_superadmin():
    if SUPERADMIN_USER is None or SUPERADMIN_PASS is None:
        LOGGER.error("Either SUPERADMIN_USER or SUPERADMIN_PASS are not set!")
        return

    async with db.async_session() as session:
        user = models.UserCreate(
            username=SUPERADMIN_USER,
            password=SUPERADMIN_PASS,
            scopes=[name for name, _ in get_settings().security_scopes.items()],
        )
        user_db = await create_or_update_user(session, user)
        if user_db:
            LOGGER.info(
                "Created superadmin user '%s' with id '%s'",
                user_db.username,
                user_db.id,
            )
        else:
            LOGGER.error("Error creating superadmin user '%s'", user.username)
        await session.close()


async def main():
    await init_security_scopes()
    await init_superadmin()


def run():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())


if __name__ == "__main__":
    run()
