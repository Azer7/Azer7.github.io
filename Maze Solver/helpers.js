//should only be called once, resets whole program
function initialize() {
    tileSize = (0.8 * height) / sideLength;
    startingY = height - sideLength * tileSize;
    endingY = startingY + sideLength * tileSize;

    startingX = (width - sideLength * tileSize) / 2;
    endingX = startingX + sideLength * tileSize;

    oldTileArray = [];
    oldTileArray = tileArray.slice();
    tileArray = [];

    //fill with terrain tiles
    for (let i = 0; i < sideLength; i++) {
        tileArray.push([]);
        for (let j = 0; j < sideLength; j++)
            tileArray[i].push(new Tile(i, j));
    }

    let lowestGrid;
    if (oldTileArray.length < tileArray.length)
        lowestGrid = oldTileArray.length;
    else
        lowestGrid = tileArray.length;

    for (let i = 0; i < lowestGrid; i++) { //copy old top left corner
        for (let j = 0; j < lowestGrid; j++)
            tileArray[i][j] = oldTileArray[i][j];
    }

        buttonInit = true;
        solveButton = new Button(1025, 700, 120, 60, "Solve", 42);
        autoButton = new Button(1025, 800, 120, 60, "Instant", 30);
    autoButton.mainColour = OFF;
}

// draws coloured tiles
function drawMaze() {
    for (let i = 0; i < sideLength; i++) {
        for (let j = 0; j < sideLength; j++) {
            tileArray[i][j].show(255);
        }
    }

    tileArray[0][0].show(color(0, 255, 100));
    tileArray[sideLength - 1][sideLength - 1].show(color(255, 0, 100));

    if (autoSolve) {

        for (let i = 0; i < openSet.length; i++) {
            if (autoSolve == 1)
                openSet[i].show(color(0, 255, 0, 50));
            else
                openSet[i].show(color(0, 255, 0, 20));
        }

        for (let i = 0; i < closedSet.length; i++) {
            if (autoSolve == 1)
                closedSet[i].show(color(255, 0, 0, 50));
            else
                closedSet[i].show(color(255, 0, 0, 20));
        }

        for (let i = 0; i < path.length; i++) {
            if (solved == 1)
                path[i].show(color(50, 0, 150));
            else
                path[i].show(color(150, 0, 50));
        }
    }
}

//draws tile colour selector
function drawChooser() {
    stroke("black");
    strokeWeight(3);
    if (wallSelected == false) {
        fill(100);
        rect(1.5, 1.5, 50, 50);
    } else {
        fill(255);
        rect(50 + 3, 1.5, 50, 50);
    }
    stroke("blue")
    strokeWeight(3);
    if (wallSelected == true) {
        fill(100);
        rect(1.5, 1.5, 50, 50);
    } else {
        fill(255);
        rect(50 + 3, 1.5, 50, 50);
    }
}

//SAVE MAZE | not used yet but works
function saveMaze() {
    let currentMaze = JSON.stringify(tileArray);


    if (localStorage.getItem("mazeAmount") === null) {
        localStorage.setItem("mazeAmount", 1);
    } else {
        localStorage.mazeAmount = Number(localStorage.mazeAmount) + 1;
    }

    localStorage.setItem("maze" + localStorage.mazeAmount, currentMaze);
    console.log(JSON.parse(localStorage.maze1));
}
