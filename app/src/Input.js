import React, { Component } from 'react';

class Input extends Component {

    constructor(props) {
        super(props)
        this.handleInput = this.handleInput.bind(this)
        this.onKeyUp = this.onKeyUp.bind(this)
    }

    componentDidMount() {
        if(this.props.value) this.input.textContent = this.props.value
    }

    handleInput(event) {
        let content = event.target.textContent

        if (this.props.max && this.props.max <= content.length && event.key !== 'Backspace') {
            event.preventDefault()
            return
        }

        else if (event.key === 'Enter') {
            event.preventDefault()
            return
        }

        else if (this.props.type && this.props.type === 'email') {
            if (!/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(content)) {
                if(this.props.onChange) this.props.onChange({ error: true, message: 'Correo electrónico incorrecto' })
                return
            }
        }

        else if (this.props.type && this.props.type === 'number') {
            if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab' && event.key !== 'Delete') {
                event.preventDefault()
                return
            } else {
                if (this.props.max && this.props.max < Number(content + event.key)) {
                    event.preventDefault()
                    return
                }
                if (this.props.min && this.props.min > Number(content + event.key)) {
                    event.preventDefault()
                    return
                }
            }
        }

        else if (this.props.type && (this.props.type === 'hour' || this.props.type === 'min')) {
            if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab' && event.key !== 'Delete') {
                event.preventDefault()
                return
            } else if (event.key === 'Backspace' || event.key === 'Delete') {
                this.input.textContent = ''
                event.preventDefault()
                return
            } else if(event.key === 'Tab'){
                return
            } else {                
                if (content[0] !== '0' && Number(content + event.key) < 10 && Number(content + event.key) >= 0) {
                    this.input.textContent = '0' + event.key
                    event.preventDefault()
                } else {
                    if (content[0] === '0') this.input.textContent = this.input.textContent.substring(1)
                    else if(content.length === 2) this.input.textContent = this.input.textContent.substring(1)
                    this.input.textContent = this.input.textContent + event.key
                    event.preventDefault()
                } 
            }
        }

        if(this.props.onChange) this.props.onChange({ error: false, value: content })
    }

    onKeyUp(event) {
        if(this.props.type === 'min') {
            if(Number(this.input.textContent) > 59) this.input.textContent = '59'                    
        }

        if(this.props.type === 'hour') {
            if(Number(this.input.textContent) > 23) this.input.textContent = '23'
        }
        if(this.props.onKeyUp) this.props.onKeyUp({ error: false, value: event.target.textContent })
    }

    render() {
        return <p required="true" tabIndex={0} className={this.props.className} onKeyUp={this.onKeyUp} onKeyDown={this.handleInput} placeholder={this.props.placeHolder} contentEditable={this.props.contentEditable} ref={(input) => this.input = input} />
    }
}

export default Input