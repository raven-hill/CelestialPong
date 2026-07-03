// INITIAL NOTES

// Every body stores:
//
// Position
// Velocity
// Acceleration
// Physical properties

//------------------------------------------------------------------------------

// Setting the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//----------------------------------------------------------------------------------

// Defining buttons
const startButton = {
    x: 500,
    y: 300,
    width: 200,
    height: 60,
    text: "Start Game",
    action: startGame
}

const elasticButton = {
    x: 300,
    y: 500,
    width: 200,
    height: 60,
    text: "Elastic Mode",
    action: startElasticGame
}

const voidButton = {
    x: 700,
    y: 500,
    width: 200,
    height: 60,
    text: "Void Mode",
    action: startVoidGame
}

const restartButton = {
    x: 500,
    y: 300,
    width: 200,
    height: 60,
    text: "Restart Game",
    action: restartGame
}

const selectionOptions = {
    title: [startButton],
    instructions: [elasticButton, voidButton],
    gameOver: [restartButton]
}

//----------------------------------------------------------------------------------

// Defining celestial bodies
const moon = {
    x: 600,
    y: 300,

    vx: 0,
    vy: 0,

    ax: 0,
    ay: 0,

    mass: 5,
    radius: 10
}

const planet1 = {
    x: 150,
    y: 300,

    vx: 0,
    vy: 0,

    ax: 0,
    ay: 0,

    mass: 100,
    radius: 20
}

const planet2 = {
    x: 1050,
    y: 300,

    vx: 0,
    vy: 0,

    ax: 0,
    ay: 0,

    mass: 100,
    radius: 20
}

const bodies = [moon, planet1, planet2];

//----------------------------------------------------------------------------------

// Defining game boarders
const leftEdge = {

    startx: 0,
    endx: 0,

    starty: 0,
    endy: canvas.height

}

const rightEdge = {

    startx: canvas.width,
    endx: canvas.width,

    starty: 0,
    endy: canvas.height
    
}

const centreLine = {
    
    startx: canvas.width / 2,
    endx: canvas.width / 2,

    starty: 0,
    endy: canvas.height

}

const topLeftEdge = {

    startx: 0,
    endx: canvas.width / 2,

    starty: 0,
    endy: 0
    
}

const topRightEdge = {

    startx: canvas.width / 2,
    endx: canvas.width,

    starty: 0,
    endy: 0
    
}

const bottomLeftEdge = {

    startx: 0,
    endx: canvas.width / 2,

    starty: canvas.height,
    endy: canvas.height
    
}

const bottomRightEdge = {

    startx: canvas.width / 2,
    endx: canvas.width,

    starty: canvas.height,
    endy: canvas.height
    
}

const boarders = [leftEdge, rightEdge, centreLine, topLeftEdge, topRightEdge, bottomLeftEdge, bottomRightEdge];

//----------------------------------------------------------------------------------

// Initial settings
let gameState = "title";
let gameMode = "";
let selection = 0;
const input = {};
const G = 0.1; // Gravity constant - adjust as needed!
const propulsionStrength = 0.1; // Adjust as needed

//----------------------------------------------------------------------------------

// Defining functions

// Button functions
function startGame() {
    gameState = "instructions";
    selection = 0; // Reset selection to first option
}

function startElasticGame() {

    gameMode = "elastic";
    gameState = "playing";
    selection = 0; // Reset selection to first option

}

function startVoidGame() {

    gameMode = "void";
    gameState = "playing";
    selection = 0; // Reset selection to first option

}

function gameOver() {
    
    gameState = "gameOver";
    selection = 0; // Reset selection to first option

}

function restartGame() {

    gameState = "title";
    selection = 0; // Reset selection to first option

}

// Physics functions
function gravityAccn(body1, body2) {

    const dx = body2.x - body1.x;
    const dy = body2.y - body1.y;
    const distance = Math.sqrt(dx*dx + dy*dy);

    if (distance < 1) {
        return; // Avoid division by zero
    }

    const force = (G * body1.mass * body2.mass) / (distance * distance);
    const forcex = force * (dx / distance);
    const forcey = force * (dy / distance);

    body1.ax += forcex / body1.mass;
    body1.ay += forcey / body1.mass;

    body2.ax -= forcex / body2.mass;
    body2.ay -= forcey / body2.mass;

}

function isColliding() {

    // Body-body collisions
    const dx = body2.x - body1.x;
    const dy = body2.y - body1.y;
    const distance = Math.sqrt(dx*dx + dy*dy);


    // are bodies colliding with each other

    // are bodies colliding with game boarders

}

// Moving celestial bodies
function applyGravity() {

    gravityAccn(moon, planet1);
    gravityAccn(moon, planet2);

}

