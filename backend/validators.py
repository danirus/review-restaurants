import re
from typing import Callable

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
