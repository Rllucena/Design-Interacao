const gameArea = document.getElementById("game-area");
const player = document.getElementById("player");
const gameOverMessage = document.getElementById("game-over-message");
let score = 0;
let aliens = [];
let alienInterval;
let bulletInterval;
let alienDirection = 1;
let canShoot = true;
let bulletSpeed = 20;
let additionalBullets = 0;
let powerUpInterval;
const backgroundMusic = new Audio("theme.mp3");
backgroundMusic.loop = true;
const shootSound = new Audio("pew.mp3");

function startGame() {
  // Alterar o botão para "Reiniciar" ao iniciar o jogo
  const startButton = document.getElementById("start-button");
  startButton.innerText = "Reiniciar";

  // Limpar o jogo caso ele já tenha sido iniciado antes
  resetGame();
  updateHighScore(); // Exibe a maior pontuação ao iniciar o jogo

  // Inicializar variáveis de jogo e elementos na tela
  score = 0;
  document.getElementById("score").innerText = score;
  spawnAliens();

 // Ajuste a velocidade dos alienígenas com base no tamanho da tela
  let screenWidth = window.innerWidth;
  let alienSpeed;

  if (screenWidth < 600) {
    alienSpeed = 2200; // Velocidade mais lenta para telas pequenas
  } else if (screenWidth < 1000) {
    alienSpeed = 150; // Velocidade intermediária para telas médias
  } else {
    alienSpeed = 120; // Velocidade normal para telas grandes
  }

 alienInterval = setInterval(moveAliens, alienSpeed);
 bulletInterval = setInterval(shootBullet, 500);

 backgroundMusic.play();
 document.addEventListener("keydown", handleKeyPress);
}

function resetGame() {
  // Parar qualquer intervalo em execução
  clearInterval(alienInterval);
  clearInterval(bulletInterval);

  // Remover alienígenas e balas da tela
  aliens.forEach(alien => gameArea.removeChild(alien));
  aliens = [];
  const bullets = document.querySelectorAll(".bullet");
  bullets.forEach(bullet => gameArea.removeChild(bullet));

  // Remover todos os power-ups da tela
  const powerUps = document.querySelectorAll(".power-up");
  powerUps.forEach(powerUp => gameArea.removeChild(powerUp));

  // Resetar configurações de power-ups e variáveis do jogador
  canShoot = true;
  bulletSpeed = 20;
  additionalBullets = 0;

  // Resetar mensagem de fim de jogo caso esteja visível
  gameOverMessage.style.display = "none";
  gameOverMessage.style.animation = ""; // Remover animação para reiniciar corretamente
  gameOverMessage.innerText = ""; // Limpar o texto para evitar conflitos
}

function spawnAliens() {
  for (let i = 0; i < 50; i++) {
    const alien = document.createElement("div");
    alien.classList.add("alien");
    alien.style.top = `${Math.floor(i / 10) * 40}px`;
    alien.style.left = `${(i % 10) * 45 + 15}px`;
    gameArea.appendChild(alien);
    aliens.push(alien);
  }
}

function moveAliens() {
  let hitWall = false;

  aliens.forEach((alien) => {
    let left = parseInt(alien.style.left) + 5 * alienDirection;
    alien.style.left = `${left}px`;

    if (left <= 0 || left >= gameArea.offsetWidth - alien.offsetWidth) {
      hitWall = true;
    }
  });

  if (hitWall) {
    alienDirection *= -1;

    aliens.forEach((alien) => {
      let top = parseInt(alien.style.top) + 20;
      alien.style.top = `${top}px`;

      if (top >= 370) {
        showEndGameMessage("Perdeu! Os alienígenas chegaram ao chão!");
      }
    });
  }
}

function shootBullet() {
  if (!canShoot) return;

  for (let i = 0; i <= additionalBullets; i++) {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullet.style.left = player.offsetLeft + 12 + "px";
    bullet.style.top = player.offsetTop - 10 + "px";
    gameArea.appendChild(bullet);

    shootSound.volume = 0.1; // Diminui o volume para 20% do total
    shootSound.currentTime = 0;
    shootSound.play();

    let bulletMove = setInterval(() => {
      bullet.style.top = bullet.offsetTop - bulletSpeed + "px";
      checkBulletCollision(bullet, bulletMove);
    }, 20);
  }
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

      // Chance de 5% para gerar um power-up
      if (Math.random() < 0.05) spawnPowerUp(alien.offsetLeft, alien.offsetTop);

      if (aliens.length === 0) {
        showEndGameMessage("Parabéns! Você derrotou todos os alienígenas!");
      }
    }
  });
}

