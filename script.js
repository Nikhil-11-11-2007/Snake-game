const board = document.querySelector('.board')
const startButton = document.querySelector('.btn-start')
const modal = document.querySelector('.modal')
const starGameModal = document.querySelector('.start-game')
const gameOverModal = document.querySelector('.game-over')
const restartButton = document.querySelector('.btn-restart')

const highScoreElement = document.querySelector('#high-score')
const scoreElement = document.querySelector('#score')
const timeElement = document.querySelector('#time')


const blockHeight = 30
const blockWidth = 30

let highScore = localStorage.getItem("highScore") || 0
let time = `00-00`
let score = 0
let speed = 400

highScoreElement.innerText = highScore

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let interval = null
let timerInterval = null

let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
const blocks = []
let snake = [
    { x: 1, y: 3 }
]

let direction = 'right'

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div')
        block.classList.add('block')
        board.appendChild(block)
        blocks[`${row},${col}`] = block
    }
}

function render() {
    let head = null

    blocks[`${food.x},${food.y}`].classList.add('food')



    if (direction === 'left') {
        head = { x: snake[0].x, y: snake[0].y - 1 }
    } else if (direction === 'right') {
        head = { x: snake[0].x, y: snake[0].y + 1 }
    } else if (direction === 'down') {
        head = { x: snake[0].x + 1, y: snake[0].y }
    } else if (direction === 'up') {
        head = { x: snake[0].x - 1, y: snake[0].y }
    }

    // wall collision logic

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(interval)
        clearInterval(timerInterval)
        modal.style.display = 'flex'
        starGameModal.style.display = 'none'
        gameOverModal.style.display = 'flex'
        return
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            clearInterval(timerInterval)
            clearInterval(interval)
            modal.style.display = 'flex';
            starGameModal.style.display = 'none';
            gameOverModal.style.display = 'flex';
            return;
        }
    }

    // food consuming logic
    let ateFood = false
    if (head.x == food.x && head.y == food.y) {
        ateFood = true
        blocks[`${food.x},${food.y}`].classList.remove('food')
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
        blocks[`${food.x},${food.y}`].classList.add('food')
        // snake.unshift(head)

        score += 10
        scoreElement.innerText = score

        if (score % 20 === 0 && speed > 150) {
            speed -= 8
            clearInterval(interval)
            interval = setInterval(render, speed);
        }

        if (score > highScore) {
            highScore = score
            localStorage.setItem("highScore", highScore.toString())
        }
    }

    snake.forEach((elem) => {
        blocks[`${elem.x},${elem.y}`].classList.remove('fill')
    })

    snake.unshift(head)
    if(!ateFood){
        snake.pop()
    }

    snake.forEach((elem) => {
        blocks[`${elem.x},${elem.y}`].classList.add('fill')
    })
}

startButton.addEventListener("click", function () {
    modal.style.display = 'none'
    clearInterval(interval)
    interval = setInterval(() => { render() }, speed) // speed
    timerInterval = setInterval(() => {
        let [min, sec] = time.split("-").map(Number)
        if (sec == 59) {
            min += 1
            sec = 0
        } else {
            sec += 1
        }

        time = `${min}-${sec}`
        timeElement.innerText = time
    }, 1000);

    console.log(timerInterval, time);

})

restartButton.addEventListener("click", function () {
    restartGame()
})

function restartGame() {
    clearInterval(interval)
    clearInterval(timerInterval)

    blocks[`${food.x},${food.y}`].classList.remove('food')

    snake.forEach((elem) => {
        blocks[`${elem.x},${elem.y}`].classList.remove('fill')
    })
    speed = 400
    score = 0
    time = `00-00`
    scoreElement.innerText = score
    timeElement.innerText = time
    highScoreElement.innerText = highScore
    modal.style.display = 'none'
    direction = 'down'
    snake = [{ x: 1, y: 3 }]
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
    interval = setInterval(() => { render() }, speed)

}

addEventListener("keydown", function (e) {
    if (e.key == "ArrowUp" && direction !== 'down') {
        direction = 'up'
    } else if (e.key == "ArrowDown" && direction !== 'up') {
        direction = 'down'
    } else if (e.key == "ArrowLeft" && direction !== 'right') {
        direction = 'left'
    } else if (e.key == "ArrowRight" && direction !== 'left') {
        direction = 'right'
    }

})