// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let para = document.querySelector('p');
let noOfBalls = 0;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

//Modelling a shape
function Shape(x, y, velX, velY, exists){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

//Modelling a ball
function Ball(x, y, velX, velY, color, size, exists){
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
}

//Drawing a ball
Ball.prototype.draw = function(){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

//moving a ball
Ball.prototype.update = function(){
    if(this.x + this.size >= width){
        this.velX = -this.velX;
    }
    if(this.x - this.size <= 0){
        this.velX = - this.velX;
    }
    if(this.y + this.size >= height){
        this.velY = -this.velY;
    }
    if(this.y - this.size <= 0){
        this.velY = - this.velY;
    }
    this.x += this.velX;
    this.y += this.velY;
}

//collision detection
Ball.prototype.collisionDetection = function(){
    for(let j=0; j<balls.length; j++){
        if(!(this === balls[j]) && balls[j].exists){
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx*dx + dy*dy);

            if(distance < this.size + balls[j].size){
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
}

function EvilCircle(x, y, exists){
    Shape.call(this, x, y, 20, 20, exists);
    this.color = 'white';
    this.size = 10;
}

EvilCircle.prototype.draw = function(){
    ctx.beginPath();
    ctx.lineWidth(3);
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
}
EvilCircle.prototype.checkBounds = function(){
    if(this.x + this.size >= width){
        this.x = this.size - this.x;
    }
    if(this.x - this.size <= 0){
        this.x = this.size + this.x;
    }
    if(this.y + this.size >= height){
        this.y = this.size - this.y;
    }
    if(this.y - this.size <= 0){
        this.y = this.size + this.y;
    }
}
EvilCircle.prototype.setControls = function(){
    let _this = this;
    window.onkeydown = function(e){
        if(e.key === 'a'){
            _this.x -= _this.velX;
        }else if(e.key === 'd'){
            _this.x += _this.velX;
        }else if(e.key === 'w'){
            _this.y -= _this.velY;
        }else if(e.key === 's'){
            _this.y += _this.velY;
        }
    }
}
EvilCircle.prototype.collisionDetect = function(){
    for(let j=0; j<balls.length; j++){
        if(balls[j].exists){
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx*dx + dy*dy);

            if(distance < this.size + balls[j].size){
                balls[j].exists = false;
                noOfBalls--;
            }
        }
    }
}

let balls = [];

// animating balls
while (balls.length < 25){
    let size = random(10, 20);
    let exists = true;
    let ball = new Ball(
        random(0+size, width-size),
        random(0+size, height-size),
        random(-7, 7),
        random(-7, 7),
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
        size,
        exists
    );

    balls.push(ball);
    noOfBalls++;
}



function loop(){
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    let evilCircle = new EvilCircle(50, 50, true);
    evilCircle.setControls();

    for(let i=0; i<balls.length; i++){
        if(balls[i].exists){
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetection();
            evilCircle.draw();
            evilCircle.checkBounds();
            evilCircle.collisionDetect();
        }
        
    }

    requestAnimationFrame(loop);
}

loop();

para.textContent = noOfBalls;