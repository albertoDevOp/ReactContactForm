import React, { Component } from 'react';
import './Login.css';
import SignIn from './Signin.js';
import SignUp from './Signup.js';

class Login extends Component {

    constructor(props) {
        super(props)
        this.signIn = this.signIn.bind(this)
        this.signUp = this.signUp.bind(this)
        this.authenticated = this.authenticated.bind(this)
        this.state = { action: '' }
    }

    signIn() {
        this.setState({ action: 'signin' })
    }

    signUp() {
        this.setState({ action: 'signUp' })
    }

    authenticated(auth) {
        this.props.onLogged(auth)
    }

    render() {
        if (this.state.action === '') {
            return (
                <div className="container login">
                    <h1><span>Message</span><span>M&oslash;</span></h1>
                    <p className="subtitle">Déjanos enviar tus mensajes</p>
                    <ul>
                        <li onClick={this.signIn}>Ya tengo una cuenta</li>
                        <li onClick={this.signUp}>Crear una cuenta nueva</li>
                    </ul>
                </div>
            )
        }
        else if (this.state.action === 'signUp') {
            return <SignIn onComplete={this.signIn} />
        }
        else {
            return <SignUp onLogged={this.authenticated}/>
        }
    }
}

export default Login;