import React, {Component} from 'react';
import './Login.css';
import { loginShowStore, SHOW_NONE } from './LRShowingStore';


export class Register extends Component{
    constructor(props){
        super(props);

        this.state = {
            firstName: {
                value: '',
                color: 'red'
            },
            lastName: {
                value: '',
                color: 'red'
            },
            address: {
                value: '',
                color: 'red'
            },            
            city: {
                value: '',
                color: 'red'
            },
            country: {
                value: '',
                color: 'red'
            },
            phoneNumber: {
                value: '',
                color: 'red'
            },
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
        this.onRegisterShow = this.onRegisterShow.bind(this);   
        this.onRegister = this.onRegister.bind(this);
    }

    componentDidMount(){
        this.unsubscribeShow = loginShowStore.subscribe(this.onRegisterShow);
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

    onRegisterShow(){
        this.state.hiddenForm = !loginShowStore.getState().showRegister;
        this.setState(this.state);
    }

    onRegister(){
        loginShowStore.dispatch({
            type: SHOW_NONE,
            showLogin: false,
            showRegister: false
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
    }

    render(){
        return <div hidden={this.state.hiddenForm}>
            <input 
                type='text'
                placeholder='First name:'
                name='firstName'
                value={this.state.firstName.value}
                style={{
                    borderColor: this.state.firstName.color
                }}
                onChange={this.onChangeInput}
            />
            <br/>
            <input 
                type='text'
                placeholder='Last name:'
                name='lastName'
                value={this.state.lastName.value}
                style={{
                    borderColor: this.state.lastName.color
                }}
                onChange={this.onChangeInput}
            />
            <br/>
            <input 
                type='text'
                placeholder='Address:'
                name='address'
                value={this.state.address.value}
                style={{
                    borderColor: this.state.address.color
                }}
                onChange={this.onChangeInput}
            />
            <br/>
            <input 
                type='text'
                placeholder='City:'
                name='city'
                value={this.state.city.value}
                style={{
                    borderColor: this.state.city.color
                }}
                onChange={this.onChangeInput}
            />
            <br/>
            <input 
                type='text'
                placeholder='Country:'
                name='country'
                value={this.state.country.value}
                style={{
                    borderColor: this.state.country.color
                }}
                onChange={this.onChangeInput}
            />
            <br/>
            <input 
                type='tel'
                placeholder='Phone number:'
                name='phoneNumber'
                value={this.state.phoneNumber.value}
                style={{
                    borderColor: this.state.phoneNumber.color
                }}
                onChange={this.onChangeInput}
            />
            <br/>
            <input 
                type='email'
                placeholder='Email:'
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
                placeholder='Password:'
                name='password'
                value={this.state.password.value}
                style={{
                    borderColor: this.state.password.color
                }}
                onChange={this.onChangeInput}
            />
            <br/>
            <button onClick={this.onRegister}>Submit</button>

        </div>
    }
}