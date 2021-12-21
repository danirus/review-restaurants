from typing import List, Optional

from pydantic import BaseModel, SecretStr, UUID4

from backend.validators import get_validator, no_whitespace, not_empty


class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None


class TokenData(BaseModel):
    username: Optional[str] = None
    scopes: List[str] = []


class SecurityScopeBase(BaseModel):
    name: str
    description: str


class SecurityScopeCreate(SecurityScopeBase):
    pass


class SecurityScope(SecurityScopeBase):
    id: UUID4

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    username: str
    disabled: Optional[bool] = False

    _username_not_empty = get_validator("username", val_func=not_empty)
    _username_no_whitespace = get_validator("username", val_func=no_whitespace)


class UserCreate(UserBase):
    password: SecretStr
    scopes: List[str] = []


class User(UserBase):
    id: UUID4
    scopes: List[SecurityScope] = []

    class Config:
        orm_mode = True


class UserLogin(BaseModel):
    username: str
    password: SecretStr

    _username_not_empty = get_validator("username", val_func=not_empty)
    _username_no_whitespace = get_validator("username", val_func=no_whitespace)
    _password_not_empty = get_validator("password", val_func=not_empty)
