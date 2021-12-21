import logging
from os import getenv

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi_jwt_auth.exceptions import AuthJWTException
from starlette.middleware.cors import CORSMiddleware

from backend import deps
from backend.apps.users import users_router


app = FastAPI()

origins = ["http://localhost:3000", "https://rest.aurant.reviews"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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

app.include_router(users_router)


# --------------------------------------
# Catch all get requests intended to hit
# the API but without endpoint defined.


@app.get("/api/{catchall:path}")
def api_catchall_gets(request: Request):
    raise HTTPException(
        status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
        detail="Method Not Allowed",
    )
