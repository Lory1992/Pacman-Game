// Trova il punto in cui disegnare sullo schermo
const canvas = document.getElementById("pacmanCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const startButtonContainer = document.getElementById("startButtonContainer");

// Quanto sono grandi le caselle del labirinto
const tileSize = 20;

// Come è fatto il labirinto (1=muro, 0=vuoto, 2=pallina, 3=mostro)
const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 2, 2, 1],
    [1, 2, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 2, 1],
    [1, 2, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 2, 1],
    [1, 2, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 0, 0, 3, 0, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Quante righe e colonne ci sono
const rows = map.length;
const cols = map[0].length;

// Pac-Man!
const pacman = {
    x: 1,
    y: 1,
    dx: 0,
    dy: 0,
};

// Mostro!
const monster = {
    x: 7,
    y: 7,
    speed: 1,
    direction: { x: 0, y: 0 },
    color: "red",
};

let gameOver = false;

// Funzione per ottenere una direzione casuale
function getRandomDirection() {
    const possibleDirections = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
    return possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
}

// Muovi il mostro
function moveMonster() {
    if (Math.random() < 0.2) {
        monster.direction = getRandomDirection();
    }

    const nextX = monster.x + monster.direction.x;
    const nextY = monster.y + monster.direction.y;

    const gridX = Math.floor(nextX);
    const gridY = Math.floor(nextY);

    if (map[gridY] && map[gridY][gridX] !== undefined && map[gridY][gridX] !== 1) {
        monster.x = nextX;
        monster.y = nextY;
    }
}

// Disegna il labirinto
function drawMap() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (map[row][col] === 1) {
                ctx.fillStyle = "blue";
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            } else if (map[row][col] === 2) {
                ctx.fillStyle = "yellow";
                ctx.beginPath();
                ctx.arc(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

// Disegna Pac-Man
function drawPacman() {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(pacman.x * tileSize + tileSize / 2, pacman.y * tileSize + tileSize / 2, tileSize / 2 - 2, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x * tileSize + tileSize / 2, pacman.y * tileSize + tileSize / 2);
    ctx.fill();
}

// Disegna il mostro
function drawMonster() {
    ctx.fillStyle = monster.color;
    ctx.beginPath();
    ctx.arc(monster.x * tileSize + tileSize / 2, monster.y * tileSize + tileSize / 2, tileSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
}

// Muovi Pac-Man
function movePacman() {
    if (!gameOver) {
        const nextX = pacman.x + pacman.dx;
        const nextY = pacman.y + pacman.dy;

        const gridX = Math.floor(nextX);
        const gridY = Math.floor(nextY);

        if (map[gridY] && map[gridY][gridX] !== undefined && map[gridY][gridX] !== 1) {
            pacman.x = nextX;
            pacman.y = nextY;

            if (map[pacman.y] && map[pacman.y][pacman.x] === 2) {
                map[pacman.y][pacman.x] = 0;
            }
        }
    }
}

// Controlla se Pac-Man e il mostro si scontrano
function checkCollision() {
    const pacmanGridX = Math.floor(pacman.x);
    const pacmanGridY = Math.floor(pacman.y);
    const monsterGridX = Math.floor(monster.x);
    const monsterGridY = Math.floor(monster.y);

    if (pacmanGridX === monsterGridX && pacmanGridY === monsterGridY && !gameOver) {
        console.log("Game Over!");
        gameOver = true;
    }
}

// Mostra il messaggio di Game Over
function drawGameOver() {
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    const gameOverText = "Game Over!";
    const textWidth = ctx.measureText(gameOverText).width;
    ctx.fillText(gameOverText, canvas.width / 2 - textWidth / 2, canvas.height / 2);
}

// Ascolta i tasti premuti
window.addEventListener("keydown", (e) => {
    if (!gameOver) {
        if (e.key === "ArrowUp") {
            pacman.dx = 0;
            pacman.dy = -1;
        } else if (e.key === "ArrowDown") {
            pacman.dx = 0;
            pacman.dy = 1;
        } else if (e.key === "ArrowLeft") {
            pacman.dx = -1;
            pacman.dy = 0;
        } else if (e.key === "ArrowRight") {
            pacman.dx = 1;
            pacman.dy = 0;
        }
    }
});

// Fai partire il gioco solo quando si clicca il pulsante
startButton.addEventListener("click", () => {
    startButtonContainer.style.display = "none";
    canvas.width = cols * tileSize;
    canvas.height = rows * tileSize;
    gameLoop();
});

// Funzione principale per far funzionare il gioco ad ogni "fotogramma"
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPacman();
    drawMonster();
    movePacman();
    moveMonster();
    checkCollision();

    if (gameOver) {
        drawGameOver();
    }

    requestAnimationFrame(gameLoop);
}