import React, { Component } from 'react';
import './App.css';
import { Crossword } from './Crossword';

export class App extends Component {
  render() {
    return (<div className="container">
      <Crossword editable={true}/>
    </div>);
  }
}

export default App;
