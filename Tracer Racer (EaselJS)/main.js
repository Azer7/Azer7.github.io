const overflow = 10000; //10k
const precision = 0.0001; // 10kths

let canvas;
let stage;
let displayStage;

let objects = [];
let terrain = [];
let car;

let mouse = new Vector();
let mouseDown = false;
let keys = [];


let score = new createjs.Container();

let pressedDown = false;

function init() {
    canvas = document.getElementById("game");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stage = new createjs.Stage(canvas);
    displayStage = new createjs.Container();
    stage.addChild(displayStage);
    //player stuff
    stage.addEventListener("stagemousemove", moveCanvas);
    stage.addEventListener("stagemousedown", mousePressed);
    stage.addEventListener("stagemouseup", mouseReleased);

    for (let i = 0; i < terrainPos.length; i++) {
        terrain.push(new Border(terrainPos[i].x, terrainPos[i].y, terrainPos[i].newLine));
    }

    lastLine.x = terrainPos[leftIndex].x2;
    lastLine.y = terrainPos[leftIndex].y2;

    // terrain.push(new Border(terrain));

    ray = new Ray(canvas.width / 2, canvas.height / 2, 270); //x, y, angle
    //car = new Car(3700, 1000, 12);
    if (localStorage.getItem("x") && localStorage.getItem("y"))
        car = new Car(parseFloat(localStorage.getItem("x")), parseFloat(localStorage.getItem("y")), 12);
    else
        car = new Car(260, 600, 12);

    let loopLabel = new createjs.Text("", "bold 24px Arial", "#FFF");
    loopLabel.textAlign = "center";
    loopLabel.textBaseline = "middle";
    loopLabel.x = 40;
    loopLabel.y = 20;
    score.addChild(loopLabel);

    let currTimeLabel = new createjs.Text("", "bold 24px Arial", "#FFF");
    currTimeLabel.textAlign = "center";
    currTimeLabel.textBaseline = "middle";
    currTimeLabel.x = 40;
    currTimeLabel.y = 45;
    score.addChild(currTimeLabel);

    let bestTimeLabel = new createjs.Text("", "bold 24px Arial", "#FFF");
    bestTimeLabel.textAlign = "center";
    bestTimeLabel.textBaseline = "middle";
    bestTimeLabel.x = 40;
    bestTimeLabel.y = 70;
    score.addChild(bestTimeLabel);
    stage.addChild(score);

    let guideLines = new createjs.Shape();
    guideLines.graphics.setStrokeStyle(5).beginStroke("black")
    guideLines.graphics.moveTo(0, 0).lineTo(4800, 0).lineTo(4800, 3000).lineTo(0, 3000).lineTo(0, 0);
    guideLines.graphics.moveTo(0, 1000).lineTo(4800, 1000);
    guideLines.graphics.moveTo(0, 2000).lineTo(4800, 2000);

    guideLines.graphics.moveTo(1600, 0).lineTo(1600, 3000);
    guideLines.graphics.moveTo(3200, 0).lineTo(3200, 3000);

    displayStage.addChild(guideLines);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tick);
}

function tick(e) {
    score.children[0].text = car.loops;
    score.children[1].text = car.currentTime;
    score.children[2].text = car.bestTime;

   // camera(car.pos.x - width / 2, car.pos.y - height / 2, 0, 0, 0, 0, 1, 0)
    displayStage.x = car.pos.x + canvas.width / 2;
    displayStage.y = car.pos.y + canvas.height / 2;
    //stroke("white");
    //line(50, 600, 430, 600);

    //draw
    //for (let i = 0; i < objects.length; i++) {
    //    objects[i].draw();
    //}

    //for (let i = 0; i < terrain.length; i++) {
    //    terrain[i].draw();
    //}

    //let compression = 0;

    //if (mouseIsPressed || pressedDown) {
    //    car.acc.y -= car.speed;
    //}
    //if (keyIsDown(83)) {
    //    car.acc.y += car.speed * 0.5; //reverse
    //}
    //if (keyIsDown(65)) {
    //    car.angle -= 2 * (1 + car.vel.mag() / 40);

    //}
    //if (keyIsDown(68)) {
    //    car.angle += 2 * (1 + car.vel.mag() / 40);
    //}

    //let mouseVec = new Vector(mouseX, mouseY);

    //mouseVec.x -= width / 2;
    //mouseVec.y -= height / 2;
    //car._angle = mouseVec.heading() + Math.PI / 2;

    //car.process(terrain);
    //car.draw();

    //localStorage.setItem("x", car.pos.x);
    //localStorage.setItem("y", car.pos.y);

    stage.update(event);
}


function moveCanvas(e) {
    mouse.x = e.stageX;
    mouse.y = e.stageY;
}

function mousePressed(e) {
    mouseDown = true;
}

function mouseReleased(e) {
    mouseDown = false;
}

onkeydown = onkeyup = function (e) {
    e = e || event; // to deal with IE
    keys[e.keyCode] = e.type == 'keydown';
    if (e.keyCode = 32 && keys[32]) {
        car.vel.mult(0);
        car.pos.x = 260;
        car.pos.y = 600;
        car.angle = 0;
    }
}
window.addEventListener('touchstart', function () {
    mouseDown = true;
});

window.addEventListener('touchend', function () {
    mouseDown = false;
});

//window.addEventListener('touchmove', function(e){e.preventDefault()});