import logging
from typing import List
from uuid import uuid4

from pydantic import UUID4
from sqlalchemy import and_, delete, func, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm.exc import NoResultFound

from backend.restaurants import dbrel as dbrel_restaurants
from backend.reviews import dbrel, models


LOGGER = logging.getLogger()


async def list_reviews(
    db: AsyncSession,
    restaurant_id: str,
    rating: int = 0,
    offset: int = 0,
    limit: int = 10
):
    async with db.begin():
        if 0 < rating < 6:
            results = await db.execute(
                select(dbrel.Review)
                .where(
                    and_(
                        dbrel.Review.restaurant_id == restaurant_id,
                        dbrel.Review.rating == rating
                    )
                )
                .offset(offset)
                .limit(limit)
            )
            return [item for item, in results.fetchall()]
        else:
            results = await db.execute(
                select(dbrel.Review)
                .where(dbrel.Review.restaurant_id == restaurant_id)
                .offset(offset)
                .limit(limit)
            )
            return [item for item, in results.fetchall()]


async def count_reviews(db: AsyncSession, restaurant_id: str, rating: int = 0):
    async with db.begin():
        if 0 < rating < 6:
            result = await db.execute(
                select(func.count(dbrel.Review.id))
                .where(
                    and_(
                        dbrel.Review.restaurant_id == restaurant_id,
                        dbrel.Review.rating == rating
                    )
                )
            )
            try:
                return result.scalars().one()
            except NoResultFound:
                return 0
        else:
            result = await db.execute(
                select(func.count(dbrel.Review.id))
                .where(dbrel.Review.restaurant_id == restaurant_id)
            )
            try:
                return result.scalars().one()
            except NoResultFound:
                return 0


async def get_best_review(db: AsyncSession, restaurant_id: str):
    async with db.begin():
        result = await db.execute(
            select(dbrel.Review)
            .where(dbrel.Review.restaurant_id == restaurant_id)
            .order_by(dbrel.Review.rating.desc())
        )
        first_result = result.first()
        if first_result is None:
            return None
        (first,) = first_result
        return first


async def get_worst_review(db: AsyncSession, restaurant_id: str):
    async with db.begin():
        result = await db.execute(
            select(dbrel.Review)
            .where(dbrel.Review.restaurant_id == restaurant_id)
            .order_by(dbrel.Review.rating)
        )
        first_result = result.first()
        if first_result is None:
            return None
        (first,) = first_result
        return first


async def get_last_review(db: AsyncSession, restaurant_id: str):
    async with db.begin():
        result = await db.execute(
            select(dbrel.Review)
            .where(dbrel.Review.restaurant_id == restaurant_id)
            .order_by(dbrel.Review.created_at.desc())
        )
        first_result = result.first()
        if first_result is None:
            return None
        (first,) = first_result
        return first


async def create_review(
    db: AsyncSession,
    restaurant_id: int,
    user_id: int,
    review: models.InputReview
):
    async with db.begin():
        result = await db.execute(
            select(dbrel_restaurants.Restaurant)
            .where(dbrel_restaurants.Restaurant.id == restaurant_id)
        )
        first_result = result.first()
        if first_result is None:
            return None  # Can't add a review for a non-existing restaurant.
        (db_restaurant,) = first_result

        # Add the review.
        db_review = dbrel.Review(
            **review.dict(), restaurant_id=restaurant_id, user_id=user_id
        )
        db.add(db_review)

        # Read total number of reviews.
        result = await db.execute(
            select(func.count(dbrel.Review.id))
            .where(dbrel.Review.restaurant_id == restaurant_id)
        )
        total_reviews = result.scalars().one()

        # Update restaurant's avg_rating.
        curr_avg = db_restaurant.avg_rating
        # avg_new = curr_avg + ( (rev_avg - curr_avg) / (total_reviews + 1) )
        avg_new = curr_avg + ((review.rating - curr_avg) / (total_reviews + 1))
        result = await db.execute(
            update(dbrel_restaurants.Restaurant)
            .where(dbrel_restaurants.Restaurant.id == restaurant_id)
            .values({ 'avg_rating': avg_new })
        )

    await db.commit()
    await db.refresh(db_review)
    return db_review