function controlPlanet1() {

    if (input["w"] === true) {
        planet1.ay -= propulsionStrength;
    }
    if (input["s"] === true) {
        planet1.ay += propulsionStrength;
    }
    if (input["a"] === true) {
        planet1.ax -= propulsionStrength;
    }
    if (input["d"] === true) {
        planet1.ax += propulsionStrength;
    }
    else {
        return; // Ignore other keys
    } 

}

function controlPlanet2() {

    if (input["ArrowUp"] === true) {
        planet2.ay -= propulsionStrength;
    }
    if (input["ArrowDown"] === true) {
        planet2.ay += propulsionStrength;
    }
    if (input["ArrowLeft"] === true) {
        planet2.ax -= propulsionStrength;
    }
    if (input["ArrowRight"] === true) {
        planet2.ax += propulsionStrength;
    }
    else {
        return; // Ignore other keys
    }

}

function moveBodies() {
    
    for (let body of bodies) {

        body.vx += body.ax;
        body.vy += body.ay;

        body.x += body.vx;
        body.y += body.vy;
    
    }

}

function checkCollisions() {
    

}

// Simulation order:
//
// 1. Reset accelerations
// 2. Calculate gravity
// 3. Read player input
// 4. Update velocities
// 5. Update positions
// 6. Resolve collisions

function update() {

    // reset accelerations from previous frame
    for (let body of bodies) {
        body.ax = 0;
        body.ay = 0;
    }

    applyGravity();

    controlPlanet1();

    controlPlanet2();

    moveBodies();

    checkCollisions();

}  

// Drawing functions
ctx.textAlign = "center";
ctx.textBaseline = "middle"; //aligning text to the centre of the button

function drawButton(button) {

    const selectedButton = selectionOptions[gameState][selection];

    if (selectedButton === button) {
        ctx.fillStyle = "white";
    } 
    else {
        ctx.fillStyle = "gray";
    }
    ctx.fillRect(button.x, button.y, button.width, button.height);
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
}

function drawTitleScreen() {

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Celestial Pong", canvas.width / 2, 200);
    drawButton(startButton);

}

function drawInstructionsScreen() {
    
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Instructions", canvas.width / 2, 200);    
    
    drawButton(elasticButton);
    drawButton(voidButton);
}

function drawGame() {

    // Draw centre line
    ctx.strokeStyle = "grey";
    ctx.beginPath();
    ctx.moveTo(centreLine.startx, centreLine.starty);
    ctx.lineTo(centreLine.endx, centreLine.endy);
    ctx.stroke();

    // Draw moon
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(moon.x, moon.y, moon.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw planet 1
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(planet1.x, planet1.y, planet1.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw planet 2
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(planet2.x, planet2.y, planet2.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw sprites (later)
}

function drawGameOver() {
    // Draw game over
    drawButton(restartButton);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState === "title") {
        drawTitleScreen();
    }
    else if (gameState === "instructions") {
        drawInstructionsScreen();
    }
    else if (gameState === "playing") {
        drawGame();
    }
    else if (gameState === "gameOver") {
        drawGameOver();
    }
}

// Main game loop
function gameLoop() {

    if (gameState === "playing") {

        document.addEventListener("keydown", function(event) {
            input[event.key] = true;
        });

        document.addEventListener("keyup", function(event) {
            input[event.key] = false;
        });

        update();

    }

    draw();

    requestAnimationFrame(gameLoop);
}

//----------------------------------------------------------------------------------

// Making buttons work
function changeSelection(event) {

    if (gameState === "playing") {
        return; // Ignore selection changes during gameplay
    }
    else {
       if (event.key === "w" || event.key === "ArrowUp") {
            selection += 1
            if (selection > selectionOptions[gameState].length - 1) {
                selection = 0; // Wrap around to the first option
            }
        }
        else if (event.key === "s" || event.key === "ArrowDown") {
            selection -= 1
            if (selection < 0) {
                selection = selectionOptions[gameState].length - 1; // Wrap around to the last option
            }
        } 
        else {
            return; // Ignore other keys
        }
    }
}

function selectOption(event) {

    if (event.key === "Enter") {
        
        if (gameState === "playing") {
            return; // Ignore selection during gameplay
        }
        else {
            const selectedButton = selectionOptions[gameState][selection];
            selectedButton.action(); // Call the action associated with the selected button
        }
    }
    else {
        return; // Ignore other keys
    }

}

document.addEventListener("keydown", function(event) {;

    changeSelection(event);
    selectOption(event);

});

//----------------------------------------------------------------------------------

// Starting to run the game
document.addEventListener("keydown", function(event) {
    input[event.key] = true;
});

document.addEventListener("keyup", function(event) {
    input[event.key] = false;
});

gameLoop()

//----------------------------------------------------------------------------------

// TO DO:
//
// Implement collision detection
// Replace circles with sprites