import axios from 'axios';
import React, {Component, Autocomplete} from 'react';
import { getViewUrl } from '../../Config';
import { loginStore, NO_USER_LOGGED } from '../Profile/LoginStore';
import './Transactions.css';

export class Payment extends Component{
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
        axios.get(getViewUrl("getCryptoCurrencies"))
        .then(res => {
            let data = res.data;
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
            <label>Buy currency:</label>
            <br/>
            <label>Currency:</label>
            <select disabled={false}>
                {currenciesOpt}
            </select>
            <br/>
            <input type='number' placeholder='Amount:'></input> 
            <br/>
            <input type='number' placeholder='Card number:'></input> 
            <br/>
            <label>Expire date:</label>
            <input type='number' placeholder='Month:'></input> 
            <input type='number' placeholder='Year:'></input> 
            <br/>
            <input type='number' placeholder='CVC:'></input> 
            <br/>
            <button>Buy</button>
        </div>
    }
}