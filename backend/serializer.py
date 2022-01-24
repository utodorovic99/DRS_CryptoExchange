from dataclasses import field
from marshmallow import Schema, fields
from config import ma


class CryptoCurrencyJson(Schema):
    id = fields.Number(dump_only=True)
    cryptoName = fields.String(dump_only=True)
    exchangeRate = fields.Float(dump_only=True)

class TransactionJson(ma.Schema):
    hashId = fields.String()
    amount = fields.Float()
    state = fields.Str()
    cryptoCurrencyId = fields.Nested(CryptoCurrencyJson)
    userfromid = fields.Number()
    usertoid = fields.Number()

class CryptoCurrencyAccountJson(ma.Schema):
    id = fields.Number()
    cryptoAccountId = fields.Number()
    cryptoCurrencyId = fields.String()
    cryptoBalance = fields.Float()

class CryptoAccountJson(ma.Schema):
    id = fields.Number()
    accountBalance = fields.Float()
    cryptoCurrency = fields.List(fields.Nested(CryptoCurrencyAccountJson))
    userId = fields.Number()

class UserJson(ma.Schema):
    id = fields.Number()
    email = fields.Str()
    firstName = fields.Str()
    lastName = fields.Str()
    address = fields.Str()  
    city = fields.Str()
    country = fields.Str()
    phoneNumber = fields.Number()
    password = fields.Str()
    verified = fields.Bool()
    cryptoAccountId = fields.Nested(CryptoAccountJson)


