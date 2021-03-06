// ------------------------ I N T R O  /  I N F O -------------------------- //

/**
pong, by mattie k.a.
//
// A primitive implementation of Pong with no scoring system
// just the ability to play the game with the keyboard.
**/

// --------------------------- V A R I A B L E S --------------------------- //

// Game colors
var fgColor = 255;

// BALL
// Basic definition of a ball object with its key properties of
// position, size, velocity, and speed
var ball = {
  x: 0,
  y: 0,
  size: 20,
  vx: 0,
  vy: 0,
  speed: 5
}

// PADDLES
// How far in from the walls the paddles should be drawn on x
var paddleInset = 20;
var scoreColor = "#ffffff";

// LEFT PADDLE
// Basic definition of a left paddle object with its key properties of
// position, size, velocity, and speed
var leftPaddle = {
  x: 0,
  y: 0,
  w: 20,
  h: 70,
  vx: 0,
  vy: 0,
  speed: 5,
  upKeyCode: 87, // The key code for W
  downKeyCode: 83, // The key code for S
  score: 0, //  score for left paddle
  scoreColor: this.scoreColor //sets initial score colour
}

// RIGHT PADDLE
// Basic definition of a left paddle object with its key properties of
// position, size, velocity, and speed
var rightPaddle = {
  x: 0,
  y: 0,
  w: 20,
  h: 70,
  vx: 0,
  vy: 0,
  speed: 5,
  upKeyCode: 38, // The key code for the UP ARROW
  downKeyCode: 40, // The key code for the DOWN ARROW
  score: 0, //  score for the right paddle
  scoreColor: this.scoreColor //sets initial score colour
}

// A variable to hold the beep sound we will play on bouncing
var beepSFX;
var restartSound;

// -------------------------- P R E L O A D -------------------------------- //

// Loads the beep audio for the sound of bouncing
function preload() {
  beepSFX = new Audio("assets/sounds/beep.wav");
  restartSound = new Audio("assets/sounds/winner.wav");
}

// ----------------------------- S E T U P --------------------------------- //

// Creates the canvas, sets up the drawing modes,
// Sets initial values for paddle and ball positions
// and velocities.
function setup() {
  // Create canvas and set drawing modes
  createCanvas(640,480);
  rectMode(CENTER);
  noStroke();
  fill(fgColor);

  setupPaddles();
  setupBall();
}

// setupPaddles()
//
// Sets the positions of the two paddles
function setupPaddles() {
  // Initialise the left paddle
  leftPaddle.x = paddleInset;
  leftPaddle.y = height/2;
  leftPaddle.score = 0 // initializes score at zero

  // Initialise the right paddle
  rightPaddle.x = width - paddleInset;
  rightPaddle.y = height/2;
  rightPaddle.score = 0; //initializes score at zero
}

// setupBall()
//
// Sets the position and velocity of the ball
function setupBall() {
  ball.x = width/2;
  ball.y = height/2;
  ball.vx = ball.speed;
  ball.vy = ball.speed;
}

// ------------------------------ D R A W ---------------------------------- //

// Calls the appropriate functions to run the game
function draw() {
  // Fill the background
  backgroundGradient();

  // Handle input
  // Notice how we're using the SAME FUNCTION to handle the input
  // for the two paddles!
  handleInput(leftPaddle);
  handleInput(rightPaddle);

  // Update positions of all objects
  // Notice how we're using the SAME FUNCTION to handle the input
  // for all three objects!
  updatePosition(leftPaddle);
  updatePosition(rightPaddle);
  updatePosition(ball);

  // Handle collisions
  handleBallWallCollision();
  handleBallPaddleCollision(leftPaddle);
  handleBallPaddleCollision(rightPaddle);

  // Handle the ball going off screen
  handleBallOffScreen();


  // Display the paddles and ball
  displayPaddle(leftPaddle);
  displayPaddle(rightPaddle);
  displayBall();

  // check for a winner
  determineWinner();
}

// -------------------------- F U N C T I O N S ---------------------------- //

