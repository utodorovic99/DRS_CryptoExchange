import logo from './logo.svg';
import './App.css';
import { LRContainer } from './Components/Profile/LoginRegisterContainer';
import { Profile } from './Components/Profile/Profile';
import { CryptoTable } from './Components/Crypto/CryptoTable';
import { SendCurrency } from './Components/Transactions/SendCurrency';
import { Payment } from './Components/Transactions/Payment';
import { Transactions } from './Components/Transactions/Transactions';
import { BuyCurrency } from './Components/Transactions/BuyCurrency';
import { Exchange } from './Components/Transactions/Exchange';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="grid-containerApp">
          <div className="item1App">
            <LRContainer
              hidden={sessionStorage.getItem('userJson') !== null}
            />
          </div>
          <div className='item2App'>
            <Profile
              hidden={sessionStorage.getItem('userJson') === null}
            ></Profile>
          </div>
          <div className='item3App'>
            <CryptoTable>
            </CryptoTable>
          </div>
          <div className='item4App'>
            <SendCurrency></SendCurrency>
            <br/>
            <Payment></Payment>
          </div>
          <div className='item5App'>
            <BuyCurrency/>
          </div>
          <div className='item6App'>
            <Transactions></Transactions>
          </div>
          <div className='item7App'>
            <Exchange></Exchange>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
