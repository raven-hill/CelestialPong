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
    height: 60
};

const elasticButton = {
    x: 300,
    y: 500,
    width: 200,
    height: 60
};

const voidButton = {
    x: 700,
    y: 500,
    width: 200,
    height: 60
};

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
};

const planet1 = {
    x: 150,
    y: 300,

    vx: 0,
    vy: 0,

    ax: 0,
    ay: 0,

    mass: 100,
    radius: 20
};

const planet2 = {
    x: 1050,
    y: 300,

    vx: 0,
    vy: 0,

    ax: 0,
    ay: 0,

    mass: 100,
    radius: 20
};

//----------------------------------------------------------------------------------

// Defining functions

// Button functions
function startGame() {
    gameState = "instructions";
}

function startElasticGame() {

    gameMode = "elastic";
    gameState = "playing";

}

function startVoidGame() {

    gameMode = "void";
    gameState = "playing";

}

// Physics functions
function gravityForce(body1, body2) {
    const G = 0.1; // Gravitational constant (adjust as needed)
    const dx = body2.x - body1.x;
    const dy = body2.y - body1.y;
    const forcex = (G * body1.mass * body2.mass) / (dx*dx);
    const forcey = (G * body1.mass * body2.mass) / (dy*dy);

    return { forcex, forcey };

// TO DO:
// Use actual distance, components don't work like this
// this is WRONG!!!

}

// Moving celestial bodies
function controlPlanet1() {
    // Control planet1 with WASD keys
}

function controlPlanet2() {
    // Control planet2 with arrow keys
}

function applyGravity() {
    forcex1, forcey1 = gravityForce(moon, planet1);
    forcex2, forcey2 = gravityForce(moon, planet2);
    
    // TODO:
    //
    // Reset every body's acceleration to zero.
    //
    // Then calculate every gravitational interaction.
    //
    // Finally update ax and ay.

}

function moveBodies() {
    // Update velocities based on acceleration
    // Update positions based on velocities
}

function checkCollisions() {
    // Check for collisions between celestial bodies and boundaries
}

// Simulation order:
//
// 1. Read player input
// 2. Calculate gravity
// 3. Update velocities
// 4. Update positions
// 5. Resolve collisions

function update() {

    controlPlanet1();

    controlPlanet2();

    applyGravity();

    moveBodies();

    checkCollisions();

}  

// Drawing functions
function drawTitleScreen() {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Celestial Pong", 450, 200);
    // Draw start button
}

function drawInstructionsScreen() {
    // Draw instructions screen
}

function drawGame() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(moon.x, moon.y, moon.radius, 0, Math.PI * 2);
    ctx.fill();
    // Draw planets
    // Draw moon
    // Draw sprites (later)
}

function drawGameOver() {
    // Draw game over screen
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        update();
    }

    draw();

    requestAnimationFrame(gameLoop);
}

//----------------------------------------------------------------------------------

// Making buttons work

//----------------------------------------------------------------------------------

// Initial settings
let gameState = "title";
let gameMode = "";

//----------------------------------------------------------------------------------

// Starting to run the game
gameLoop()

//----------------------------------------------------------------------------------

// TO DO:
// Fix gravity function!!
// Fix applyGravity function!!