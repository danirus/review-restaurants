FROM python:3.9-buster

WORKDIR /prod

RUN apt-get -y update && \
    apt-get -y upgrade

RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add && \
    echo "deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list && \
    apt-get update && apt-get -y install postgresql-client-12

COPY backend/requirements.txt /prod/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /prod/requirements.txt

COPY ./README.md /prod/README.md
COPY ./setup.py /prod/setup.py
COPY ./setup.cfg /prod/setup.cfg
COPY ./alembic.ini /prod/alembic.ini
COPY ./migrations /prod/migrations
COPY ./backend /prod/backend

RUN python setup.py install

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8100"]
