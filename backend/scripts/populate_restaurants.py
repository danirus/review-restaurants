import asyncio
import json
import logging
import os.path

from backend import db
from backend.restaurants import models
from backend.restaurants.crud import create_restaurant


LOGGER = logging.getLogger()


async def populate_restaurants():
    datafile = os.path.join(os.path.dirname(__file__), "restaurants.json")
    restaurant_list = json.loads(open(datafile).read())
    for item in restaurant_list:
        async with db.async_session() as session:
            input_rest = models.InputRestaurant(**item)
            await create_restaurant(session, input_rest)
            print("Created restaurant %s" % item['name'])


def run():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(populate_restaurants())


if __name__ == "__main__":
    run()