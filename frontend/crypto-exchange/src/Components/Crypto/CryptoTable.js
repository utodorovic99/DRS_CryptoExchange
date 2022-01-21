import React, {Component} from 'react';
import { loginStore, NO_USER_LOGGED, USER_LOGGED } from './../Profile/LoginStore';
import './CryptoTable.css';
import { cryptoCointMarketKey, cryptoCointMarketUrl } from '../../Config';

export class CryptoTable extends Component{
    constructor(props){
        super(props);

        this.state = {
            cryptos : [],
            hidden: sessionStorage.getItem('userJson') === null
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.onLoginShow = this.onLoginShow.bind(this)
    }

    componentDidMount(){
        this.state.cryptos = [
            {
                name: 'BTC',
                value: 40000
            },
            {
                name: 'ETH',
                value: 2000
            },
            {
                name: 'DOC',
                value: 300
            }
        ];
        
        const requestOptions = {
            headers: {
              'X-CMC_PRO_API_KEY': '22df2849-a048-4ae2-8f1b-36f5fa9ca20b'
            },
            mode: 'no-cors',
            json: true,
            gzip: true
        };

        // fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?
        // X-CMC_PRO_API_KEY=22df2849-a048-4ae2-8f1b-36f5fa9ca20b&start=1&limit=5000&convert=USD`, 
        //     requestOptions
        // )
        // .then(res => console.log(JSON.stringify(res)))
        // // .then((data) => console.log(data));

        this.unsubLogin = loginStore.subscribe(this.onLoginShow);

        this.setState(this.state);
    }

    onLoginShow(){
        this.state.hidden = loginStore.getState().type === NO_USER_LOGGED;
    
        this.setState(this.state);
    }

    render(){

        let cryptoTds = [];

        for(let c in this.state.cryptos){
            console.log(this.state.cryptos[c])
            cryptoTds.push(
                <tr>
                    <td>{this.state.cryptos[c].name}</td>
                    <td>{this.state.cryptos[c].value}</td>
                </tr>
            )
        }

        return <table hidden={this.state.hidden}>
            <thead>
                <th>
                    <td>Name:</td>
                </th>
                <th>
                    <td>Value[$]:</td>
                </th>
            </thead>
            <tbody>
                {cryptoTds}
            </tbody>
        </table>
    }
}