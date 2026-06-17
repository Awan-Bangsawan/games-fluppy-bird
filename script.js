// board
let board;
let boardwidth = 360;
let boardheight = 640;
let context;

// bird
let birdwidth = 34;
let birdheight = 24;
let birdX = boardwidth / 8;
let birdY = boardheight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdwidth,
    height: birdheight
};

// pipe
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardwidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// physics - DIPERBAIKI: gravitasi lebih kecil, lompatan lebih kuat
let velocityX = -2;
let velocityY = 0;
let gravity = 0.25;        // <--- dikurangi dari 0.4
let jumpPower = -6.5;      // <--- kekuatan lompatan

let gameOver = false;
let score = 0;

// ===== LOAD GAMBAR & INIT =====
window.onload = function () {
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "./image/flappybird.png";
    topPipeImg = new Image();
    topPipeImg.src = "./image/toppipe.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./image/bottompipe.png";

    let imagesLoaded = 0;
    const totalImages = 3;
    function checkReady() {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            startGame();
        }
    }
    birdImg.onload = checkReady;
    topPipeImg.onload = checkReady;
    bottomPipeImg.onload = checkReady;
    birdImg.onerror = checkReady;
    topPipeImg.onerror = checkReady;
    bottomPipeImg.onerror = checkReady;
};

function startGame() {
    document.addEventListener("keydown", handleKeyPress);
    board.addEventListener("touchstart", handleTap);
    board.addEventListener("mousedown", handleTap);
    board.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
}

// ===== UPDATE =====
function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        drawGameOver();
        return;
    }

    context.clearRect(0, 0, boardwidth, boardheight);

    // Bird physics
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y + bird.height > boardheight) {
        gameOver = true;
    }

    // Pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // Score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(Math.floor(score), 5, 45);

    if (gameOver) {
        drawGameOver();
    }
}

function drawGameOver() {
    context.fillStyle = "rgba(0,0,0,0.5)";
    context.fillRect(0, boardheight / 2 - 50, boardwidth, 100);
    context.fillStyle = "white";
    context.font = "40px sans-serif";
    context.textAlign = "center";
    context.fillText("GAME OVER", boardwidth / 2, boardheight / 2 + 10);
    context.font = "20px sans-serif";
    context.fillText("Tap / Spasi untuk mulai ulang", boardwidth / 2, boardheight / 2 + 50);
    context.textAlign = "left";
}

function placePipes() {
    if (gameOver) return;

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = boardheight / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,   // sudah diperbaiki
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

// ===== EVENT =====
function handleKeyPress(e) {
    if (e.code === "Space" || e.code === "ArrowUp" || e.key === "x" || e.key === "X") {
        e.preventDefault();
        jump();
    }
}

function handleTap(e) {
    e.preventDefault();
    jump();
}

function jump() {
    if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
        velocityY = 0;
        return;
    }
    velocityY = jumpPower;   // menggunakan jumpPower yang sudah disesuaikan
}

// ===== COLLISION =====
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}