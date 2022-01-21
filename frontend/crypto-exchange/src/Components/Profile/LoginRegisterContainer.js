import React, {Component} from 'react';
import { Login } from './Login';
import { Register } from './Register';
import './LRContainer.css';
import { loginShowStore, SHOW_LOGIN, SHOW_NONE, SHOW_REGISTER } from './LRShowingStore';
import { lrContainerShowStore, SHOW } from './LRContainerStore';
import { loginStore, NO_USER_LOGGED, USER_LOGGED } from './LoginStore';


export class LRContainer extends Component{
    constructor(props){
        super(props);

        this.state = {
            loginHidden: true,
            registerHidden: true,
            hidden: props.hidden
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onLogOut = this.onLogOut.bind(this);
        this.onLRContainerShow = this.onLRContainerShow.bind(this);
    }

    componentDidMount(){
        this.unsubscribeShow = lrContainerShowStore.subscribe(this.onLRContainerShow);
    }

    componentWillUnmount(){
        this.unsubscribeShow();
    }

    onLRContainerShow(){
        this.state.hidden = !lrContainerShowStore.getState().show;
        this.state.loginHidden = !lrContainerShowStore.getState().show;
        this.state.registerHidden = !lrContainerShowStore.getState().show;

        this.setState(this.state);
    }

    onClick(e){
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

    onLogOut(){
        loginShowStore.dispatch({
            type: SHOW_NONE,
            showLogin: false,
            showRegister: false
        });

        sessionStorage.removeItem('userJson');
        this.state.hidden = false;

        loginStore.dispatch({
            type: NO_USER_LOGGED,
            userJson: null
        });

        console.log('after logout:');
        console.log(loginStore.getState())

        this.setState(this.state);
    }

    render(){
        return <div className="grid-container">
            <div className="item1" hidden={this.state.hidden}>
                <button name='login' onClick={this.onClick}>Login</button>
                <Login hidden={this.state.loginHidden}/>
            </div>
            <div className="item2" hidden={this.state.hidden}>
                <button name='register' onClick={this.onClick}>Register</button>
                <Register hidden={this.state.registerHidden}/>
            </div>
            <div hidden={!this.state.hidden}>
                <button onClick={this.onLogOut}>Log out</button>
            </div>
        </div>
    }
}