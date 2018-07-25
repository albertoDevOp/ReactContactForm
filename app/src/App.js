import React, { Component } from 'react';
import Login from './Login.js'
import List from './List.js'
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = { isLogged: null }
    this.authenticated = this.authenticated.bind(this)
  }

  authenticated(auth) {
    this.setState({ isLogged: auth })
  }

  render() {
    if (!this.state.isLogged) {
      return <Login onLogged={this.authenticated} />
    }
    return (
      <div className="App">
        <nav>
          <h3>Message Me</h3>
          <p className="user"><span>Bienvenido Eliot</span><span>4.12€</span></p>
        </nav>
        <List/>
      </div >
    );
  }
}

export default App;
