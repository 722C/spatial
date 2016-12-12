import React, { Component } from 'react';

import Spot from './spot'
import Cell from './cell'
import Car from './car'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parkingLot: [
                [new Cell(' '), new Cell('^'), new Cell('^'), new Cell('^'), new Cell('^'), new Cell('^'), new Cell('^'), new Cell('^'), new Cell('^'), new Cell(' ')],
                [new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' ')],
                [new Cell(' '), new Cell('v'), new Cell('v'), new Cell('v'), new Cell('v'), new Cell('v'), new Cell('v'), new Cell('v'), new Cell('v'), new Cell(' ')],
                [new Cell(' '), new Cell('^'), new Cell('^'), new Cell('^'), new Cell('^'), new Cell('^'), new Cell('^'), new Cell('^'), new Cell('^'), new Cell(' ')],
                [new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' ')],
                [new Cell(' '), new Cell('v'), new Cell('v'), new Cell('v'), new Cell('v'), new Cell('v'), new Cell('v'), new Cell('v'), new Cell('v'), new Cell(' ')],
                [new Cell(' '), new Cell('^'), new Cell('^'), new Cell('^'), new Cell('^'), new Cell('^'), new Cell('^'), new Cell('^'), new Cell('^'), new Cell(' ')],
                [new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' '), new Cell(' ')],
                [new Cell(' '), new Cell('v'), new Cell('v'), new Cell('v'), new Cell('v'), new Cell('v'), new Cell('v'), new Cell('v'), new Cell('v'), new Cell(' ')],
            ],
            cars: [new Car(0, 0, 10, 9)],
            runningTotal: 0,
            totalCars: 0,
            greedyRunningTotal: 0,
            greedyTotalCars: 0,
            optimalRunningTotal: 0,
            optimalTotalCars: 0,
        };
        this.state.parkingLot.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {
                column.setXY(columnIndex, rowIndex);
            })
        })
        this.state.cars.forEach(car => {
            this.state.parkingLot[car.y][car.x] = this.state.parkingLot[car.y][car.x].updateOccupied(car)
        })
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            let grid = []
            let runningTotal = this.state.runningTotal
            let totalCars = this.state.totalCars
            let greedyRunningTotal = this.state.greedyRunningTotal
            let greedyTotalCars = this.state.greedyTotalCars
            let optimalRunningTotal = this.state.optimalRunningTotal
            let optimalTotalCars = this.state.optimalTotalCars
            this.state.parkingLot.forEach(row => {
                for (let y = 0; y < 3; ++y) {
                    let elements = []
                    row.forEach(column => {
                        elements = elements.concat(column.getGridSet(y))
                    })
                    grid.push(elements);
                }
            })
            this.state.cars.forEach((car, index) => {
                let newLocation = car.getNewPosition(this.state.parkingLot);
                if (newLocation) {
                    this.state.parkingLot[car.y][car.x] = this.state.parkingLot[car.y][car.x].updateOccupied(null)
                    car.updateLocation(newLocation[0], newLocation[1])
                    this.state.parkingLot[car.y][car.x] = this.state.parkingLot[car.y][car.x].updateOccupied(car)
                }
            })
            this.state.cars.forEach((car, index) => {
                if (!car.isAlive()) {
                    let distance = Math.sqrt(car.y * car.y + car.x * car.x)
                    runningTotal += distance
                    totalCars += 1
                    if (car.greedy) {
                        greedyRunningTotal += distance
                        greedyTotalCars += 1
                    }
                    if (car.optimal) {
                        optimalRunningTotal += distance
                        optimalTotalCars += 1
                    }
                    this.state.parkingLot[car.y][car.x] = this.state.parkingLot[car.y][car.x].updateOccupied(null)
                }
            })
            this.state.cars = this.state.cars.filter(car => car.isAlive())
            let newCars = []
            if (Math.random() < 0.2) {
                let newCar = new Car(0, 0, 10, 9)
                this.state.parkingLot[newCar.y][newCar.x] = this.state.parkingLot[newCar.y][newCar.x].updateOccupied(newCar)
                newCars.push(newCar)
            }
            this.setState({
                runningTotal: runningTotal,
                totalCars: totalCars,
                cars: this.state.cars.concat(newCars),
                parkingLot: this.state.parkingLot,
                greedyRunningTotal: greedyRunningTotal,
                greedyTotalCars: greedyTotalCars,
                optimalRunningTotal: optimalRunningTotal,
                optimalTotalCars: optimalTotalCars,
            })
            if (totalCars >= 5000) {
                clearInterval(this.interval)
            }
        }, 50)
    }

    render() {
        return (
            <div>
                <table>
                    <tbody>
                        {this.state.parkingLot.map((row, rowIndex) => {
                            return (
                                <tr key={`row-${rowIndex}`}>
                                    {row.map((column, columnIndex) => {
                                        return (
                                            <Spot key={`row-${rowIndex} column-${columnIndex}`} spot={column} container={'td'} />
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <p>Total Cars: {this.state.totalCars}</p>
                <p>Running Average: {this.state.runningTotal / this.state.totalCars}</p>
                <p>Total Greedy Cars: {this.state.greedyTotalCars}</p>
                <p>Running Greedy Average: {this.state.greedyRunningTotal / this.state.greedyTotalCars}</p>
                <p>Total Optimal Cars: {this.state.optimalTotalCars}</p>
                <p>Running Optimal Average: {this.state.optimalRunningTotal / this.state.optimalTotalCars}</p>
            </div>
        )
    }
}
                // <p>Running Total: {this.state.runningTotal}</p>
                // <p>Running Greedy Total: {this.state.greedyRunningTotal}</p>
                // <p>Running Optimal Total: {this.state.optimalRunningTotal}</p>