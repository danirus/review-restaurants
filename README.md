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
    export DB_TEST=revrest_tests

    # DB URI used by Alembic (in migrations/env.py) to manage DB migrations.
    export ALEMBIC_URI=postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}

    # DB URI used by the FastAPI application.
    export DATABASE_URI=postgresql+asyncpg://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}

    # DB URI used for tests.
    export DATABASE_TEST_URI=postgresql+asyncpg://${DB_USER}:${DB_PASS}@localhost:5432/${DB_TEST}

    # Default superadmin user and password.
    export SUPERADMIN_USER=sadmin
    export SUPERADMIN_PASS=secret

Then source it so that the content is accessible in your terminal session:

    $ source .env_dev


#### Setup PostgreSQL Database

You can use a local PostgreSQL Server or run a docker container with it.

##### Using a local PostgreSQL Server

If you opt for running PostgreSQL locally, simply run the psql console and create the user and database. Create the tests database too if you plan to run the tests.

    $ psql
    psql (9.6.1)
    Type "help" for help.

    hostname=# create role revrest login password 'secret';
    CREATE ROLE
    hostname=# create database revrest owner revrest;
    CREATE DATABASE
    hostname=# create database revrest owner revrest_tests;
    CREATE DATABASE

It's assumed that PostgreSQL is running in port 5432.


##### Using a PostgreSQL Docker Container

To run PostgreSQL in Docker, pull the latest image and then run the container passing the DB name, DB user and DB password as environment parameters.

    $ docker image pull postgres:latest
    $ docker container run -d --name postgres --publish 5432:5432 --env POSTGRES_DB=${DB_NAME} --env POSTGRES_USER=${DB_USER} --env POSTGRES_PASSWORD=${DB_PASS} postgres:latest


#### Run DB Migrations and feed the DB

Apply the DB migrations to create the tables:

    $ alembic upgrade head

Create the superadmin user 'sadmin', with password 'secret':

    $ python -m backend.scripts.create_superadmin

Populare the database with some restaurants:

    $ python -m backend.scripts.populate_restaurants

#### Launch the backend service

You can use uvicorn in the command line to run the backend with the flag `--reload`, so that changes in the sources are automatically loaded. Or you can use the `run_backend.py` script.

Using the uvicorn command:

    $ uvicorn backend.main:app --host localhost --port 8100 --log-level info --reload

Or using the run_backend script:

    $ python run_backend.py

Now the API service should be up and running. Visit http://localhost:8100/docs to get access to the Swagger interface provided by FastAPI. Click on the "Authorize" button to login with user 'sadmin' and password 'secret'.

### Frontend

The frontend is a Typescript / ReactJS application bootstrapped with create-react-app. The UI has been built using the v4 of the Material-UI component library. To run the application in development, follow the next steps:

    $ cd frontend
    $ npm install
    $ npm run start


## Run with Docker

Use the `docker-compose.yml` file to run the project. Build the image with the backend (the API service), and then launch the docker instances with PostgreSQL, the Backend Service and the Frontend:

    $ docker-compose build
    $ docker-compose up

The three services (postgres, backend, frontend) should be running. However, if you don't see the API Service interface at http://backend:8100/docs, then find out what's the IP address of your host, and add it to your `/etc/hosts` file for names `backend` and `postgres`. If your IP is `192.168.2.100`, add the following line to `/etc/hosts`:

    192.168.2.100   backend postgres

Run the DB migrations:

    $ docker-compose run backend alembic upgrade head

Create the superadmin user 'sadmin' (password: 'secret'):

    $ docker-compose run backend python -m backend.scripts.create_superadmin

Populate the DB with some restaurants:

    $ docker-compose run backend python -m backend.scripts.populate_restaurants

# Tests

Added the initial setup to run tests in the backend. Use `make test` or `make coverage` to run them. It includes the bare minimum, with required pytest fixtures to test also endpoints required authorization.
