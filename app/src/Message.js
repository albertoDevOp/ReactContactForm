import React, { Component } from 'react';
import Input from './Input.js';
import './Message.css';

class Message extends Component {

    constructor(props) {
        super(props)
        this.state = { activeArea: false, body: { text: '', html: null }, sender: '', node: this.txtNode, offset: 0 }
        this.focus = this.focus.bind(this)
        this.blur = this.blur.bind(this)
        this.input = this.input.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.mountText = this.mountText.bind(this)
        this.tags = []
    }

    componentDidMount() {
        this.setState({ node: this.txtNode })

        this.tags = this.props.values.slice()
        this.tags.push('url')

        if (this.props.body && this.props.sender) {
            this.setState({ body: this.props.body, sender: this.props.sender })
            this.props.moveForward()
        }
    }

    mountText() {
        if (this.props.body) return { __html: this.props.body.html }
    }

    handleChange(input) {
        this.setState({ sender: input.value })
        if (input.value.length > 0 && this.state.body.text.length > 0) this.props.moveForward()
        else this.props.cancelForward()
    }

    focus() {
        this.setState({ activeArea: true })
    }

    blur() {
        let timeout = setTimeout(() => this.setState({ activeArea: false }), 500)
        this.setState({ timeout: timeout })
    }

    getData() {
        return { body: this.state.body, sender: this.state.sender }
    }

    bind(tag) {
        if (this.state.activeArea) {
            if (this.state.timeout) {
                clearTimeout(this.state.timeout)
                this.setState({ timeout: null })
            }

            let counter = 0

            if (this.state.node.childNodes.length === 0) {
                const node = this.state.node
                node.textContent = ':' + tag.toUpperCase()
            } else {
                for (let node of this.state.node.childNodes) {
                    if (node.nodeType === 3) {
                        counter = counter + node.textContent.length
                        if (counter >= this.state.offset) {
                            let prev = this.state.node.childNodes[0].textContent.slice(0, this.state.offset)
                            let post = this.state.node.childNodes[0].textContent.slice(this.state.offset)
                            node.textContent = prev + ':' + tag.toUpperCase() + post
                            break
                        }
                    } else if (node.nodeType === 1) {
                        if (node.nodeName === 'BR') {
                            const parent = this.state.node
                            const tn = document.createTextNode(':' + tag.toUpperCase())
                            parent.replaceChild(tn, node)
                        }
                    }
                }
            }
            this.txtNode.focus()
            var range = document.createRange();
            range.setStart(this.state.node.childNodes[0], this.state.offset + tag.length + 1);
            range.collapse(true);
            let selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            this.input()
        }
    }

    input() {
        if (this.state.activeArea) {
            let body = this.getTxt(this.txtNode)
            this.setState({ body: { text: body, html: this.txtNode.innerHTML } })

            if (this.state.sender.length > 0 && body.length > 0) this.props.moveForward()
            else this.props.cancelForward()

            let sel = window.getSelection()
            if (sel.rangeCount) {
                let range = sel.getRangeAt(0)
                let node = sel.focusNode
                let offset = 0
                if (node.nodeType === 3) {
                    node = range.commonAncestorContainer.parentNode
                    offset = range.endOffset
                }
                this.setState({ node: node, offset: offset })
            }
        }
    }

    getTxt(node) {
        let text = ''
        for (let childNode of node.childNodes) {
            if (childNode.nodeType === 3) text = text + childNode.textContent
            else if (childNode.nodeType === 1) {
                if (childNode.nodeName === 'BR')
                    text = text + '\n';
                else text = text + '\n' + this.getTxt(childNode)
            }
        }
        return text
    }

    render() {
        let tags = this.tags.map((value, id) =>
            <li key={id} className={id} onClick={() => this.bind(value)}>{value}</li>
        )

        return <div className="mform">
            <section>
                <h2>Mensaje</h2>
                <ul className="tags">
                    {tags}
                </ul>
                <div className="template">
                    <Input className="name" onKeyUp={this.handleChange} onChange={this.handleChange} max={15} contentEditable="true" placeHolder="Escribe aquí el remitente" value={this.props.sender} />
                    <div className="msg">
                        <div onClick={this.input} onKeyUp={this.input} className={ "body" + ((this.state.activeArea || (this.state.body.text.length > 0)) ? ' visible' : '')} onFocus={this.focus} onBlur={this.blur} contentEditable ref={element => this.txtNode = element} dangerouslySetInnerHTML={this.mountText()} />
                        <div className={'placeholder' + ((this.state.activeArea || (this.state.body.text.length > 0)) ? ' hidden' : '')} onClick={() => { this.txtNode.focus() }}>
                            <p>Hola usuario,</p>
                            <p>Escribe aquí el mensaje que quieres enviar y añade las etiquetas de la izquierda</p>
                            <p>Saludos</p>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <h2>Instrucciones</h2>
                <div className="instructions">
                    <ul>
                        <li>Escribe el nombre del remitente</li>
                        <li>Escribe el mensaje que quieras que los usuarios reciban</li>
                        <li>Haz clic en las etiquetas para que aparezcan dentro del mensaje. Situa el cursor dentro del mensaje para controlar dónde añadir la etiqueta.</li>
                        <li>En el envío las etiquetas seran sustituidas por los valores correspondientes introducidos en el paso previo.</li>
                    </ul>
                </div>
            </section>
        </div>


    }

}

export default Message