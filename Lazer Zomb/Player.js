class Player {
    constructor(x, y) {
        this.baseSpeed;
        this.speed;
        this.friction = .1; // 10% of velocity is lost
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this._angle = 0;
        this.dead = false;

        this.maxHealth;
        this._health;

        this.equippedGun = 0;

        this.damage; //dictated by gun
        this.pierce;
        this.energyDischarge; //dictated by gun
        this.energyRecharge;
        this.maxEnergy;
        this.energy;
        this.maxBoost;
        this.boost;
        this.boostDischarge = 4;
        this.boostRecharge;
        this.boostSpeed;
        this.laser = new Ray(x, y, 0, 9999, true);
        this.bullets = [];
        this.bulletContainer = new createjs.Container();
        gameAssets.children.splice(1, 0, this.bulletContainer);
        this.rays = [];
        for (let i = 0; i < 72; i++) {
            this.rays.push(new Ray(x, y, 0, 40 * hScl, false))
            this.rays[i].angle = 5 * i;
        }
        this._shooting = false;
        this.boosting = false;
        this.canShoot;

        //this.rays.push();
        this.barrelPos = new Vector(68 * hScl, 6 * hScl);

        //this.player = new createjs.Shape(graphics.player);
        this.sprite = new createjs.Sprite(playerSpriteSheet, "s-idle");
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.scaleX = .4 * hScl;
        this.sprite.scaleY = .4 * hScl;
        stage.addChild(this.sprite);
        gameAssets.addChild(this.sprite);

        //health bar
        this.healthbar = new createjs.Shape();
        this.healthbar.graphics.setStrokeStyle(11 * hScl, "round")
        this.healthbar.graphics.beginStroke(createjs.Graphics.getRGB(180, 0, 30, 1));
        this.healthbar.graphics.moveTo(82 * hScl, 15 * hScl);
        this.healthbarTo = this.healthbar.graphics.lineTo(197 * hScl, 15 * hScl).command;
        gameAssets.addChild(this.healthbar);

        //energy bar
        this.energybar = new createjs.Shape();
        this.energybar.graphics.setStrokeStyle(11 * hScl, "round")
        this.energybar.graphics.beginStroke(createjs.Graphics.getRGB(190, 200, 45, 1));
        this.energybar.graphics.moveTo(95 * hScl, 46 * hScl);
        this.energybarTo = this.energybar.graphics.lineTo(207 * hScl, 46 * hScl).command;
        gameAssets.addChild(this.energybar);

        //boost bar
        this.boostbar = new createjs.Shape();
        this.boostbar.graphics.setStrokeStyle(11 * hScl, "round")
        this.boostbar.graphics.beginStroke(createjs.Graphics.getRGB(40, 60, 170, 1));
        this.boostbar.graphics.moveTo(82 * hScl, 77 * hScl);
        this.boostbarTo = this.boostbar.graphics.lineTo(197 * hScl, 77 * hScl).command;
        gameAssets.addChild(this.boostbar);

        this.boostG = new createjs.Shape();
        this.boostG.graphics.setStrokeStyle(1);
        this.boostG.graphics.beginStroke(createjs.Graphics.getRGB(40, 111, 180, 0.6));
        this.boostG.graphics.beginFill(createjs.Graphics.getRGB(46, 136, 205, 0.4));
        this.boostG.graphics.drawCircle(0, 0, 45 * hScl);
        this.boostG.x = this.pos.x;
        this.boostG.y = this.pos.y;
        this.boostG.visible = false;
        gameAssets.addChild(this.boostG);
    }

    reset() {
        //calculate stats
        this.damage = guns[player.equippedGun].damage * upgrades[0].getValue(upgrades[0].level);
        this.pierce = upgrades[1].getValue(upgrades[1].level);
        this.maxHealth = upgrades[2].getValue(upgrades[2].level);
        this.baseSpeed = upgrades[3].getValue(upgrades[3].level) * guns[player.equippedGun].speedMultiplier * hScl;
        this.maxEnergy = upgrades[4].getValue(upgrades[4].level);
        this.maxBoost = upgrades[5].getValue(upgrades[5].level);
        this.boostRecharge = upgrades[6].getValue(upgrades[6].level);
        this.boostSpeed = upgrades[7].getValue(upgrades[7].level) * guns[player.equippedGun].speedMultiplier * hScl;
        this.energyDischarge = guns[player.equippedGun].energyCost;
        this.energyRecharge = upgrades[8].getValue(upgrades[8].level);

        this.canShoot = true;
        this.bullets = [];

        gameAssets.removeChild(this.bulletContainer);
        if (guns[this.equippedGun].beam.type == "fire") {
            this.bulletContainer = new createjs.FastContainer();
        } else {
            this.bulletContainer = new createjs.Container();
        }
        gameAssets.children.splice(1, 0, this.bulletContainer);
        //reset variable stats
        this.health = this.maxHealth;
        this.energy = this.maxEnergy;
        this.boost = this.maxBoost;
        this.speed = this.baseSpeed;
        this.shooting = false;
        this.boosting = false;
        this.boostG.visible = false;

        this.laser.activeRay = guns[player.equippedGun].beam;

        if (guns[this.equippedGun] instanceof Laser) {
            this.laser.line.visible = true;
        } else if (guns[this.equippedGun] instanceof Gun) {
            this.laser.line.visible = false;
        } else {}
    }

    set shooting(value) {
        if (value == true) {
            if (guns[this.equippedGun] instanceof Gun || guns[this.equippedGun] instanceof Rifle)
                this.sprite.gotoAndPlay("r-shoot");
            else
                this.sprite.gotoAndPlay("s-shoot");

        } else {
            if (this.sprite.currentAnimation != "reload") {
                if (guns[this.equippedGun] instanceof Gun || guns[this.equippedGun] instanceof Rifle)
                    this.sprite.gotoAndPlay("r-unshoot");
                else
                    this.sprite.gotoAndPlay("s-unshoot");
            }

        }
        this._shooting = value;
    }

    get shooting() {
        return this._shooting;
    }

    get angle() {
        let inDegrees = this._angle * 180 / Math.PI;
        return Math.round(inDegrees); //5 decimals of precision
    }
    set angle(degrees) {
        //change to radians
        this._angle = degrees * Math.PI / 180;
    }

    process(objArr, e) {
        //add player movement
        this.vel.add(this.acc);
        this.vel.multiplyScalar(1 - this.friction);
        this.pos.add(this.vel);
        this.constrainVel(0, width, 0, height);
        this.acc.multiplyScalar(0); // only do once

        //calculate boost energy
        if (this.boosting) {
            this.boost -= this.boostDischarge;
            this.boostG.x = this.pos.x;
            this.boostG.y = this.pos.y;
        }
        this.boost += this.boostRecharge;

        if (this.boost < 0) {
            this.boost = 0;
            this.boosting = false;
            this.boostG.visible = false;
        } else if (this.boost > this.maxBoost)
            this.boost = this.maxBoost;

        this._angle = mouse.pos.clone().subtract(this.pos).angle();
        let angleChange = mouse.pos.clone().subtract(this.barrelPos.clone().rotateBy(this._angle).multiplyScalar(0.001)).subtract(this.pos).angle() - this._angle;
        this._angle += angleChange * 1000;

        //detect player angle
        for (let i = 0; i < this.rays.length; i++) {
            this.rays[i].pos = this.pos;
            this.rays[i].checkCollision(objArr);
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
            this.pos.x -= (this.speed / 10) * (largestVector.x - (this.rays[i].posEnd.x - this.rays[i].pos.x));
            this.pos.y -= (this.speed / 10) * (largestVector.y - (this.rays[i].posEnd.y - this.rays[i].pos.y));
            console.log();
        }

        /* LOGIC */
        if (guns[this.equippedGun] instanceof Laser) { //laser logic
            //calculate laser energy
            if (this.shooting)
                this.energy -= this.energyDischarge;
            this.energy += this.energyRecharge;

            if (this.energy < 0) {
                this.energy = 0;
                this.shooting = false;

            } else if (this.energy > this.maxEnergy)
                this.energy = this.maxEnergy;




            //detect gun angle

            //process gun
            this.laser.pos = this.barrelPos.clone().rotateBy(this._angle).add(this.pos);
            this.laser._angle = this._angle;
            let hits = this.laser.getCollisions(objArr);
            hits.sort((a, b) => {
                if (a.length > b.length)
                    return 1;
                if (a.length < b.length)
                    return -1;
            });

            for (let i = 0; i < hits.length; i++) {
                if (objects[hits[i].index] instanceof Enemy) {
                    //if ((1 - this.pierce) * i < 1) {
                    //    objects[hits[i].index].health -= this.damage * (1 - (1 - this.pierce) * i);
                    //} else {
                    //    this.laser.length = hits[i].length;
                    //    break;
                    //}
                    if (this.shooting)
                        objects[hits[i].index].health -= this.damage * Math.pow(this.pierce, i);
                }
            }
        } else if (guns[this.equippedGun] instanceof Gun) { //gun logic
            if (this.shooting && this.canShoot) {
                this.canShoot = false;
                setTimeout(() => {
                    this.canShoot = true;
                    this.shooting = false;
                }, guns[this.equippedGun].delay);

                this.energy -= this.energyDischarge;
                for (let i = 0; i < guns[this.equippedGun].bulletAmount; i++) {
                    //let randPos = this.barrelPos.clone().rotateBy(this._angle).add(new Vector(this.pos.x + Math.random() * 35 - Math.random() * 35, this.pos.y + Math.random() * 35 - Math.random() * 35));
                    let randPos = new Vector(this.barrelPos.x + Math.random() * guns[this.equippedGun].posSpread.x - Math.random() * guns[this.equippedGun].posSpread.y, this.barrelPos.y + Math.random() * guns[this.equippedGun].posSpread.y - Math.random() * guns[this.equippedGun].posSpread.y).rotateBy(this._angle).add(this.pos);
                    let randAngle = this._angle + Math.random() * guns[this.equippedGun].angleSpread - Math.random() * guns[this.equippedGun].angleSpread;
                    this.bullets.push(new Bullet(randPos, randAngle, guns[this.equippedGun].bulletSpeed, this.damage, this.pierce - .6, this.bulletContainer, guns[this.equippedGun].beam));

                }


                if (this.energy < this.energyDischarge) {
                    this.sprite.gotoAndPlay("r-reload");
                    setTimeout(() => {
                        this.energy = this.maxEnergy
                    }, 2000 / Math.pow(this.energyRecharge, 1 / 4));
                }
            }
        } else if (guns[this.equippedGun] instanceof Rifle) {
            if (this.shooting && elapsedTicks % guns[this.equippedGun].delay == 0) {
                this.energy -= this.energyDischarge; // reduce energy
                for (let i = 0; i < guns[this.equippedGun].bulletAmount; i++) {
                    let randPos = new Vector(this.barrelPos.x - 4, this.barrelPos.y + 6).rotateBy(this._angle).add(this.pos);
                    let randAngle = this._angle + Math.random() * guns[this.equippedGun].angleSpread - Math.random() * guns[this.equippedGun].angleSpread;
                    this.bullets.push(new Bullet(randPos, randAngle, guns[this.equippedGun].bulletSpeed, this.damage, this.pierce - .6, this.bulletContainer, guns[this.equippedGun].beam));
                }
            }
            this.energy += this.energyRecharge;

            if (this.energy < 0) {
                this.energy = 0;
                this.shooting = false;

            } else if (this.energy > this.maxEnergy)
                this.energy = this.maxEnergy;
        } else if (guns[this.equippedGun] instanceof Flamethrower) {
            if (this.shooting) {
                this.energy -= this.energyDischarge; // reduce energy
                for (let i = 0; i < guns[this.equippedGun].bulletAmount; i++) {
                    let randPos = new Vector(this.barrelPos.x + Math.random() * guns[this.equippedGun].posSpread.x - Math.random() * guns[this.equippedGun].posSpread.y, this.barrelPos.y + Math.random() * guns[this.equippedGun].posSpread.y - Math.random() * guns[this.equippedGun].posSpread.y).rotateBy(this._angle).add(this.pos);
                    let randAngle = this._angle + Math.random() * guns[this.equippedGun].angleSpread - Math.random() * guns[this.equippedGun].angleSpread;
                    this.bullets.push(new Bullet(randPos, randAngle, guns[this.equippedGun].bulletSpeed, this.damage, 0, this.bulletContainer, guns[this.equippedGun].beam));
                }
            }
            this.energy += this.energyRecharge;

            if (this.energy < 0) {
                this.energy = 0;
                this.shooting = false;

            } else if (this.energy > this.maxEnergy)
                this.energy = this.maxEnergy;
        }


        this.boostbarTo.x = (this.boost / this.maxBoost * 115 + 82) * hScl; //draw line
        this.energybarTo.x = (this.energy / this.maxEnergy * 112 + 95) * hScl; //draw line
    }

    constrainVel(xlow, xhigh, ylow, yhigh) {
        if (this.pos.x < xlow) {
            this.pos.x = xlow;
            this.vel.x = 0;
        } else if (this.pos.x > xhigh) {
            this.pos.x = xhigh;
            this.vel.x = 0;
        }
        if (this.pos.y < ylow) {
            this.pos.y = ylow;
            this.vel.y = 0;
        } else if (this.pos.y > yhigh) {
            this.pos.y = yhigh;
            this.vel.y = 0;
        }
    }

    update() {
        //draw rays
        if (guns[this.equippedGun] instanceof Laser) {
            this.laser.active = this.shooting;
            this.laser.update();
        } else if (guns[this.equippedGun] instanceof Gun || guns[this.equippedGun] instanceof Rifle || guns[this.equippedGun] instanceof Flamethrower) {
            for (let i = 0; i < this.bullets.length; i++) {
                this.bullets[i].update(this.bullets, i);
            }
        } else {}

        //draw player
        this.sprite.x = this.pos.x;
        this.sprite.y = this.pos.y;
        this.sprite.rotation = this.angle
    }

    set health(hp) {
        this._health = hp;
        this.healthbarTo.x = (this._health / this.maxHealth * 113 + 82) * hScl;
    }
    get health() {
        return this._health;
    }
}

