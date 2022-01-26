
from flask import Flask, request, Response, jsonify
from markupsafe import re
import sqlalchemy
from config import db, ma, Config, SQLAlchemy
from cryptomodels import *
from usermodels import *
from app import *
import json
from serializer import CryptoCurrencyAccountJson,CryptoCurrencyJson
from serializer2 import *
from requests import Request, Session
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import enum
from random import randint
from multiprocessing import Process, Queue
import _thread
from Crypto.Hash import keccak
from time import sleep
from cryptomodels import db as crypto_db
from cryptomodels import *
from usermodels import db as user_db

@app.route('/getUserCryptos', methods=['GET'])
def GetUserCryptos():
    userId = int(request.args.get('id'))
    cryptoAccountId = CryptoAccount.query.filter_by(userId=userId).first()
    cryptoCurrencyAccounts = list(CryptoCurrencyAccount.query.filter_by(cryptoAccountId=cryptoAccountId.id).all())
    ccaJson = CryptoCurrencyAccountJson(many=True)
    retJson = ccaJson.dump(cryptoCurrencyAccounts)

    return jsonify(retJson),200

@app.route("/getCryptoCurrencies", methods=['GET'])
def GetAllCurrencies():
    def myFunc(e):
        return e['id']

    allCryptos  = CryptoCurrency.query.all()
    cryptos = list(allCryptos)
    jsonobject = CryptoCurrencyJson(many=True)
    results = jsonobject.dump(cryptos)
    results.sort(key=myFunc)
    return jsonify(results)

@app.route('/checkBalance',methods=['GET'])
def CheckBalance():
    body = json.loads(request.data.decode('utf-8'))
    email = body["email"]

    iuser = IUser.query.filter_by(email=email).first()
    if iuser is None:
        return jsonify({"error": "User with that email or password doesn't exist!"}),404

    jsonObject = UserJson()
    userr  =  jsonObject.dump(iuser)

    return jsonify(userr),200

