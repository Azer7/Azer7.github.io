let start;
let end;
let openSet = [];
let closedSet = [];
let path = [];
let solved = 0;

function Tile(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbours = [];
    this.type = 0;
    this.wall = false;

    if (random(1) < 0.0)
        this.wall = true;

    this.parent = undefined;

    this.show = function (colour) {
        fill(colour);
        if (this.wall)
            fill(70);
        stroke(0);
        strokeWeight(tileSize / 50);
        rect(startingX + tileSize * j, startingY + tileSize * i, tileSize, tileSize);
    }

    this.addNeighbours = function (grid) {
        this.neighbours = [];
        let i = this.i;
        let j = this.j;
        if (i < sideLength - 1)
            this.neighbours.push(grid[i + 1][j]);
        if (i > 0)
            this.neighbours.push(grid[i - 1][j]);
        if (j < sideLength - 1)
            this.neighbours.push(grid[i][j + 1]);
        if (j > 0)
            this.neighbours.push(grid[i][j - 1]);

    }
}

// removes a certain element by data
function removeFromArray(arr, elt) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
}

//calculates how close it's getting (manhattan distance)
function heuristic(a, b) {
    let c = abs(a.i - b.i) + abs(a.j - b.j); //manhattan distance from tile to end
    //let c = dist(a.i, a.j, b.i, b.j) //euclidean distance from tile to end
    return c;
}

//reset the whole maze
function initMaze() {
    for (let i = 0; i < sideLength; i++) {
        for (let j = 0; j < sideLength; j++)
            tileArray[i][j].addNeighbours(tileArray);
    }

    start = tileArray[0][0];
    end = tileArray[sideLength - 1][sideLength - 1];
    start.wall = false;
    end.wall = false;
    openSet = [];
    closedSet = [];
    path = [];

    solved = 0;
    openSet.push(start);
}

//solve algorithm
function solveMaze() {
    if (autoSolve == 1) { //frame by frame solve
        if (openSet.length > 0 && !solved) {
            mazeLogic();
        } else {
            if (solved == 0) {
                solved = -1;
                //there are no items left, thus maze has no solution
                console.log("no solutions");
            }
        }

    } else if (autoSolve == 2) { //instant solve
        while (openSet.length > 0 && !solved) { 
            mazeLogic();
        }
        if (solved == 0) {
            solved = -1;
            //there are no items left, thus maze has no solution
            console.log("no solutions");
        }
    }
}

function mazeLogic() {
    //the index of the lowest f value in the array
    let lowestIndexF = 0;
    for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[lowestIndexF].f) {
            lowestIndexF = i;
        }
    }
    let current = openSet[lowestIndexF];

    if (current === end) {
        solved = 1;
        console.log("Done!");
    }

    //add and remove nodes
    removeFromArray(openSet, current);
    closedSet.push(current);

    //evaluate neighbour logic
    let neighbours = current.neighbours;
    for (let i = 0; i < neighbours.length; i++) { //loops through all (up to 4) neighbours
        let neighbour = neighbours[i];
        if (!closedSet.includes(neighbour) && !neighbour.wall) { //still up for evaluating
            let tempG = current.g + 1; //temporary g, because potentially there is a shorter route
            let newPath = false
            if (openSet.includes(neighbour)) { //is the neighbour already in the openSet
                if (tempG < neighbour.g) { //if the cost is less
                    neighbour.g = tempG;
                    newPath = true;
                }
            } else { //otherwise the path hasn't been reached yet, so change the node value
                neighbour.g = tempG;
                newPath = true;
                openSet.push(neighbour);
            }

            if (newPath) {
                // get the total cost of the node path
                neighbour.h = heuristic(neighbour, end); //educated guess to see how close the neighbour is
                neighbour.f = neighbour.g + neighbour.h;
                neighbour.parent = current; //dont update if it's not better
            }
        }
    }
    // Find the shortest path out of all the paths
    path = [];
    let temp = current;
    path.push(temp); //push the last parent
    while (temp.parent) { //while a previous exists; find the parent of each parent
        path.push(temp.parent);
        temp = temp.parent;
    }
}
