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
};

const elasticButton = {
    x: 300,
    y: 500,
    width: 200,
    height: 60,
    text: "Elastic Mode",
    action: startElasticGame
};

const voidButton = {
    x: 700,
    y: 500,
    width: 200,
    height: 60,
    text: "Void Mode",
    action: startVoidGame
};

const restartButton = {
    x: 500,
    y: 300,
    width: 200,
    height: 60,
    text: "Restart Game",
    action: restartGame
};

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

const bodies = [moon, planet1, planet2];

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

    const G = 0.1; // Gravity constant - adjust as needed!

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

// Moving celestial bodies
function applyGravity() {

    gravityAccn(moon, planet1);
    gravityAccn(moon, planet2);

}

function controlPlanet1() {
    // Control planet1 with WASD keys
}

function controlPlanet2() {
    // Control planet2 with arrow keys
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
    // Draw instructions
    drawButton(elasticButton);
    drawButton(voidButton);
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
        update();
    }

    draw();

    requestAnimationFrame(gameLoop);
}

//----------------------------------------------------------------------------------

// Initial settings
let gameState = "title";
let gameMode = "";
let selection = 0;

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
gameLoop()

//----------------------------------------------------------------------------------

// TO DO:
//
// finish work on menu buttons!!!
//
//
// Implement moveBodies()
// Implement keyboard controls
// Implement collision detection
// Draw planets
// Draw menu buttons
// Replace circles with sprites