# Review Restaurants

This is a full-stack project:
 * The backend is written in Python using FastAPI.
 * The frontend is written in JavaScript using ReactJS.


## Run locally

This section describes how to setup the project to run it locally in your computer.

### Backend

Setting up the development environment to run the backend requires to have a Python 3 interpreter installed on your OS. Once you have a copy of Python 3, cd into the directory with the cloned repository, create the python virtual environment, activate it, and install the dependencies listed in the `requirements.txt` file:

    $ python3 -m venv venv
    $ source venv/bin/activate
    $ pip install -r backend/requirements.txt

#### Local .env file

Create a `.env_dev` file with the following variables:

    export ENVIRONMENT="development"

    # Secret key to be used as JWT token: `openssl rand -hex 32`.
    export SECRET_KEY=d158eafd405f22bad2fba31ec397b43d3373bfe995aa7d327b37f90857da7b01

    # DB name, user and password.
    export DB_NAME=revrest
    export DB_USER=revrest
    export DB_PASS=secret

    # DB URI used by Alembic (in migrations/env.py) to manage DB migrations.
    export ALEMBIC_URI=postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}

    # DB URI used by the FastAPI application.
    export DATABASE_URI=postgresql+asyncpg://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}

Then source it so that the content is accessible in your terminal session:

    $ source .env_dev


#### Setup PostgreSQL Database

You can use a local PostgreSQL Server or run a docker container with it.

##### Using a local PostgreSQL Server

If you opt for running PostgreSQL locally, simply run the psql console and create the user and database:

    $ psql
    psql (9.6.1)
    Type "help" for help.

    hostname=# create role revrest login password 'secret';
    CREATE ROLE
    hostname=# create database revrest owner revrest;
    CREATE DATABASE

It's assumed that PostgreSQL is running in port 5432.

##### Using a PostgreSQL Docker Container

To run PostgreSQL in Docker, pull the latest image and then run the container passing the DB name, DB user and DB password as environment parameters.

    $ docker image pull postgres:latest
    $ docker container run -d --name timescaledb --publish 5432:5432 --env POSTGRES_DB=${DB_NAME} --env POSTGRES_USER=${DB_USER} --env POSTGRES_PASSWORD=${DB_PASS} postgres:latest


#### Run DB Migrations

    $ alembic upgrade head


## Run with Docker
