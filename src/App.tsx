import React, { CSSProperties, Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Color } from 'csstype';
import { Crossword } from './Crossword';

export class App extends Component {
  render() {
    return (<div className="Crossword">
      <Crossword />
    </div>);
  }
}

export default App;
