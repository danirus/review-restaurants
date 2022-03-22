import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import UUID4
from sqlalchemy.ext.asyncio import AsyncSession

from backend.db import get_db
from backend.restaurants import crud, models
from backend.reviews.crud import (count_reviews, get_best_review,
                                  get_last_review, get_worst_review)
from backend.users import auth


router = APIRouter()

LOGGER = logging.getLogger()


@router.get("/api/v1/restaurants", summary="List all restaurants.")
async def list_restaurants(
    offset: Optional[int] = 0,
    limit: Optional[int] = 10,
    db: AsyncSession = Depends(get_db),
):
    try:
        restaurant_list = await crud.list_restaurants(db, offset, limit)
        restaurant_count = await crud.count_restaurants(db)
        return {
            'data': restaurant_list,
            'count': restaurant_count
        }
    except Exception as exc:
        raise HTTPException(status_code=405, detail=exc.args)


@router.get(
    "/api/v1/restaurants/{country}/{postcode}",
    summary="List restaurants in the given country and postal code.",
)
async def list_restaurants_in_area(
    country: str,
    postcode: str,
    name: Optional[str] = "",
    offset: Optional[int] = 0,
    limit: Optional[int] = 10,
    db: AsyncSession = Depends(get_db),
):
    try:
        restaurant_list = await crud.find_restaurants(
            db, country, postcode, name, offset, limit
        )
        restaurant_count = await crud.count_restaurants(
            db, country, postcode, name
        )
        return {
            'data': restaurant_list,
            'count': restaurant_count
        }
    except Exception as exc:
        raise HTTPException(status_code=405, detail=exc.args)


@router.post("/api/v1/restaurant", response_model=models.Restaurant)
async def create_restaurant(
    restaurant: models.InputRestaurant,
    db: AsyncSession = Depends(get_db),
    Authorize: auth.AuthJWTScoped = Depends(),
):
    Authorize.jwt_required("users:write")
    return await crud.create_restaurant(db, restaurant)


@router.get(
    "/api/v1/restaurant/{restaurant_id}",
    summary=(
        "Get restaurant details with the best, "
        "the worst and the latest review"
    )
)
async def get_restaurant_by_id(
    restaurant_id: UUID4,
    Authorize: auth.AuthJWTScoped = Depends(),
    db: AsyncSession = Depends(get_db),
    _token: str = Depends(auth.oauth2_access_scheme),
):
    Authorize.jwt_required("users:me")

    db_restaurant = await crud.get_restaurant_by_id(db, restaurant_id)
    if db_restaurant is None:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    rev_count = await count_reviews(db, restaurant_id)
    best_rev = None
    worst_rev = None
    last_rev = None

    if rev_count > 0:
        last_rev = await get_last_review(db, restaurant_id)
        if rev_count > 1:
            best_rev = await get_best_review(db, restaurant_id)
            worst_rev = await get_worst_review(db, restaurant_id)

        if last_rev and best_rev and last_rev.id == best_rev.id:
            last_rev = None

        if last_rev and worst_rev and last_rev.id == worst_rev.id:
            last_rev = None

        if best_rev and worst_rev and best_rev.id == worst_rev.id:
            worst_rev = None

    return {
        "data": db_restaurant,
        "review_count": rev_count,
        "best_review": best_rev,
        "worst_review": worst_rev,
        "last_review": last_rev
    }


@router.put(
    "/api/v1/restaurant/{restaurant_id}", response_model=models.Restaurant
)
async def update_restaurant(
    restaurant_id: UUID4,
    restaurant: models.InputExtendedRestaurant,
    db: AsyncSession = Depends(get_db),
    Authorize: auth.AuthJWTScoped = Depends(),
):
    Authorize.jwt_required("users:write")
    db_restaurant = await crud.update_restaurant(db, restaurant_id, restaurant)
    if db_restaurant is None:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return db_restaurant


@router.delete(
    "/api/v1/restaurant/{restaurant_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_restaurant(
    restaurant_id: UUID4, db: AsyncSession = Depends(get_db)
):
    deleted_count = await crud.delete_restaurant(db, restaurant_id)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Restaurant not found")
