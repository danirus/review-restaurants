from datetime import datetime

from pydantic import BaseModel, Field, UUID4

from backend.validators import (
    get_validator,
    is_between_1and5,
    is_tz_aware,
    not_empty,
)


class InputReview(BaseModel):
    review: str
    rating: int

    _review_not_empty = get_validator("review", val_func=not_empty)
    _rating_within_range = get_validator("rating", val_func=is_between_1and5)


class Review(InputReview):
    id: UUID4
    restaurant_id: UUID4
    user_id: UUID4
    created_at: datetime = Field(default_factory=lambda: datetime.now())

    _created_at_is_tz_aware = get_validator("created_at", val_func=is_tz_aware)

    class Config:
        orm_mode = True
