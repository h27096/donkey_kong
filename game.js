const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player
let player = {
  x: 50,
  y: canvas.height - 100,
  width: 30,
  height: 30,
  dy: 0,
  onGround: false
};

let gravity = 0.5;

// Controls
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Random Level Generator
function generateLevel() {
  let platforms = [];
  let ladders = [];

  let levels = 5;

  for (let i = 0; i < levels; i++) {
    let y = canvas.height - i * 120;

    // random slope direction
    let slopeLeft = Math.random() > 0.5;

    for (let x = 0; x < canvas.width; x += 100) {
      platforms.push({
        x: slopeLeft ? x : canvas.width - x,
        y: y + (slopeLeft ? x * 0.1 : -x * 0.1),
        width: 100,
        height: 10
      });
    }

    // random ladder
    ladders.push({
      x: Math.random() * canvas.width,
      y: y - 100,
      width: 20,
      height: 100
    });
  }

  return { platforms, ladders };
}

let level = generateLevel();

// Game Loop
function update() {
  player.dy += gravity;
  player.y += player.dy;

  // Movement
  if (keys["ArrowLeft"]) player.x -= 5;
  if (keys["ArrowRight"]) player.x += 5;

  // Jump
  if (keys[" "] && player.onGround) {
    player.dy = -10;
    player.onGround = false;
  }

  // Collision with platforms
  player.onGround = false;
  level.platforms.forEach(p => {
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y + player.height < p.y + 10 &&
      player.y + player.height + player.dy >= p.y
    ) {
      player.y = p.y - player.height;
      player.dy = 0;
      player.onGround = true;
    }
  });
}

// Draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Platforms
  ctx.fillStyle = "brown";
  level.platforms.forEach(p => {
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });

  // Ladders
  ctx.fillStyle = "yellow";
  level.ladders.forEach(l => {
    ctx.fillRect(l.x, l.y, l.width, l.height);
  });
}

// Loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
