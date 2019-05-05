function preload() {
    tree = loadModel('assets/simpleTree.obj', true);
    img = loadImage('assets/Grass.jpg');
  }
  
  function setup() {
    createCanvas(innerWidth, innerHeight, WEBGL);
  }
  
  function draw() {
    background(200);
    //rotateX(frameCount * 0.01);
    rotateX(3.14159)
    //rotateY(frameCount * 0.01);
    directionalLight(250, 250, 250, -0.16, 1, 0.25);
    normalMaterial(); 
    texture(img);
    model(tree);
  }