@app.route("/updateCryptoCurrency", methods=['GET'])
def getCryptoData():
    url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'
    parameters = {
    'start':'1',
    'limit':'100',
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


     cryptoName = data['data'][0]['symbol']
     print(cryptoName)
     if(CryptoCurrency.query.filter_by(cryptoName=cryptoName).first() is None):
          for d in data['data']:
            try:
                
                cryptoCurr = CryptoCurrency(d['symbol'],d['quote']['USD']['price'])
                # cryptoCurr =CryptoCurrency.query.filter_by(cryptoName=d['symbol']).first()
                db.session.add(cryptoCurr)
                # db.session.
                # cryptoCurr.exchangeRate =d['quote']['USD']['price']
                db.session.commit()
                
            except Exception:
                    continue
     else:
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



@app.route("/registerUser", methods=['POST'])
def registerUser():

    body = json.loads(request.data.decode('utf-8'))

    firstName = body["firstName"]
    lastName = body["lastName"]
    address = body["address"]
    city = body["city"]
    country = body["country"]
    phoneNumber = body["phoneNumber"]
    email = body["email"]
    password = body["password"]

    existUser = IUser.query.filter_by(email=email).first()

    if(existUser != None):
        return jsonify({"error":"User already exist!"}), 400

    iuser = IUser(firstName,lastName,address,password,email,phoneNumber,city,country)

    db.session.add(iuser)
    db.session.commit()

    cryptoAccount = CryptoAccount(userId = iuser.id, accountBalance = 0)
    db.session.add(cryptoAccount)
    db.session.commit()

    return Response(status=200)

@app.route('/getuser', methods=['GET'])
def GetUser():
    userId = int(request.args.get('id'))
    user = IUser.query.filter_by(id= userId).first()
    jsonObject = UserJson()
    userr  =  jsonObject.dump(user)
    
    return jsonify(userr)

@app.route('/login',methods=['POST'])
def LogIn():
    body = json.loads(request.data.decode('utf-8'))
    email = body["email"]
    password = body["password"]
  
    iuser = IUser.query.filter(IUser.email.like(email),
    IUser.password.like(password)).first()


    if iuser is None:
        return jsonify({"error": "User with that email or password doesn't exist!"}),404
    # if iuser.verified == False:
    #     return jsonify({"error": "User not verified"}),404
    jsonObject = UserJson()
     
    cryptoAcc = CryptoAccount.query.filter_by(userId = iuser.id).first()
    obj = list(CryptoCurrencyAccount.query.filter_by(cryptoAccountId= cryptoAcc.id).all())
    
    iuser.cryptoAccountId.cryptoCurrency = obj
    
    userr  =  jsonObject.dump(iuser)

    return jsonify(userr),200

@app.route('/payment', methods =['POST'])
def CreditCardPayment():
    body = json.loads(request.data.decode('utf-8'))

    email = body["email"]
    amount = float(body["amount"])
    
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
    body = json.loads(request.data.decode('utf-8'))
    print(body)
    id = body["id"]
    user = IUser.query.filter_by(id= id).first()

    user.firstName = body["firstName"]
    user.lastName = body["lastName"]
    user.address = body["address"]
    user.city = body["city"]
    user.country = body["country"]
    user.phoneNumber = body["phoneNumber"]
    user.email = body["email"]
    user.password = body["password"]

    db.session.add(user)
    db.session.commit()
    jsonObject = UserJson()
    userr  =  jsonObject.dump(user)

    return jsonify(userr)

@app.route('/buyNewCrypto',methods = ['POST'])
def BuyCrypto():
    
    print(request)
    body = json.loads(request.data.decode('utf-8'))
    print(body)
    email = body["email"]
    amountDollars = body["amountDollars"]
    cryptoCurrency = body["cryptoCurrency"]
    cryptoAmount = body["cryptoAmount"]

    iuser = IUser.query.filter_by(email = email).first()
    iuser.cryptoAccountId.accountBalance -= amountDollars

    db.session.commit()
    ###################
    cryptoAccount = CryptoAccount.query.filter_by(userId = iuser.id).first()
    cryptoCurrencyAccounts = CryptoCurrencyAccount.query.all()
    found = False
    for curr in cryptoCurrencyAccounts:
        if(curr.cryptoCurrencyId == cryptoCurrency) and (curr.cryptoAccountId == cryptoAccount.id):
            objectS = CryptoCurrencyAccount.query.filter_by(id = curr.id).first()
            objectS.cryptoBalance += cryptoAmount
            db.session.commit()
            found = True

    
    if(found == False):
        # ne postoji
        cryptoCurrencyAccount = CryptoCurrencyAccount()
        cryptoCurrencyAccount.cryptoBalance = cryptoAmount
        cryptoCurrencyAccount.cryptoAccountId = iuser.cryptoAccountId.id
        cryptoCurrencyAccount.cryptoCurrencyId = cryptoCurrency
        db.session.add(cryptoCurrencyAccount)
        db.session.commit()


    jsonObject = UserJson()
    userr  =  jsonObject.dump(iuser)
    return jsonify(userr)

@app.route("/exchangeCrypto", methods=['POST'])
def ExchangeCrypto():
    body = json.loads(request.data.decode('utf-8'))

    accountId = body["accountId"]
    cryptoAmount = body["amount"]
    fromCryptoCurrency = body["fromCryptoCurrency"]
    toCryptoCurrency = body["toCryptoCurrency"]

    fromCrypto = CryptoCurrency.query.filter_by(cryptoName= fromCryptoCurrency).first()
    toCrypto = CryptoCurrency.query.filter_by(cryptoName= toCryptoCurrency).first()

    inDollars = fromCrypto.exchangeRate * float(cryptoAmount)

    inAnotherCrypto = inDollars/toCrypto.exchangeRate

    cryptoCurrAcc = CryptoCurrencyAccount()
    allcryptoAccounts = list(CryptoCurrencyAccount.query.all())

    for alc in allcryptoAccounts:
        if (alc.cryptoCurrencyId==fromCryptoCurrency) and (alc.cryptoAccountId==accountId):
            cryptoCurrAcc = alc
            print(cryptoCurrAcc.id)
            cryptoCurrencyAccount = CryptoCurrencyAccount.query.filter_by(id = cryptoCurrAcc.id ).first()
            cryptoCurrencyAccount.cryptoBalance -= cryptoAmount

            db.session.commit()
    found = False
    for alc in allcryptoAccounts:
        if (alc.cryptoCurrencyId==toCryptoCurrency) and (alc.cryptoAccountId==accountId):
            found = True
            cryptoCurrAcc = alc
            cryptoCurrencyAccount = CryptoCurrencyAccount.query.filter_by(id = cryptoCurrAcc.id ).first()
            cryptoCurrencyAccount.cryptoBalance += inAnotherCrypto
            db.session.commit()
            
    if found == False:
        cryptoCurrencyAccount = CryptoCurrencyAccount()
        cryptoCurrencyAccount.cryptoBalance = inAnotherCrypto
        cryptoCurrencyAccount.cryptoAccountId = accountId
        cryptoCurrencyAccount.cryptoCurrencyId = toCrypto.cryptoName
        db.session.add(cryptoCurrencyAccount)
        db.session.commit()

    account = CryptoAccount.query.filter_by(id = accountId).first()
    iuser = IUser.query.filter_by(id = account.userId).first()

    jsonObject = UserJson()
    userr  =  jsonObject.dump(iuser)
    return jsonify(userr),200


    


    



@app.route("/getTransactions", methods=['GET'])
def getTransactionUser():
    userId = int(request.args.get('id'))
    transactions = Transaction.query.all() 
    
    userTransaction = filter(lambda x : x.userfromid == userId or x.usertoid == userId,transactions)
    
    transactions = list(userTransaction)
   # trans = Transaction.all()
    jsonn = TransactionJson(many=True)
    results = jsonn.dump(transactions)

    for i in range(len(transactions)):
        trName = transactions[i].cryptoCurrencyId
        cur = CryptoCurrency.query.filter_by(cryptoName=trName).first()
        curJson = CryptoCurrencyJson()
        temp = curJson.dump(cur)
        results[i]['cryptoCurrencyId'] = temp

    return jsonify(results),200

@app.route("/doTransaction", methods= ['POST'])
def StartTransaction():
    body = json.loads(request.data.decode('utf-8'))

    emailFrom = body['emailFrom']
    emailTo = body['emailTo']
    amount = body['amount']
    state = 'PROCESSING'
    
    rndint = randint(1,1389)
    k = keccak.new(digest_bits=256)
    stringToHash = emailFrom+emailTo+str(amount)+str(rndint)
    k.update(stringToHash.encode('utf-8'))

    cryptoCurrencyId1 = body['cryptoName']
    userfromid = body['userfromid']
    #naci drugog po mejlu
    valid = False
    userTo = (IUser.query.filter_by(email = body['emailTo']).first())
    userToid = userfromid

    if userTo== None :
        state = 'DECLINED'
    else:   
        cryptoAcc = CryptoAccount.query.filter_by(userId = userTo.id).first()
        cryptoCurrencyAccount2 = list(CryptoCurrencyAccount.query.all())
        objekat = None
        for ccc in cryptoCurrencyAccount2:
            if ( ccc.cryptoAccountId==cryptoAcc.id ) and (ccc.cryptoCurrencyId==cryptoCurrencyId1):
                objekat = ccc        

        userToid = userTo.id

        if objekat!=None:
            valid = True            
        else:
            state = 'DECLINED'

    transaction =  Transaction()
    transaction.amount = float(body['amount'])
    transaction.hashID = str(k.hexdigest())
    transaction.state= state 
    transaction.userfromid = int(userfromid)
    transaction.usertoid = int(userToid)
    transaction.cryptoCurrencyId = cryptoCurrencyId1 #CryptoCurrency.query.filter_by(cryptoName= cryptoCurrencyId).first()

    db.session.add(transaction)
    db.session.commit()


    jsonObject = TransactionJson()
    trJson  =  jsonObject.dump(transaction)

    cur = CryptoCurrency.query.filter_by(cryptoName=cryptoCurrencyId1).first()
    curJson = CryptoCurrencyJson()
    temp = curJson.dump(cur)
    trJson['cryptoCurrencyId'] = temp


    # if valid == True:
    return jsonify(trJson),200
    # else:
        # return jsonify({"Status message":"Ne postoji onaj kome saljes"}),404


def announce(q1,q2):
    q1.get()
    q2.put("done")

def Mining(q1,hashId,userFromId,userToId,amount,cryptoCurrencyId):

    sleep(10)
    cryptoAccountFrom = CryptoAccount.query.filter_by(userId=(userFromId)).first()
    cryptoAccountTo = CryptoAccount.query.filter_by(userId=(userToId)).first()

    allcryptoAccounts = list(CryptoCurrencyAccount.query.all())

    for alc in allcryptoAccounts:
        if (alc.cryptoCurrencyId==cryptoCurrencyId) and (alc.cryptoAccountId==cryptoAccountFrom.id):
            cryptoCurrencyAccFrom = alc

    for alc in allcryptoAccounts:
        if (alc.cryptoCurrencyId==cryptoCurrencyId) and (alc.cryptoAccountId==cryptoAccountTo.id):
            cryptoCurrencyAccTo = alc


    balance = cryptoCurrencyAccFrom.cryptoBalance
    balance = balance - (float(amount) + float(amount)*0.05)

    cryptoCurrencyAccFrom.cryptoBalance= balance
    db.session.add(cryptoCurrencyAccFrom)

    db.session.commit()


    cryptoCurrencyAccTo.cryptoBalance+= float( amount)

    db.session.add(cryptoCurrencyAccTo)
    db.session.commit()

    transaction = Transaction.query.filter_by(hashID = hashId).first()
    transaction.state= 'PROCESSED'
    db.session.add(transaction)
    db.session.commit()

    q1.put("done")


@app.route("/startMining", methods= ['POST'])
def StartMining():
    q1 = Queue()
    q2 = Queue()

    body = json.loads(request.data.decode('utf-8'))

    hashId = body['hashID']
    amount = body['amount']
    userFromId = body['userFromId']
    userToId = body['userToId']
    cryptoCurrencyId = str(body['cryptoCurrencyId'])

    _thread.start_new_thread(announce,(q1,q2))
    process1 = Process(target= Mining, args = (q1,hashId,userFromId,userToId,float(amount),cryptoCurrencyId))
    process1.start()
    q2.get()

    return jsonify({"Status message":"obavljeno"}),200


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
    