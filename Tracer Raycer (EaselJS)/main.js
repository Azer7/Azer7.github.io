const overflow = 10000; //10k
const precision = 0.0001; // 10kths

let canvas;
let stage;
let displayStage;

let objects = [];
let terrain = [];
let car;
let policeSpriteSheet;

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
    createjs.Touch.enable(stage);
    displayStage = new createjs.Container();
    stage.addChild(displayStage);
    //player stuff
    stage.on("stagemousemove", moveCanvas);
    stage.on("stagemousedown", mousePressed);
    stage.on("stagemouseup", mouseReleased);

    stage.on("pressmove", moveCanvas);
    stage.on("pressup", mouseReleased);


    console.log(canvas.width);
    console.log(canvas.height);


    //    let guideLines = new createjs.Shape();
    //    guideLines.graphics.setStrokeStyle(5).beginStroke("black");
    //    guideLines.graphics.moveTo(0, 0).lineTo(4800, 0).lineTo(4800, 3000).lineTo(0, 3000).lineTo(0, 0);
    //    guideLines.graphics.moveTo(0, 1000).lineTo(4800, 1000);
    //    guideLines.graphics.moveTo(0, 2000).lineTo(4800, 2000);
    //
    //    guideLines.graphics.moveTo(1600, 0).lineTo(1600, 3000);
    //    guideLines.graphics.moveTo(3200, 0).lineTo(3200, 3000);
    //    guideLines.alpha = 0.5;
    //
    let guideLines = new createjs.Shape();
    guideLines.graphics.setStrokeStyle(2).beginStroke("white");
    guideLines.graphics.moveTo(50, 600).lineTo(430, 600);
    displayStage.addChild(guideLines);

    let terrainGraphics;

    for (let i = 0; i < terrainPos.length; i++) {
        if (terrainPos[i].newLine) {
            if (terrainGraphics) {
                displayStage.addChild(new createjs.Shape(terrainGraphics));
            }

            lastLine.x = terrainPos[i].x;
            lastLine.y = terrainPos[i].y;

            terrainGraphics = new createjs.Graphics();
            terrainGraphics.setStrokeStyle(5, "round", "round").beginStroke("black")
            terrainGraphics.moveTo(lastLine.x, lastLine.y);
        } else {
            terrain.push(new Border(terrainPos[i].x, terrainPos[i].y));
            terrainGraphics.lineTo(terrainPos[i].x, terrainPos[i].y);
        }
    }
    displayStage.addChild(new createjs.Shape(terrainGraphics));

    lastLine.x = terrainPos[leftIndex].x2;
    lastLine.y = terrainPos[leftIndex].y2;

    policeSpriteSheet = new createjs.SpriteSheet({
        framerate: 30,
        "images": ["./Assets/Car.png", "./Assets/Black_viper.png", "./Assets/Police_animation/1.png", "./Assets/Police_animation/2.png", "./Assets/Police_animation/3.png", "./Assets/ambulance_animation/1.png", "./Assets/ambulance_animation/2.png", "./Assets/ambulance_animation/3.png"],
        "frames": [[0, 0, 256, 256, 0, 128, 128], [0, 0, 256, 256, 1, 128, 128], [0, 0, 256, 256, 2, 128, 128], [0, 0, 256, 256, 3, 128, 128], [0, 0, 256, 256, 4, 128, 128], [0, 0, 256, 256, 5, 128, 128], [0, 0, 256, 256, 6, 128, 128], [0, 0, 256, 256, 7, 128, 128]
        ],
        "animations": {
            "car": [0],
            "viper": [1],
            "police": [2, 4, "police", 0.1],
            "ambulance": [5, 7, "ambulance", 0.1]
        }
    });


    ray = new Ray(canvas.width / 2, canvas.height / 2, 270); //x, y, angle
    //car = new Car(3700, 1000, 12);
    //    if (localStorage.getItem("x") && localStorage.getItem("y"))
    //        car = new Car(parseFloat(localStorage.getItem("x")), parseFloat(localStorage.getItem("y")), 12);
    //    else
    car = new Car(260, 599, 12);

    let loopLabel = new createjs.Text("v1.2", "bold 24px Arial", "#FFF");
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

    displayStage.cache(-2.5, -2.5, 4805, 3005);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.on("tick", tick);
}

function tick(e) {
    score.children[0].text = car.loops;
    score.children[1].text = Math.round(car.currentTime * 100) / 100;
    score.children[2].text = car.bestTime;

    displayStage.x = -1 * (car.pos.x - canvas.width / 2);
    displayStage.y = -1 * (car.pos.y - canvas.height / 2);

    car.speed = 0.3;

    if (mouse.down || pressedDown || keys[16] || keys[32]) {
        car.acc.y -= car.speed / ((100 / 6) / e.delta);
    }

    let mouseVec = new Vector(mouse.x, mouse.y);

    mouseVec.x -= canvas.width / 2;
    mouseVec.y -= canvas.height / 2;
    car._angle = mouseVec.angle() + Math.PI / 2;

    car.process(terrain);
    car.draw();
    
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

onkeydown = function (e) {
    e = e || event; // to deal with IE
    keys[e.keyCode] = true;
    if (e.keyCode == 67) {
        car.animationValue++;
        car.animationValue = car.animationValue % 4;
        if (car.animationValue == 0) {
            car.g.gotoAndPlay("car");
        } else if (car.animationValue == 1) {
            car.g.gotoAndPlay("viper");
        } else if (car.animationValue == 2) {
            car.g.gotoAndPlay("police");
        } else if (car.animationValue == 3) {
            car.g.gotoAndPlay("ambulance");
        }
    } else if (keys[74] && keys[73] && keys[78] && keys[79] && keys[87]) {
        keys[74] = keys[73] = keys[78] = keys[79] = keys[87] = false;
        let cheat = prompt("what is yer cheet code skrb:", ">:(");
        if (cheat.toLocaleLowerCase() == "ji won sucks" || cheat.toLocaleLowerCase() == "jiwon sucks") {
            alert("scrub detected");
            terrain = [];
        }
    }
}

onkeyup = function (e) {
    e = e || event; // to deal with IE
    keys[e.keyCode] = false;
}
window.addEventListener('touchstart', function () {
    mouse.down = true;
});

window.addEventListener('touchend', function () {
    mouse.down = false;
});
