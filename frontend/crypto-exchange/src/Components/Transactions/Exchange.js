import React, {Component} from 'react';
import { getViewUrl } from '../../Config';
import { loginStore, NO_USER_LOGGED, USER_LOGGED } from '../Profile/LoginStore';
import './Transactions.css';
import { initUpdateTableState, updateTableStore } from './UpdateTableStore';

export class Exchange extends Component{
    constructor(props){
        super(props);
        this.state = {
            amount: '',
            cryptoOptions: [],
            userCryptos: [],
            currencies: {
                from: '',
                to: ''
            },
            hidden: sessionStorage.getItem('userJson') === null
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onLoginShow = this.onLoginShow.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onExchange = this.onExchange.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.fillCurrencies = this.fillCurrencies.bind(this);
        this.findCryptoExchangeRate = this.findCryptoExchangeRate.bind(this);
        this.validInput = this.validInput.bind(this);
    }

    componentDidMount(){
        fetch(getViewUrl("getCryptoCurrencies"))
        .then(async res => {
            let data = await res.json();
            this.state.cryptoOptions = [];

            if(data.length == 0){
                fetch(getViewUrl("updateCryptoCurrency"))
                .then(async r => {
                    data = await r.json();
                    this.state.cryptoOptions = [];

                    for(let d in data){
                        this.state.cryptoOptions.push(data[d]);
                    }
                    
                    this.setState(this.state);
                })
                .catch(e => alert(e));
            }
            else {
                for(let d in data){
                    this.state.cryptoOptions.push(data[d]);
                }
                this.setState(this.state);
            }
        });

        this.fillCurrencies();

        this.unsubLogin = loginStore.subscribe(this.onLoginShow);
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

                if(ucJson.length > 0){
                    this.state.currencies.from = ucJson[0].cryptoCurrencyId;
                }

            })
            .catch(err => alert(err));
        }

        this.setState(this.state);
    }

    componentWillUnmount(){
        this.unsubLogin();
    }

    onLoginShow(){
        this.state.hidden = loginStore.getState().type === NO_USER_LOGGED;
        this.fillCurrencies();
        this.setState(this.state);
    }

    onInputChange(e){
        this.state.amount = e.target.value;
        this.setState(this.state);
    }

    validInput(){
        return this.state.amount != '' &&
            this.state.currencies.from != '' &&
            this.state.currencies.to != '';
    }

    onExchange(){
        if(!this.validInput()){
            alert('Invalid input.');
            return;
        }

        let userJson = JSON.parse(sessionStorage.getItem('userJson'));
        
        if(userJson){
            let userCurrencies = userJson.cryptoAccountId.cryptoCurrency;
            let selectedFrom = userCurrencies.filter(c => c.cryptoCurrencyId == this.state.currencies.from);
        
            if(selectedFrom){
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        accountId: userJson.cryptoAccountId.id,
                        amount: Number(this.state.amount),
                        fromCryptoCurrency: selectedFrom[0].cryptoCurrencyId,
                        toCryptoCurrency: this.state.currencies.to
                    })
                };

                fetch(getViewUrl('exchangeCrypto'), requestOptions)
                .then(async res => {
                    if(!res.ok) throw Error(await res.json());
                    let userJson = await res.json(); 
                    updateTableStore.dispatch(initUpdateTableState);
                    loginStore.dispatch({
                        type: USER_LOGGED,
                        userJson: JSON.stringify(userJson)
                    });
                })
                .catch(err => alert(err));

            }   
            else {
                alert("You don't have account for that currency.");
            } 
        }
    }

    onSelectChange(e){
        this.state.currencies[e.target.name] = e.target.value;
        this.setState(this.state);
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

    render(){
        let cryptoTds = [];

        for (let i = 0; i < this.state.cryptoOptions.length; i++) {
            cryptoTds.push(
            <option value={this.state.cryptoOptions[i].cryptoName}>
                {this.state.cryptoOptions[i].cryptoName + ", USD=" + this.state.cryptoOptions[i].exchangeRate.toFixed(2)}
            </option>);
        }

        let userCryptosTds = [];

        for (let i = 0; i < this.state.userCryptos.length; i++) {
            userCryptosTds.push(
            <option value={this.state.userCryptos[i].cryptoCurrencyId}>
                {this.state.userCryptos[i].cryptoCurrencyId + 
                    ", USD=" + this.findCryptoExchangeRate(this.state.userCryptos[i].cryptoCurrencyId).toFixed(2)}
            </option>);
        }

        return <div hidden={this.state.hidden} className='transtactionDiv'>
            <label>Exchange currency:</label>
            <div>
                <label>From:</label>
                <select name='from' onChange={this.onSelectChange}>
                    {userCryptosTds}
                </select>
            </div>
            <div>
                <label>To:</label>
                <select name='to' onChange={this.onSelectChange}>
                    {cryptoTds}
                </select>
            </div>
            <div>
                <input type='number' placeholder='Amount:' 
                value={this.state.amount} onChange={this.onInputChange}/>
            </div>
            <div>
                <button onClick={this.onExchange}>Exchange</button>
            </div>
        </div>
    }
}