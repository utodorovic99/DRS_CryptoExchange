from flask_sqlalchemy import SQLAlchemy 
from flask_marshmallow import Marshmallow
from dotenv import load_dotenv
import os
from flaskext.mysql import MySQL


load_dotenv()
mysql = MySQL()
db = SQLAlchemy()
ma = Marshmallow()
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    # SQLALCHEMY_DATABASE_URI = "postgresql://postgres:admin@localhost/cryptoexchange"
    # SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
    ISOLATION_LEVEL = "READ UNCOMMITTED"
    # SESSION_COOKIE_SECURE = True