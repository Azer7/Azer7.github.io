class Player {
    constructor(x, y, size) {
        this.speed = .35; 
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);

        this.rayAmount = 16;
        this.rays = [];
        for (let i = 0; i < this.rayAmount; i++)
            this.rays.push(new Ray(0, 0, i * (360 / this.rayAmount)));

        this.g = new createjs.Shape();
        this.g.graphics.setStrokeStyle(1).beginStroke("black");
        this.fill = this.g.graphics.beginFill("red");
        this.g.graphics.drawCircle(0,0,30);
        
        stage.addChild(this.g)
    }
}
