export default class Cell {
    constructor(type, cost = 0, car = null) {
        this.type = type
        this.cost = cost
        this.car = car
    }
    getType() {
        return this.type
    }
    isParkingSpot() {
        return this.type == '^' || this.type == 'v'
    }
    isOpenParkingSpot() {
        return this.isParkingSpot() && !this.car 
    }
    isOccupied() {
        return !!this.car
    }
    navigable() {
        return this.isOpenParkingSpot() || this.type == ' '
    }
    getCost() {
        return this.cost
    }
    hasCar() {
        return !!this.car
    }
    setXY(x, y) {
        this.x = x
        this.y = y
    }
    updateOccupied(car) {
        let toReturn = new Cell(this.type, this.cost, car)
        toReturn.setXY(this.x, this.y)
        return toReturn
    }
    getGridSet(y) {
        if (this.car && this.type != ' ') {
            return [1, 1, 1]
        }
        if (this.type == ' ') {
            return [0, 0, 0]
        }
        if (((y == 0 || y == 1) && this.type == 'v') || ((y == 1 || y == 2) && this.type == '^')) {
            return [1, 0, 1]
        }
        return [1, 1, 1]
    }
}