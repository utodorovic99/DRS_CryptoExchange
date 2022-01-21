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

        tempJson['password'] = '';

        this.state = {
            userJson : tempJson,
            hidden : props.hidden,
            hiddenInfo: true
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onProfileClick = this.onProfileClick.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
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
        this.setState(this.state);
    }

    onChangeInput(e){
        let col = e.target.value.length == 0 ? 'red' : 'black';
        
        this.state[e.target.name].value = e.target.value;
        this.state[e.target.name].color = col;

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
            <label>First name:</label>
            <input 
                type='text'
                placeholder='First name:'
                name='firstName'
                value={this.state.userJson.firstName.value}
                style={{
                    borderColor: this.state.userJson.firstName.color
                }}
                onChange={this.onChangeInput}
            />
            <br/>
            <label>Last name:</label>
            <input 
                type='text'
                placeholder='Last name:'
                name='lastName'
                value={this.state.userJson.lastName.value}
                style={{
                    borderColor: this.state.userJson.lastName.color
                }}
                onChange={this.onChangeInput}
            />
            <br/>
            <label>Address:</label>
            <input 
                type='text'
                placeholder='Address:'
                name='address'
                value={this.state.userJson.address.value}
                style={{
                    borderColor: this.state.userJson.address.color
                }}
                onChange={this.onChangeInput}
            />
            <br/>
            <label>City:</label>
            <input 
                type='text'
                placeholder='City:'
                name='city'
                value={this.state.userJson.city.value}
                style={{
                    borderColor: this.state.userJson.city.color
                }}
                onChange={this.onChangeInput}
            />
            <br/>
            <label>Country:</label>
            <input 
                type='text'
                placeholder='Country:'
                name='country'
                value={this.state.userJson.country.value}
                style={{
                    borderColor: this.state.userJson.country.color
                }}
                onChange={this.onChangeInput}
            />
            <br/>
            <label>Phone number:</label>
            <input 
                type='tel'
                placeholder='Phone number:'
                name='phoneNumber'
                value={this.state.userJson.phoneNumber.value}
                style={{
                    borderColor: this.state.userJson.phoneNumber.color
                }}
                onChange={this.onChangeInput}
            />
            <br/>
            <label>Email:</label>
            <input 
                type='email'
                placeholder='Email:'
                name='email'
                value={this.state.userJson.email.value}
                style={{
                    borderColor: this.state.userJson.email.color
                }}
                onChange={this.onChangeInput}
            />
            <br/>
            <label>New password:</label>
            <input 
                type='password'
                placeholder='Password:'
                name='password'
                value={this.state.userJson.password.value}
                style={{
                    borderColor: this.state.userJson.password.color
                }}
                onChange={this.onChangeInput}
            />
            <br/>
            <button>Save profile</button>
            <br/>
            </div>
        </div>
    }
}