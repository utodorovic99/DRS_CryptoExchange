from enum import unique
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import db, ma, Config, SQLAlchemy

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, supports_credentials=True)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class IUser(db.Model):
    __tablename__ = "iuser"
    id = db.Column(db.Integer, primary_key = True)
    firstName = db.Column(db.String(30))
    lastName = db.Column(db.String(30))
    address = db.Column(db.String(50))
    city = db.Column(db.String(50))
    country = db.Column(db.String(60))
    phoneNumber = db.Column(db.Integer)
    password = db.Column(db.String(65))
    verified = db.Column(db.Boolean, default = False)
    cryptoAccountId = db.relationship(
        "CryptoAccount",
        backref="iuser",
        uselist=False
    )


class CryptoAccount(db.Model):
    __tablename__ = "cryptoaccount"
    id = db.Column(db.Integer, primary_key = True)
    cryptoCurrency = db.relationship(
        "CryptoCurrencyAccount",
        backref="cryptoaccount"
    ) 
    userId = db.Column(db.Integer, db.ForeignKey("iuser.id"))

class CryptoCurrencyAccount(db.Model):
    __tablename__ = "cryptocurrencyaccount"
    id = db.Column(db.Integer, primary_key = True)
    cryptoAccountId = db.Column(
        db.Integer,
        db.ForeignKey( 
            "cryptoaccount.id"
        )
    )
    cryptoCurrencyId = db.Column(
        db.String(10),
        db.ForeignKey(
            "cryptocurrency.cryptoName"
        )
    )

class CryptoCurrency(db.Model):
    __tablename__="cryptocurrency"
    id = db.Column(db.Integer, primary_key = True)
    cryptoName = db.Column(db.String(10), unique = True)
    exchangeRate = db.Column(db.Float)


class Transaction(db.Model):
    __tablename__ = "transaction"
    hashID = db.Column(db.String(256), primary_key=True)
    amount = db.Column(db.Float)
    state = db.Column(db.String(100))
    cryptoCurrencyId = db.Column(
        db.String(10),
        db.ForeignKey(
            "cryptocurrency.cryptoName"
        )
    )
    userfromid = db.Column(db.Integer, db.ForeignKey("iuser.id"))
    usertoid = db.Column(db.Integer, db.ForeignKey("iuser.id"))