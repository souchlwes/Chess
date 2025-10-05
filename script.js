const game = new Chess();
let board;
let stockfish = new Worker("https://cdn.jsdelivr.net/npm/stockfish/stockfish.js");
let isAI = false;
let currentPlayer = "white";
let clockTime = 300;
let whiteTime = clockTime;
let blackTime = clockTime;
let timerInterval;

const winSound = document.getElementById("win-sound");

function initBoard() {
  board = Chessboard("board", {
    position: "start",
    draggable: true,
    onDrop: handleMove
  });
  updateTicker();
  startClock();
}

function handleMove(source, target) {
  const move = game.move({ from: source, to: target, promotion: "q" });
  if (!move) return "snapback";

  updateTicker();
  switchTurn();

  if (game.game_over()) {
    winSound.play();
    alert("Game Over!");
    stopClock();
  }

  if (isAI && currentPlayer === "black") {
    setTimeout(makeAIMove, 500);
  }
}

function makeAIMove() {
  stockfish.postMessage("position fen " + game.fen());
  stockfish.postMessage("go depth 15");
  stockfish.onmessage = function (event) {
    if (event.data.includes("bestmove")) {
      const move = event.data.split(" ")[1];
      game.move({ from: move.slice(0, 2), to: move.slice(2, 4), promotion: "q" });
      board.position(game.fen());
      updateTicker();
      switchTurn();
      if (game.game_over()) {
        winSound.play();
        alert("Game Over!");
        stopClock();
      }
    }
  };
}

function switchTurn() {
  currentPlayer = currentPlayer === "white" ? "black" : "white";
}

function updateTicker() {
  const moves = game.history();
  const ticker = document.getElementById("moves");
  ticker.innerText = moves.join(" • ");
}

function startClock() {
  stopClock();
  timerInterval = setInterval(() => {
    if (currentPlayer === "white") {
      whiteTime--;
    } else {
      blackTime--;
    }
    updateClock();
    if (whiteTime <= 0 || blackTime <= 0) {
      winSound.play();
      alert("Time's up!");
      stopClock();
    }
  }, 1000);
}

function stopClock() {
  clearInterval(timerInterval);
}

function updateClock() {
  const clock = document.getElementById("clock");
  const format = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
  clock.innerText = `W ${format(whiteTime)} | B ${format(blackTime)}`;
}

document.getElementById("ai-toggle").onclick = () => {
  isAI = true;
  resetGame();
};

document.getElementById("multi-toggle").onclick = () => {
  isAI = false;
  resetGame();
};

document.getElementById("start").onclick = () => {
  resetGame();
};

document.getElementById("reset").onclick = () => {
  resetGame();
};

document.getElementById("mode-select").onchange = (e) => {
  setClockMode(e.target.value);
};

function resetGame() {
  game.reset();
  board.position("start");
  whiteTime = clockTime;
  blackTime = clockTime;
  currentPlayer = "white";
  updateTicker();
  startClock();
}

function setClockMode(mode) {
  if (mode === "blitz") clockTime = 300;
  if (mode === "rapid") clockTime = 900;
  if (mode === "classical") clockTime = 1800;
  resetGame();
}

initBoard();