import React, {Component, Autocomplete} from 'react';
import { getViewUrl } from '../../Config';
import { loginStore, NO_USER_LOGGED, USER_LOGGED } from '../Profile/LoginStore';
import './Transactions.css';

const tempCardData = {
    cardNumber: "4242 4242 4242 4242",
    userName: '',
    validUntil: "02/23",
    cvc: "123"
};

export class Payment extends Component{
    constructor(props){
        super(props);
        this.state = {
            formData : {
                amount: {
                    value: '',
                    color: 'black'
                },
                cardNumber:{
                    value: '',
                    color: 'black'
                },
                month: {
                    value: '',
                    color: 'black'
                },
                year: {
                    value: '',
                    color: 'black'
                },
                cvc:{
                    value: '',
                    color: 'black'
                }
            },
            paymentVerified: true,
            hidden: sessionStorage.getItem('userJson') === null
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onLoginShow = this.onLoginShow.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onBuy = this.onBuy.bind(this);
        this.validInput = this.validInput.bind(this);
    }

    componentDidMount(){
        this.unsubLogin = loginStore.subscribe(this.onLoginShow);

        this.state.hidden = loginStore.getState().type === NO_USER_LOGGED;
        if(!this.state.hidden){
            this.state.paymentVerified = JSON.parse(loginStore.getState().userJson).verified; 
            if(!Boolean(this.state.paymentVerified)){
                this.state.formData.amount = 1;
            }
        }
    }

    componentWillUnmount(){
        this.unsubLogin();
    }

    onLoginShow(){
        this.state.hidden = loginStore.getState().type === NO_USER_LOGGED;
        if(!this.state.hidden){
            this.state.paymentVerified = JSON.parse(loginStore.getState().userJson).verified; 
            if(!Boolean(this.state.paymentVerified)){
                this.state.formData.amount.value = '1';
            }
        }
        
        this.setState(this.state);
    }

    onInputChange(e){
        this.state.formData[e.target.name].value = e.target.value;
        this.state.formData[e.target.name].color = this.state.formData[e.target.name].value == '' ? 'red' : 'black';
        this.setState(this.state); 
    }

    validInput(){
        let validCard = this.state.formData.cardNumber.value == tempCardData.cardNumber &&
            `${this.state.formData.month.value}/${this.state.formData.year.value}` == tempCardData.validUntil &&
            String(this.state.formData.cvc.value) == tempCardData.cvc;

        return validCard && this.state.formData.amount.value != '';
    }

    onBuy(){
        if(this.validInput()){
            

            const body = {
                email : JSON.parse(sessionStorage.getItem('userJson')).email,
                amount: this.state.formData.amount.value
            };

            const requestOptions = {
                method : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            };

            fetch(getViewUrl('payment'), requestOptions)
            .then(res => {
                if(!res.ok) throw Error("error on payment");
                //alert("succesfull payment");
                let userId = JSON.parse(sessionStorage.getItem('userJson')).id;
                
                fetch(getViewUrl('getuser' + `?id=${userId}`))
                .then(async res => {
                    let newUserJson = await res.json();

                    sessionStorage.setItem('userJson', JSON.stringify(newUserJson));
                    loginStore.dispatch({
                        type: USER_LOGGED,
                        userJson: JSON.stringify(newUserJson)
                    });

                    for(let k in this.state.formData){
                        this.state.formData[String(k)].value = '';
                    }

                    this.setState(this.state);
                })
                .catch(err => alert(err));
            })
            .catch(err => alert(err));
        }
        else{
            alert('Invalid input.');
        }
    }

    render(){

        return <div hidden={this.state.hidden} className='transtactionDiv'>
            <label>Add money:</label>
            <br/>
            <input 
                type='number' placeholder='Amount:' disabled={!this.state.paymentVerified}
                value={
                    this.state.formData.amount.value}
                name="amount"
                style={{
                    color: this.state.formData.amount.color
                }}
                onChange={this.onInputChange}>
            </input> 
            <br/>
            <input 
                type='text' placeholder='Card number:' value={this.state.formData.cardNumber.value}
                name="cardNumber"
                style={{
                    color: this.state.formData.cardNumber.color
                }}
                onChange={this.onInputChange}>
            </input> 
            <br/>
            <label>Expire date:</label>
            <input 
                type='number' placeholder='Month:' value={this.state.formData.month.value}
                name="month"
                style={{
                    color: this.state.formData.month.color
                }}
                onChange={this.onInputChange}>
            </input> 
            <input 
                type='number' placeholder='Year:' value={this.state.formData.year.value}
                name="year"
                style={{
                    color: this.state.formData.year.color
                }}
                onChange={this.onInputChange}>
            </input> 
            <br/>
            <input 
                type='number' placeholder='CVC:' value={this.state.formData.cvc.value}
                name="cvc" 
                style={{
                    color: this.state.formData.cvc.color
                }}
                onChange={this.onInputChange}>
            </input> 
            <br/>
            <button onClick={this.onBuy}>Buy</button>
        </div>
    }
}