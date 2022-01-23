import axios from 'axios';
import { sha256 } from 'js-sha256';
import React, {Component} from 'react';
import { getViewUrl } from '../../Config';
import './Login.css';
import { loginStore, USER_LOGGED } from './LoginStore';
import { HIDE, lrContainerShowStore } from './LRContainerStore';
import { loginShowStore, SHOW_NONE } from './LRShowingStore';

const emailTemp = '123';
const passwordTemp = '123';

export class Login extends Component{
    constructor(props){
        super(props);

        this.state = {
            email: {
                value: '',
                color: 'red'
            },
            password: {
                value: '',
                color: 'red'
            },
            hiddenForm: this.props.hidden,
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onLoginShow = this.onLoginShow.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    componentDidMount(){
        this.unsubscribeShow = loginShowStore.subscribe(this.onLoginShow);
    }

    componentWillUnmount(){
        this.unsubscribeShow();
    }

    onChangeInput(e){
        let col = e.target.value.length == 0 ? 'red' : 'black';
        
        this.state[e.target.name].value = e.target.value;
        this.state[e.target.name].color = col;

        this.setState(this.state);
    }

    onLoginShow(){
        this.state.hiddenForm = !loginShowStore.getState().showLogin;
        this.setState(this.state);
    }

    onLogin(){
        let valid = this.state.email.value.length > 0 && this.state.password.value.length > 0;
        
        if(valid){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: this.state.email.value,
                    password: sha256(this.state.password.value)
                })
            };
    
            fetch(getViewUrl('login'), requestOptions)
            .then(async res => {
                if(!res.ok) throw Error("Wrong credentials.");
                let loggedUser = await res.json();

                alert(String("User logged:" + JSON.stringify(loggedUser)));
                sessionStorage.setItem('userJson', JSON.stringify(loggedUser));
    
                loginShowStore.dispatch({
                    type: SHOW_NONE,
                    showLogin: false,
                    showRegister: false
                });
    
                lrContainerShowStore.dispatch({
                    type: HIDE,
                    show: false
                });
                
                loginStore.dispatch({
                    type: USER_LOGGED,
                    userJson: JSON.stringify(loggedUser)
                });
    
                for(let k in this.state){
                    if(k != 'hiddenForm'){
                        this.state[k] = {
                            value: '',
                            color: 'red'
                        };
                    }
                }
    
                this.setState(this.state);
            })
            .catch(err => alert(err));
        }
        else {
            alert("Please fill out required fields.");
        }
    }

    render(){
        return <div hidden={this.state.hiddenForm}>
            <input 
                type='email'
                placeholder='Email'
                name='email'
                value={this.state.email.value}
                style={{
                    borderColor: this.state.email.color
                }}
                onChange={this.onChangeInput}
            />
            <br/>
            <input 
                type='password'
                placeholder='Password'
                name='password'
                value={this.state.password.value}
                style={{
                    borderColor: this.state.password.color
                }}
                onChange={this.onChangeInput}
            />
            <br/>
            <button onClick={this.onLogin}>Submit</button>
        </div>
    }
}