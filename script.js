const game = new Chess();
const stockfish = STOCKFISH();
let playerTime = 300;
let aiTime = 300;
let timerInterval;
let selectedSquare = null;

function updateTimers() {
  document.getElementById("player-timer").textContent = formatTime(playerTime);
  document.getElementById("ai-timer").textContent = formatTime(aiTime);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function startAI() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (game.turn() === 'w') {
      playerTime--;
    } else {
      aiTime--;
    }
    updateTimers();
  }, 1000);

  renderBoard();
  makeMove();
}

function makeMove() {
  if (game.game_over()) {
    clearInterval(timerInterval);
    if (game.in_checkmate()) {
      document.getElementById("mateSound").play();
      alert("Checkmate! The loser has to fall.");
    }
    return;
  }

  if (game.turn() === 'b') {
    stockfish.postMessage("position fen " + game.fen());
    stockfish.postMessage("go depth 15");
    stockfish.onmessage = function (event) {
      const match = event.data.match(/bestmove\s(\w+)/);
      if (match) {
        game.move(match[1], { sloppy: true });
        renderBoard();
        makeMove();
      }
    };
  }
}

function renderBoard() {
  const boardEl = document.getElementById("board");
  boardEl.innerHTML = "";

  const squares = game.board();
  for (let row = 7; row >= 0; row--) {
    for (let col = 0; col < 8; col++) {
      const squareEl = document.createElement("div");
      squareEl.classList.add("square");
      const isLight = (row + col) % 2 === 0;
      squareEl.classList.add(isLight ? "light" : "dark");

      const piece = squares[row][col];
      if (piece) {
        squareEl.textContent = getUnicode(piece);
      }

      const squareName = "abcdefgh"[col] + (row + 1);
      squareEl.dataset.square = squareName;
      if (squareName === selectedSquare) {
        squareEl.classList.add("selected");
      }

      squareEl.onclick = () => handleClick(squareName);
      boardEl.appendChild(squareEl);
    }
  }
}

function getUnicode(piece) {
  const symbols = {
    p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
    P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔"
  };
  return symbols[piece.color === "w" ? piece.type.toUpperCase() : piece.type] || "";
}

function handleClick(square) {
  if (selectedSquare) {
    const move = game.move({ from: selectedSquare, to: square, promotion: 'q' });
    if (move) {
      selectedSquare = null;
      renderBoard();
      makeMove();
    } else {
      selectedSquare = square;
      renderBoard();
    }
  } else {
    selectedSquare = square;
    renderBoard();
  }
}

function resetGame() {
  game.reset();
  selectedSquare = null;
  playerTime = 300;
  aiTime = 300;
  clearInterval(timerInterval);
  updateTimers();
  renderBoard();
}

renderBoard();
updateTimers();