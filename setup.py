#!/usr/bin/env python
import os
from setuptools import setup, find_packages


long_description = open(
    os.path.join(os.path.dirname(__file__), 'README.md')
).read()


install_requires = open(
    os.path.join(os.path.dirname(__file__), 'backend', 'requirements.txt')
).read()

install_requires = [req for req in install_requires.split("\n") if len(req)]

setup(
    name='review-restaurants',
    author='Daniela Rus Morales',
    version='0.1.0',
    url='https://git.toptal.com/Daniela-Rus-Morales/Daniela-Rus-Morales',
    description='Review Restaurants Web Application',
    long_description=long_description,
    packages=find_packages('.'),
    install_requires=install_requires,
)
