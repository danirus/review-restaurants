import logging
from os import getenv

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi_jwt_auth.exceptions import AuthJWTException
from starlette.middleware.cors import CORSMiddleware

from backend import deps
from backend.restaurants import restaurants_router
from backend.reviews import reviews_router
from backend.users import users_router


tags_metadata = [
    {
        "name": "Users",
        "description": (
            "Manage authorization tokens, do the signup of regular "
            "users, create or update users passing their scopes, "
            "list users, etc."
        ),
    },
    {
        "name": "Restaurants",
        "description": "Create, read, list, update and delete restaurants.",
    },
    {
        "name": "Reviews",
        "description": (
            "Create a review of a restaurant, update it, read it,"
            "and list reviews."
        ),
    },
]


app = FastAPI(
    title="Review Restaurants API Service",
    version="0.1.0",
    openapi_tags=tags_metadata,
)

origins = [
    "http://localhost:3000",  # When frontend runs from cmd line.
    "http://frontend:3000",  # When frontend runs via Docker.
    "https://res.taurant.reviews"  # When frontend runs in production.
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def configure_logging():
    fmt = (
        "%(asctime)s %(name)-15s %(levelname)-7s "
        "%(filename)s:%(funcName)s():L%(lineno)s %(message)s"
    )
    logging.basicConfig(
        level=getenv("LOG_LEVEL"), format=fmt, datefmt="%Y-%m-%d %H:%M:%S"
    )


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(
        status_code=exc.status_code, content={"detail": exc.message}
    )


kwds = {"dependencies": [Depends(deps.check_jwt)]}

app.include_router(users_router, tags=["Users"])
app.include_router(restaurants_router, tags=["Restaurants"], **kwds)
app.include_router(reviews_router, tags=["Reviews"], **kwds)


@app.get("/")
def main():
    return {"status": "ok"}


# --------------------------------------
# Catch all get requests intended to hit
# the API but without endpoint defined.


@app.get("/api/{catchall:path}")
def api_catchall_gets(request: Request):
    raise HTTPException(
        status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
        detail="Method Not Allowed",
    )
