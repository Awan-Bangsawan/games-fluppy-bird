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

// physics
let velocityX = -2; // pipes moving left speed
let velocityY = 0; // bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;

// ===== LOAD GAMBAR & INIT =====
window.onload = function () {
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth; // perbaikan: sebelumnya salah tulis boardwidth
    context = board.getContext("2d");

    // Load gambar
    birdImg = new Image();
    birdImg.src = "./image/flappybird.png";
    topPipeImg = new Image();
    topPipeImg.src = "./image/toppipe.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./image/bottompipe.png";

    // Tunggu semua gambar selesai dimuat baru mulai game
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

    // Jika gambar gagal dimuat, tetap jalan (pakai placeholder)
    birdImg.onerror = checkReady;
    topPipeImg.onerror = checkReady;
    bottomPipeImg.onerror = checkReady;
};

function startGame() {
    // Event untuk keyboard
    document.addEventListener("keydown", handleKeyPress);

    // Event untuk sentuhan & klik (layar HP)
    board.addEventListener("touchstart", handleTap);
    board.addEventListener("mousedown", handleTap);
    // Mencegah scroll pada touch
    board.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

    // Mulai loop
    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
}

// ===== FUNGSI UTAMA =====
function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        // Tetap gambar layar game over
        drawGameOver();
        return;
    }

    context.clearRect(0, 0, boardwidth, boardheight);

    // Bird physics
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Cek tabrakan dengan tanah
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

    // Hapus pipe yang sudah lewat layar
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // Tampilkan skor
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

    // Perbaikan: gunakan bottomPipeImg, bukan topPipeImg
    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

// ===== EVENT HANDLER =====
function handleKeyPress(e) {
    if (e.code === "Space" || e.code === "ArrowUp" || e.key === "x" || e.key === "X") {
        e.preventDefault(); // mencegah scroll halaman
        jump();
    }
}

function handleTap(e) {
    e.preventDefault(); // mencegah scroll / zoom
    jump();
}

function jump() {
    if (gameOver) {
        // Reset game
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
        velocityY = 0;
        // Hapus pesan game over dengan memulai ulang loop
        return;
    }
    // Lompat
    velocityY = -6;
}

// ===== DETEKSI TABRAKAN =====
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}