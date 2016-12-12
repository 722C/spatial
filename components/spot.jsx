import React, { Component } from 'react'

const styles = {
    ' ': {
        backgroundColor: 'gray',
    },
    'C': {
        backgroundColor: 'green',
    },
    '^': {
        backgroundColor: 'gray',
        borderStyle: 'solid double hidden',
    },
    'v': {
        backgroundColor: 'gray',
        borderStyle: 'hidden double solid',
    },
    cell: {
        width: '3em',
        height: '3em',
        textAlign: 'center',
        borderColor: 'yellow',
    },
    car: {
        padding: '19px',
        margin: '5px',
    }
}

export default class Spot extends Component {
    render() {
        let car = null
        if (this.props.spot.hasCar()) {
            car = <div style={Object.assign({}, styles.car, {backgroundColor: this.props.spot.car.getColor()})}></div>
        }
        return (
            <this.props.container style={Object.assign({}, styles.cell, styles[this.props.spot.getType()])}>{car}</this.props.container>
        )
    }
}