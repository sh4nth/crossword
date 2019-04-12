import React, { CSSProperties, Component } from 'react';
import './App.css';
import { Crossword } from './Crossword';

export class App extends Component {
  render() {
    return (<div className="Crossword">
      <Crossword />
    </div>);
  }
}

export default App;
