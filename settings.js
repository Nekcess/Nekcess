/** @type {HTMLCanvasElement} */
const canvas = document.querySelector(".snake-game")
const context = canvas.getContext("2d")
const board_border = 'black';
const board_background = "white";
const gameOver = document.querySelector(".game-over")

class Snake{    
    constructor(screen){
        this.gameWidth = screen.width
        this.gameHeight = screen.height
        this.dx = 10
        this.dy = 0
        this.game_over = null
        this.foodPosY = Math.round( Math.random() * (this.gameHeight - 0) / 10 ) * 10 
        this.foodPosX = Math.round( Math.random() * (this.gameWidth - 0) / 10 ) * 10
        this.game_Speed = 0
        
        this.snake_body = [
            {x:200,y:200},
            {x:190,y:200},
            {x:180, y:200},
            {x:170, y:200},
        ]
        
        this.game_over = false
        this.snakeUp = false
        this.snakeDown = false
        this.snakeLeft = false
        this.snakeRight = true

        this.keMap = {
            "keyW ": "up",
            "ArrowUp": "up",
            "ArrowDown": "down",
            "KeyS": "down",
            "ArrowRight":"right",
            "KeyD": "right",
            "ArrowLeft":"left",
            "KeyA": "left",
        }
    }
    

    make_snake(ctx){
        ctx.fillStyle = "red"
        ctx.strokestyle = "darkred";
        for (let index = 0; index < this.snake_body.length; index++){
            ctx.fillRect(this.snake_body[index].x, this.snake_body[index].y, 10, 10)
            ctx.strokeRect(this.snake_body[index].x, this.snake_body[index].y, 10, 10);
        }
    }

    createFood(ctx){
        ctx.fillStyle = "orange"
        ctx.fillRect(this.foodPosX, this.foodPosY, 10, 10)
    }

    updateSnake(ctx){
        var head = { x:this.snake_body[0].x + this.dx, y:this.snake_body[0].y + this.dy}
        // Add the head in fronte of the array
        this.snake_body  = [head, ...this.snake_body]
        // removes the last element from the array as in this case, the tail

        // add new element body into the array
        const has_eaten = this.snake_body[0].x === this.foodPosX && this.snake_body[0].y === this.foodPosY
        if(has_eaten){
            this.generateFood()
        }else{
            this.snake_body.pop()
        }
        
        //check if the snake exited the screen
        if(this.snake_body[0].x > ctx.canvas.width - 10 ){
            this.snake_body[0].x = 0
        }
        else if (this.snake_body[0].x < 0){
            this.snake_body[0].x = ctx.canvas.width
        }
    
        else if(this.snake_body[0].y > ctx.canvas.height - 10){
            this.snake_body[0].y = 0
        }
        else if (this.snake_body[0].y < 0){
            this.snake_body[0].y = ctx.canvas.height
        }
        
        for (let index = 1; index < this.snake_body.length; index++) {
            if(this.snake_body[0].y === this.snake_body[index].y && this.snake_body[0].x === this.snake_body[index].x){
                this.game_over = true
                console.log("KILLED");
            }
        }
    }

    createMovement(){
        document.addEventListener("keydown", keys=>{
            const direction = this.keMap[keys.code]
            if(direction == "up" && !this.snakeDown){
                this.dy = -10
                this.dx = 0
                this.snakeDown = false
                this.snakeUp = true
                this.snakeLeft = false
                this.snakeRight = false
            }
            if(direction == "down" && !this.snakeUp){
                this.dx = 0
                this.dy = 10
                this.snakeDown = true
                this.snakeUp = false
                this.snakeLeft = false
                this.snakeRight = false
            }
            if(direction == "left" && !this.snakeRight){
                this.dx = -10
                this.dy = 0
                this.snakeLeft = true
                this.snakeRight = false
                this.snakeUp = false
                this.snakeDown = false
            }
            if( direction == "right" && !this.snakeLeft){
                this.dx = 10
                this.dy = 0
                this.snakeRight = true
                this.snakeLeft = false
                this.snakeUp = false
                this.snakeDown = false
            }
        })
    }

    randomiseFood(min,max){
        return Math.round((Math.random() * (max - min) + min ) / 10) * 10
    }
    
    generateFood(){
        this.foodPosY= this.randomiseFood(0,this.gameHeight)
        this.foodPosX = this.randomiseFood(0, this.gameWidth)
        for (let index = 0; index < this.snake_body.length; index++) {
            const has_eaten_food = this.snake_body[index].x === this.foodPosX && this.snake_body[index].y === this.foodPosY;
            if(has_eaten_food){
                this.generateFood()
            }
        }
    }

}


function clearCanvas(){
    context.fillStyle = board_background;
    context.strokestyle = board_border;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeRect(0, 0, canvas.width, canvas.height);
}

const firstsnake = new Snake({
    width: context.canvas.width,
    height : context.canvas.height
})

function update(){
    clearCanvas()
    firstsnake.make_snake(context)
    firstsnake.updateSnake(context)
    firstsnake.createFood(context)
    firstsnake.createMovement()
}

var previous, elapsed

function frame(timestamp){
    if(firstsnake.game_over){
        gameOver.classList.add("active")
        return
    }
    setTimeout(() => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        if (!previous) previous = timestamp;
        elapsed = timestamp - previous;
        update()
        previous = timestamp;
        window.requestAnimationFrame(frame);
        
    }, 100);
}
window.requestAnimationFrame(frame)