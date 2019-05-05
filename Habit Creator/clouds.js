var cloudY = [];
var cloudX = []; 
var cloudZ = [];
var it = 0;

function setup() {
  createCanvas(600,600,WEBGL); 
	for(var i = 0; i < 4; i++){
		cloudY.push(random(0,300));
		cloudZ.push(random(-200,0));
		cloudX.push(0);
	}
  }

function clouds(){
	stroke(240);
	fill(255);
	push();
	translate(-300,0);
	for(var t = 0; t <= it; t ++){
		translate(cloudX[it],cloudY[it],cloudZ[it]);
		cloudX[it] ++;
		ellipsoid(30,30,30,4,3);
		push();
		translate(20,20,15);
		ellipsoid(30,30,30,4,4);
		translate(15,-25,-10);
		ellipsoid(30,30,30,4,4);
		translate(3,0,20);
		ellipsoid(30,30,30,4,4);
		translate(18,18,13);//
		ellipsoid(30,30,30,4,4);
		translate(21,-16,-9);
		ellipsoid(30,30,30,4,4);
		translate(14,29,11);
		ellipsoid(30,30,30,4,4);
		pop();
		pop();
	}
	var newcloud = int(random(200));
		if (newcloud == 5){
		it++;
		}
	if(it > 3){
		it = 0;
	}
}

function draw(){
	background(178, 232, 255);
	clouds();
}

