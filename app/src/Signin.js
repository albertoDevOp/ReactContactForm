import React, { Component } from 'react';
import Input from './Input.js'
import './Signin.css';

class SignIn extends Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.state = { registered: false, submitted: false, error: false }
    }

    submit() {
        this.setState({ submitted: true })
        if (!this.state.error && this.state.input !== undefined) {
            fetch('/ok.json').then(response => {
                this.setState({ registered: true })
            }).catch(response => {
                response.text().then(text => this.setState({ error: true, message: 'Algún problema ha ocurrido con el envio' }))
            })
        }
    }

    handleChange(input) {
        this.setState({ error: input.error, message: input.message, input: input.value })
    }

    render() {
        let content
        if (!this.state.registered) {
            content =
                <React.Fragment>
                    <Input onChange={this.handleChange} type="email" max={50} contentEditable="true" placeHolder="correo@dominio.td" />
                    <p className="button" onClick={this.submit}>Suscribirse</p>
                    {this.state.error && this.state.submitted &&
                        <p className="error">{this.state.message}</p>
                    }
                </React.Fragment>
        }
        else content =
            <div className="confirmed">
                <p>Gracias por registrarte</p>
                <p>Se ha enviado un correo con la clave de acceso al servicio</p>
                <p className="button" onClick={() => this.props.onComplete()}>Entrar</p>
            </div>

        return (<div className="container signin">
            {content}
        </div>)
    }

}

export default SignIn