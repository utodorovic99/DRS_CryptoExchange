import logo from './logo.svg';
import './App.css';
import { LRContainer } from './Components/Login/LoginRegisterContainer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="grid-container">
          <div className="item1">
            <LRContainer/>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
