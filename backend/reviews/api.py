import logging
from os import stat
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import UUID4
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db import get_db
from backend.reviews import crud, models
from backend.users import auth
from backend.users.crud import get_user


router = APIRouter()

LOGGER = logging.getLogger()


@router.get(
    "/api/v1/reviews/{restaurant_id}",
    summary="List all reviews for the given restaurant ID."
)
async def list_reviews(
    restaurant_id: UUID4,
    rating: Optional[int] = 0,
    offset: Optional[int] = 0,
    limit: Optional[int] = 10,
    Authorize: auth.AuthJWTScoped = Depends(),
    db: AsyncSession = Depends(get_db),
    _token: str = Depends(auth.oauth2_access_scheme),
):
    try:
        review_list = await crud.list_reviews(
            db, restaurant_id, rating, offset, limit
        )
        review_count = await crud.count_reviews(db, restaurant_id, rating)
        return {
            'data': review_list,
            'count': review_count
        }
    except Exception as exc:
        raise HTTPException(status_code=405, detail=exc.args)


@router.post(
    "/api/v1/review/{restaurant_id}",
    summary="Create a review for the given restaurant ID.",
    status_code=status.HTTP_201_CREATED
)
async def create_review(
    restaurant_id: UUID4,
    review: models.InputReview,
    db: AsyncSession = Depends(get_db),
    Authorize: auth.AuthJWTScoped = Depends(),
):
    Authorize.jwt_required("users:me")
    username = Authorize.get_jwt_subject()
    user = await get_user(db, username=username)
    return await crud.create_review(db, restaurant_id, user.id, review)
