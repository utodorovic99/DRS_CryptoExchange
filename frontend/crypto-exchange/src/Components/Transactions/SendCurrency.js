import React, {Component} from 'react';
import { getViewUrl } from '../../Config';
import { loginStore, NO_USER_LOGGED } from '../Profile/LoginStore';
import './Transactions.css';

export class SendCurrency extends Component{
    constructor(props){
        super(props);
        this.state = {
            cryptoOptions: [],
            hidden: sessionStorage.getItem('userJson') === null
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.onLoginShow = this.onLoginShow.bind(this);
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

    render(){
        let currenciesOpt = []

        for (let i = 0; i < this.state.cryptoOptions.length; i++) {
            currenciesOpt.push(
            <option value={this.state.cryptoOptions[i].cryptoName}>
                {this.state.cryptoOptions[i].cryptoName + ", USD=" + this.state.cryptoOptions[i].exchangeRate.toFixed(2)}
            </option>);
        }

        return <div hidden={this.state.hidden} className='transtactionDiv'>
            <label>Send currency:</label>
            <br/>
            <input type='email' placeholder='User email:'></input>
            <br/>
            <select disabled={false}>
                {currenciesOpt}
            </select>
            <br/>
            <input type='number' placeholder='Amount:'></input> 
            <br/>
            <button>Send</button>
        </div>
    }
}