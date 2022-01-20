from dataclasses import field
from marshmallow import Schema, fields
from config import ma


class CryptoCurrencyJson(ma.Schema):
    id = fields.Number()
    cryptoName = fields.Str()
    exchangeRate = fields.Float()

class TransactionJson(ma.Schema):
    hashId = fields.Number()
    amount = fields.Float()
    state = fields.Str()
    cryptoCurrencyId = fields.Nested(CryptoCurrencyJson)
    userfromid = fields.Number()
    usertoid = fields.Number()

class CryptoCurrencyAccountJson(ma.Schema):
    id = fields.Number()
    cryptoAccountId = fields.Number()
    cryptoCurrencyId = fields.Nested(CryptoCurrencyJson)

class CryptoAccountJson(ma.Schema):
    id = fields.Number()
    cryptoCurrency = fields.List(fields.Nested(CryptoCurrencyAccountJson))
    userId = fields.Number()

class UserJson(ma.Schema):
    id = fields.Number()
    firstName = fields.Str()
    lastName = fields.Str()
    address = fields.Str()  
    city = fields.Str()
    country = fields.Str()
    phoneNumber = fields.Number()
    password = fields.Str()
    verified = fields.Bool()
    cryptoAccountId = fields.Nested(CryptoAccountJson)


