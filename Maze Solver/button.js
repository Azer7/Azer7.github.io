class Button {
    constructor(x, y, width, height, text, textSize) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.mainColour = [165, 255, 90];
        this.frozenColour = [210, 210, 210];
        this.text = text;
        this.textSize = textSize;

        this.hoverSize = 1.07;
        this.clickSize = 1.15;
        this.lastState = 0; //0: outside, 1: hovering, 2: pressed
        this.sizeMultiplier = 1; //size multiplier for idle mode, hover mode, and pressed mode
        this.clickedAndReleased = false; //true: button clicked
        this.frozen = false;
        this.colourSave = this.mainColour.slice(0, 3);
        Button.all.push(this);
    }

    update() {
        this.clickedAndReleased = false;
        //Cursor Detection
        if (((mouseX > this.x - (this.width * this.sizeMultiplier - this.width) / 2 && mouseX < this.x + this.width / 2 + this.width * this.sizeMultiplier / 2) && (mouseY > this.y - (this.height * this.sizeMultiplier - this.height) / 2 && mouseY < this.y + this.height / 2 + this.height * this.sizeMultiplier / 2)) && !this.frozen) { //if the cursor is withing the bounds of the button
            if (mouseIsPressed && (this.lastState == 1 || this.lastState == 2)) { //if the mouse is pressed and was hovering or pressed
                this.sizeMultiplier = this.clickSize;
                this.lastState = 2; // pressed
            } else if (mouseIsPressed && this.lastState == 0) { //if the cursor is down and the cursor was just "outside" the square
                this.sizeMultiplier = this.hoverSize;
                this.lastState = 0; //pretends that the cursor was just outside the button so that the button won't become pressed if the cursor entered down
            } else { //if the cursor isn't down
                this.sizeMultiplier = this.hoverSize;
                if (this.lastState == 2)
                    this.clickedAndReleased = true;
                this.lastState = 1; //hovering
            }
        } else {
            this.sizeMultiplier = 1;
            this.lastState = 0; //outside
        }

        //Button Graphics
        //button
        fill(this.mainColour[0], this.mainColour[1], this.mainColour[2]); //lime green
        stroke('black');
        strokeWeight(2);
        rect(this.x - (this.width * this.sizeMultiplier - this.width) / 2, this.y - (this.height * this.sizeMultiplier - this.height) / 2, this.width * this.sizeMultiplier, this.height * this.sizeMultiplier, 5); //rendering button

        //text
        fill(0, 150, 153); //darkish cyan
        noStroke();
        textSize(this.textSize * this.sizeMultiplier);
        textAlign(CENTER, CENTER);
        text(this.text, this.x + this.width / 2, this.y + this.height / 2); //rendering text

        return this.clickedAndReleased; //return whether the button was just clicked
    }

    freeze(freeze, switchColour) {
        if (switchColour) {
            if (freeze) {
                this.mainColour = this.frozenColour; //set the colour to gray
            } else {
                this.mainColour = this.colourSave;
            }
        }
        this.frozen = freeze;
    }
}

Button.all = [];