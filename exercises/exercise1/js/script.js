//------------------------ I N T R O ----------------------------------------//

// Exercise 1 - Moving pictures
// Pippin Barr
//
// Starter code for exercise 1.
// It moves two pictures around on the canvas.
// One moves linearly down the screen.
// One moves toward the mouse cursor.


//------------------------ C L O W N     F A C E ----------------------------//

// The image of a clown face
var clownImage;
// The current position of the clown face
var clownImageX;
var clownImageY;

//------------------------ F E L T     T E X T U R E ------------------------//

// The transparent image of "felt" that wipes down the canvas
var feltTextureImage;
// The current position of the transparent image of "felt"
var feltTextureImageX;
var feltTextureImageY;

//----------------------- C L O W N     B O X -------------------------------//

// the clown box
var clownBox;
//the current position of the clown clown box
var clownBoxX;
var clownBoxY;

//------------------------- P R E L O A D -----------------------------------//

// preload()
//
// Load the images we're using before the program starts

function preload() {
  clownImage = loadImage("assets/images/clown.png");
  feltTextureImage = loadImage("assets/images/black-felt-texture.png");
  clownBox = loadImage("assets/images/clownbox.png");
}

//------------------------- S E T U P ---------------------------------------//

// setup()
//
// Set up the canvas, position the images, set the image mode.

function setup() {
  // Create our canvas
  createCanvas(640,640);

  // Start the clown image at the centre of the canvas
  clownImageX = width/2;
  clownImageY = height/2;

  // Start the felt image perfectly off screen above the canvas
  feltTextureImageX = width/2;
  feltTextureImageY = 0 - feltTextureImage.height/2;

  // start the clown box off the screen to the left of the canvas
  clownBoxY = height/2;
  clownBoxX = 0 - clownBox.width/2;

  // We'll use imageMode CENTER for this script
  imageMode(CENTER);
}

//----------------------------- D R A W -------------------------------------//

// draw()
//
// Moves the felt image linearly
// moves the clown box from left to right linearly
// Moves the clown face toward the current mouse location

function draw() {

  // Move the felt image down by increasing its y position
  feltTextureImageY += 1;

  // Display the felt image
  image(feltTextureImage,feltTextureImageX,feltTextureImageY);

  // move the clown box right by increasing its x position
  clownBoxX = clownBoxX + 1;

  // display the clown box
  image(clownBox,clownBoxX,clownBoxY);

  // Move the clown by moving it 1/10th of its current distance from the mouse

  // Calculate the distance in X and in Y
  var xDistance = mouseX - clownImageX;
  var yDistance = mouseY - clownImageY;
  // Add 1/10th of the x and y distance to the clown's current (x,y) location
  clownImageX = clownImageX + xDistance/10;
  clownImageY = clownImageY + yDistance/10;

  // Display the clown image
  image(clownImage,clownImageX,clownImageY);
}
