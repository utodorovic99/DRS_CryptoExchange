import React, {Component} from 'react';
import { getViewUrl } from '../../Config';
import { loginStore, NO_USER_LOGGED } from '../Profile/LoginStore';
import './Transactions.css';
import { initUpdateTableState, updateTableStore } from './UpdateTableStore';

export class SendCurrency extends Component{
    constructor(props){
        super(props);
        this.state = {
            cryptoOptions: [],
            userCryptos: [],
            selectedCurrency: '',
            amount: '',
            email: '',
            hidden: sessionStorage.getItem('userJson') === null
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.onLoginShow = this.onLoginShow.bind(this);
        this.onSendCurrency = this.onSendCurrency.bind(this);
        this.onCurrencySelect = this.onCurrencySelect.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.fillCurrencies = this.fillCurrencies.bind(this);
        this.findCryptoExchangeRate = this.findCryptoExchangeRate.bind(this);
        this.validInput = this.validInput.bind(this);
    }

    componentDidMount(){
        fetch(getViewUrl("getCryptoCurrencies"))
        .then(async res => {
            let data = await res.json();
            for(let d in data){
                this.state.cryptoOptions.push(data[d]);
            }
            this.setState(this.state);
        });

        this.fillCurrencies();

        this.unsubLogin = loginStore.subscribe(this.onLoginShow);
    }

    componentWillUnmount(){
        this.unsubLogin();
    }

    findCryptoExchangeRate(cryptoName){
        for (let i = 0; i < this.state.cryptoOptions.length; i++) {
            const c = this.state.cryptoOptions[i];
            if(c.cryptoName == cryptoName){
                return c.exchangeRate;
            }
        }
        return 0;
    }

    fillCurrencies(){
        let userJson = JSON.parse(sessionStorage.getItem('userJson'));

        if(userJson){
            fetch(getViewUrl("getUserCryptos") + `?id=${userJson.id}`)
            .then(async res => {
                let ucJson = await res.json();

                for (let i = 0; i < ucJson.length; i++) {
                    this.state.userCryptos.push(ucJson[i]);                    
                }
            })
            .catch(err => alert(err));
        }

        this.setState(this.state);
    }


    onLoginShow(){
        this.state.hidden = loginStore.getState().type === NO_USER_LOGGED;
        this.fillCurrencies();
        this.setState(this.state);
    }

    onCurrencySelect(e){
        this.state.selectedCurrency = e.target.value;
        console.log(this.state.selectedCurrency);
        this.setState(this.state);
    }

    validInput(){
        return this.state.selectedCurrency == '' &&
                this.state.amount == '' &&
                this.state.email == '';
    }

    onSendCurrency(){
        if(!this.validInput()){
            alert("Please fill out required fields.");
            return;
        }


        let userJson = JSON.parse(sessionStorage.getItem('userJson'));
        
        if(userJson){
            let userCurrencies = userJson.cryptoAccountId.cryptoCurrency;
            let selectedCurrency = userCurrencies.filter(c => c.cryptoCurrencyId == this.state.selectedCurrency);
            if(selectedCurrency.length != 0){
                let userAmountCurrency = Number(selectedCurrency[0].cryptoBalance);
                let selectedAmount = Number(this.state.amount);
                
                if(userAmountCurrency < selectedAmount){
                    alert('Insufficient funds.');
                    return;
                }
    
                const requestStartTransaction = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        emailFrom: userJson.email,
                        emailTo: this.state.email,
                        amount: selectedAmount,
                        cryptoName: this.state.selectedCurrency,
                        userfromid: Number(userJson.id)
                    })
                };

                fetch(getViewUrl('doTransaction'), requestStartTransaction)
                .then(async res => {
                    if(!res.ok) throw Error(JSON.stringify(await res.json()));

                    let transactionJson = await res.json(); 

                    updateTableStore.dispatch(initUpdateTableState);

                    if(transactionJson.state != 'DECLINED'){
                        const requestStartMining = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                hashID: transactionJson.hashID,
                                amount: Number(selectedAmount),
                                userFromId: Number(transactionJson.userfromid),
                                userToId: Number(transactionJson.usertoid),
                                cryptoCurrencyId: this.state.selectedCurrency
                            })
                        };

                        fetch(getViewUrl('startMining'), requestStartMining)
                        .then(async res => {
                            if(!res.ok) throw Error(await res.json())
                            updateTableStore.dispatch(initUpdateTableState);
                            console.log(await res.json());
                        })
                        .catch(err => alert(err));
                    }
                    else {
                        alert('Transaction failed. ' + `${this.state.email} doesn't have account for ${this.state.selectedCurrency}`);
                    }

                })
                .catch(err => alert(err));
    
            }
            else {
                alert("You don't have that currency.");
            }
        }
    }

    onInputChange(e){
        this.state[e.target.name] = e.target.value;
        this.setState(this.state);
    }

    render(){
        let currenciesOpt = []

        for (let i = 0; i < this.state.userCryptos.length; i++) {
            currenciesOpt.push(
            <option value={this.state.userCryptos[i].cryptoCurrencyId} selected={i==0}>
                {this.state.userCryptos[i].cryptoCurrencyId + 
                    ", USD=" + 
                    Number(this.findCryptoExchangeRate(this.state.userCryptos[i].cryptoCurrencyId)).toFixed(2)}
            </option>);
        }

        return <div hidden={this.state.hidden} className='transtactionDiv'>
            <label>Send currency:</label>
            <br/>
            <input 
                type='email' name='email' 
                placeholder='User email:' 
                value={this.state.email}             
                onChange={this.onInputChange}></input>
            <br/>
            <select disabled={false} onChange={this.onCurrencySelect}>
                {currenciesOpt}
            </select>
            <br/>
            <input 
                type='number' name='amount'
                placeholder='Amount:' 
                value={this.state.amount}             
                onChange={this.onInputChange}></input> 
            <br/>
            <button onClick={this.onSendCurrency}>Send</button>
        </div>
    }
}