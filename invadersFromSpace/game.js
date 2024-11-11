const gameArea = document.getElementById("game-area");
const player = document.getElementById("player");
let score = 0;
let aliens = [];
let alienInterval;
let bulletInterval;
let randomAlienInterval;

// Música de fundo
const backgroundMusic = new Audio("theme.mp3");
backgroundMusic.loop = true;

// Som de tiro
const shootSound = new Audio("pew.mp3");

function startGame() {
  document.getElementById("start-button").style.display = "none";
  score = 0;
  document.getElementById("score").innerText = score;

  spawnAliens();
  alienInterval = setInterval(moveAliens, 180);
  bulletInterval = setInterval(shootBullet, 500);

  // Tocar a música de fundo
  backgroundMusic.play();

  document.addEventListener("keydown", handleKeyPress);
}

function spawnAliens() {
  for (let i = 0; i < 50; i++) {
    const alien = document.createElement("div");
    alien.classList.add("alien");
    alien.style.top = `${Math.floor(i / 10) * 40}px`;
    alien.style.left = `${(i % 10) * 45 + 15}px`;
    alien.direction = 1; // Inicialmente, todos se movem para a direita
    gameArea.appendChild(alien);
    aliens.push(alien);
  }
}

function moveAliens() {
  if (aliens.length > 15) {
    // Movimentação em conjunto enquanto há mais de 15 alienígenas
    aliens.forEach((alien) => {
      let top = parseInt(alien.style.top) + 2;
      alien.style.top = `${top}px`;

      if (top >= 370) {
        endGame("Perdeu! Os alienígenas chegaram ao chão!");
      }
    });
  } else {
    // Movimentação independente mais lenta quando restam 15 ou menos alienígenas
    if (!randomAlienInterval) {
      clearInterval(alienInterval);
      randomAlienInterval = setInterval(moveAliensIndividually, 240); 
    }
  }
}

function moveAliensIndividually() {
  aliens.forEach((alien) => {
    let top = parseInt(alien.style.top) + 2;
    alien.style.top = `${top}px`;

    if (top >= 370) {
      endGame("Perdeu! Os alienígenas chegaram ao chão!");
    }

    // Movimento aleatório para a esquerda ou direita
    let left = parseInt(alien.style.left);
    if (Math.random() < 0.5) {
      alien.style.left = left + 5 * alien.direction + "px";
    } else {
      alien.style.left = left - 5 * alien.direction + "px";
    }

    // Mudar a direção aleatoriamente
    if (Math.random() < 0.05) {
      alien.direction *= -1; // Inverte a direção
    }
  });
}

function shootBullet() {
  const bullet = document.createElement("div");
  bullet.classList.add("bullet");
  bullet.style.left = player.offsetLeft + 12 + "px";
  bullet.style.top = player.offsetTop - 10 + "px";
  gameArea.appendChild(bullet);

  // Tocar som do tiro
  shootSound.currentTime = 0;
  shootSound.play();

  let bulletMove = setInterval(() => {
    bullet.style.top = bullet.offsetTop - 5 + "px";
    checkBulletCollision(bullet, bulletMove);
  }, 20);
}

function checkBulletCollision(bullet, bulletMove) {
  aliens.forEach((alien, index) => {
    if (isColliding(bullet, alien)) {
      gameArea.removeChild(alien);
      aliens.splice(index, 1);
      gameArea.removeChild(bullet);
      clearInterval(bulletMove);

      score += 10;
      document.getElementById("score").innerText = score;

      if (aliens.length === 0) {
        endGame("Parabéns! Você derrotou todos os alienígenas!");
      }
    }
  });
}

function isColliding(el1, el2) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();
  return !(
    rect1.top > rect2.bottom ||
    rect1.bottom < rect2.top ||
    rect1.left > rect2.right ||
    rect1.right < rect2.left
  );
}

function movePlayer(direction) {
  let left = player.offsetLeft;
  let top = player.offsetTop;

  switch (direction) {
    case 'up': if (top > 0) player.style.top = top - 20 + "px"; break;
    case 'down': if (top < 370) player.style.top = top + 20 + "px"; break;
    case 'left': if (left > 0) player.style.left = left - 20 + "px"; break;
    case 'right': if (left < 470) player.style.left = left + 20 + "px"; break;
  }
}

function handleKeyPress(e) {
  switch (e.key) {
    case 'w': movePlayer('up'); break;
    case 's': movePlayer('down'); break;
    case 'a': movePlayer('left'); break;
    case 'd': movePlayer('right'); break;
  }
}

function endGame(message) {
  clearInterval(alienInterval);
  clearInterval(bulletInterval);
  clearInterval(randomAlienInterval);
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  alert(message);
  aliens.forEach((alien) => gameArea.removeChild(alien));
  aliens = [];
  document.getElementById("start-button").style.display = "block";
}
