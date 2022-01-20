
from flask_sqlalchemy.model import Model
from flask_sqlalchemy.utils import sqlalchemy as db
#from config import db, ma 


class IUser(Model):
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
    cryptoAccountId = db.Model.relationship(
        "CryptoAccount",
        backref="iuser",
        uselist=False
    )


class CryptoAccount(Model):
    __tablename__ = "cryptoaccount"
    id = db.Column(db.Integer, primary_key = True)
    cryptoCurrency = db.relationship(
        "CryptoCurrencyAccount",
        backref="cryptoaccount"
    ) 
    userId = db.Column(db.Integer, db.ForeignKey("iuser.id"))

class CryptoCurrencyAccount(Model):
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

class CryptoCurrency(Model):
    __tablename__="cryptocurrency"
    id = db.Column(db.Integer, primary_key = True)
    cryptoName = db.Column(db.String(10), unique = True)
    exchangeRate = db.Column(db.Float)


class Transaction(Model):
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