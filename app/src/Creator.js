import React, { Component } from 'react';
import UserInput from './UserInput.js'
import Message from './Message.js'
import DatePicker from './DatePicker.js'
import Confirm from './Confirm.js'

class Creator extends Component {

    constructor(props) {
        super(props)
        this.state = { step: 0, last_step: 0, canNext: false, data: {} }
        this.undoData = this.undoData.bind(this)
        this.isReady = this.isReady.bind(this)
        this.isNotReady = this.isNotReady.bind(this)
        this.stepForward = this.stepForward.bind(this)
    }

    undoData() {
        this.component.erase()
        this.setState({ canNext: false })
    }

    isReady() {
        this.setState({ canNext: true })
    }

    isNotReady() {
        this.setState({ canNext: false }) 
    }

    stepForward() {
        const data = Object.assign(this.state.data, this.component.getData())
        this.setState((prevState) => {
            if(prevState.last_step === prevState.step) return { step: prevState.step + 1, last_step: prevState.last_step + 1, canNext: false, data: data }            
            else return { step: prevState.step + 1, canNext: false, data: data }
        })
    }

    moveTo(step) {        
        if(this.state.last_step >= step) this.setState({ step: step, canNext: false })
    }

    render() {
        let content
        if (this.state.step === 0) content = <UserInput link={this.state.data.link} name={this.state.data.name} columns={this.state.data.header} rows={this.state.data.rows} cancelForward={this.isNotReady} moveForward={this.isReady} ref={(component) => { this.component = component; }} />
        else if (this.state.step === 1) content = <Message body={this.state.data.body} sender={this.state.data.sender} cancelForward={this.isNotReady} moveForward={this.isReady} values={this.state.data.header} ref={(component) => { this.component = component; }} />
        else if (this.state.step === 2) content = <DatePicker n={this.state.data.rows.length} dates={this.state.data.dates} cancelForward={this.isNotReady} moveForward={this.isReady} ref={(component) => { this.component = component; }} />
        else if (this.state.step === 3) content = <Confirm data={this.state.data} moveForward={this.accept} ref={(component) => { this.component = component; }} />
        return (
            <React.Fragment>
                {content}
                <div className="menu">
                    <ul>
                        <li onClick={() => this.moveTo(0)}>Datos</li>
                        <li onClick={() => this.moveTo(1)} className={this.state.last_step < 1?'disabled':''}>Mensaje</li>
                        <li onClick={() => this.moveTo(2)} className={this.state.last_step < 2?'disabled':''}>Programación</li>
                        <li onClick={() => this.moveTo(3)} className={this.state.last_step < 3?'disabled':''}>Confirmación</li>
                    </ul>
                    {this.state.canNext &&
                        <p className="next" onClick={this.stepForward}>Siguiente</p>
                    }
                    {this.state.step === 0 && this.state.canNext &&
                        <p className="undo" onClick={this.undoData}>Deshacer</p>
                    }
                </div>
            </React.Fragment>
        )
    }

}

export default Creator