import React, {Component, Autocomplete} from 'react';
import { getViewUrl } from '../../Config';
import { loginStore, NO_USER_LOGGED, USER_LOGGED } from '../Profile/LoginStore';
import './Transactions.css';

export class Exchange extends Component{
    constructor(props){
        super(props);
        this.state = {
            cryptoOptions: [],
            formData: {
                amount: {
                    value: '',
                    color: 'black'
                },
                cryptoName:{
                    value: ''
                }
            },
            hidden: sessionStorage.getItem('userJson') === null
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.onLoginShow = this.onLoginShow.bind(this);
        this.onCurrencySelectChanged = this.onCurrencySelectChanged.bind(this);
        this.onAmountInput = this.onAmountInput.bind(this);
        this.onExchange = this.onExchange.bind(this);
        this.findExchangeRate = this.findExchangeRate.bind(this);
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
        this.unsubLogin = loginStore.subscribe(this.onLoginShow);
    }

    componentWillUnmount(){
        this.unsubLogin();
    }

    onLoginShow(){
        this.state.hidden = loginStore.getState().type === NO_USER_LOGGED;
        this.setState(this.state);
    }

    onCurrencySelectChanged(e){
        this.state.formData.cryptoName.value = e.target.value;
        this.setState(this.state);
    }

    onAmountInput(e){
        this.state.formData.amount.value = e.target.value;
        this.setState(this.state);
    }

    findExchangeRate(cryptoName){
        for (let i = 0; i < this.state.cryptoOptions.length; i++) {
            const opt = this.state.cryptoOptions[i];
            if(opt.cryptoName == cryptoName){
                return opt.exchangeRate;
            }
        }
        return 0;
    }

    onExchange(){
        let exRate = this.findExchangeRate(this.state.formData.cryptoName.value);

        let userEmail = JSON.parse(sessionStorage.getItem('userJson')).email;
        let cryptoAmount = Number(this.state.formData.amount.value);
        let dollarAmount = cryptoAmount * Number(exRate);
        let cryptoName = this.state.formData.cryptoName.value;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: JSON.parse(sessionStorage.getItem('userJson')).email,
                amountDollars: Number(this.state.formData.amount.value) * Number(exRate),
                cryptoCurrency: this.state.formData.cryptoName.value,
                cryptoAmount: Number(this.state.formData.amount.value)
            })
        };

        fetch(getViewUrl('buyNewCrypto'), requestOptions)
        .then(async res => {
            if(!res.ok) throw new Error("error while exchanging.");
            let resJson = await res.json();
            
            sessionStorage.setItem('userJson', JSON.stringify(resJson));
            loginStore.dispatch({
                type: USER_LOGGED,
                userJson: JSON.stringify(resJson)
            });
        })
        .catch(err => alert(err))
    }

    render(){
        let currenciesOpt = []

        for (let i = 0; i < this.state.cryptoOptions.length; i++) {
            currenciesOpt.push(
            <option value={this.state.cryptoOptions[i].cryptoName}>
                {this.state.cryptoOptions[i].cryptoName + ", USD=" + this.state.cryptoOptions[i].exchangeRate.toFixed(2)}
            </option>);
        }

        return <div hidden={this.state.hidden} className='transtactionDiv'>
            <label>Exchange currency:</label>
            <br/>
            <label>Currency:</label>
            <select disabled={false} onClick={this.onCurrencySelectChanged}>
                {currenciesOpt}
            </select>
            <br/>
            <input type='number' placeholder='Amount:' 
                onChange={this.onAmountInput} value={this.state.formData.amount.value}>
            </input> 
            <br/>
            <button onClick={this.onExchange}>Exchange</button>
        </div>
    }
}