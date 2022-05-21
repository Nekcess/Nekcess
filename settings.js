/** @type {HTMLCanvasElement} */



const canvas = document.querySelector(".snake-game")
const context = canvas.getContext("2d")
const board_border = 'black';
const board_background = "white";
const gameOver = document.querySelector(".game-over")
var keMap = {
    "keyW ": "up",
    "ArrowUp": "up",
    "ArrowDown": "down",
    "KeyS": "down",
    "ArrowRight":"right",
    "KeyD": "right",
    "ArrowLeft":"left",
    "KeyA": "left",
}

var directionUdpate = {
    'up':['y', -20],
    'down' : ['y', 20],
    'left' : ['x', -20],
    'right' : ['x', 20]
}


snake = [
    {x:200,y:200},
    {x:190,y:200},
    {x:180, y:200},
    {x:170, y:200},
]


let dx = 10
let dy = 0
let game_over = null
let foodPosY
let foodPosX
let game_Speed = 0


gen_food()

// function main(){
//     if(game_over){
//         gameOver.classList.add("active")
//         return
//     }

//     setTimeout(() => {

//     }, 100);
// }


function MakeFood(){
    context.fillStyle = "orange"
    context.fillRect(foodPosX,foodPosY, 10,10)
}

function draw_snake(snake_body){
    context.fillStyle = "red"

    for (let index = 0; index < snake.length; index++) {
        context.fillRect(snake_body[index].x, snake_body[index].y, 10, 10) 
    }
}
let up = false
let right = true
let left = false
let down = false
const snakeBody = 10

let eat = false

function SelfLoopCheck(){
    for (let index = 1; index < snake.length; index++) {
        if(snake[0].y === snake[index].y && snake[0].x === snake[index].x){
            game_over = true
            console.log("KILLED");
        }
    }
}

function moveTheHead(){
    document.addEventListener("keydown", (e)=>{

        if(e.code == "ArrowUp" && down == false){
            dy = -10
            dx = 0
            up = true
            left = false 
            right = false
            down = false
        }

        if(e.code == "ArrowDown" && up == false){
            dy = 10
            dx = 0
            down = true
            up = false
            left = false
            right = false
        }

        if(e.code == "ArrowLeft" && right == false){
            dy = 0
            dx = -10
            left = true
            up = false
            down = false
            right = false
        }

        if(e.code == "ArrowRight" && left == false){
            dy = 0
            dx = 10
            right = true
            left = false
            up = false
            down = false

        }

    })
    const head = {x: snake[0].x + dx, y: snake[0].y + dy }
    // Add the head infront of the array
    snake = [head, ...snake]

    const addon = {x:snake[snake.length - 1]-snakeBody, y:200 }
    const has_eaten_food = snake[0].x === foodPosX && snake[0].y === foodPosY;
    if(has_eaten_food){
        gen_food()
        snake.push(addon)
    }

    // Remove the tail,as the head addons to the array.
    snake.pop()
    // console.log(snake[0].x)
    if(snake[0].x > canvas.width - 10 ){
        snake[0].x = 0
    }
    else if (snake[0].x < 0){
        snake[0].x = canvas.width
    }

    else if(snake[0].y > canvas.height - 10){
        snake[0].y = 0
    }
    else if (snake[0].y < 0){
        snake[0].y = canvas.height
    }

}

function randomizeTheFood(min,max){
    return Math.round((Math.random() * (max - min) + min ) / 10) * 10
}

function gen_food(){
    foodPosY = randomizeTheFood(0, context.canvas.height)
    foodPosX = randomizeTheFood(0, context.canvas.width)
    for (let index = 0; index < snake.length; index++) {
        const has_eaten_food = snake[index].x === foodPosX && snake[index].y === foodPosY;
        if(has_eaten_food){
            gen_food()
            console.log("ATE");
        }
    }
}




function clearCanvas(){
          //  Select the colour to fill the drawing
          context.fillStyle = board_background;
          //  Select the colour for the border of the canvas
          context.strokestyle = board_border;
          // Draw a "filled" rectangle to cover the entire canvas
          context.fillRect(0, 0, canvas.width, canvas.height);
          // Draw a "border" around the entire canvas
          context.strokeRect(0, 0, canvas.width, canvas.height);
}
var previous, elapsed

function frame(timestamp){
    if(game_over){
        gameOver.classList.add("active")
        return
    }
    setTimeout(() => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        if (!previous) previous = timestamp;
        elapsed = timestamp - previous;

        clearCanvas()
        moveTheHead()
        SelfLoopCheck()
        draw_snake(snake || snake_array)
        MakeFood()
        previous = timestamp;
        window.requestAnimationFrame(frame);
        
    }, 100);
}
window.requestAnimationFrame(frame)