// PADDLE FUNCTIONS (input)
// Updates the paddle's velocity based on whether one of its movement
// keys are pressed or not.
// Takes one parameter: the paddle to handle.
function handleInput(paddle) {

  // Set the velocity based on whether one or neither of the keys is pressed

  // NOTE how we can change properties in the object, like .vy and they will
  // actually CHANGE THE OBJECT PASSED IN, this allows us to change the velocity
  // of WHICHEVER paddle is passed as a parameter by changing it's .vy.

  // UNLIKE most variables passed into functions, which just pass their VALUE,
  // when we pass JAVASCRIPT OBJECTS into functions it's the object itself that
  // gets passed, so we can change its properties etc.

  // Check whether the upKeyCode is being pressed
  // NOTE how this relies on the paddle passed as a parameter having the
  // property .upKey
  if (keyIsDown(paddle.upKeyCode)) {
    // Move up
    paddle.vy = -paddle.speed;
  }
  // Otherwise if the .downKeyCode is being pressed
  else if (keyIsDown(paddle.downKeyCode)) {
    // Move down
    paddle.vy = paddle.speed;
  }
  else {
    // Otherwise stop moving
    paddle.vy = 0;
  }

  // stop paddle from going offscreen if player sends it too far up or down
  //blocking it at the top
  if (paddle.y - paddle.h/2 <= 0) {
    paddle.vy = 0;
    paddle.y = paddle.y + paddle.h/2;
  }
  // blocking it at the bottom
  if (paddle.y + paddle.h/2 >= height) {
    paddle.vy = 0;
    paddle.y = paddle.y - paddle.h/2;
  }
}

//-------

// UPDATE PROJECTILE POSITION
// Sets the position of the object passed in based on its velocity
// Takes one parameter: the object to update, which will be a paddle or a ball
//
// NOTE how this relies on the object passed in have .x, .y, .vx, and .vy
// properties, which is true of both the two paddles and the ball
function updatePosition(object) {
  object.x = object.x + object.vx;
  object.y = object.y + object.vy;
}

//-------

// BALL COLLISION WITH WALL
// Checks if the ball has overlapped the upper or lower 'wall' (edge of the screen)
// and is so reverses its vy
function handleBallWallCollision() {

  // Calculate edges of ball for clearer if statement below
  var ballTop = ball.y - ball.size/2;
  var ballBottom = ball.y + ball.size/2;
  var ballLeft = ball.x - ball.size/2;
  var ballRight = ball.x + ball.size/2;

  // Check for ball colliding with top and bottom
  if (ballTop < 0 || ballBottom > height) {
    // If it touched the top or bottom, reverse its vy
    ball.vy = -ball.vy;
    // Play our bouncing sound effect by rewinding and then playing
    beepSFX.currentTime = 0;
    beepSFX.play();
  }
}

//-------

// BALL COLLISION WITH PADDLE
// Checks if the ball overlaps the specified paddle and if so
// reverses the ball's vx so it bounces
function handleBallPaddleCollision(paddle) {

  // Calculate edges of ball for clearer if statements below
  var ballTop = ball.y - ball.size/2;
  var ballBottom = ball.y + ball.size/2;
  var ballLeft = ball.x - ball.size/2;
  var ballRight = ball.x + ball.size/2;

  // Calculate edges of paddle for clearer if statements below
  var paddleTop = paddle.y - paddle.h/2;
  var paddleBottom = paddle.y + paddle.h/2;
  var paddleLeft = paddle.x - paddle.w/2;
  var paddleRight = paddle.x + paddle.w/2;

  // First check it is in the vertical range of the paddle
  if (ballBottom > paddleTop && ballTop < paddleBottom) {
    // Then check if it is touching the paddle horizontally
    if (ballLeft < paddleRight && ballRight > paddleLeft) {
      // Then the ball is touching the paddle so reverse its vx
      ball.vx = -ball.vx;
      // Play our bouncing sound effect by rewinding and then playing
      beepSFX.currentTime = 0;
      beepSFX.play();
    }
  }
}

//-------
//BALL RESET : resets the ball to the middle of the screen after someone scores
// velocity/direction of the ball depends on who just scored

