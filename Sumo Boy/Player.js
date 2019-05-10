class Player {
    constructor(x, y, size) {
        this.speed = .3;
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);

        this.direction = 0;

        this.rayAmount = 16;
        this.rays = [];
        for (let i = 0; i < this.rayAmount; i++) {
            this.rays.push(new Ray(0, 0, i * (360 / this.rayAmount)));
            this.rays[this.rays.length - 1].visible = true;
        }
        this.g = new createjs.Shape();
        this.g.graphics.setStrokeStyle(1).beginStroke("black");
        this.fill = this.g.graphics.beginFill("red");
        this.g.graphics.drawCircle(0, 0, 30);

        stage.addChild(this.g)
    }

    update() {
        this.move();

        this.g.x = this.pos.x;
        this.g.y = this.pos.y;
    }

    move() {
        this.direction = new Vector(mouse.x, mouse.y).subtract(this.pos).angle();

        if (this.vel.length() != 0) {
            this.acc.multiplyScalar(1 / (this.vel.length() / this.speed));
            console.log(1 / (this.vel.length() / this.speed));
        }
        this.acc.rotate(this.direction);


        this.vel.add(this.acc);
        this.vel.multiplyScalar(0.99);
        this.pos.add(this.vel);

        this.acc.multiplyScalar(0);
    }
}
