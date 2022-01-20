from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
from config import db, ma, Config, SQLAlchemy
from app import *


@app.route('/')
def hello():
    return {"hello": "world"}


@app.route('/crypto/', methods=['POST','GET'])
def crypto_currency():
    if request.method == 'POST':
        if request.is_json:
            data = request.get_json()
            print(data)
            newCrypto = CryptoCurrency(id=data['id'], cryptoName=data['cryptoName'], exchangeRate=data['exchangeRate'])
            db.session.add(newCrypto)
            db.session.commit()
            return {"message": f"crypto {newCrypto.cryptoName} has been created successfully."}
        else:
            return {"error": "The request payload is not in JSON format"}

    elif request.method == 'GET':
        cryptos = CryptoCurrency.query.all()
        print(len(cryptos))
        results = [
            {
                "cryptoName": crypto.cryptoName,
                "id": crypto.id,
                "exchange": crypto.exchangeRate
            } for crypto in cryptos]

        return {"count": len(results), "crypto ": results}

if __name__ == '__main__':
    app.run(debug=True)