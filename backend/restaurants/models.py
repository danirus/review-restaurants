from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, UUID4

from backend.validators import (
    get_validator,
    is_country_code,
    is_tz_aware,
    not_empty,
)


class InputRestaurant(BaseModel):
    name: str
    description: str
    country: str
    postal_code: str
    address: str
    webpage: str
    phone_number: str

    _name_not_empty = get_validator("name", val_func=not_empty)
    _description_not_empty = get_validator("description", val_func=not_empty)
    _country_code = get_validator("country", val_func=is_country_code)
    _postal_code_not_empty = get_validator("postal_code", val_func=not_empty)
    _address_not_empty = get_validator("address", val_func=not_empty)


class InputExtendedRestaurant(InputRestaurant):
    disabled: Optional[bool]
    avg_rating: Optional[float]


class Restaurant(InputExtendedRestaurant):
    id: UUID4
    created_at: datetime = Field(default_factory=lambda: datetime.now())

    _created_at_is_tz_aware = get_validator("created_at", val_func=is_tz_aware)

    class Config:
        orm_mode = True
