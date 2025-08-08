// script.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 600;

    // Game variables
    let helicopter = {
        x: 100,
        y: 250,
        width: 80,
        height: 40,
        vy: 0, // Vertical velocity
        gravity: 0.3,
        lift: -7
    };

    let obstacles = [];
    let score = 0;
    let gameOver = false;
    let frameCount = 0;

    // --- Draw Functions ---
    function drawHelicopter() {
        ctx.fillStyle = '#4A90E2'; // Blue color for helicopter
        // Body
        ctx.fillRect(helicopter.x, helicopter.y, helicopter.width, helicopter.height);
        // Cockpit
        ctx.beginPath();
        ctx.arc(helicopter.x + helicopter.width, helicopter.y + helicopter.height / 2, helicopter.height / 2, -Math.PI / 2, Math.PI / 2);
        ctx.fill();
        // Tail
        ctx.fillRect(helicopter.x - 20, helicopter.y + 15, 20, 10);
        // Rotor
        ctx.fillStyle = '#333';
        ctx.fillRect(helicopter.x + 20, helicopter.y - 10, 40, 5);
        ctx.fillRect(helicopter.x + 37.5, helicopter.y - 15, 5, 25);
    }

    function drawObstacles() {
        ctx.fillStyle = '#F5A623'; // Orange color for obstacles
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.topHeight); // Top part
            ctx.fillRect(obstacle.x, canvas.height - obstacle.bottomHeight, obstacle.width, obstacle.bottomHeight); // Bottom part
        });
    }

    function drawScore() {
        ctx.fillStyle = '#000';
        ctx.font = '24px Arial';
        ctx.fillText('Score: ' + score, 10, 30);
    }

    function drawGameOver() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#FFF';
        ctx.font = '60px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);

        ctx.font = '30px Arial';
        ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 20);

        ctx.font = '20px Arial';
        ctx.fillText("Press 'R' to Restart", canvas.width / 2, canvas.height / 2 + 70);
        ctx.textAlign = 'left'; // Reset alignment
    }

    // --- Game Logic ---
    function generateObstacles() {
        // Generate obstacles every 150 frames
        if (frameCount % 150 === 0) {
            const gapHeight = 200;
            const minHeight = 50;
            const topHeight = Math.random() * (canvas.height - gapHeight - minHeight * 2) + minHeight;
            const bottomHeight = canvas.height - topHeight - gapHeight;

            obstacles.push({
                x: canvas.width,
                width: 50,
                topHeight: topHeight,
                bottomHeight: bottomHeight,
                speed: 3
            });
        }
    }

    function checkCollision() {
        // Helicopter boundaries
        const heliTop = helicopter.y;
        const heliBottom = helicopter.y + helicopter.height;
        const heliLeft = helicopter.x;
        const heliRight = helicopter.x + helicopter.width;

        // Check for collision with canvas top/bottom
        if (heliTop < 0 || heliBottom > canvas.height) {
            gameOver = true;
        }

        // Check for collision with obstacles
        obstacles.forEach(obstacle => {
            const obsTop = 0;
            const obsBottomTop = obstacle.topHeight;
            const obsTopBottom = canvas.height - obstacle.bottomHeight;
            const obsBottom = canvas.height;
            const obsLeft = obstacle.x;
            const obsRight = obstacle.x + obstacle.width;

            if (
                heliRight > obsLeft &&
                heliLeft < obsRight &&
                (heliTop < obsBottomTop || heliBottom > obsTopBottom)
            ) {
                gameOver = true;
            }
        });
    }

    function resetGame() {
        helicopter.y = 250;
        helicopter.vy = 0;
        obstacles = [];
        score = 0;
        frameCount = 0;
        gameOver = false;
        update(); // Restart the game loop
    }

    // --- Main Game Loop ---
    function update() {
        if (gameOver) {
            drawGameOver();
            return; // Stop the loop if game is over
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update helicopter position
        helicopter.vy += helicopter.gravity;
        helicopter.y += helicopter.vy;

        // Update obstacles
        obstacles.forEach(obstacle => {
            obstacle.x -= obstacle.speed;
        });

        // Remove off-screen obstacles
        obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

        // Generate new obstacles
        generateObstacles();

        // Check for collisions
        checkCollision();

        // Update score and frame count
        score++;
        frameCount++;

        // Draw everything
        drawHelicopter();
        drawObstacles();
        drawScore();

        // Request next frame
        requestAnimationFrame(update);
    }

    // --- Event Listeners ---
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            if (!gameOver) {
                helicopter.vy = helicopter.lift;
            }
        }
        if (e.code === 'KeyR' && gameOver) {
            resetGame();
        }
    });

    // Initial call to start the game
    update();
});

