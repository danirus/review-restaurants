import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import UUID4
from sqlalchemy.ext.asyncio import AsyncSession

from backend.apps.restaurants import crud, models
from backend.apps.users import auth
from backend.db import get_db


router = APIRouter()

LOGGER = logging.getLogger()


@router.get("/api/v1/restaurants", summary="List all restaurants.")
async def list_restaurants(
    offset: Optional[int] = 0,
    limit: Optional[int] = 10,
    db: AsyncSession = Depends(get_db),
):
    try:
        return await crud.list_restaurants(db, offset, limit)
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
        return restaurant_list
    except Exception as exc:
        raise HTTPException(status_code=405, detail=exc.args)


@router.post("/api/v1/restaurants/", response_model=models.Restaurant)
async def create_restaurant(
    restaurant: models.InputRestaurant,
    db: AsyncSession = Depends(get_db),
    Authorize: auth.AuthJWTScoped = Depends(),
):
    Authorize.jwt_required("users:write")
    return await crud.create_restaurant(db, restaurant)


@router.put(
    "/api/v1/restaurants/{restaurant_id}", response_model=models.Restaurant
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
    "/api/v1/restaurants/{restaurant_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_restaurant(
    restaurant_id: UUID4, db: AsyncSession = Depends(get_db)
):
    deleted_count = await crud.delete_restaurant(db, restaurant_id)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Restaurant not found")
