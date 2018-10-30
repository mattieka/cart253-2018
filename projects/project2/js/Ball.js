/******************************** B A L L ************************************/

/* A class to define how a ball behaves. Includes:
      - bouncing on the top and bottom edges of the canvas,
      - going off the left and right sides,
      - and bouncing off paddles. */

/************************ C O N S T R U C T O R ******************************/

/* sets ball properties and their arguments */
function Ball(x,y,vx,vy,size,speed) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.size = size;
  this.speed = speed;
}

/********************** U P D A T E    F U N C T I O N  **********************/

/* update function does the following:
    - updates the ball's position based on its velocity
    - constrains y to keep the ball from going off the top or bottom of canvas
    - checks for ball hitting top or bottom of canvas; makes it bounce if so
    - checks for ball going offscreen on the left or right; adjusts score accordingly */

Ball.prototype.update = function () {
  // update position with velocity
  this.x = this.x + this.vx;
  this.y = this.y + this.vy;

  // Constrain y position to be on screen
  this.y = constrain(this.y,0,height-this.size);

  // Check for touching upper or lower edge and reverse velocity if so
  if (this.y === 0 || this.y + this.size === height) {
    this.vy = -this.vy;
  }
}

/******************* O F F S C R E E N   F U N C T I O N  ********************/

/* function triggers when the ball goes off the left or right side of the canvas.
   does the following:
      - checks if the ball has moved off the screen and, if so, returns true.
      - otherwise it returns false. */

Ball.prototype.isOffScreen = function () {
  // Check for going off screen and reset if so
  if (this.x + this.size < 0 || this.x > width) {
    return true;
  }
  else {
    return false;
  }
}

/********************* D I S P L A Y   F U N C T I O N  **********************/

/* Draws the ball as a rectangle on the screen */
Ball.prototype.display = function () {
  fill(255);
  rect(this.x,this.y,this.size,this.size);
}

/************ P A D D L E   C O L L I S I O N    F U N C T I O N *************/

/* function that checks if the ball is overlapping the paddle (as an argument)
   does the following:
      - checks if this ball overlaps the paddle passed as an argument
      - if so reverses x velocity to bounce*/

Ball.prototype.handleCollision = function(paddle) {
  // Check if the ball overlaps the paddle on x axis
  if (this.x + this.size > paddle.x && this.x < paddle.x + paddle.w) {
    // Check if the ball overlaps the paddle on y axis
    if (this.y + this.size > paddle.y && this.y < paddle.y + paddle.h) {
      // If so, move ball back to previous position (by subtracting current velocity)
      this.x = this.x - this.vx;
      this.y = this.x - this.vy;
      // Reverse x velocity to bounce
      this.vx = -this.vx;
    }
  }
}

/*********************** R E S E T     F U N C T I O N  **********************/
// Set position back to the middle of the screen
Ball.prototype.reset = function () {
  this.x = width/2;
  this.y = height/2;
}