function ballReset() {
  // Calculate edges of ball for clearer if statement below
  var ballLeft = ball.x - ball.size/2;
  var ballRight = ball.x + ball.size/2;

  if (ballLeft < 0) {
    rightPaddle.score = rightPaddle.score + 1;
    console.log("right score: " + rightPaddle.score);
    ball.x = width/2;
    ball.y = height/2;
    ball.vx = random(3,10);
  } else if (ballRight > width) {
    leftPaddle.score = leftPaddle.score + 1;
    ball.x = width/2;
    ball.y = height/2;
    ball.vx = random(-10,-3);
    console.log("left score: " + leftPaddle.score);
  }
}


//-------

// OFFSCREEN BALL HANDLING
// Checks if the ball has gone off screen to the left or right
// and moves it back to the centre if so
function handleBallOffScreen() {

  // Calculate edges of ball for clearer if statement below
  var ballLeft = ball.x - ball.size/2;
  var ballRight = ball.x + ball.size/2;

  ballReset();
}

//--------

// CHECKS SCORE AND CHANGES THE COLOUR OF THE PADDLE TO REFLECT THAT
function colorPaddle(paddle) {
  //console.log(paddle.score, paddle.scoreColor);
  switch (paddle.score) {
    case 0: paddle.scoreColor = "#ffffff"; break;
    case 1: paddle.scoreColor = "#ef3326"; break;
    case 2: paddle.scoreColor = "#efd426"; break;
    default: paddle.scoreColor = "#4de257"; break;
  }
}

//--------

// DISPLAY BALL
// Draws ball on screen based on its properties
function displayBall() {
  push();
    fill("#ffffff");
  pop();
  rect(ball.x,ball.y,ball.size,ball.size);
}

//-------

// DISPLAY PADDLE
// Draws the specified paddle on screen based on its properties
function displayPaddle(paddle) {
  colorPaddle(paddle);
  fill(paddle.scoreColor);
  rect(paddle.x,paddle.y,paddle.w,paddle.h);

}

//-------

//BACKGROUND GRADIENT
//changes the color of the background based on where the ball is
function backgroundGradient() {
  if (ball.x < width) {
    push();
      colorMode(HSB,255);
      background(map(ball.x,0,width,0,255),127,200);
    pop();
  }
}

//-------

// WIN CONDITIONS
function determineWinner () {
  if (leftPaddle.score == 4) {
    // cover screen in black rectangle
    fill ("#000000");
    rect (width/2,height/2,width,height);
    //center ball so that it stops moving and doesnt add to the score
    ball.vx = 0;
    ball.vy = 0;
    ball.x = width/2;
    ball.y = height/2;
    // text and text color
    textSize(50);
    textAlign(CENTER);
    fill ("#ef3326");
    text("LOSE",width/4*3,height/2);
    fill ("#4de257");
    text("WIN",width/4,height/2);
    //reset message
    fill ("#ffffff");
    text ("press ENTER to try again!",width/2,height-50);
    if (keyIsDown(SHIFT)) {
      console.log("shift pressed")
      textSize(10);
      fill("#ffffff");
      text("if ball is life then youre my ball",width/2,height/2);
      text("that is the shift key, dingus",width/2,10);
    }
    if (keyIsDown(ENTER)) {
      restartSound.play();
      setup();
    }
  } else if (rightPaddle.score == 4) {
    fill ("#000000");
    rect (width/2,height/2,width,height);
    //center ball so that it stops moving and doesnt add to the score
    ball.vx = 0;
    ball.vy = 0;
    ball.x = width/2;
    ball.y = height/2;
    // text and text color
    textSize(50);
    textAlign(CENTER);
    fill ("#4de257");
    text("WIN",width/4*3,height/2);
    fill ("#ef3326");
    text("LOSE",width/4,height/2);
    //reset message
    fill ("#ffffff");
    text ("press ENTER to try again!",width/2,height-50);
    if (keyIsDown(SHIFT)) {
      console.log("shift pressed")
      textSize(10);
      fill("#ffffff");
      text("if ball is life then youre my ball",width/2,height/2);
      text("that is the shift key, dingus",width/2,10);
    }
    if (keyIsDown(ENTER)) {
      restartSound.play();
      setup();
    }
  }
}
//-------

/** SOUND SOURCE: https://opengameart.org/content/completion-sound **/

//-------