function spawnPowerUp(x, y) {
  const powerUp = document.createElement("div");
  powerUp.classList.add("power-up");

  const type = Math.floor(Math.random() * 3);
  switch (type) {
    case 0:
      powerUp.classList.add("blue");
      powerUp.dataset.type = "speed";
      break;
    case 1:
      powerUp.classList.add("red");
      powerUp.dataset.type = "extraBullet";
      break;
    case 2:
      powerUp.classList.add("yellow");
      powerUp.dataset.type = "freeze";
      break;
  }

  powerUp.style.left = x + "px";
  powerUp.style.top = y + "px";
  gameArea.appendChild(powerUp);

  let powerUpInterval = setInterval(() => {
    powerUp.style.top = powerUp.offsetTop + 2 + "px";

    if (isColliding(powerUp, player)) {
      clearInterval(powerUpInterval);
      applyPowerUp(powerUp.dataset.type);
      gameArea.removeChild(powerUp);
    } else if (powerUp.offsetTop > gameArea.offsetHeight) {
      clearInterval(powerUpInterval);
      gameArea.removeChild(powerUp);
    }
  }, 30);
}

function applyPowerUp(type) {
  switch (type) {
    case "speed":
      bulletSpeed *= 1.5;
      break;
    case "extraBullet":
      additionalBullets += 1;
      break;
    case "freeze":
      clearInterval(alienInterval);
      setTimeout(() => {
        alienInterval = setInterval(moveAliens, 120);
      }, 5000); // Congela os alienígenas por 5 segundos
      break;
  }
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
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  alert(message);
  aliens.forEach((alien) => gameArea.removeChild(alien));
  aliens = [];
  document.getElementById("start-button").style.display = "block";
}

function updateHighScore() {
  let highScore = localStorage.getItem('highScore') || 0;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }
  document.getElementById("high-score").innerText = `Maior Pontuação: ${highScore}`;
}

function showEndGameMessage(message) {
  gameOverMessage.innerText = message;
  gameOverMessage.style.display = "block";
  gameOverMessage.style.animation = "slide-down 20s forwards";

  clearInterval(alienInterval);
  clearInterval(bulletInterval);
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;

  // Atualiza a maior pontuação
  updateHighScore();

  // Remove qualquer listener anterior para evitar duplicação
  gameOverMessage.removeEventListener("animationend", hideEndGameMessage);

  // Adiciona um listener para ocultar a mensagem ao final da animação
  gameOverMessage.addEventListener("animationend", hideEndGameMessage);
}

// Função para ocultar a mensagem ao final da animação
function hideEndGameMessage() {
  gameOverMessage.style.display = "none";
  gameOverMessage.style.animation = ""; // Reseta a animação para reutilizar
}


// Adiciona evento de clique e toque para mover a nave
gameArea.addEventListener("click", movePlayerToPoint);
gameArea.addEventListener("touchstart", movePlayerToPoint);

function movePlayerToPoint(event) {
  // Verifica se o evento é de toque e ajusta as coordenadas para mobile
  const x = event.touches ? event.touches[0].clientX : event.clientX;
  const y = event.touches ? event.touches[0].clientY : event.clientY;

  // Calcula a posição ajustada para manter a nave centralizada no ponto tocado/clicado
  const gameAreaRect = gameArea.getBoundingClientRect();
  const newLeft = Math.min(
    gameArea.offsetWidth - player.offsetWidth,
    Math.max(0, x - gameAreaRect.left - player.offsetWidth / 2)
  );
  const newTop = Math.min(
    gameArea.offsetHeight - player.offsetHeight,
    Math.max(0, y - gameAreaRect.top - player.offsetHeight / 2)
  );

  // Move a nave para a nova posição
  player.style.left = `${newLeft}px`;
  player.style.top = `${newTop}px`;
}

