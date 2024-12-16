const cells = document.querySelectorAll(".box");
const messageContainer = document.getElementById("message");
const winnerMessage = document.getElementById("winner-message");
const restartButton = document.getElementById("restart-button");
const modeSelection = document.getElementById("mode-selection");
const gameContainer = document.getElementById("game-container");

let currentPlayer = "X"; // Jogador 1 começa
let gameActive = true; // Para bloquear jogadas após vitória ou empate
let board = ["", "", "", "", "", "", "", "", ""];
let gameMode = ""; // Armazena o modo de jogo

// Contadores de vitórias
let xWins = 0;
let oWins = 0;

// Condições de vitória
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Manipula o clique em cada célula
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (
      gameActive &&
      board[index] === "" &&
      (gameMode === "two-player" || currentPlayer === "X")
    ) {
      board[index] = currentPlayer;
      cell.innerHTML =
        currentPlayer === "X"
          ? `<span class="X">X</span>`
          : `<span class="O"></span>`;
      checkResult();
      currentPlayer = currentPlayer === "X" ? "O" : "X"; // Alterna entre X e O

      if (gameMode === "vs-ia" && gameActive && currentPlayer === "O") {
        iaMove(); // IA joga automaticamente
      }
    }
  });
});

// Verifica se há um vencedor ou empate
function checkResult() {
  let roundWon = false;

  // Verificar todas as condições de vitória
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    displayMessage(`Jogador ${currentPlayer === "X" ? "1" : "2"} ganhou!`);
    if (currentPlayer === "X") {
      xWins++;
    } else {
      oWins++;
    }
    updateScoreboard();
    gameActive = false; // Bloqueia o jogo
    return;
  }

  // Verificar se deu empate (tabuleiro cheio)
  if (!board.includes("")) {
    displayMessage("Deu velha!");
    gameActive = false; // Bloqueia o jogo
    return;
  }
}

// Exibe a mensagem de vitória ou empate
function displayMessage(message) {
  winnerMessage.textContent = message;
  messageContainer.classList.remove("hide");
}

// Atualiza o placar
function updateScoreboard() {
  document.getElementById("x-score").textContent = xWins;
  document.getElementById("o-score").textContent = oWins;
}

// Função para a IA fazer sua jogada
function iaMove() {
  let availableMoves = board
    .map((value, index) => (value === "" ? index : null))
    .filter((index) => index !== null);

  if (availableMoves.length === 0) return; // Se não houver jogadas disponíveis

  // IA faz uma jogada aleatória
  let move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  board[move] = "O";
  cells[move].innerHTML = `<span class="O"></span>`;
  checkResult();
  currentPlayer = "X"; // Retorna para o jogador 1 após a jogada da IA
}

// Reiniciar o jogo
restartButton.addEventListener("click", () => {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  cells.forEach((cell) => (cell.innerHTML = ""));
  messageContainer.classList.add("hide");
});

// Selecionar o modo de jogo
document.getElementById("two-player").addEventListener("click", () => {
  gameMode = "two-player";
  startGame();
});

document.getElementById("vs-ia").addEventListener("click", () => {
  gameMode = "vs-ia";
  startGame();
});

// Inicializa o jogo
function startGame() {
  modeSelection.classList.add("hide");
  gameContainer.classList.remove("hide");
}
