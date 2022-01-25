import React, {Component} from 'react';
import profilePic from './profile.png';
import './Profile.css';
import { loginStore, USER_LOGGED } from './LoginStore';
import {getViewUrl} from '../../Config';
import leftArrowPic from './../Crypto/left-arrow.png';
import rightArrowPic from './../Crypto/right-arrow.png';

function mapDbNameToUserInput(dbName){
    switch (dbName) {
        case "firstName":
            return "First Name:";
        case "lastName":
            return "Last Name:";
        case "address":
            return "Address:";
        case "email":
            return "Email:";
        case "city":
            return "City:";
        case "country":
            return "Country:";
        case "phoneNumber":
            return "Phone number:";
        case "password":
            return "Password:";
        default:
            return "wrong name";
    }
}

export class Profile extends Component{
    constructor(props){
        super(props);

        this.state = {
            userJson : JSON.parse(sessionStorage.getItem('userJson')),
            tableCnt: 0,
            hidden : props.hidden,
            hiddenInfo: true
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onProfileClick = this.onProfileClick.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onSaveProfile = this.onSaveProfile.bind(this);
        this.onArrowClick = this.onArrowClick.bind(this);
    }

    componentDidMount(){
        this.unsubscribeLogin = loginStore.subscribe(this.onLogin)
    }

    componentWillUnmount(){
        this.unsubscribeLogin();
    }

    onProfileClick(){
        this.state.hiddenInfo = !this.state.hiddenInfo;
        this.setState(this.state);
    }

    onLogin(){
        this.state.hidden = loginStore.getState().userJson != null ? false : true;
        this.state.userJson = JSON.parse(loginStore.getState().userJson);
        
        this.setState(this.state);
    }

    onChangeInput(e){
        this.state.userJson[e.target.name] = e.target.value;
        this.setState(this.state);
    }

    onSaveProfile(){
        const requestOptions = {
            method : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.userJson)
        };

        if(this.state.userJson.password == ''){
            this.state.userJson.password = JSON.parse(sessionStorage.getItem('userJson')).password;
        }

        fetch(getViewUrl('updateUser'), requestOptions)
        .then(res => {
            if(!res.ok) throw Error('Not saved.');
            alert('User saved');
            sessionStorage.setItem('userJson', JSON.stringify(this.state.userJson));
        })
        .catch(err => alert(err));
    }

    onArrowClick(e){
        if(e.target.name == 'left'){
            this.state.tableCnt--;
        }
        else {
            this.state.tableCnt++;
        }
        this.state.tableCnt %= this.state.userJson.cryptoAccountId.cryptoCurrency.length;
        this.setState(this.state);
    }

    render(){

        let formItems = [];

        for(let k in this.state.userJson){
            if(!(["cryptoAccountId", "id", "verified"].includes(k))){
                formItems.push(
                    <div>
                        <label>{mapDbNameToUserInput(k)}</label>
                            <input 
                                type='text'
                                placeholder={mapDbNameToUserInput(k)}
                                name={k}
                                value={
                                    k != 'password' ?
                                    this.state.userJson[k] : ''
                                }
                                style={{
                                    borderColor: 'black'
                                }}
                                onChange={this.onChangeInput}
                            />
                        <br/>
                    </div>
                )
            }
        }
        let accountBalanceDiv = <div></div>;

        if(this.state.userJson){
            accountBalanceDiv = <div>
                <label>Current balance[$]:</label>
                <input disabled={true} type="number" 
                    value={Number(this.state.userJson.cryptoAccountId.accountBalance).toFixed(2)}
                    style={{
                        textAlign:'center'
                    }}
                ></input>
            </div>;
        }

        let form = <div hidden={this.state.hiddenInfo} className='profileForm'>
            {formItems}
            <button onClick={this.onSaveProfile}>Save profile</button>
            <br/>
            {accountBalanceDiv}
        </div>;

        let userCryptosTd = <div></div>;

       if(this.state.userJson){
            // array of crypto currencies
            let userCryptos = this.state.userJson.cryptoAccountId.cryptoCurrency;

            if(this.state.tableCnt < userCryptos.length){
                const uc = userCryptos[this.state.tableCnt];
                userCryptosTd = <tr>
                    <td>{uc.cryptoCurrencyId}</td>
                    <td>{uc.cryptoBalance}</td>
                </tr>;
        }

       }
        return <div hidden={this.state.hidden}>
            <div>
                <img 
                    src={profilePic} alt='profile'
                    style={{
                        width: '80px',
                        height: '50px'
                    }}
                    onClick={this.onProfileClick}
                ></img>
            </div>
            {form}
            <div hidden={this.state.hiddenInfo}>
                <table>
                    <thead>
                        <th>Currency:</th>
                        <th>Amount:</th>
                    </thead>
                    {userCryptosTd}
                </table>
                <div style={{
                    display:'grid',
                    gridTemplateAreas: 'a b'
                    }}>

                    <img src={leftArrowPic} width='50px' height='30px' alt='left' name='left'
                    style={{
                        gridArea:'a',
                        paddingRight: '200px'
                    }} onClick={this.onArrowClick}/>

                    <img src={rightArrowPic} width='50px' height='30px' alt='right' name='right'
                    style={{
                        gridArea:'a',
                        paddingLeft: '200px'
                    }} onClick={this.onArrowClick}/>

                </div>
            </div>
        </div>
    }
}