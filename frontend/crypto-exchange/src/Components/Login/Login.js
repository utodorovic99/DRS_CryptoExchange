import React, {Component} from 'react';
import './Login.css';
import { loginShowStore } from './LRShowingStore';

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
        
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onLoginShow = this.onLoginShow.bind(this);

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
            <button>Submit</button>
        </div>
    }
}