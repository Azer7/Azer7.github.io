function setup() {
    createCanvas(600,600,WEBGL); 
   }
   
   function flower(x,y){
       ambientMaterial(0,255,0);
       push();
       noStroke();
       translate(-x,-y);
       cylinder(5,100,2,2);
       push();
       ambientMaterial(255,105,180);
       translate(0,-75);
       ellipsoid(25,25,25,4,4);
       pop();
       pop();
   }
   
    function draw() {
        directionalLight(255,255,255,1,1,-2);
        flower(100,200);
   
   }