// 

// Define variables and functions for wire generation

let cellSize = 30;
let wireLength = 20;
let cutOffLength = 2;
let straightness = 5;
let grid = [];
let gridWidth, gridHeight;
let available = [];
let wires = [];

let dirs = [
    [-1, -1], [0, -1], [1, -1],
    [1, 0],
    [1, 1], [0, 1], [-1, 1],
    [-1, 0]
];

function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.available = true;
}

function Wire(start) {
    this.cells = [];
    this.cells.push(start);
    this.last = findOpenDir(start.x, start.y);
}

Wire.prototype.render = function () {
    noFill();
    strokeWeight(cellSize / 8);
    stroke(130, 100, 60, .1); 
    beginShape();
    for (let i = 0; i < this.cells.length; i++) {
        let cell = this.cells[i];
        vertex((cell.x + .5) * cellSize, (cell.y + .5) * cellSize);
    }
    endShape();
    noFill();
    strokeWeight(cellSize / 10);
    let end = this.cells.length - 1;
    ellipse((this.cells[0].x + .5) * cellSize, (this.cells[0].y + .5) * cellSize, cellSize * .7);
    ellipse((this.cells[end].x + .5) * cellSize, (this.cells[end].y + .5) * cellSize, cellSize * .7);
}

Wire.prototype.generate = function () {
    let hasSpace = true;
    while (this.cells.length < wireLength && hasSpace) {
        let prevCell = this.cells[this.cells.length - 1];
        let tries = [0, 1, -1];
        if (random() > .5) tries = [0, -1, 1];
        let found = false;
        hasSpace = false;

        while (tries.length > 0 && !found) {
            let mod = tries.splice(floor(pow(random(), straightness) * tries.length), 1)[0];
            let index = this.last + 4 + mod;
            if (index < 0) index += 8;
            if (index > 7) index -= 8
            let dir = dirs[index];

            let x = dir[0] + prevCell.x;
            let y = dir[1] + prevCell.y;
            if (x >= 0 && x < gridWidth - 1 && y >= 0 && y < gridHeight - 1) {
                let cell = grid[x][y];
                if (cell.available && noCrossOver(index, x, y)) {
                    this.cells.push(cell);
                    cell.available = false;
                    hasSpace = found = true;
                    this.last = this.last + mod;
                    if (this.last < 0) this.last += 8;
                    if (this.last > 7) this.last -= 8;
                }
            }
        }
    }
}

function noCrossOver(index, x, y) {
    if (index == 0) return (grid[x + 1][y].available || grid[x][y + 1].available);
    if (index == 2) return (grid[x - 1][y].available || grid[x][y + 1].available);
    if (index == 4) return (grid[x - 1][y].available || grid[x][y - 1].available);
    if (index == 6) return (grid[x + 1][y].available || grid[x][y - 1].available);
    return true;
}

function findOpenDir(x, y) {
    let checks = [0, 1, 2, 3, 4, 5, 6, 7];
    while (checks.length > 0) {
        let index = checks.splice(floor(random() * checks.length), 1)[0];
        let dir = dirs[index];
        let x2 = x + dirs[0];
        let y2 = y + dirs[1];
        if (x2 >= 0 && x2 < gridWidth - 1 && y2 >= 0 && y2 < gridHeight - 1) {
            if (grid[x2][y2].available) return index;
        }
    }
    return 0;
}

function recreate() {
    gridWidth = ceil(windowWidth / cellSize) + 1;
    gridHeight = ceil(windowHeight / cellSize) + 1;
    grid = [];
    available = [];
    wires = [];

    for (let i = 0; i < gridWidth; i++) {
        grid.push([]);
        for (let j = 0; j < gridHeight; j++) {
            let cell = new Cell(i, j);
            grid[i][j] = cell;
            available.push(cell);
        }
    }

    while (available.length > 0) {
        let cell = available[floor(random() * available.length)];
        cell.available = false;
        let wire = new Wire(cell);
        wire.generate();
        wires.push(wire);
        for (let i = 0; i < wire.cells.length; i++) {
            available.splice(available.indexOf(wire.cells[i]), 1);
        }
    }
}
