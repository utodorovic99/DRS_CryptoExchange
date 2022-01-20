import logo from './logo.svg';
import './App.css';
import { LRContainer } from './Components/Profile/LoginRegisterContainer';
import { Profile } from './Components/Profile/Profile';

const firstName = "blabla";
const lastName = "blabla";
const address = "blabla";
const city = "blabla";
const country = "blabla";
const phoneNumber = "blabla";
const email = "blabla";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="grid-containerApp">
          <div className="item1App">
            <LRContainer
              hidden={sessionStorage.getItem('userJson') === undefined}
            />
          </div>
          <div className='item2App'>
            <Profile
              userJson={{
                firstName: firstName,
                lastName: lastName,
                address: address,
                city: city,
                country: country,
                phoneNumber: phoneNumber,
                email: email
              }}
              hidden={sessionStorage.getItem('userJson') !== undefined}
            ></Profile>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
