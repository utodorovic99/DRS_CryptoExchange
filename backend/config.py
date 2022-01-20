from flask_sqlalchemy import SQLAlchemy 
from flask_marshmallow import Marshmallow
from flask_postgresql import postgresql, PostgreSQL
import os

pg = PostgreSQL()
db = SQLAlchemy()
ma = Marshmallow()
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:admin@localhost/cryptoexchange"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    