class Bullet {
    constructor(pos, angle, speed, damage, pierce, container, display) {
        this.pos = pos;
        this.angle = angle;
        this.speed = speed * hScl;
        this.damage = damage;
        this.pierce = pierce;

        this.hits = [];

        this.container = container;
        this.g = new createjs.Shape();
        this.g.graphics.setStrokeStyle(1 * hScl);
        this.g.graphics.beginStroke(createjs.Graphics.getRGB(100, 111, 100));
        this.g.graphics.beginFill(display.c);

        this.g.x = this.pos.x;
        this.g.y = this.pos.y;

        if (display.type == "round") {
            this.g.graphics.drawCircle(0, 0, display.s * hScl);
            this.g.cache(-display.s * 1.5, -display.s * 1.5, 3 * display.s, 3 * display.s);
        } else if (display.type == "rect") {
            this.g.graphics.drawRect(0, 0, display.s * hScl, display.s * hScl / 4);
            this.g.regX = display.s * hScl / 2;
            this.g.regY = display.s * hScl / 2;
            this.g.rotation = this.angle * 180 / Math.PI;
            this.g.cache(-display.s * 2, -display.s * 2, 4 * display.s, 4 * display.s);
        } else if (display.type == "fire") {
            this.g = new createjs.Bitmap("./Sprites/Fire.png");
            this.g.regX = 329.5;
            this.g.regY = 329.5;
            this.g.scaleX = .2 * hScl;
            this.g.scaleY = .2 * hScl;

        }
        container.addChild(this.g);
    }

    update(bulletArr, index) {
        if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) {
            this.remove(bulletArr, index)
            return;
        }

        this.pos.add(new Vector(this.speed).rotateBy(this.angle));
        this.g.x = this.pos.x;
        this.g.y = this.pos.y;

        for (let i = 0; i < objects.length; i++) {
            if (objects[i] instanceof Enemy) {
                let object = objects[i].collision;
                if (this.pos.x > object.pos.x && this.pos.x < object.pos.x + object.width && this.pos.y > object.pos.y && this.pos.y < object.pos.y + object.height && !this.hits.includes(objects[i])) {
                    objects[i].health -= this.damage;
                    this.hits.push(objects[i]);
                    if (Math.random() > this.pierce) {
                        this.remove(bulletArr, index);
                    }
                    return;
                }
            }
        }
    }

    remove(bulletArr, index) {
        this.container.removeChild(this.g);
        bulletArr.splice(index, 1);
    }
}
