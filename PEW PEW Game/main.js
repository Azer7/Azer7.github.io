"use strict";
let canvas;
let stage;
let width = window.innerWidth,
    height = window.innerHeight + 1;

let wScl = width / 800,
    hScl = height / 640;
let mouse = new Vector(0, 0);
let mouseDown = false;

let lessLag = false;

let keys = [];

const overflow = 10000; //10k
const precision = 0.0001; // 10kths

let elapsedTicks = 0;
let enemies = 0;
let enemyFrequency;
let objects = [];
let player;
let playerSpriteSheet;
let zombieSpriteSheet;
let playerHud;
let background;

let score = 0;
let scoreLabel;
//
let fpsLabel;
let blurBackground;
let shopGui;
let cash = 0;
let cashLabel;
let playButton;

let leftButton;
let rightButton;

let gunImg;
let gunContainer = new createjs.Container();
let gunIndex = 0;
let guns = [];

guns.push(new Laser("Terry's Trash Taser", 3.33, 4, 0, 1.2, "The result of 6 years of pole-dancing", "no-speciallyness", {
    c: createjs.Graphics.getRGB(180, 0, 30, .9),
    s: 5
}, {
        x: 139,
        y: 6,
        w: 42,
        h: 28
    }));
guns[0].bought = true;

guns.push(new Laser("Alpha v0.1 Laser", 4, 6, 21.01, 1, "Always better than the full release", "no-speciallyness", {
    c: createjs.Graphics.getRGB(140, 50, 30, .9),
    s: 6
}, {
        x: 97,
        y: 5,
        w: 42,
        h: 26
    }));

guns.push(new Gun("Grandma's Gun", 7, 9, 55, .7, "Used to protect herself from the wolf", "no-speciallyness", {
    c: createjs.Graphics.getRGB(91, 107, 6, .9),
    s: 6
}, {
        x: 42,
        y: 34.6,
        w: 56,
        h: 20
    }));

guns.push(new Laser("Alien Dispatcher", 24, 25, 121, 1.2, "911, an alien showed up at my door", "no-speciallyness", {
    c: createjs.Graphics.getRGB(89, 255, 119, .7),
    s: 6
}, {
        x: 72,
        y: 57.5,
        w: 40,
        h: 24
    }));

guns.push(new Laser("Butt Blaster", 40, 33, 432, .9, "Man that's a stinky one", "no-speciallyness", {
    c: createjs.Graphics.getRGB(109, 60, 20, .7),
    s: 6
}, {
        x: 1,
        y: 60,
        w: 70,
        h: 30
    }));

guns.push(new Laser("Fire Extinguisher", 66, 44, 666, .9, "Burn Baby Burn", "Burnemup dot", {
    c: createjs.Graphics.getRGB(222, 66, 6, .7),
    s: 12
}, {
        x: 1,
        y: 135,
        w: 52,
        h: 16
    }));

guns.push(new Laser("Flamer Gamer", 0, 0, 0.1, 2.5, "hey, you, fix your shit -Ji Won", "Downfall: The League got the best of him", {
    c: createjs.Graphics.getRGB(222, 222, 22, .5),
    s: 800
}, {
        x: 1,
        y: 115,
        w: 56,
        h: 21
    }));

let upgrades = [];
//Damage upgrade
upgrades.push(new Upgrade("Damage", 40, (lvl) => 1 + 0.08 * lvl));
//Pierce value
upgrades.push(new Upgrade("Pierce", 20, (lvl) => .8 + 0.01 * lvl));
//Max Health upgrade
upgrades.push(new Upgrade("Health", 50, (lvl) => 100 + 30 * lvl));
//Player speed upgrade
upgrades.push(new Upgrade("Speed", 15, (lvl) => .5 + 0.03 * lvl));
//Player Max Energy upgrade
upgrades.push(new Upgrade("Max Energy", 50, (lvl) => 100 + Math.pow(40 * lvl, 1.2)));
//Player Max Boost upgrade
upgrades.push(new Upgrade("Max Boost", 50, (lvl) => 100 + 30 * lvl));
//Player Boost Recharge upgrade
upgrades.push(new Upgrade("Boost Recharge", 20, (lvl) => .5 + 0.05 * lvl));
//Player Boost Speed upgrade
upgrades.push(new Upgrade("Boost Speed", 15, (lvl) => .9 + 0.06 * lvl));
//Player Energy Recharge upgrade
upgrades.push(new Upgrade("Energy Recharge", 40, (lvl) => 3 + Math.floor(Math.pow(lvl, 1.3) * 10) / 10));
//Game Income multiplier upgrade
upgrades.push(new Upgrade("Income", 15, (lvl) => 1 + 0.25 * lvl));
//Game Zombie spawn rate upgrade
upgrades.push(new Upgrade("Zombie Rate", 25, (lvl) => 1 + 0.05 * lvl));
//Zombie Speed (slowdown) upgrade
upgrades.push(new Upgrade("Zombie Speed", 20, (lvl) => 1 - Math.sqrt(lvl) * 0.08));


