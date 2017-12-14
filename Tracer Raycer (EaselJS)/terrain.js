let leftIndex = 9;

let terrainPos = [
    //left wall
    {
        newLine: true,
        x: 50,
        y: 600,
    },
    {
        x: 141,
        y: 283
    },
    {
        x: 301,
        y: 171
    },
    {
        x: 498,
        y: 102
    },
    {
        x: 798,
        y: 82
    },
    {
        x: 1000,
        y: 70
    },
    {
        x: 1400,
        y: 80
    },
    {
        x: 1800,
        y: 150
    },
    {
        x: 2400,
        y: 150
    },
    {
        x: 2750,
        y: 450
    },
    {
        x: 3100,
        y: 530
    },
    {
        x: 3400,
        y: 460
    },
    {
        x: 3700,
        y: 460
    },
    {
        x: 3900,
        y: 540
    },
    {
        x: 4200,
        y: 740
    },
    {
        x: 4400,
        y: 1100
    },
    {
        x: 4450,
        y: 1400
    },
    {
        x: 4400,
        y: 1700
    },
    {
        x: 4300,
        y: 1900
    },
    {
        x: 4000,
        y: 2100
    },
    {
        x: 3700,
        y: 2150
    },
    {
        x: 3590,
        y: 2700
    },
    {
        x: 3000,
        y: 2820
    },
    {
        x: 2700,
        y: 2750
    },
    {
        x: 2500,
        y: 2650
    },
    {
        x: 2400,
        y: 2400
    },
    {
        x: 2380,
        y: 2000
    },
    {
        x: 2360,
        y: 1970
    },
    {
        x: 2230,
        y: 1930
    },
    {
        x: 2100,
        y: 1970
    },
    {
        x: 2200,
        y: 2300
    },
    {
        x: 2100,
        y: 2550
    },
    {
        x: 1850,
        y: 2750
    },
    {
        x: 1590,
        y: 2800
    },
    {
        x: 1280,
        y: 2790
    },
    {
        x: 1000,
        y: 2680
    },
    {
        x: 750,
        y: 2500
    },
    {
        x: 520,
        y: 2100
    },
    {
        x: 520,
        y: 1700
    },
    {
        x: 200,
        y: 1300
    },
    {
        x: 100,
        y: 950
    },
    {
        x: 50,
        y: 600
    },





    //right wall
    {
        newLine: true,
        x: 430,
        y: 600,
    },
    {
        x: 460,
        y: 426
    },
    {
        x: 640,
        y: 290
    },
    {
        x: 799,
        y: 256
    },
    {
        x: 1200,
        y: 250
    },
    {
        x: 1500,
        y: 300
    },
    {
        x: 1700,
        y: 370
    },
    {
        x: 2100,
        y: 340
    },
    {
        x: 2300,
        y: 370
    },
    {
        x: 2470,
        y: 540
    },
    {
        x: 2700,
        y: 670
    },
    {
        x: 3100,
        y: 730
    },
    {
        x: 3600,
        y: 700
    },
    {
        x: 3950,
        y: 920
    },
    {
        x: 4080,
        y: 1200
    },
    {
        x: 4100,
        y: 1500
    },
    {
        x: 4030,
        y: 1700
    },
    {
        x: 3800,
        y: 1850
    },
    {
        x: 3500,
        y: 1950
    },
    {
        x: 3400,
        y: 2450
    },
    {
        x: 3000,
        y: 2530
    },
    {
        x: 2800,
        y: 2520
    },
    {
        x: 2670,
        y: 2400
    },
    {
        x: 2580,
        y: 1950
    },
    {
        x: 2420,
        y: 1600
    },
    {
        x: 2200,
        y: 1500
    },
    {
        x: 2000,
        y: 1530
    },
    {
        x: 1830,
        y: 1720
    },
    {
        x: 1830,
        y: 1900
    },
    {
        x: 1930,
        y: 2220
    },
    {
        x: 1750,
        y: 2430
    },
    {
        x: 1500,
        y: 2520
    },
    {
        x: 1300,
        y: 2470
    },
    {
        x: 1100,
        y: 2350
    },
    {
        x: 1030,
        y: 2100
    },
    {
        x: 1090,
        y: 1800
    },
    {
        x: 1030,
        y: 1450
    },
    {
        x: 860,
        y: 1180
    },
    {
        x: 630,
        y: 950
    },
    {
        x: 430,
        y: 600
    },






    {
        newLine: true,
        x: 790,
        y: 1900,
    },
    {
        x: 700,
        y: 1760
    },
    {
        x: 680,
        y: 1680
    },
    {
        x: 700,
        y: 1550
    },
    {
        x: 780,
        y: 1650
    },
    {
        x: 810,
        y: 1730
    },
    {
        x: 790,
        y: 1900
    },


];


//detect new
let clicks = 0;
let startPos = {
    x: 0,
    y: 0
};
let endPos = {
    x: 0,
    y: 0
};

function mouseClicked() {
    clicks = 2;
    if (clicks == 1) {
        startPos.x = mouseX;
        startPos.y = mouseY;
    } else if (clicks == 2) {
        endPos.x = mouseX;
        endPos.y = mouseY;


        //terrainPos.splice(leftIndex + 1, 0, {x: mouseX + car.pos.x - width / 2, y: mouseY + car.pos.y - height / 2});
        //graphics
        //terrain.push(new Border(terrainPos[leftIndex + 1].x1, terrainPos[leftIndex + 1].y1, terrainPos[leftIndex + 1].x, terrainPos[leftIndex + 1].y))

        leftIndex++;
        console.log("x: " + (mouseX - car.pos.x) + "\ny: " + (mouseY - car.pos.y));
        clicks = 0;
    }
}

class TerrainObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
