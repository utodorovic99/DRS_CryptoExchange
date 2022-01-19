import React, {Component} from 'react';
import { Login } from './Login';
import { Register } from './Register';
import './LRContainer.css';
import { loginShowStore, SHOW_LOGIN, SHOW_NONE, SHOW_REGISTER } from './LRShowingStore';


export class LRContainer extends Component{
    constructor(props){
        super(props);
        this.state = {
            loginHidden: true,
            registerHidden: true
        };

        this.onClick = this.onClick.bind(this);
    }

    onClick(e){
        let otherName = e.target.name === 'login' ? 'register' : 'login';

        if(e.target.name === 'login'){
            if(this.state.loginHidden){
                loginShowStore.dispatch({
                    type: SHOW_LOGIN,
                    showLogin: true,
                    showRegister: false
                });
    
                this.state.registerHidden = true;
                this.state.loginHidden = false;    
            }
            else {
                loginShowStore.dispatch({
                    type: SHOW_NONE,
                    showLogin: false,
                    showRegister: false
                });
    
                this.state.registerHidden = true;
                this.state.loginHidden = true;    
            }
        }
        else {
            if(this.state.registerHidden){
                loginShowStore.dispatch({
                    type: SHOW_REGISTER,
                    showLogin: false,
                    showRegister: true
                });
                
                this.state.registerHidden = false;
                this.state.loginHidden = true;    
            }
            else {
                loginShowStore.dispatch({
                    type: SHOW_NONE,
                    showLogin: false,
                    showRegister: false
                });
                
                this.state.registerHidden = true;
                this.state.loginHidden = true;
            }
        }


        this.setState(this.state);
    }

    render(){
        return <div class="grid-container">
            <div class="item1">
                <button name='login' onClick={this.onClick}>Login</button>
                <Login hidden={this.state.loginHidden}/>
            </div>
            <div class="item2">
                <button name='register' onClick={this.onClick}>Register</button>
                <Register hidden={this.state.registerHidden}/>
            </div>
        </div>
    }
}