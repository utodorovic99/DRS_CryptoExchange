from dataclasses import field
from marshmallow import Schema, fields
from config import ma

class CryptoCurrencyJson(Schema):
    id = fields.Number(dump_only=True)
    cryptoName = fields.String(dump_only=True)
    exchangeRate = fields.Float(dump_only=True)

class TransactionJson(ma.Schema):
    hashID = fields.String()
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