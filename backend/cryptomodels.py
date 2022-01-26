
from config import db, ma, Config
from usermodels import *

class CryptoCurrency(db.Model):
    __tablename__="cryptocurrency"
    id = db.Column(db.Integer, primary_key = True)
    cryptoName = db.Column(db.String(10), unique = True)
    exchangeRate = db.Column(db.Float)
    def __init__(
            self, cryptoName, exchangeRate
        ):
           self.cryptoName = cryptoName,
           self.exchangeRate = exchangeRate

class CryptoCurrencyAccount(db.Model):
    __tablename__ = "cryptocurrencyaccount"
    id = db.Column(db.Integer, primary_key = True)
    cryptoBalance = db.Column(db.Float)
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
    def _init_(
            self,cryptoBalance,cryptoAccountId,cryptoCurrencyId
    ):
            self.cryptoBalance = cryptoBalance
            self.cryptoAccountId = cryptoAccountId
            self.cryptoCurrencyId = cryptoCurrencyId


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
        
    def _init_(
            self,hashID,amount,state,cryptoCurrencyId,userfromid,usertoid
    ):
            self.hashID = hashID
            self.amount = amount
            self.state = state
            self.cryptoCurrencyId = cryptoCurrencyId
            self.userfromid = userfromid
            self.usertoid = usertoid

   