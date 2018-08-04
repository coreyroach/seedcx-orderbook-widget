import 'babel-polyfill';
import React, { Component } from 'react';

import './App.css';
import Orderbook from './containers/Orderbook';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Orderbook />
      </div>
    );
  }
}

export default App;


