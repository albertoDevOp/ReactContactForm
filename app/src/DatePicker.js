import React, { Component } from 'react';
import Input from './Input.js';
import "./DatePicker.css";
import Moment from 'moment'
import 'moment/locale/es.js'

class DatePicker extends Component {

    constructor(props) {
        super(props)
        let date = new Date()
        Moment.locale('es');
        this.state = { day: null, month: date.getMonth(), year: date.getFullYear(), hour: null, min: null, dates: [] }
        this.prevMonth = this.prevMonth.bind(this)
        this.postMonth = this.postMonth.bind(this)
        this.minutes = this.minutes.bind(this)
        this.hour = this.hour.bind(this)
        this.addDate = this.addDate.bind(this)
        this.getPrograms = this.getPrograms.bind(this)
    }

    componentDidMount() {
        if(this.props.dates) {
            this.setState({dates: this.props.dates })
            this.props.moveForward()
        }
    }

    prevMonth() {
        this.setState((prev) => {
            return {
                month: ((this.state.month - 1) < 0) ? 11 : (this.state.month - 1),
                year: ((this.state.month - 1) < 0) ? (this.state.year - 1) : this.state.year,
                day: null
            }
        })
    }

    postMonth() {
        this.setState((prev) => {
            return {
                month: ((this.state.month + 1) > 11) ? 0 : (this.state.month + 1),
                year: ((this.state.month + 1) > 11) ? (this.state.year + 1) : this.state.year,
                day: null
            }
        })
    }

    minutes(min) {
        this.setState({ min: min.value })
    }

    hour(hour) {
        this.setState({ hour: hour.value })
    }

    getData() {
        return { dates: this.state.dates }
    }

    getCalendar() {
        let date = new Date(this.state.year, this.state.month, 1)
        let first_day = date.getDay() - 1
        let empty = first_day >= 0 ? [...Array(first_day).keys()] : [];
        let prev = empty.map((val, id) => <li className="prev" key={'p' + id}></li>)
        let year = this.state.month < 12 ? this.state.year : this.state.year + 1
        let month = this.state.month < 11 ? this.state.month + 1 : 0
        let last = new Date(year, month, 0).getDate()
        let post = [...Array(last).keys()].map((val, id) => <li className={(this.state.day === val + 1) ? 'selected' : ''} onClick={() => this.setState({ day: val + 1 })} key={id}>{val + 1}</li>)
        return <ul className="month">{prev.concat(post)}</ul>
    }

    getTime() {
        return <div className="time">
            <p className="label">Hora del envio</p>
            <Input type="hour" onKeyUp={this.hour} contentEditable="true" max={23} min={0} placeHolder={'HH'} />:
            <Input type="min" onKeyUp={this.minutes} contentEditable="true" max={59} min={0} placeHolder={'MM'} />
        </div>
    }

    addDate() {
        this.setState((prev) => {
            const dates = prev.dates
            let found = dates.find(date => {
                return date.year === this.state.year && date.month === this.state.month &&
                    date.day === this.state.day && date.hour === this.state.hour &&
                    date.min === this.state.min
            })
            if (found) return
            dates.push({
                day: prev.day,
                month: prev.month,
                year: prev.year,
                hour: prev.hour,
                min: prev.min
            })
            dates.sort(this.sort)

            if (dates.length > 0) this.props.moveForward()
            else this.props.cancelForward()

            return { dates: dates }
        })
    }

    sort(datea, dateb) {
        if (datea.year > dateb.year) return 1;
        else if (datea.year < dateb.year) return -1;
        else {
            if (datea.month > dateb.month) return 1;
            else if (datea.month < dateb.month) return -1;
            else {
                if (datea.day > dateb.day) return 1;
                else if (datea.day < dateb.day) return -1;
                else {
                    if (datea.hour > dateb.hour) return 1;
                    else if (datea.hour < dateb.hour) return -1;
                    else {
                        if (datea.min > dateb.min) return 1;
                        else if (datea.min < dateb.min) return -1;
                        else return 0;
                    }
                }
            }
        }
    }

    getKey(date) {
        return Moment(new Date(date.year, date.month, date.day)).format('DD/MM/YYYY') + date.hour + ":" + date.min
    }

    getPrograms() {
        let dates = this.state.dates.map((date, index) => <li key={this.getKey(date)}>
            <p>{Moment(new Date(date.year, date.month, date.day)).format('DD MMMM YYYY') + " a las " + date.hour + ":" + date.min}</p>
            {index < (this.state.dates.length -1) &&
            <p className="info">Se envian {Math.floor(this.props.n/this.state.dates.length)} mensajes</p>
            }
            {index === (this.state.dates.length - 1) &&
            <p className="info">Se envian {Math.floor(this.props.n/this.state.dates.length)+(this.props.n%this.state.dates.length)} mensajes</p>
            }
        </li>)
        return <ul className="dates">{dates}</ul>
    }

    render() {
        let calendar = this.getCalendar()
        let timepicker = this.getTime()
        let programs = this.getPrograms()
        return <div className="data_picker">
            <section className="column">
                <div className="day">
                    <p className="label">Día del envio</p>
                    <p className="picker">{Moment(new Date(this.state.year, this.state.month)).format('MMMM YYYY')}
                        <span onClick={this.prevMonth} className="prev">&#xe904;</span>
                        <span onClick={this.postMonth} className="post">&#xe904;</span>
                    </p>
                    {calendar}
                </div>
                {this.state.day && timepicker}
                {!!Number(this.state.hour) && !!Number(this.state.min) && this.state.day &&
                    <p onClick={this.addDate} className="button add">Añadir</p>
                }
            </section>
            <section>
                {programs}
            </section>
        </div>
    }

}

export default DatePicker;
