from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import db, ma, Config, SQLAlchemy
from cryptomodels import db as crypto_db
from cryptomodels import *
from usermodels import db as user_db
from usermodels import * 
from flask import Blueprint
from multiprocessing import Process
from sqlalchemy import create_engine
app = Flask(__name__)
app.config.from_object(Config)
CORS(app, supports_credentials=False)
db = SQLAlchemy(app)

user_db.init_app(app)
crypto_db.init_app(app)
migrate = Migrate(app, db)

try:
    
    engine = create_engine('postgresql://postgres:admin@localhost/cryptoexchange')
    
    with engine.connect() as con:
        rs = con.execute('SELECT * FROM cryptocurrency')
        objekat = rs.fetchall()
            

except Exception as e:

    with app.app_context():
       user_db.create_all()
       crypto_db.create_all()
    