function init() {
    canvas = document.getElementById("game");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight + 1;
    stage = new createjs.Stage(canvas);

    //player stuff
    stage.addEventListener("stagemousemove", moveCanvas);
    stage.addEventListener("stagemousedown", mousePressed);
    stage.addEventListener("stagemouseup", mouseReleased);

    let playerFrames = [];
    for (let i = 0; i < 40; i++) { //idle and move
        playerFrames.push([2 + i * 313, 2, 312, 206, 0, 116, 123]);
    }
    for (let i = 0; i < 20; i++) { //reload
        playerFrames.push([12522 + i * 322, 2, 322, 217, 0, 116, 123]);
    }
    for (let i = 0; i < 20; i++) { //shoot
        playerFrames.push([18962 + i * 313, 2, 312, 206, 0, 116, 123]);
    }

    playerSpriteSheet = new createjs.SpriteSheet({
        framerate: 30,
        "images": ["Sprites/player-gun-anims.png"],
        "frames": playerFrames,
        // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        "animations": {
            "idle": [0, 19, "idle", .2],
            "move": [20, 39, "idle", .5],
            "reload": [40, 59, "reload", .5],
            "shoot": {
                frames: [61],
                next: "",
                speed: 0.5
            },
            "unshoot": {
                frames: [61, 62],
                next: "idle",
                speed: 0.5
            }
        }
    });

    background = new createjs.Bitmap("Sprites/grass-background.png");
    background.scaleX = wScl;
    background.scaleY = hScl;
    gameAssets.addChild(background);

    zombieSpriteSheet = new createjs.SpriteSheet({
        framerate: 30,
        "images": ["Sprites/zombie-animations.png"],
        "frames": {
            width: 288,
            height: 311,
            regX: 110,
            regY: 165,
            count: 17,
            spacing: 2,
            margin: 1
        },
        "animations": {
            "move": [0, 16, "move", .32],
        }
    });

    //add game collision stuff
    //objects.push(new Border(0, 0, width, 200, true));

    player = new Player(220, 350);

    playerHud = new createjs.Bitmap("Sprites/playerHud.png");
    playerHud.x = 2 * hScl;
    playerHud.y = 2 * hScl;
    playerHud.scaleX = .7 * hScl;
    playerHud.scaleY = .7 * hScl;
    playerHud.shadow = new createjs.Shadow("#000000", .3, .3, 4);
    gameAssets.addChild(playerHud);

    scoreLabel = new createjs.Text("", "bold " + 37 * hScl + "px Arial", "#FFF");
    scoreLabel.textAlign = "center";
    scoreLabel.textBaseline = "middle";
    scoreLabel.x = 44 * hScl;
    scoreLabel.y = 46 * hScl;
    gameAssets.addChild(scoreLabel);

    //get ready for shop setup q.q
    //state 2 
    blurBackground = new createjs.Shape();
    blurBackground.graphics.setStrokeStyle(1);
    blurBackground.graphics.beginFill(createjs.Graphics.getRGB(10, 10, 50, .6));
    blurBackground.graphics.drawRect(0, 0, width, height);
    shopAssets.addChild(blurBackground);

    shopGui = new createjs.Bitmap("Sprites/bShopGui.png");
    shopGui.scaleX = .952 * hScl;
    shopGui.scaleY = .952 * hScl;
    shopGui.x = (width - 609.28 * hScl) / 2;
    shopGui.shadow = new createjs.Shadow("#000000", 4, 4, 8);
    shopAssets.addChild(shopGui);

    //create gun container
    //gun change upgrade (top box)
    let gunBackground = new createjs.Shape();
    gunBackground.graphics.setStrokeStyle(1);
    gunBackground.graphics.beginStroke(createjs.Graphics.getRGB(10, 50, 255, 1));
    gunBackground.graphics.beginFill(createjs.Graphics.getRGB(120, 120, 130, 1));
    gunBackground.graphics.drawRoundRect(0, 0, 400 * hScl, 95 * hScl, 7 * hScl);
    gunContainer.addChild(gunBackground);

    gunImg = new createjs.Bitmap("Sprites/guns.png");
    gunImg.snapToPixel = false;
    gunContainer.addChild(gunImg);

    leftButton = new Button(() => {
        updateGun(gunIndex - 1)
    }, () => { });
    leftButton.bubbly = false;
    rightButton = new Button(() => {
        updateGun(gunIndex + 1)
    }, () => { });
    rightButton.bubbly = false;

    let leftArrow = new createjs.Shape();
    leftArrow.graphics.setStrokeStyle(1);
    leftArrow.graphics.beginStroke(createjs.Graphics.getRGB(10, 50, 50, 1));
    leftButton.buttonColor = leftArrow.graphics.beginFill(createjs.Graphics.getRGB(0, 0, 0, 1)).command;
    leftButton.hoverColor = createjs.Graphics.getRGB(30, 30, 30, 1);
    leftButton.unhoverColor = createjs.Graphics.getRGB(0, 0, 0, 1);
    leftArrow.graphics.drawPolyStar(27 * hScl, 31 * hScl, 15 * hScl, 3, 0, 180);

    leftButton.container.addChild(leftArrow);

    let rightArrow = new createjs.Shape();
    rightArrow.graphics.setStrokeStyle(1);
    rightArrow.graphics.beginStroke(createjs.Graphics.getRGB(10, 50, 50, 1));
    rightButton.buttonColor = rightArrow.graphics.beginFill(createjs.Graphics.getRGB(0, 0, 0, 1)).command;
    rightButton.hoverColor = createjs.Graphics.getRGB(30, 30, 30, 1);
    rightButton.unhoverColor = createjs.Graphics.getRGB(0, 0, 0, 1);
    rightArrow.graphics.drawPolyStar(150 * hScl, 31 * hScl, 15 * hScl, 3);

    rightButton.container.addChild(rightArrow);

    let equipContainer = new Button(() => {
        equipGun();
    }, () => { });

    let equipButton = new createjs.Shape();
    equipButton.graphics.setStrokeStyle(1);
    equipButton.graphics.beginStroke(createjs.Graphics.getRGB(10, 50, 255, 1));
    equipContainer.buttonColor = equipButton.graphics.beginFill(createjs.Graphics.getRGB(109, 121, 143, 1)).command;
    equipButton.graphics.drawRoundRect(0, 0, 94 * hScl, 26 * hScl, 7 * hScl);

    let equipText = new createjs.Text("Equip", "bold " + 16.5 * hScl + "px Arial", "#FFF");
    equipText.textAlign = "center";
    equipText.textBaseline = "middle";
    equipText.x = 47 * hScl;
    equipText.y = 12 * hScl;

    equipContainer.container.addChild(equipButton);
    equipContainer.container.addChild(equipText);
    equipContainer.container.x = 88 * hScl;
    equipContainer.container.y = 72 * hScl;
    equipContainer.container.regX = 47 * hScl;
    equipContainer.container.regY = 13 * hScl;

    //gun container wrapper
    gunContainer.addChild(leftButton.container);
    gunContainer.addChild(rightButton.container);
    gunContainer.addChild(equipContainer.container);

    //add gun text n stuff
    let gunName = new createjs.Text("Terry's Trash Taser", "bold " + 15 * hScl + "px Arial", "#FFF");
    gunName.textAlign = "center";
    gunName.textBaseline = "middle";
    gunName.x = 281 * hScl;
    gunName.y = 14 * hScl;

    let gunStats = new createjs.Text("Damage: 4    Energy Cost: 4", "bold " + 12 * hScl + "px Arial", "#FFF");
    gunStats.textAlign = "center";
    gunStats.textBaseline = "middle";
    gunStats.x = 281 * hScl;
    gunStats.y = 33 * hScl;

    let gunSpeed = new createjs.Text("Speed Multiplier: 1.2x", "bold " + 12 * hScl + "px Arial", "#FFF");
    gunSpeed.textAlign = "center";
    gunSpeed.textBaseline = "middle";
    gunSpeed.x = 281 * hScl;
    gunSpeed.y = 50 * hScl;

    let gunText = new createjs.Text("“The result of 6 years of pole-dancing”", "bold " + 11 * hScl + "px Arial", "#FFF");
    gunText.textAlign = "center";
    gunText.textBaseline = "middle";
    gunText.x = 281 * hScl;
    gunText.y = 66 * hScl;

    let gunSpecial = new createjs.Text("no-speciallyness", "bold " + 11 * hScl + "px Arial", "#FFF");
    gunSpecial.textAlign = "center";
    gunSpecial.textBaseline = "middle";
    gunSpecial.x = 281 * hScl;
    gunSpecial.y = 81 * hScl;


    gunContainer.addChild(gunName);
    gunContainer.addChild(gunStats);
    gunContainer.addChild(gunSpeed);
    gunContainer.addChild(gunText);
    gunContainer.addChild(gunSpecial);

    gunContainer.x = shopGui.x + 36 * hScl;
    gunContainer.y = 22 * hScl;
    shopAssets.addChild(gunContainer);

    cashLabel = new createjs.Text("฿" + cash, "bold 125px Arial", "#FFF");
    cashLabel.font = "bold " + 38 * (Math.sqrt(210 / cashLabel.getBounds().width)) + "px Arial";

    cashLabel.textAlign = "center";
    cashLabel.textBaseline = "middle";
    cashLabel.x = shopGui.x + 500 * hScl;
    cashLabel.y = 67 * hScl;
    shopAssets.addChild(cashLabel);

    playButton = new Button(() => { }, () => {
        setupGame()
    });
    let button = new createjs.Shape();
    button.graphics.setStrokeStyle(1 * hScl);
    button.graphics.beginStroke(createjs.Graphics.getRGB(10, 50, 255, 1));
    playButton.buttonColor = button.graphics.beginFill(createjs.Graphics.getRGB(109, 121, 143, 1)).command;
    button.graphics.drawRoundRect(0, 0, 200 * hScl, 66 * hScl, 7 * hScl);

    let playText = new createjs.Text("~Play~", "bold " + 25.5 * hScl + "px Arial", "#FFF");
    playText.textAlign = "center";
    playText.textBaseline = "middle";
    playText.x = 100 * hScl;
    playText.y = 33 * hScl;

    playButton.container.addChild(button);
    playButton.container.addChild(playText);
    playButton.container.x = shopGui.x + 304 * hScl;
    playButton.container.y = 585 * hScl;
    playButton.container.regX = 100 * hScl;
    playButton.container.regY = 33 * hScl;

    shopAssets.addChild(playButton.container);

    //upgrades
    for (let i = 0; i < upgrades.length; i++) {
        let button;
        let nameText;
        let levelText;
        let statText;
        let costText;

        //upgrades
        button = new createjs.Shape();
        button.graphics.setStrokeStyle(1 * hScl);
        button.graphics.beginStroke(createjs.Graphics.getRGB(10, 50, 255, 1));
        upgrades[i].buttonColor = button.graphics.beginFill(createjs.Graphics.getRGB(109, 121, 143, 1)).command;
        button.graphics.drawRoundRect(0, 0, 120 * hScl, 114 * hScl, 7 * hScl);

        //button.shadow = new createjs.Shadow("#000000", 2, 2, 16);
        nameText = new createjs.Text(upgrades[i].name, "bold 11.5px Arial", "#FFF");
        nameText.font = "bold " + 11.5 * (Math.sqrt(100 / nameText.getBounds().width)) * hScl + "px Arial";
        nameText.textAlign = "center";
        nameText.textBaseline = "middle";
        nameText.x = 59 * hScl;
        nameText.y = 20 * hScl;

        levelText = new createjs.Text("Lvl: " + upgrades[i].level, "bold 15.5px Arial", "#FFF");
        levelText.font = "bold " + 11.5 * (Math.sqrt(100 / levelText.getBounds().width)) * hScl + "px Arial";
        levelText.textAlign = "center";
        levelText.textBaseline = "middle";
        levelText.x = 59 * hScl;
        levelText.y = 45 * hScl;

        if (upgrades[i].name == "Damage" || upgrades[i].name == "Income" || upgrades[i].name == "Zombie Rate" || upgrades[i].name == "Zombie Mult.") {
            statText = new createjs.Text(Math.floor(upgrades[i].getValue(upgrades[i].level) * 100) / 100 + "x ⇒ " + Math.floor(upgrades[i].getValue(upgrades[i].level + 1) * 100) / 100 + "x", "bold 15.5px Arial", "#FFF");

        } else {
            statText = new createjs.Text(Math.floor(upgrades[i].getValue(upgrades[i].level) * 100) / 100 + " ⇒ " + Math.floor(upgrades[i].getValue(upgrades[i].level + 1) * 100) / 100, "bold 15.5px Arial", "#FFF");
        }
        statText.font = "bold " + 11.5 * (Math.sqrt(100 / statText.getBounds().width)) * hScl + "px Arial";
        statText.textAlign = "center";
        statText.textBaseline = "middle";
        statText.x = 59 * hScl;
        statText.y = 70 * hScl;


        costText = new createjs.Text("฿" + upgrades[i].getCost(upgrades[i].level), "bold 12px Arial", "#FFF");
        costText.font = "bold " + 12 * (Math.sqrt(100 / costText.getBounds().width)) * hScl + "px Arial";
        costText.textAlign = "center";
        costText.textBaseline = "middle";
        costText.x = 59 * hScl;
        costText.y = 94 * hScl;

        upgrades[i].container.addChild(button);
        upgrades[i].container.addChild(nameText);
        upgrades[i].container.addChild(levelText);
        upgrades[i].container.addChild(statText);
        upgrades[i].container.addChild(costText);
        upgrades[i].container.x = shopGui.x + (95 + 140 * (i % 4)) * hScl; //130 offset
        upgrades[i].container.y = (197 + 138 * Math.floor(i / 4)) * hScl; //125 offset
        upgrades[i].container.regX = 60 * hScl;
        upgrades[i].container.regY = 57 * hScl;

        shopAssets.addChild(upgrades[i].container);
    }

    //game run 
    mouse.x = stage.mouseX;
    mouse.y = stage.mouseY;

    stage.addChild(gameAssets);
    stage.addChild(shopAssets);

    // add a text object to output the current FPS:
    fpsLabel = new createjs.Text("- fps", "bold " + 14 * hScl + "px Arial", "#FFF");
    stage.addChild(fpsLabel);
    fpsLabel.x = width - 70 * hScl;
    fpsLabel.y = 20 * hScl;

    //setupGame();
    setupShop();
    // start the tick and point it at the window so we can do some work before updating the stage:
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tick);
}

