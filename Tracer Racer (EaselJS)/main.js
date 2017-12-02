const overflow = 10000; //10k
const precision = 0.0001; // 10kths

let canvas;
let stage;
let displayStage;

let objects = [];
let terrain = [];
let car;

let mouse = {
    x: 0,
    y: 0,
    down: false
};
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
    stage.on("stagemousemove", moveCanvas);
    stage.on("stagemousedown", mousePressed);
    stage.on("stagemouseup", mouseReleased);

    stage.on("pressmove", moveCanvas);
    stage.on("pressup", mouseReleased);


    let terrainGraphics;

    for (let i = 0; i < terrainPos.length; i++) {
        if (terrainPos[i].newLine) {
            if (terrainGraphics) {
                displayStage.addChild(new createjs.Shape(terrainGraphics));
            }            
            
            lastLine.x = terrainPos[i].x;
            lastLine.y = terrainPos[i].y;

            terrainGraphics = new createjs.Graphics();
            terrainGraphics.setStrokeStyle(5).beginStroke("black")
            terrainGraphics.moveTo(lastLine.x, lastLine.y);            
        } else {
            terrain.push(new Border(terrainPos[i].x, terrainPos[i].y));
            terrainGraphics.lineTo(terrainPos[i].x, terrainPos[i].y);
        }
    }
    displayStage.addChild(new createjs.Shape(terrainGraphics));


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
    guideLines.graphics.setStrokeStyle(5).beginStroke("black");
    guideLines.graphics.moveTo(0, 0).lineTo(4800, 0).lineTo(4800, 3000).lineTo(0, 3000).lineTo(0, 0);
    guideLines.graphics.moveTo(0, 1000).lineTo(4800, 1000);
    guideLines.graphics.moveTo(0, 2000).lineTo(4800, 2000);

    guideLines.graphics.moveTo(1600, 0).lineTo(1600, 3000);
    guideLines.graphics.moveTo(3200, 0).lineTo(3200, 3000);
    guideLines.alpha = 0.5;
    
    displayStage.addChild(guideLines);

    displayStage.cache(-2.5, -2.5, 4805, 3005);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.on("tick", tick);
}

function tick(e) {
    score.children[0].text = car.loops;
    score.children[1].text = Math.round(car.currentTime * 100) / 100;
    score.children[2].text = car.bestTime;

    // camera(car.pos.x - width / 2, car.pos.y - height / 2, 0, 0, 0, 0, 1, 0)
    ///displayStage.x = car.pos.x - canvas.width / 2;
    ///displayStage.y = car.pos.y - canvas.height / 2;
    displayStage.x = -1 * (car.pos.x - canvas.width / 2);
    displayStage.y = -1 * (car.pos.y - canvas.height / 2);


    //stroke("white");
    //line(50, 600, 430, 600);

    if (mouse.down || pressedDown) {
        car.acc.y -= car.speed;
    }

    let mouseVec = new Vector(mouse.x, mouse.y);

    mouseVec.x -= canvas.width / 2;
    mouseVec.y -= canvas.height / 2;
    car._angle = mouseVec.angle() + Math.PI / 2;

    car.process(terrain);
    car.draw();

    localStorage.setItem("x", car.pos.x);
    localStorage.setItem("y", car.pos.y);

    stage.update(event);
}


function moveCanvas(e) {
    mouse.x = e.stageX;
    mouse.y = e.stageY;
}

function mousePressed(e) {
    mouse.down = true;
}

function mouseReleased(e) {
    mouse.down = false;
}

onkeydown = onkeyup = function (e) {
    e = e || event; // to deal with IE
    keys[e.keyCode] = e.type == 'keydown';
    if (e.keyCode = 32 && keys[32]) {
        car.vel.multiply(0);
        car.pos.x = 260;
        car.pos.y = 600;
        car.angle = 0;
    }
}
window.addEventListener('touchstart', function () {
    mouse.down = true;
});

window.addEventListener('touchend', function () {
    mouse.down = false;
});

//window.addEventListener('touchmove', function(e){e.preventDefault()});
