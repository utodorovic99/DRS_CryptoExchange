import React, {Component} from 'react';
import profilePic from './profile.png';
import './Profile.css';
import { loginStore, USER_LOGGED } from './LoginStore';



export class Profile extends Component{
    constructor(props){
        super(props);

        let tempJson = {};

        for(let k in props.userJson){
            tempJson[k] = {
                value: props.userJson[k],
                color: 'black'
            }
        }

        this.state = {
            userJson : tempJson,
            hidden : props.hidden,
            hiddenInfo: true
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onProfileClick = this.onProfileClick.bind(this);
        this.onLogin = this.onLogin.bind(this);
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
        console.log('in profile:');
        console.log(loginStore.getState());
        this.state.hidden = loginStore.getState().userJson != null ? false : true;
        this.setState(this.state);
    }

    render(){
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
            <div hidden={this.state.hiddenInfo} className='profileForm'>
            <input 
                type='text'
                placeholder='First name:'
                name='firstName'
                value={this.state.userJson.firstName.value}
                // style={{
                //     borderColor: this.state.firstName.color
                // }}
                // onChange={this.onChangeInput}
            />
            <br/>
            <input 
                type='text'
                placeholder='Last name:'
                name='lastName'
                // value={this.state.lastName.value}
                // style={{
                //     borderColor: this.state.lastName.color
                // }}
                // onChange={this.onChangeInput}
            />
            <br/>
            <input 
                type='text'
                placeholder='Address:'
                name='address'
                // value={this.state.address.value}
                // style={{
                //     borderColor: this.state.address.color
                // }}
                // onChange={this.onChangeInput}
            />
            <br/>
            <input 
                type='text'
                placeholder='City:'
                name='city'
                // value={this.state.city.value}
                // style={{
                //     borderColor: this.state.city.color
                // }}
                // onChange={this.onChangeInput}
            />
            <br/>
            <input 
                type='text'
                placeholder='Country:'
                name='country'
                // value={this.state.country.value}
                // style={{
                //     borderColor: this.state.country.color
                // }}
                // onChange={this.onChangeInput}
            />
            <br/>
            <input 
                type='tel'
                placeholder='Phone number:'
                name='phoneNumber'
                // value={this.state.phoneNumber.value}
                // style={{
                //     borderColor: this.state.phoneNumber.color
                // }}
                // onChange={this.onChangeInput}
            />
            <br/>
            <input 
                type='email'
                placeholder='Email:'
                name='email'
                // value={this.state.email.value}
                // style={{
                //     borderColor: this.state.email.color
                // }}
                // onChange={this.onChangeInput}
            />
            <br/>
            <input 
                type='password'
                placeholder='Password:'
                name='password'
                // value={this.state.password.value}
                // style={{
                //     borderColor: this.state.password.color
                // }}
                // onChange={this.onChangeInput}
            />
            </div>
        </div>
        

    }
}