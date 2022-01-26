
from flask import Flask
from config import db, ma, Config, SQLAlchemy
from cryptomodels import *


class CryptoAccount(db.Model):
    __tablename__ = "cryptoaccount"
    id = db.Column(db.Integer, primary_key = True)
    accountBalance = db.Column(db.Float)
    cryptoCurrency = db.relationship(
        "CryptoCurrencyAccount",
        backref="cryptoaccount"
    )
    userId = db.Column(db.Integer, db.ForeignKey("iuser.id"))
    def _init_(
            self,id,accountBalance,userId
    ):
            self.id = id
            self.accountBalance = accountBalance
            self.userId = userId


class IUser(db.Model):
    __tablename__ = "iuser"
    id = db.Column(db.Integer, primary_key = True, autoincrement=True)
    firstName = db.Column(db.String(30))
    lastName = db.Column(db.String(30))
    address = db.Column(db.String(50))
    email = db.Column(db.String(50))
    city = db.Column(db.String(50))
    country = db.Column(db.String(60))
    phoneNumber = db.Column(db.BigInteger)
    password = db.Column(db.String(65))
    verified = db.Column(db.Boolean, default = False)
    cryptoAccountId = db.relationship(
        "CryptoAccount",
        backref="iuser",
        uselist=False
    )
    def __init__(
            self, firstName, lastName, address, password, email, phoneNumber, country, city
        ):
            self.firstName = firstName
            self.lastName = lastName
            self.address = address
            self.password = password
            self.email = email
            self.phoneNumber = phoneNumber
            self.country = country
            self.city = city


