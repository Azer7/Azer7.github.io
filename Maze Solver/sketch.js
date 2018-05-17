//Constants
let OFF = [255, 0, 0];
let ON = [165, 255, 90];

//variables
let tileArray = [];
let oldTileArray = [];
let sideLength = 15;
let tileSize;
let startingX, endingX;
let startingY, endingY;
let phase = 0;
let wallSelected = true;
let solveButton;
let autoButton;
let instantSolve = 0;
let autoSolve = 0; //0 is don't solve, 1 is frame by frame, 2 is instant solve

let buttonInit = false;

let debugMazeClick

// SETUP FUNCTION - Runs once at beginning of program
function setup() {
    createCanvas(1200, 900);
    frameRate(30);
    initialize();
    initMaze();
}

// DRAW FUNCTION - Loops @ 60FPS by default
function draw() {
    background(255);
    //maze creator

    //draw maze
    drawMaze();
    drawChooser();

    buttonLogic();

    fill(0);
    textSize(40);
    stroke(1);
    text("space to\nswap", 200, 50);
    text("r to\nreset solve", 600, 50);
    text("backspace\nto reset", 1090, 50);
}

//checks if buttons are clicked
function buttonLogic() {
    if (autoButton.update()) {
        instantSolve = instantSolve ? 0 : 1;
        initMaze();

        if (autoSolve)
            autoSolve = instantSolve + 1;
    }

    //set colours
    autoButton.mainColour = instantSolve ? ON : OFF;
    solveButton.mainColour = autoSolve ? ON : OFF;

    if (solveButton.update()) {
        autoSolve = autoSolve ? 0 : instantSolve + 1;

        if (autoSolve) {
            initMaze();
            solveMaze();
        }
    }

    if (autoSolve != 0)
        solveMaze();
}
