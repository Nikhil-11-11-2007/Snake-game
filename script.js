const board = document.querySelector('.board')
const blockHeight = 40
const blockWidth = 40
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

const blocks = []
const snake = [
    {x: 1, y: 3}
]

let direction = 'left'

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
    snake.forEach((elem) => {
        blocks[`${elem.x},${elem.y}`].classList.add('fill')
    })
}

setInterval(() => {
    let head = null

    if(direction === 'left'){
        head = {x: snake[0].x, y: snake[0].y - 1}
    }

    snake.forEach((elem) => {
        blocks[`${elem.x},${elem.y}`].classList.remove('fill')
    })

    snake.unshift(head)
    snake.pop()
    render()
}, 400);