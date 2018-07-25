import React, { Component } from 'react';
import Creator from './Creator.js'
import Moment from 'moment'

class ListDeliveries extends Component {

    constructor(props) {
        super(props)
        this.state = { deliveries: [], section: 'main' }
    }

    componentDidMount() {
        fetch('/list.json').then(result => {
            result.json().then(list => {
                this.setState({ deliveries: list.list })
            })
        }).catch()
    }

    render() {
        if (this.state.section === 'main') {
            const list = this.state.deliveries.map(delivery => {
                let dates = []
                if (delivery.created)
                    dates.push(<p key="start" className="date"><span>Comienzo</span>{Moment(delivery.created).format('L')}</p>)
                if (delivery.last)
                    dates.push(<p  key="beginning" className="date"><span>Último envio</span>{Moment(delivery.last).format('L')}</p>)
                if (delivery.next)
                    dates.push(<p key="next" className="date"><span>Próximo envío</span>{Moment(delivery.next).format('L')}</p>)
                return (
                    <li key={delivery.id}>
                        <p>Envio U.Alcoyana</p>
                        {dates}
                        {delivery.status === 'delivering' && <p className="status delivering">Enviando</p>}
                        {delivery.status === 'finished' && <p className="status finished">Enviado</p>}
                        {delivery.status === 'pending' && <p className="status pending">Pendiente</p>}
                    </li>
                )
            })
            return (
                <ul className="deliveries">
                    <li key={'new'} onClick={() => this.setState({ section: 'new' })} className="new">
                        <div className="content">
                            <p className="add">&#xe920;</p>
                            <p className="add_hover">Nuevo envio</p>
                        </div>
                    </li>
                    {list}
                </ul >
            )
        }
        else if (this.state.section === 'new') {
            return <Creator/>
        }
    }
}

export default ListDeliveries;
