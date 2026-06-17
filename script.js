//board
let board;
let boardwidth = 360;
let boardheight = 640;
let context;
//bird
let birdwidth = 34;
let birdheight = 24;
let birdX = boardwidth/8;
let birdY = boardheight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdwidth,
    height : birdheight
}
//pipa
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardwidth;
let pipeY = 0;

let topPipeImg;
let bottompipeImg;
//physics
let velocityX = -2;//ipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardheight;
    boardwidth = boardwidth;
    context = board.getContext("2d");//used for drawing on the board
}
//load images
birdImg = new Image();
birdImg.src = "./image/flappybird.png";
birdImg.onload = function(){
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

} 
topPipeImg = new Image();
topPipeImg.src = "./image/toppipe.png";

bottompipeImg = new Image();
bottompipeImg.src = "./image/bottompipe.png";

requestAnimationFrame(update);
setInterval(placepipes, 1500);//every 1.5 seconds
document.addEventListener("keydown", moveBird);

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0, 0, boardwidth, boardheight);
    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, birdwidth, birdheight);

    if(bird.y > boardheight){
        gameOver = true;
    }
    //pipa
    for(let i = 0; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipeWidth){
            score += 0.5;
            pipe.passed = true;
        }
        if(detectCollision(bird, pipe)){
            gameOver = true;
        }
        
    }
    //clear pipa
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift();
    }
    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if(gameOver){
        context.fillText("GAME OVER", 5, 90);
    }

}
function placepipes(){
    if(gameOver){
        return;
    }
let randompipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
let openingSpace = boardheight/4;

let topPipe = {
    img : topPipeImg,
    x : pipeX,
    y : randompipeY,
    width : pipeWidth,
    height : pipeHeight,
    passed : false
}
pipeArray.push(topPipe);


let bottomPipe = {
    img : topPipeImg,
    x : pipeX,
    y : randompipeY + pipeHeight + openingSpace,
    width : pipeWidth,
    height : pipeHeight,
    passed : false
}
pipeArray.push(bottomPipe);
}

function moveBird(e){
    if (e.code == "Space" || e.code == "ArrowUp"|| e.code == "keyX"){
        //jump
        velocityY = -6;

        //reset game
        if(gameOver){
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;

        }
    }
}
function detectCollision(a, b){
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}


