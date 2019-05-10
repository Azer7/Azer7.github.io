class Car {
    constructor(x, y, rayAmount) {
        this.speed = .35;
        this.slowDown = 1;
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this._angle = 0;
        this.crashed = false;

        this.forwardWay = true;
        this.startDate = new Date().getTime() + 2000;
        this.currentTime = -2;
        this.bestTime = "N/A";
        this.loops = 0;
        this.rayNum = rayAmount;
        this.rays = [];

        this.animationValue = 0;

        for (let i = 0; i < rayAmount; i++) {
            this.rays.push(new Ray(0, 0, i * (360 / rayAmount)));

        }
        //  this.g = new createjs.Bitmap("./Assets/Police.png");
        //    this.g.regX = 128;
        //  this.g.regY = 128;
        //    this.g.scaleX = .36;
        //    this.g.scaleY = .36;

        this.g = new createjs.Sprite(policeSpriteSheet, "car");
        this.g.scaleX = .35;
        this.g.scaleY = .35;

        //this.g = new createjs.Shape();
        //this.g.graphics.setStrokeStyle(1).beginStroke("black");
        //this.fill = this.g.graphics.beginFill("red").command;
        //this.g.graphics.drawRect(-15, -25, 30, 50);
        stage.addChild(this.g);
    }

    get angle() {
        let inDegrees = this._angle * 180 / Math.PI;
        return inDegrees; //5 decimals of precision
    }
    set angle(degrees) {
        //change to radians
        //360 - degrees to switch it from clockwise to counter clockwise
        if (!this.crashed)
            this._angle = degrees * Math.PI / 180;
    }

    process(objArr) {
        this.currentTime += 0.016;
        if (this.currentTime > 0) {
            this.currentTime = (new Date().getTime() - car.startDate) / 1000;

            //add movement
            this.acc.rotate(this._angle);
            this.vel.add(this.acc.divideScalar(this.slowDown));
            if (this.acc.x == 0 && this.acc.y == 0) {
                this.vel.multiplyScalar(.88);
            } else {
                this.vel.multiplyScalar(.985);
            }
            if (this.pos.x > 50 && this.pos.x < 430 && this.pos.y >= 600 && this.pos.y + this.vel.y < 600) {
                if (this.forwardWay) {
                    this.startDate = new Date().getTime();
                    if (this.loops == 0 || this.currentTime < this.bestTime)
                        this.bestTime = this.currentTime;

                    this.loops++;
                }
                else {
                    this.forwardWay = true;
                    this.startDate = new Date().getTime();
                }
            } else if (this.pos.x > 50 && this.pos.x < 430 && this.pos.y <= 600 && this.pos.y + this.vel.y > 600) {
                this.forwardWay = false;
            }
                this.pos.add(this.vel);
            this.acc.multiplyScalar(0); // only do once            

            //process rays
            //            for (let i = 0; i < this.rays.length; i++) {
            //                this.rays[i].pos = this.pos;
            //                this.rays[i]._angle = this._angle + this.rays[i].baseAngle;
            //            }
            let totalVector = new Vector(0, 0);

            for (let i = 0; i < this.rays.length; i++) {

                this.rays[i].pos = this.pos;
                this.rays[i].checkCollisions(objArr);
                //calculate collision bounce back direction
                let largestVector = new Vector(-1, this.rays[i].slope);
                if (this.rays[i].angle > 270 || this.rays[i].angle < 90) {
                    largestVector.x = 1;
                }

                if (this.rays[i].angle > 90 && this.rays[i].angle <= 270)
                    largestVector.y *= -1;

                //same as setMag to get actually distance to move back
                largestVector.multiplyScalar(this.rays[i].maxLength / largestVector.length());
                //this.speed / 10 to get how much of the bounce back vector to move
                let pushVector = new Vector(0, 0);
                pushVector.x = (this.speed / 1) * (largestVector.x - (this.rays[i].posEnd.x - this.rays[i].pos.x))
                pushVector.y = (this.speed / 1) * (largestVector.y - (this.rays[i].posEnd.y - this.rays[i].pos.y));
                this.vel.subtract(pushVector);

                totalVector.add(pushVector);
                //if (this.rays[i].length < 10)
                //   this.crashed = true;
            }
            if (totalVector.length() > precision)
                car.vel.multiplyScalar(.6);
            car.slowDown = 1 + totalVector.length();
        } else {
            car.vel.multiplyScalar(0);
            car.acc.multiplyScalar(0);
        }
    }

    draw() {
        //draw rays
        //Ray.preDraw();
        //for (let i = 0; i < this.rays.length; i++) {
        //    this.rays[i].draw();
        //}

        //draw car
        this.g.x = canvas.width / 2;
        this.g.y = canvas.height / 2;
        this.g.rotation = this.angle;
        //if (this.forwardWay)
        //  this.fill.style = "#999999";
        //else
        //  this.fill.style = "#c04000";
    }
}
