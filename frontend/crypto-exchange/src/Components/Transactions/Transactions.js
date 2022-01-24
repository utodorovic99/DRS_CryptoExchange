import React, {Component} from 'react';
import { getViewUrl } from '../../Config';
import { loginStore, NO_USER_LOGGED } from '../Profile/LoginStore';
import './Transactions.css';

function compareTransactionByField(a, b, field, asc){
    if(a[field] < b[field]) return asc ? -1 : 1;
    if(a[field] > b[field]) return asc ?  1 : -1;
    else return 0;
}

export class Transactions extends Component{
    constructor(props){
        super(props);
        this.state = {
            transactions: [],
            tempTransactions: [],
            hidden: sessionStorage.getItem('userJson') === null
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onLoginShow = this.onLoginShow.bind(this);
        this.fillTransactions = this.fillTransactions.bind(this);
        this.sortByAmount = this.sortByAmount.bind(this);
        this.filterByFlowType = this.filterByFlowType.bind(this);
        this.filterByName = this.filterByName.bind(this);
        this.filterByState = this.filterByState.bind(this);
    }

    componentDidMount(){
        this.unsubLogin = loginStore.subscribe(this.onLoginShow);
        this.fillTransactions();
    }

    componentWillUnmount(){
        this.unsubLogin();
    }

    onLoginShow(){
        this.state.hidden = sessionStorage.getItem('userJson') === null;
        this.setState(this.state);
    }

    fillTransactions(){
        if(!this.state.hidden){
            let userId = JSON.parse(sessionStorage.getItem('userJson')).id;

            fetch(getViewUrl('getTransactions') + `?id=${userId}`)
            .then(async res => {
                if(!res.ok) throw Error("Request error.");
                this.state.transactions = await res.json();
                this.state.transactions.sort((a, b) => {
                    return compareTransactionByField(a, b, 'amount', false);
                });
                this.state.tempTransactions = [...this.state.transactions]; 
                this.setState(this.state);   
            })
            .catch(err => alert(err));
        }
        
    }

    sortByAmount(e){
        this.state.tempTransactions = this.state.tempTransactions.sort((a, b) => {
            return compareTransactionByField(a, b, 'amount', e.target.value == 'asc');
        });
        this.setState(this.state);
    }

    filterByFlowType(e){
        let userId = JSON.parse(sessionStorage.getItem('userJson')).id;

        switch (e.target.value) {
            case 'all':
                this.state.tempTransactions = [...this.state.transactions];
                break;
            case 'outflow':
                this.state.tempTransactions = this.state.transactions.filter(
                    t => Number(t.userfromid) == Number(userId)
                );
                break;
            case 'inflow':
                this.state.tempTransactions = this.state.transactions.filter(
                    t => Number(t.userfromid) != Number(userId)
                );
                break;                
            default:
                break;
        }

        this.setState(this.state);
    }

    filterByName(e){
        if(e.target.value == ''){
            this.state.tempTransactions = [...this.state.transactions];
        }
        else{
            this.state.tempTransactions = 
                this.state.tempTransactions.filter(
                    t => t.cryptoCurrencyId.cryptoName.includes(e.target.value.toUpperCase())
                );
        }
        this.setState(this.state);
    }

    filterByState(e){
        switch (e.target.value) {
            case 'done':
                this.state.tempTransactions = this.state.transactions.filter(
                    t => t.state == 'DONE'
                );
                break;
            case 'inpg':
                this.state.tempTransactions = this.state.transactions.filter(
                    t => t.state == 'IN PROGRESS'
                );
                break;
            case 'canceled':
                this.state.tempTransactions = this.state.transactions.filter(
                    t => t.state == 'CANCELED'
                );
                break;                
            case 'none':
                this.state.tempTransactions = [...this.state.transactions];
                break;
        }

        this.setState(this.state);
    }

    render(){
        let transactionRows = [];
        if(sessionStorage.getItem('userJson')){
            var userId = JSON.parse(sessionStorage.getItem('userJson')).id;
        }
        else {
            this.state.hidden = true;
        }
        
        for (let i = 0; i < this.state.tempTransactions.length; i++) {
            const tr = this.state.tempTransactions[i];
            transactionRows.push(
                <tr>
                    <td>{Number(tr.userfromid) == userId ? 'Outflow' : 'Inflow'}</td>
                    <td>{tr.amount}</td>
                    <td>{tr.cryptoCurrencyId.cryptoName}</td>
                    <td>{tr.state}</td>
                </tr>
            );
        }

        return <div hidden={this.state.hidden}>
            <table>
                <thead>
                    <th>
                        <select 
                            onChange={this.filterByFlowType}
                            style={{
                                textAlign: 'center'
                            }}
                        >
                            <option value="all">All</option>
                            <option value="inflow">Inflow</option>
                            <option value="outflow">Outflow</option>
                        </select>
                    </th>
                    <th>
                        <select 
                            onChange={this.sortByAmount}
                            style={{
                                textAlign: 'center'
                            }}
                        >
                            <option value="desc">Descending</option>
                            <option value="asc">Ascending</option>
                        </select>
                    </th>
                    <th>
                        <input type='text' onChange={this.filterByName}></input>
                    </th>
                    <th>
                        <select 
                            onChange={this.filterByState}
                            style={{
                                textAlign: 'center'
                            }}
                        >
                            <option value="none">None</option>
                            <option value="done">Done</option>
                            <option value="inpg">In progress</option>
                            <option value="canceled">Canceled</option>
                        </select>
                    </th>
                </thead>
                <tbody>
                    <tr>
                    <td>
                        Inflow/Outflow
                    </td>
                    <td>
                        Amount
                    </td>
                    <td>
                        Currency
                    </td>
                    <td>
                        State
                    </td>
                    </tr>
                    {transactionRows}
                </tbody>            
            </table>

        </div>
    }
}