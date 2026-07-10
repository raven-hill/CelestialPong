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

function resetBodies() {

    const moon = {
        x: 600,
        y: 300,

        vx: 0,
        vy: 0,

        ax: 0,
        ay: 0,

        mass: 5,
        radius: 3,

        colour: "255,255,255", // white, still needs opcity though!
        trailx: [600],
        traily: [300],
        trailLength: 60
    }

    const planet1 = {
        x: 150,
        y: 300,

        vx: 0,
        vy: 0,

        ax: 0,
        ay: 0,

        mass: 100,
        radius: 5,

        colour: "0,0,255", // blue, still needs opacity though!
        trailx: [150],
        traily: [300],
        trailLength: 30
    }

    const planet2 = {
        x: 1050,
        y: 300,

        vx: 0,
        vy: 0,

        ax: 0,
        ay: 0,

        mass: 100,
        radius: 5,

        colour: "255,0,0",  // red, still needs opacity though!
        trailx: [1050],
        traily: [300],
        trailLength: 30
    }

    return { moon, planet1, planet2 };
}

const { moon, planet1, planet2 } = resetBodies();

const bodies = [moon, planet1, planet2];

//----------------------------------------------------------------------------------

// Initial settings
let gameState = "title";
let gameMode = "";
let selection = 0; // Reset selection to first option
let isEndGame = false;
let winner = "";
const trailTransparency = "0.4";
const input = {};
const G = 2.0; // Gravity constant - adjust as needed!
const propulsionStrength = 0.3; // Adjust as needed
const velocityLimit = 3; // Adjust as needed
ctx.textAlign = "center";
ctx.textBaseline = "middle"; //aligning text to the centre of the button

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
    gameMode = "";
    selection = 0; // Reset selection to first option
    isEndGame = false;
    winner = "";
    
    const reset = resetBodies();

    Object.assign(moon, reset.moon);
    Object.assign(planet1, reset.planet1);
    Object.assign(planet2, reset.planet2);

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

// Collision detection functions
function isMoonBoarderColliding() {

    if (gameMode === "elastic") {   

        if (moon.y - moon.radius <= 0 || moon.y + moon.radius >= canvas.height) {
            moon.vy *= -1; // Reverse vertical velocity
            return;
        }
        if (moon.x - moon.radius <= 0 || moon.x + moon.radius >= canvas.width) {
            moon.vx *= -1; // Reverse horizontal velocity
            return;
        }
    }

    if (gameMode === "void") {

        if (moon.y - moon.radius <= 0 || moon.y + moon.radius >= canvas.height) {
            if (moon.x < canvas.width / 2) {  // Collision with top or bottom wall on left side
                winner = "Player 2";
                gameOver();
                return;
            }
            else {  // Collision with top or bottom wall on right side
                winner = "Player 1";
                gameOver();
                return;
            }
        }
        if (moon.x - moon.radius <= 0) {  // Collision with left wall
            winner = "Player 2";
            gameOver();
            return;
        }
        if (moon.x + moon.radius >= canvas.width) {  // Collision with right wall
            winner = "Player 1";
            gameOver();
            return;
        }
    }

    else {
        return; // No collision detected
    }
}

function isMoonPlanetColliding() {

    // Check for collision between moon and planet1
    const dx1 = moon.x - planet1.x;
    const dy1 = moon.y - planet1.y;
    const distance1 = Math.sqrt(dx1*dx1 + dy1*dy1);

    if (distance1 <= moon.radius + planet1.radius) {
        winner = "Player 2";
        gameOver();
        return;
    }

    // Check for collision between moon and planet2
    const dx2 = moon.x - planet2.x;
    const dy2 = moon.y - planet2.y;
    const distance2 = Math.sqrt(dx2*dx2 + dy2*dy2);

    if (distance2 <= moon.radius + planet2.radius) {
        winner = "Player 1";
        gameOver();
        return;
    }
}

