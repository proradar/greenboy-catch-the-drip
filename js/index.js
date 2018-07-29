var dead = false
var myGamePiece;
var myObstacles = [];
var myScore;
var myGameOver;
var score = 0;
var audio = new Audio('music.wav');

audio.addEventListener('ended', function() {
    if (dead == false) {
      this.currentTime = 0;
      this.play();
    }
}, false);

function startGame() {
    myGamePiece = new component(30, 30, "white", 235, 450);
    myGamePiece.gravity = 0.05;
    myScore = new component("30px", "Consolas", "white", 280, 40, "text");
    myScore.color = "#fff";
    myGameArea.start();
    audio.play();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.getElementById('gameContent').appendChild(this.canvas);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var bottom = myGameArea.canvas.height - this.height;
        var top = 0;
        var right = myGameArea.canvas.width - this.width;
        var left = 0;
        if (this.y > bottom) {
            this.y = bottom;
        }
        if (this.y < top) {
            this.y = top;
        }
        if (this.x < left) {
            this.x = left;
        }
        if (this.x > right) {
            this.x = right;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
  if (dead == false) {

    var y, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
          myObstacles.splice(i, 1);
          score += 1
        }
        if (myObstacles[i].y > myGameArea.canvas.height+20) {
          myObstacles.splice(i, 1);
          dead = true
          audio.pause();
          audio.currentTime = 0;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(80)) {
        x = Math.floor(Math.random()*(myGameArea.canvas.width-40)+1);
        myObstacles.push(new component(20, 20, "blue", x, 0));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].y += 5;
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + score;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
  }
  else {
    myGameOver = new component("50px", "Consolas", "white", 140, 250, "text");
    myGameOver.text="Game Over";
    myGameOver.update();
  }
}

document.onkeydown = checkKey;
document.onkeyup = stopKey;

function checkKey(e) {
    key = e || window.event;
    // console.log(key);
    if (key.keyCode == '37') {
       // left arrow
       // console.log("Left");
       myGamePiece.speedX = -5.25;
    }
    else if (key.keyCode == '39') {
       // right arrow
       // console.log("Right");
       myGamePiece.speedX = 5.25;
    }

}

function stopKey(e) {
    key = e || window.event;
    // console.log(key);
   if (key.keyCode == '37') {
       // left arrow
       // console.log("Left");
       myGamePiece.speedX = 0;
    }
    else if (key.keyCode == '39') {
       // right arrow
       // console.log("Right");
       myGamePiece.speedX = 0;
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

start.onclick = function() {
}
