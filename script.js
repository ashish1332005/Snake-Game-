let inputdir = { x: 0, y: 0 };
const foodSound = new Audio("food.mp3");
const gameoversound = new Audio("gameover.mp3");
const moveSound = new Audio("move.mp3");
const musicSound = new Audio("music.mp3");

let speed = 6.5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

const board = document.getElementById("board");
const scoreBox = document.getElementById("scoreBox");
const highscoreBox = document.getElementById("highscoreBox");


document.addEventListener("touchstart", () => {
    musicSound.play().catch(error => console.log("Autoplay Blocked:", error));
}, { once: true });


// Mobile Swipe Controls
let touchStartX = 0, touchStartY = 0;
document.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchmove", (e) => {
    let touchEndX = e.touches[0].clientX;
    let touchEndY = e.touches[0].clientY;
    let diffX = touchEndX - touchStartX;
    let diffY = touchEndY - touchStartY;
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            inputdir = { x: 1, y: 0 }; // Right
        } else {
            inputdir = { x: -1, y: 0 }; // Left
        }
    } else {
        if (diffY > 0) {
            inputdir = { x: 0, y: 1 }; // Down
        } else {
            inputdir = { x: 0, y: -1 }; // Up
        }
    }
    moveSound.play();
});

// Game Function
function main(ctime) {
    requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}



function isCollide(snake) {
   // If you bump into yourself
   for (let i = 1; i < snakeArr.length; i++) {
       if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
           return true;
       }
   }

   // If you hit the wall
   if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
       return true;
   }
   return false;
}

function gameEngine() {
    musicSound.play();
    // Part 1: Updating the snake array & food
    if (isCollide(snakeArr)) {
        gameoversound.play();
        musicSound.pause();
        inputdir = { x: 0, y: 0 };
        alert("Game Over. Press any key to play again!");
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
        musicSound.play();
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        foodSound.currentTime = 0;
        score += 1;
        scoreBox.innerHTML = "Score: " + score;

        // Update high score
        if (score > highscoreval) {
            highscoreval = score;
            localStorage.setItem("highscore", JSON.stringify(highscoreval));
            highscoreBox.innerHTML = "High Score: " + highscoreval;
        }

        snakeArr.unshift({
            x: snakeArr[0].x + inputdir.x,
            y: snakeArr[0].y + inputdir.y
        });

        let a = 2, b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        };
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputdir.x;
    snakeArr[0].y += inputdir.y;

    // Part 2: Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index == 0) {
            snakeElement.classList.add("head");
        } else {
            snakeElement.classList.add("snake");
        }

        board.appendChild(snakeElement);
    });

    // Display the food
    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");

    board.appendChild(foodElement);
}

// Main logic starts here
let highscore = localStorage.getItem("highscore");
let highscoreval;
if (highscore === null) {
    highscoreval = 0;
    localStorage.setItem("highscore", JSON.stringify(highscoreval));
} else {
    highscoreval = JSON.parse(highscore);
    highscoreBox.innerHTML = "High Score: " + highscoreval;
}



window.requestAnimationFrame(main);
window.addEventListener("keydown", (e) => {
    inputdir = { x: 0, y: 1 }; // Start the game
    moveSound.play();

    switch (e.key) {
        case "ArrowUp":
            inputdir.x = 0;
            inputdir.y = -1;
            console.log("ArrowUp");
            break;
        case "ArrowDown":
            inputdir.x = 0;
            inputdir.y = 1;
            console.log("ArrowDown");
            break;
        case "ArrowLeft":
            inputdir.x = -1;
            inputdir.y = 0;
            console.log("ArrowLeft");
            break;
        case "ArrowRight":
            inputdir.x = 1;
            inputdir.y = 0;
            console.log("ArrowRight");
            break;
        default:
            break;
    }
});
