from telnetlib import STATUS
from flask import Flask, request, Response, jsonify
from flask_sqlalchemy import SQLAlchemy
from markupsafe import re
import sqlalchemy
from config import db, ma, Config, SQLAlchemy
from app import *
import json
from  models.serializer import *
from requests import Request, Session
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects

@app.route("/updateCryptoCurrency", methods=['GET'])
def getCryptoData():
    url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'
    parameters = {
    'start':'1',
    'limit':'5000',
    'convert':'USD'
    }
    headers = {
    'Accepts': 'application/json',
    'X-CMC_PRO_API_KEY': '22df2849-a048-4ae2-8f1b-36f5fa9ca20b',
    }

    session = Session()
    session.headers.update(headers)
        
    def myFunc(e):
     return e['id']

    try:
     response = session.get(url, params=parameters)
     data = json.loads(response.text)
        # print(data)

     for d in data['data']:
      try:
        
        # cryptoCurr = CryptoCurrency(d['symbol'],d['quote']['USD']['price'])
        cryptoCurr =CryptoCurrency.query.filter_by(cryptoName=d['symbol']).first()
        # db.session.add(cryptoCurr)
        # db.session.
        cryptoCurr.exchangeRate =d['quote']['USD']['price']
        db.session.commit()
        
      except Exception:
            continue
    
    except (ConnectionError, Timeout, TooManyRedirects) as e:
        print(e)
    allCryptos  = CryptoCurrency.query.all()
    cryptos = list(allCryptos)
    jsonobject = CryptoCurrencyJson(many=True)
    results = jsonobject.dump(cryptos)
    
    results.sort(key=myFunc)
    return jsonify(results)




@app.route('/')
def hello():
    return jsonify({"as": "asdasd"})

@app.route("/registerUser", methods=['POST'])
def registerUser():
    firstName = request.json["firstName"]
    lastName = request.json["lastName"]
    address = request.json["address"]
    city = request.json["city"]
    country = request.json["country"]
    phoneNumber = request.json["phoneNumber"]
    email = request.json["email"]
    password = request.json["password"]


    existUser = IUser.query.filter_by(email=email).first()

    if(existUser == True):
        return jsonify({"User already exist!"})

    iuser = IUser(firstName,lastName,address,password,email,phoneNumber,city,country)

    db.session.add(iuser)
    db.session.commit()

    cryptoAccount = CryptoAccount(userId = iuser.id, accountBalance = 0)
    db.session.add(cryptoAccount)
    db.session.commit()

    return Response(status=200)

@app.route('/login',methods=['POST'])
def LogIn():
    email = request.json["email"]
    password = request.json["password"]
    
    iuser = IUser.query.filter(IUser.email.like(email),
    IUser.password.like(password)).first()
    if iuser is None:
        return jsonify({"error": "User with that email or password doesn't exist!"}),400
    if iuser.verified == False:
        return jsonify({"error": "User not verified"}),400
    return Response(status=200)

@app.route('/payment', methods =['POST'])
def CreditCardPayment():
    email = request.json["email"]
    amount = request.json["amount"]
    iuser = IUser.query.filter_by(email = email).first()
    if iuser.verified == False:
        iuser.verified = True
        iuser.cryptoAccountId.accountBalance-= 1
        db.session.commit()
    
    iuser.cryptoAccountId.accountBalance += amount
    db.session.commit()
    jsonobject = UserJson()
    userr = jsonobject.dump(iuser)
    return jsonify(userr)

@app.route("/updateUser",methods=['POST'])
def updateUser():
    id = request.json["id"]
    user = IUser.query.filter_by(id= id).first()

    user.firstName = request.json["firstName"]
    user.lastName = request.json["lastName"]
    user.address = request.json["address"]
    user.city = request.json["city"]
    user.country = request.json["country"]
    user.phoneNumber = request.json["phoneNumber"]
    user.email = request.json["email"]
    user.password = request.json["password"]

    db.session.add(user)
    db.session.commit()
    jsonObject = UserJson()
    userr  =  jsonObject.dump(user)

    return jsonify(userr)

@app.route('/buyNewCrypto',methods = ['POST'])
def BuyCrypto():
    email = request.json["email"]
    amountDollars = request.json["amountDollars"]
    cryptoCurrency = request.json["cryptoCurrency"]
    cryptoAmount = request.json["cryptoAmount"]

    iuser = IUser.query.filter_by(email = email).first()
    iuser.cryptoAccountId.accountBalance -= amountDollars

    db.session.commit()
    
    cryptoCurrencyAccount = CryptoCurrencyAccount()
    cryptoCurrencyAccount.cryptoBalance = cryptoAmount
    cryptoCurrencyAccount.cryptoAccountId = iuser.cryptoAccountId.id
    cryptoCurrencyAccount.cryptoCurrencyId = cryptoCurrency
    db.session.add(cryptoCurrencyAccount)
    db.session.commit()

    jsonObject = UserJson()
    userr  =  jsonObject.dump(iuser)
    return jsonify(userr)

@app.route("/getTransactions", methods=['GET'])
def getTransactionUser() : 
    transactions = Transaction.query.all() 
    
    userTransaction = filter(lambda x : x.userfromid == request.json["id"] or x.usertoid == request.json["id"],transactions)
    
    transactions = list(userTransaction)
    json = TransactionJson(many=True)  
    results = json.dump(transactions)

    return jsonify(results)


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
    #getCryptoData()