class Car {
    constructor(x, y, rayAmount) {
        this.speed = .3;
        this.slowDown = 1;
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this._angle = 0;
        this.crashed = false;

        this.forwardWay = true;
        this.startDate = new Date().getTime();
        this.currentTime = 0;
        this.bestTime = "N/A";
        this.loops = 0;

        this.rayNum = rayAmount;
        this.rays = [];

        for (let i = 0; i < rayAmount; i++)
            this.rays.push(new Ray(0, 0, i * (360 / rayAmount)));
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
        if (!this.crashed) {
            this.currentTime = (new Date().getTime() - car.startDate) / 1000;

            //add movement
            this.acc.rotate(this._angle);
            this.vel.add(this.acc.div(this.slowDown));
            if (this.acc.x == 0 && this.acc.y == 0) {
                this.vel.mult(.88);
            } else {
                this.vel.mult(.985);
            }            
            if (this.pos.x > 50 && this.pos.x < 430 && this.pos.y > 600 && this.pos.y + this.vel.y < 600) {
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
            } else if (this.pos.x > 50 && this.pos.x < 430 && this.pos.y < 600 && this.pos.y + this.vel.y > 600) {
                this.forwardWay = false;
            }
            this.pos.add(this.vel);
            this.acc.mult(0); // only do once
            this.currentTime += 0.016;

            //process rays
//            for (let i = 0; i < this.rays.length; i++) {
//                this.rays[i].pos = this.pos;
//                this.rays[i]._angle = this._angle + this.rays[i].baseAngle;
//            }
            let totalVector = createVector(0, 0);
            
            for (let i = 0; i < this.rays.length; i++) {
             
                this.rays[i].pos = this.pos;
               this.rays[i].checkCollisions(objArr);
                //calculate collision bounce back direction
                let largestVector = createVector(-1, this.rays[i].slope);
                if (this.rays[i].angle > 270 || this.rays[i].angle < 90) {
                    largestVector.x = 1;
                }

                if (this.rays[i].angle > 90 && this.rays[i].angle <= 270)
                    largestVector.y *= -1;

                //same as setMag to get actually distance to move back
                largestVector.mult(this.rays[i].maxLength / largestVector.mag());
                //this.speed / 10 to get how much of the bounce back vector to move
                let pushVector = createVector(0, 0);
                pushVector.x = (this.speed / 1) * (largestVector.x - (this.rays[i].posEnd.x - this.rays[i].pos.x))
                pushVector.y = (this.speed / 1) * (largestVector.y - (this.rays[i].posEnd.y - this.rays[i].pos.y));
                this.vel.sub(pushVector);
                
                totalVector.add(pushVector);
                //if (this.rays[i].length < 10)
                 //   this.crashed = true;
            }
            if(totalVector.mag() > precision)
                car.vel.mult(.6);
            car.slowDown = 1 + totalVector.mag();
        }
    }

    draw() {
        //draw rays
        Ray.preDraw();
        for (let i = 0; i < this.rays.length; i++) {
            this.rays[i].draw();
        }

        //draw car
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this._angle);
        rectMode(CENTER);
        if (this.forwardWay)
            fill("grey");
        else
            fill("red");
        rect(0, 0, 20, 40);
        pop();
    }
}
