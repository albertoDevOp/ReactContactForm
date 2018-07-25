import React, { Component } from 'react';
import Input from './Input.js'
import './Table.css'

class Table extends Component {

    constructor(props) {
        super(props)
        this.state = { drag: 0 }
        this.name = this.name.bind(this)
        this.link = this.link.bind(this)
    }

    name(name) {
        this.props.name(name.value)
    }

    link(url) {
        this.props.link(url.value)
    }

    render() {
        const head = this.props.data.header.map(name =>
            <li key={name} className="th">{name}</li>
        )
        const rows = this.props.data.rows.map((row,index) => {
            let cells = Object.values(row).map((cell,it) =>
                <li key={it} className="td">{cell}</li>
            )
            return < ul key={index} onClick={() => this.props.onDelRow(index)} className="tr" >
                {cells}
                <li className="uicoda delete">&#xe90c;</li>
            </ul >
        })
        return (
            <React.Fragment>
                <ul className="sum">
                    <li className="name">
                        <Input onKeyUp={this.name} max={50} contentEditable="true" placeHolder="Nombre del envío" value={this.props.data.name}/>
                    </li>
                    <li className="url">
                        <Input onKeyUp={this.link} max={50} contentEditable="true" placeHolder="Enlace de la promoción" value={this.props.data.link}/>
                    </li>
                    <li><span>Núm. respuestas</span>{this.props.data.rows.length}</li>
                </ul>
                <div className="table">
                    <ul className="thead">
                        {head}
                    </ul>
                    {rows}
                </div>
            </React.Fragment>
        )
    }

}

export default Table