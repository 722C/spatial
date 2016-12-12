import PF from 'pathfinding'
import gaussian from 'gaussian'

let finder = new PF.AStarFinder({
    allowDiagonal: false
});


export default class Car {
    constructor(x, y, maxX, maxY, lifeSpan = 200, variance = 400, viewDistance = 3) {
        this.x = x
        this.y = y
        this.viewDistance = 3
        this.visited = []
        this.found = null
        this.path = []
        this.foundX = x
        this.foundY = y
        this.world = []
        for (let row = 0; row < maxY; ++row) {
            let worldRow = []
            for (let column = 0; column < maxX; ++column) {
                worldRow.push(0)
            }
            this.world.push(worldRow)
        }
        let distribution = gaussian(lifeSpan, variance);
        this.lifeSpan = distribution.ppf(Math.random());
        while (this.lifeSpan < 20) {
            this.lifeSpan = distribution.ppf(Math.random());
        }
        if (Math.random() < 0.5) {
            this.greedy = true
        } else {
            this.greedy = false
        }
        this.optimal = !this.greedy
        this.parked = false
    }
    getNewPosition(parkingLot) {
        this.parked = this.parked || parkingLot[this.y][this.x].isParkingSpot()
        if (this.parked) {
            this.lifeSpan -= 1
        } 
        if (parkingLot[this.y][this.x].isParkingSpot() && !this.optimal) {
            // found a parking spot, not moving
            return null
        }



        let bestPosition = null
        let bestPositionScore = -1
        let bestX = 0
        let bestY = 0

        for (let x = -1 * this.viewDistance + 1; x < this.viewDistance; ++x) {
            for (let y = -1 * this.viewDistance + 1; y < this.viewDistance; ++y) {
                let score = this.considerPosition(parkingLot, this.x + x, this.y + y)
                if (score > bestPositionScore || score > 0 && score < 1 && score == bestPositionScore && Math.random() < 0.5) {
                    bestPosition = parkingLot[this.y + y][this.x + x]
                    bestPositionScore = score
                    bestX = x + this.x
                    bestY = y + this.y
                } else if (score == 1 && (Math.abs(bestX - this.x) > Math.abs(x) || Math.abs(bestX - this.x) > Math.abs(x))) {
                    bestPosition = parkingLot[this.y + y][this.x + x]
                    bestPositionScore = score
                    bestX = x + this.x
                    bestY = y + this.y
                }
            }
        }
        if (parkingLot[this.y][this.x].isParkingSpot() && (!bestPosition.isOpenParkingSpot() || bestPosition.isOpenParkingSpot() && bestX >= this.x && bestY >= this.y || Math.random() < 0.5) ) {
            return null
        }
        for (let x = -1 * this.viewDistance + 1; x < this.viewDistance; ++x) {
            for (let y = -1 * this.viewDistance + 1; y < this.viewDistance; ++y) {
                if (this.x + x < 0 || this.x + x >= parkingLot[0].length) {
                    continue
                }
                if (this.y + y < 0 || this.y + y >= parkingLot.length) {
                    continue
                }
                this.world[this.y + y][this.x + x] = this.considerPositionAvailable(parkingLot, this.x + x, this.y + y)
            }
        }
        if (this.found && this.found.length && this.world[this.found[1]][this.found[0]] != 1 && this.optimal) {
            if (this.found[0] < bestX) {
                bestPosition = parkingLot[this.found[1]][this.found[0]]
                bestX = this.found[0]
                bestY = this.found[1]
            }
        }
        let pfGrid = new PF.Grid(this.world);
        let path = finder.findPath(this.x, this.y, bestX, bestY, pfGrid);
        if (bestPosition && bestPosition.isOpenParkingSpot()) {
            this.found = [bestPosition.x, bestPosition.y]
        }
        this.path = path
        this.path.shift()
        try {
            let next = this.path.shift()
            return [next[0], next[1]]
        } catch (error) {
            this.lifeSpan = -1
        }
    }
    updateLocation(x, y) {
        this.visited.push([this.x, this.y])
        this.x = x
        this.y = y
    }
    considerPosition(parkingLot, x, y) {
        if (x < 0 || x >= parkingLot[0].length) {
            return -10
        }
        if (y < 0 || y >= parkingLot.length) {
            return -10
        }
        if (parkingLot[y][x].isOccupied()) {
            return -10
        }
        if (this.x == x && this.y == y && !parkingLot[y][x].isParkingSpot()) {
            return -10
        }
        if (parkingLot[y][x].isParkingSpot()) {
            return 1
        }
        if (this.visited.find(match => match[0] == x && match[1] == y)) {
            return 0.3
        }
        return 0.5
    }
    considerPositionAvailable(parkingLot, x, y) {
        if (x < 0 || x >= parkingLot[0].length) {
            return 1
        }
        if (y < 0 || y >= parkingLot.length) {
            return 1
        }
        if (parkingLot[y][x].navigable()) {
            return 0
        }
        return 1
    }
    isAlive() {
        return this.lifeSpan >= 0
    }
    getColor() {
        if (this.greedy) {
            return 'blue'
        }
        if (this.optimal) {
            return 'green'
        }
        return 'black'
    }
}