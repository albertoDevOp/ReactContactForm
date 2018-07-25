import React, { Component } from 'react';
import Input from './Input.js'
import './Signup.css';

class SignUn extends Component {

    constructor(props) {
        super(props);
        this.click = this.click.bind(this)
    }

    click() {
        fetch('/ok.json').then(response => {
            response.json().then(text => this.props.onLogged(text))
        }).catch(response => {
            response.text().then(text => console.log(text))
        })
    }
    
    render() {
        return (<div className="container signup">
            <Input max={10} contentEditable="true" placeHolder="codigo de entrada"/>
            <p className="button" onClick={this.click}>entrar</p>
        </div>)
    }

}

export default SignUn
