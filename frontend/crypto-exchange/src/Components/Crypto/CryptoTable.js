import React, {Component} from 'react';
import { loginStore, NO_USER_LOGGED, USER_LOGGED } from './../Profile/LoginStore';
import './CryptoTable.css';
import { getViewUrl } from '../../Config';
import leftArrowPic from './left-arrow.png';
import rightArrowPic from './right-arrow.png';
import downArrowPic from './down-arrow.png';
import upArrowPic from './up-arrow.png';
import axios from 'axios';

export class CryptoTable extends Component{
    constructor(props){
        super(props);

        this.state = {
            cryptos : [],
            hidden: sessionStorage.getItem('userJson') === null,
            maxCryptoShown: 10,
            cryptoShowPage: 1
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.onLoginShow = this.onLoginShow.bind(this);
        this.onClickLeft = this.onClickLeft.bind(this);
        this.onClickRight = this.onClickRight.bind(this);
        this.onClickUp = this.onClickUp.bind(this);
        this.onClickDown = this.onClickDown.bind(this);
    }

    componentDidMount(){
        axios.get(getViewUrl("getCryptoCurrencies"))
        .then(res => {
            let data = res.data;
            this.state.cryptos = [];
            
            for(let d in data){
                this.state.cryptos.push({
                    name: data[d].cryptoName,
                    value: data[d].exchangeRate
                });
            }

            this.setState(this.state);
        });

        this.unsubLogin = loginStore.subscribe(this.onLoginShow);
    }

    onLoginShow(){
        this.state.hidden = loginStore.getState().type === NO_USER_LOGGED;
        this.setState(this.state);
    }

    onClickLeft(){
        this.state.cryptoShowPage -= 1;
        this.state.cryptoShowPage %= this.state.cryptos.length / this.state.maxCryptoShown;
        this.setState(this.state);
    }

    onClickRight(){
        this.state.cryptoShowPage += 1;
        this.state.cryptoShowPage %= this.state.cryptos.length / this.state.maxCryptoShown;
        this.setState(this.state);
    }

    onClickDown(){
        this.state.cryptos = this.state.cryptos.sort((a, b) => {
            let x = Number(a.value);
            let y = Number(b.value);
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        })

        this.setState(this.state);
    }

    onClickUp(){
        this.state.cryptos = this.state.cryptos.sort((a, b) => {
            let x = Number(a.value);
            let y = Number(b.value);
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        })

        this.setState(this.state);
    }

    render(){
        let cryptoTds = [];

        for(let i = this.state.cryptoShowPage * this.state.maxCryptoShown;
            i < this.state.cryptos.length && i < this.state.maxCryptoShown + this.state.maxCryptoShown * this.state.cryptoShowPage;
            i++){
            cryptoTds.push(
                <tr>
                    <td>{this.state.cryptos[i].name}</td>
                    <td>{this.state.cryptos[i].value}</td>
                </tr>
            )
        }

        return <div hidden={this.state.hidden}>
                <div style={{
                    display:'grid',
                    gridTemplateAreas: 'a b'
                }}>
                    <img src={upArrowPic} width='50px' height='30px' style={{
                        gridArea:'a',
                        paddingRight: '200px'
                    }} onClick={this.onClickUp}/>
                    <img src={downArrowPic} width='50px' height='30px' style={{
                        gridArea:'a',
                        paddingLeft: '200px'
                    }} onClick={this.onClickUp}/>
                </div>
                <table >
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
            <br/>
            <div style={{
                display:'grid',
                gridTemplateAreas: 'a b'
            }}>
                <img src={leftArrowPic} width='50px' height='30px' style={{
                    gridArea:'a',
                    paddingRight: '200px'
                }} onClick={this.onClickLeft}/>
                <img src={rightArrowPic} width='50px' height='30px' style={{
                    gridArea:'a',
                    paddingLeft: '200px'
                }} onClick={this.onClickRight}/>
            </div>
        </div>
    }
}