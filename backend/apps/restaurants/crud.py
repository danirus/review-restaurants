import logging
from typing import List
from uuid import uuid4

from pydantic import UUID4
from sqlalchemy import and_, delete, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm.exc import NoResultFound

from backend.apps.restaurants import dbrel, models


LOGGER = logging.getLogger()


async def get_restaurant_by_id(db: AsyncSession, restaurant_id: uuid4):
    async with db.begin():
        result = await db.execute(
            (
                select(dbrel.Restaurant).where(
                    dbrel.Restaurant.id == restaurant_id
                )
            )
        )
        first_result = result.first()
        if first_result is None:
            return None
        (first,) = first_result
        return first


async def list_restaurants(
    db: AsyncSession, offset: int, limit: int
) -> List[dbrel.Restaurant]:
    async with db.begin():
        result = await db.execute(
            select(dbrel.Restaurant).offset(offset).limit(limit)
        )
        return [item for item, in result.fetchall()]


async def find_restaurants(
    db: AsyncSession,
    country: str,
    postcode: str,
    name: str = "",
    offset: int = 0,
    limit: int = 10,
):
    async with db.begin():
        results = await db.execute(
            select(dbrel.Restaurant)
            .where(
                and_(
                    dbrel.Restaurant.country == country,
                    dbrel.Restaurant.postal_code == postcode,
                    dbrel.Restaurant.name.ilike(f"%{name}%"),
                )
            )
            .offset(offset)
            .limit(limit)
        )
        return [item for item, in results.fetchall()]


async def create_restaurant(
    db: AsyncSession, restaurant: models.InputRestaurant
):
    async with db.begin():
        db_restaurant = dbrel.Restaurant(
            **restaurant.dict(), disabled=False, avg_rating=0.0
        )
        db.add(db_restaurant)
    await db.commit()
    await db.refresh(db_restaurant)
    return db_restaurant


async def update_restaurant(
    db: AsyncSession,
    restaurant_id: UUID4,
    restaurant: models.InputExtendedRestaurant,
):
    async with db.begin():
        result = await db.execute(
            update(dbrel.Restaurant)
            .where(dbrel.Restaurant.id == restaurant_id)
            .values(**restaurant.dict())
        )
    if result.rowcount > 0:
        return await get_restaurant_by_id(db, restaurant_id)
    return None


async def delete_restaurant(db: AsyncSession, restaurant_id: uuid4):
    async with db.begin():
        result = await db.execute(
            delete(dbrel.Restaurant).where(dbrel.Restaurant.id == restaurant_id)
        )
        return result.rowcount
