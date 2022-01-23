import React, {Component} from 'react';
import profilePic from './profile.png';
import './Profile.css';
import { loginStore, USER_LOGGED } from './LoginStore';
import {getViewUrl} from '../../Config';

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
            hidden : props.hidden,
            hiddenInfo: true
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onProfileClick = this.onProfileClick.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onSaveProfile = this.onSaveProfile.bind(this);
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
        console.log(loginStore.getState().userJson);        
        this.setState(this.state);
    }

    onChangeInput(e){
        console.log(e.target.name);
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

        console.log(this.state.userJson);

        let accountBalanceDiv = <div></div>;

        if(this.state.userJson){
            accountBalanceDiv = <div>
                <label>Current balance[$]:</label>
                <input disabled={true} type="number" 
                    value={this.state.userJson.cryptoAccountId.accountBalance}
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
        </div>
    }
}