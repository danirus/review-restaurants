import re
from datetime import datetime
from typing import Callable

import pytz

from pydantic import validator


def get_validator(*fields, val_func: Callable, **kwargs):
    return validator(*fields, allow_reuse=True, **kwargs)(val_func)


def not_empty(value: str) -> str:
    if value == "":
        raise ValueError("String cannot be empty!")
    return value


def no_whitespace(value: str) -> str:
    pattern = re.compile(r"\s+")
    if pattern.search(value):
        raise ValueError("String may not contain whitespace!")
    return value


def is_tz_aware(value: datetime) -> datetime:
    if value.tzinfo is None:
        raise ValueError("Datetime must be timezone aware!")
    return value


def is_country_code(value: str) -> str:
    if not value.upper() in pytz.country_names:
        raise ValueError("Country must be a valid ISO-3166 2-digit code.")
    return value


def is_between_1and5(value: int) -> int:
    if value < 1 or value > 5:
        raise ValueError("Ratings must be between 1 and 5.")
    return value
