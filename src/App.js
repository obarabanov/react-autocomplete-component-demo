import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Autocomplete from './components/Autocomplete'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Autocomplete component built with React.js</h2>
        </div>

        <Autocomplete />

      </div>
    );
  }
}

export default App;
