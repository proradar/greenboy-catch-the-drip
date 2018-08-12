var dead = false
var myGamePiece;
var myGamePiecePic;
var myObstacles = [];
var myScore;
var myHighScore;
var myGameOver;
var speedOfDrip = 3;
var score = 0;
var highScore = 0;
var hasPressed = false;
var audio = new Audio('music.wav');
var bucketPic = document.getElementById("bucketPic");
var dripPic = document.getElementById("dripPic");

audio.addEventListener('ended', function() {
    if (dead == false) {
      this.currentTime = 0;
      this.play();
    }
}, false);

function startGame() {
    myGamePiece = new component(30, 30, "rgba(255,255,255,0)", 235, 450);
    myGamePiecePic = new component(0, 0, "#000", 235, 450, "image", bucketPic);
    myScore = new component("30px", "Comic Sans MS", "white", 280, 40, "text");
    myScore.color = "#fff";
    myHighScore = new component("30px", "Comic Sans MS", "white", 188, 80, "text");
    myHighScore.color = "#fff";
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
        if (hasPressed == false) {
          this.interval = setInterval(updateGameArea, 20);
          hasPressed = true;
        }
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type, text) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.text = text;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else if (this.type == "image") {
            ctx.drawImage(this.text, this.x, this.y);
        }
        else {
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
          if (score > highScore) {
            highScore += 1
          }
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
    // speedOfDrip += 0.01;
    myScore.update();
    myHighScore.text="HIGH SCORE: " + highScore;
    myHighScore.update();
    if (leftKey == true) {
      myGamePiece.speedX = -5.25;
    }
    if (rightKey == true) {
      myGamePiece.speedX = 5.25;
    }
    if (rightKey == false) {
      if (leftKey == false) {
        myGamePiece.speedX = 0;
      }
    }
    myGamePiece.newPos();
    myGamePiece.update();
    if (leftKey == true) {
      myGamePiecePic.speedX = -5.25;
    }
    if (rightKey == true) {
      myGamePiecePic.speedX = 5.25;
    }
    if (rightKey == false) {
      if (leftKey == false) {
        myGamePiecePic.speedX = 0;
      }
    }
    myGamePiecePic.newPos();
    myGamePiecePic.update();
  }
  else {
    myGameOver = new component("50px", "Comic Sans MS", "white", 140, 250, "text");
    myGameOver.text="Game Over";
    myGameOver.update();
  }
}

document.onkeydown = checkKey;
document.onkeyup = stopKey;
var rightKey = false;
var leftKey = false;

function checkKey(e) {
    key = e || window.event;
    // console.log(key);
    if (key.keyCode == '37') {
       // left arrow
       // console.log("Left");
       // myGamePiece.speedX = -5.25;
       leftKey = true;
    }
    else if (key.keyCode == '39') {
       // right arrow
       // console.log("Right");
       // myGamePiece.speedX = 5.25;
       rightKey = true;
    }

}

function stopKey(e) {
    key = e || window.event;
    // console.log(key);
   if (key.keyCode == '37') {
       // left arrow
       // console.log("Left");
       // myGamePiece.speedX = 0
       leftKey = false;
    }
    else if (key.keyCode == '39') {
       // right arrow
       // console.log("Right");
       // myGamePiece.speedX = 0;
       rightKey = false;
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

start.onclick = function() {
  dead = false
  myGamePiece;
  myGamePiecePic;
  myObstacles = [];
  myScore;
  myGameOver;
  speedOfDrip = 3;
  score = 0;
  audio.currentTime = 0;
  startGame()
}
