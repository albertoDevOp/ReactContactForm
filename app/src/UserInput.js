import React, { Component } from 'react';
import Table from './Table.js'
import './UserInput.css'

class UserInput extends Component {

    constructor(props) {
        super(props)
        this.state = { drag: 0 }
        this.isReady = false
        this.dragEnter = this.dragEnter.bind(this)
        this.dragLeave = this.dragLeave.bind(this)
        this.dragOber = this.dragOver.bind(this)
        this.dropFile = this.dropFile.bind(this)
        this.deleteRow = this.deleteRow.bind(this)
        this.moveForward = this.moveForward.bind(this)
        this.name = this.name.bind(this)
        this.link = this.link.bind(this)
    }

    componentDidMount() {
        if(this.props.columns && this.props.rows && this.props.name && this.props.link) {
            this.setState({drag: 3, data: { rows: this.props.rows, header: this.props.columns, name: this.props.name, link: this.props.link }})
            this.props.moveForward()
        }
    }

    moveForward() {
        if(this.state.data.header && this.state.data.rows && this.state.data.name && this.state.data.link) this.props.moveForward()
    }

    deleteRow(row) {
        const data = this.state.data
        data.rows.splice(row, 1)
        if(data.rows.length > 0) this.setState({data})
        else this.setState({ drag: 0})
    }

    erase() {
        this.setState({ drag: 0 })
    }

    dragLeave(event) {
        event.preventDefault()
        this.setState({ drag: 0 })
    }

    dragEnter(event) {
        event.preventDefault()
        this.setState({ drag: 1 })
    }

    dropFile(event) {
        event.preventDefault()
        event.dataTransfer.effectAllowed = "none";
        event.dataTransfer.dropEffect = "none";
        for (let file of event.dataTransfer.files) {
            let reader = new FileReader()
            reader.onloadstart = () => this.setState({ drag: 2 })
            reader.onloadend = (content) => {
                let lines = content.target.result.split('\n')
                let columns = lines.splice(0, 1)
                columns = columns[0].replace(/[^a-zA-Z,; ]/g, "")
                columns = columns.split(/\s*,\s*/)
                let table = { rows: [], header: columns }
                for (let line of lines) {
                    let cells = line.split(/\s*,\s*/)
                    let object = {}
                    for (let i = 0; i < columns.length; i++) {
                        object[columns[i]] = cells[i]
                    }
                    table.rows.push(object)
                }
                this.setState({ drag: 3, data: table })
                this.moveForward()
            }
            reader.readAsBinaryString(file)
        }
    }

    dragOver(event) {
        event.preventDefault()
    }

    getData() {
        return this.state.data
    }

    name(name) {
        const data = this.state.data
        data.name = name
        this.setState({ data: data })
        if(name) this.moveForward()
        else this.props.cancelForward()
    }

    link(url) {
        const data = this.state.data
        data.link = url
        this.setState({ data: data })
        if(url) this.moveForward()
        else this.props.cancelForward()
    }

    render() {
        if (this.state.drag < 3) {
            return (
                <div className={"file" + (this.state.drag === 1 ? ' dragged' : '')} onDragOver={this.dragOver} onDrop={this.dropFile} onDragLeave={this.dragLeave} onDragEnter={this.dragEnter}>
                    <div className="container">
                        <p>
                            {this.state.drag < 2 &&
                                <span className="uicoda add">&#xe91a;</span>
                            }
                            {this.state.drag === 2 &&
                                <span className="uicoda add">&#xe918;</span>
                            }
                        </p>
                        {this.state.drag === 0 &&
                            <p className="wtd">Arrastra el fichero y sueltalo aquí o clica aqui para abrir el explorador</p>
                        }
                        {this.state.drag === 1 &&
                            <p className="wtd">Suelta el fichero aquí</p>
                        }
                        {this.state.drag === 2 &&
                            <p className="wtd">Cargando datos</p>
                        }
                    </div>
                </div>
            )
        } else {
            return <Table link={this.link} name={this.name} onDelRow={this.deleteRow} data={this.state.data} />
        }
    }

}

export default UserInput