//for terrain
var w = 3000;
var h = 900;
var rows,cols;
var scl = 75; //MAKE SURE SCALE IS FACTOR OF W & H!!!
var terrain = [];
var geocolours =[];

//for clouds
var cloudY = [];
var cloudX = []; 
var cloudZ = [];
var cloudnum = 6;
var it = 0;

//for trees
function preload() {
  tree1 = loadModel('assets/Tree1.obj', true);
  tree2 = loadModel('assets/Tree2.obj', true);
  tree3 = loadModel('assets/Tree3.obj', true);
  tree4 = loadModel('assets/Tree4.obj', true);
  tree5 = loadModel('assets/Tree5.obj', true);
  tree6 = loadModel('assets/Tree6.obj', true);
  img = loadImage('assets/green.jpg');
}

function setup() {
 var canvas = createCanvas(innerWidth*0.95,innerHeight * 0.9,WEBGL); 
 canvas.parent("animation-div");
 //for terrain
 rows = h/scl;
 cols = w/scl;
 
 var xoff = 0;
 var yoff = 0;


	
 
 for (var y = 0; y < rows; y++){
   terrain.push([]);
		 for (var x = 0; x < cols; x++){
     terrain[y].push(map(noise(xoff,yoff),0,1,-50,50));
     xoff += 0.3;
   }
	 
   yoff += 0.3;
 }
 
 
 for (var j = 0; j < rows; j++){
	 geocolours.push([]);
   for (var i = 0; i < cols; i++){
     geocolours[j].push(random(150,255));
   }
 }

 //for clouds
 for(var i = 0; i < cloudnum; i++){
  cloudY.push(random(-400,0));
  cloudZ.push(random(50,100));
  cloudX.push(0);
}
}


function clouds(){
	stroke(240);
	specularMaterial(255);
	push();
	translate(-600,0);
	for(var t = 0; t <= it; t ++){
		translate(cloudX[t],cloudY[t],cloudZ[t]);
		cloudX[t]+=2;
		ellipsoid(50,50,50,4,3);
		push();
		translate(40,40,15);
		ellipsoid(60,60,60,4,4);
		translate(35,-45,-30);
		ellipsoid(60,60,60,4,4);
		translate(23,20,40);
		ellipsoid(60,60,60,4,4);
		translate(38,38,33);
		ellipsoid(60,60,60,4,4);
		translate(41,-26,-19);
		ellipsoid(60,60,60,4,4);
		translate(34,49,31);
		ellipsoid(60,60,60,4,4);
    pop();
    if (cloudX[t] > w){
      cloudX[t] = 0;
    }
    }
  
  pop();
	var newcloud = int(random(100));
		if (newcloud == 5){
		it++;
		}
	if(it > cloudnum){
		it -= 1;
  }
}


function bush(x,y,z){
  push();
  translate(x,y,z)
  ambientMaterial(255,105,180);
  noStroke();
  texture(img);
  
  ellipsoid(60,50,60,4,4)
  pop();
}

function trees(x,y,z,whichtree){
  push();
  rotateX(3.14159)
  translate(x,-y,-z);
  scale(1.8);
  normalMaterial(); 
  texture(img);
  model(whichtree);
  pop();
}

function flower(x,y,z){
  ambientMaterial(0,255,0);
  push();
  noStroke();
  translate(x,y,z);
  cylinder(4,60,2,2);
  push();
  ambientMaterial(255,105,180);
  translate(0,-35);
  ellipsoid(20,20,20,3,3);
  pop();
  pop();
}

function draw() {
  background(178, 232, 255);
  noStroke();
  ambientLight(100);


  var dirY = (mouseY / height - 0.5) * 4;
	var dirX = (mouseX / width - 0.5) * 4;
  directionalLight(204, 204, 204, dirX, dirY, 1);


  directionalLight(255,255,255,1,100,-100);

  push();
  translate(width/2,height/2);
  rotateX(PI/2);
  translate(-w/2-250,-h/2-150,-100);


  for (var y = 0; y < rows-1; y++){
    for (var x = 0; x< cols-1; x++){
      beginShape(TRIANGLES);
      fill(0,geocolours[y][x],0);
      vertex(x*scl , y*scl, terrain[y][x]);
      vertex(x*scl, (y+1)*scl, terrain[y+1][x]);
      vertex((x+1)*scl, (y+1)*scl, terrain[y+1][x+1]);
      endShape();
      fill(0,geocolours[y+1][x+1],0);
      beginShape(TRIANGLES);
      vertex(x*scl, y*scl, terrain[y][x]);
      vertex((x+1)*scl, (y+1)*scl, terrain[y+1][x+1]);
      vertex((x+1)*scl, (y)*scl, terrain[y][x+1]);
      endShape();
    }
  }
  pop();
  push();
  translate(width/2, height/2);
  translate(-w/2-250,-100,-h/2-150);
  //these have y value baselines
  if (level >= 1) {
    flower(600,150,250);
    flower(300,150,350);
    flower(750,150,290);
    flower(600,150,300);
    flower(300,150,250);
    flower(1400,150,190);
    flower(1600,150,200);
    flower(1000,150,280);
  }
  if (level >= 3) {
    trees(1600,100,250,tree1);
    trees(1000,100,350, tree3);
    trees(400,100,290, tree2);
    trees(1800,100,160, tree2);
    trees(600,100,320, tree4);
  }
  if (level >= 4) {
    bush(1000,150,300);
    bush(300,150,340);
    bush(1200,150,100);
    bush(600,150,225);
    bush(800,150,260);
    bush(1900,150,320);
  }
  if (level >= 6) {
     clouds();
  }
  
  pop();

  ambientMaterial(255,255,0);
  stroke(240,240,0);
  push();
  translate(-900,-300,-500);
  ellipsoid(90,90,90,5,5);
  pop();

  //  flower(-800,420);
  //  trees(-200,290,-450);
  //  bush(-600,420,-550);
  //  clouds(); //must be last ... idk why

}