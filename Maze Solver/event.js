function mousePressed() {
    if (phase == 0) {
        changeTile();
    }
}

function mouseDragged() {
    if (phase == 0) {
        changeTile();
    }
}

function changeTile() {
    if (mouseX > startingX && mouseX < startingX + sideLength * tileSize && mouseY > startingY && mouseY < startingY + sideLength * tileSize) {
        let xIndex = floor(map(mouseX, startingX, endingX, 0, sideLength));
        let yIndex = floor(map(mouseY, startingY, endingY, 0, sideLength));

        if (!(xIndex == 0 && yIndex == 0) && !(xIndex == sideLength - 1 && yIndex == sideLength - 1)) { //basic terrain
            if (tileArray[yIndex][xIndex].wall != wallSelected) {
                tileArray[yIndex][xIndex].wall = wallSelected;
                if (autoSolve) {
                    initMaze();
                    solveMaze();
                }
            }
        }
    }
}

function mouseClicked() {
    if (mouseY < tileSize * 1.5 + 3) {
        if (mouseX < tileSize * 1.5 + 3) {
            wallSelected = true;
        } else if (mouseX < tileSize * 1.5 * 2 + 6) {
            wallSelected = 0;
        }
    }
}

function keyReleased() {
    if (keyCode === 32) {
        if (wallSelected == true)
            wallSelected = false;
        else if (wallSelected == false)
            wallSelected = true;
    } else if (keyCode === 8) { //reset maze
        tileArray = [];
        setup();
    } else if (keyCode === 107) { //add size
        if (sideLength < 31) {
            sideLength += 2;
            setup();
        }
    } else if (keyCode === 109) { //subtract size
        if (sideLength > 5) {
            sideLength -= 2;
            setup();
        }
    } else if (keyCode === 82) { //restart maze solve
        initMaze();
    }
    return false; // prevent any default behavior
}
