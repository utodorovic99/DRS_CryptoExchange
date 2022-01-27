from flask_sqlalchemy import SQLAlchemy 
from flask_marshmallow import Marshmallow
from dotenv import load_dotenv
import os
from flaskext.mysql import MySQL

# db url for docker 
# DATABASE_URL="mysql+mysqlconnector://root:1234@db/mysql_db"

#heroku db url
# "mysql://b9751ed1e327b5:8d48e671@us-cdbr-east-05.cleardb.net/heroku_b4ed7a8e0c4eb0a"

load_dotenv()
# mysql = MySQL(pool_size=100, pool_recycle=280, connect_timeout=28800, interactive_timeout=28800, wait_timeout=28800)
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