function tick(e) {
    elapsedTicks++;
    if (gameState == 1) {
        mainGame(e);
    } else if (gameState == 2) { //show score screen
        shop(e);
    } else if (gameState == 3) { //show shop

    }
    fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";
    stage.update(event);
}

function moveCanvas(e) {
    mouse.x = e.stageX;
    mouse.y = e.stageY;
}

function mousePressed(e) {
    mouseDown = true;
    if (gameState == 1) {
        player.sprite.gotoAndPlay("shoot");
        player.shooting = true;
    }
}

function mouseReleased(e) {
    mouseDown = false;
    if (gameState == 1 && player.shooting) {
        player.sprite.gotoAndPlay("unshoot");
        player.shooting = false;
    }
}

onkeydown = onkeyup = function(e) {
    e = e || event; // to deal with IE
    keys[e.keyCode] = e.type == 'keydown';
    if (e.keyCode == 32) {
        if (keys[32]) { //press shield
            if (gameState == 1) {
                player.boosting = true;
                player.speed = player.boostSpeed;
                player.boostG.visible = true;
            }
        } else { //release shield
            if (gameState == 1) {
                player.boosting = false;
                player.speed = player.baseSpeed;
                player.boostG.visible = false;
            }
        }
    } else if (e.keyCode == 76 && keys[76]) {
        lessLag = !lessLag;
    }
}

window.onbeforeunload = closingCode;
function closingCode() {
    // do something...
    return null;
}