function isPlanetBoarderColliding(planet) {

    // Collision with left wall
    if (planet.x - planet.radius <= 0) {
        planet.x = planet.radius + 1; // Prevent going out of bounds
        planet.vx = 0; // Stop horizontal movement
    }

    // Collision with right wall
    if (planet.x + planet.radius >= canvas.width) {
        planet.x = canvas.width - planet.radius - 1; // Prevent going out of bounds
        planet.vx = 0; // Stop horizontal movement
    }

    // Collision with top wall
    if (planet.y - planet.radius <= 0) {
        planet.y = planet.radius + 1; // Prevent going out of bounds
        planet.vy = 0; // Stop vertical movement
    }

    // Collision with bottom wall
    if (planet.y + planet.radius >= canvas.height) {
        planet.y = canvas.height - planet.radius - 1; // Prevent going out of bounds
        planet.vy = 0; // Stop vertical movement
    }

    // Collision with centre line
    if (planet === planet1 && planet.x + planet.radius >= canvas.width / 2) {
        planet.x = canvas.width / 2 - planet.radius - 1;
        planet.vx = 0; // Stop horizontal movement
    }
    else if (planet === planet2 && planet.x - planet.radius <= canvas.width / 2) {
        planet.x = canvas.width / 2 + planet.radius + 1;
        planet.vx = 0; // Stop horizontal movement
    }

}

// Moving celestial bodies
function applyGravity() {

    gravityAccn(moon, planet1);
    gravityAccn(moon, planet2);
    //gravityAccn(planet1, planet2); // Optional (remove if it makes gameplay too hard)

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

        if (body.vx < velocityLimit || body.vx > -velocityLimit) {
            body.vx += body.ax;
        }
        if (body.vy < velocityLimit || body.vy > -velocityLimit) {
            body.vy += body.ay;
        }

        body.x += body.vx;
        body.y += body.vy;
    
    }

}

function checkCollisions() {

    isMoonBoarderColliding();

    isMoonPlanetColliding();

    isPlanetBoarderColliding(planet1);
    
    isPlanetBoarderColliding(planet2);

}

function createTrail(body) {

    body.trailx.push(body.x);
    body.traily.push(body.y);

    if (body.trailx.length > body.trailLength) {
        body.trailx.shift();
        body.traily.shift();
    }

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

    for (let body of bodies) {
        createTrail(body)
    }

}  

// Drawing functions
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

function drawTrail(body) {

    for (i = body.trailx.length - 1; i>= 0; i -= 1) {
        let particleRadius = body.radius * ((i + 1)/(body.trailx.length));
        ctx.fillStyle = `rgba(${body.colour}, ${trailTransparency})`;
        ctx.beginPath();
        ctx.arc(body.trailx[i], body.traily[i], particleRadius, 0, Math.PI * 2);
        ctx.fill();
    }

}


function drawGame() {

    // Draw centre line
    ctx.strokeStyle = "grey";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Draw bodies
    for (let body of bodies) {
        drawTrail(body)
        ctx.fillStyle = `rgba(${body.colour},1)`;
        ctx.beginPath();
        ctx.arc(Math.round(body.x), Math.round(body.y), body.radius, 0, Math.PI * 2);
        ctx.fill();
    }

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

    // Debugging help
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(
        gameMode,
        80,
        20
    );

    ctx.fillText(
        winner,
        80,
        40
    );

}

// Main game loop
function gameLoop() {

    if (gameState === "playing") {

        update();

    }

    draw();

    requestAnimationFrame(gameLoop);
}

// Handling selection changes and option selection
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

}

//----------------------------------------------------------------------------------

// Handling keydown events

// Option selection and navigation
document.addEventListener("keydown", function(event) {;
    changeSelection(event);
    selectOption(event);
});

// Handling player input for controlling planets
document.addEventListener("keydown", function(event) {
    input[event.key] = true;
});

document.addEventListener("keyup", function(event) {
    input[event.key] = false;
});

//----------------------------------------------------------------------------------

// Starting to run the game
restartGame()
gameLoop()

//----------------------------------------------------------------------------------

// TO DO:
//
// Implement collision detection
// Replace circles with sprites