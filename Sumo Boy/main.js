let mouse = {
    x: 0,
    y: 0,
    down: false
};

let player;

function init() {
    canvas = document.getElementById("game");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight + 1;
    stage = new createjs.Stage(canvas);

    stage.on("stagemousemove", moveCanvas);
    stage.on("stagemousedown", mousePressed);
    stage.on("stagemouseup", mouseReleased);


    player = new Player(0, 0, 50);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.on("tick", tick);
}

function tick(e) {
    if(mouse.down) {
        player.acc.x = player.speed;
    }
    
    player.update()
    stage.update();
}

function mousePressed(e) {
    mouse.down = true;
}

function mouseReleased(e) {
    mouse.down = false;
}

function moveCanvas(e) {
    mouse.x = e.stageX;
    mouse.y = e.stageY;
}
