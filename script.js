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
let time = ``
let score = 0

highScoreElement.innerText = highScore

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let interval = null
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
        block.innerText = `${row},${col}`
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
        modal.style.display = 'flex'
        starGameModal.style.display = 'none'
        gameOverModal.style.display = 'flex'
        return
    }

    // food consuming logic
    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x},${food.y}`].classList.remove('food')
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
        blocks[`${food.x},${food.y}`].classList.add('food')
        snake.unshift(head)

        score += 10
        scoreElement.innerText = score

        if(score > highScore){
            highScore = score
            localStorage.setItem("highScore", highScore.toString())
        }
    }

    snake.forEach((elem) => {
        blocks[`${elem.x},${elem.y}`].classList.remove('fill')
    })

    snake.unshift(head)
    snake.pop()

    snake.forEach((elem) => {
        blocks[`${elem.x},${elem.y}`].classList.add('fill')
    })
}

startButton.addEventListener("click", function () {
    modal.style.display = 'none'
    interval = setInterval(() => { render() }, 350)
})

restartButton.addEventListener("click", function () {
    restartGame()
})

function restartGame() {
    clearInterval(interval)

    blocks[`${food.x},${food.y}`].classList.remove('food')

    snake.forEach((elem) => {
        blocks[`${elem.x},${elem.y}`].classList.remove('fill')
    })

    score = 0
    time = `00-00`
    scoreElement.innerText = score
    timeElement.innerText = time
    highScoreElement.innerText = highScore
    modal.style.display = 'none'
    direction = 'down'
    snake = [{ x: 1, y: 3 }]
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) }
    interval = setInterval(() => { render() }, 350)

}

addEventListener("keydown", function (e) {
    if (e.key == "ArrowUp") {
        direction = 'up'
    } else if (e.key == "ArrowDown") {
        direction = 'down'
    } else if (e.key == "ArrowLeft") {
        direction = 'left'
    } else if (e.key == "ArrowRight") {
        direction = 'right'
    }

})