const game = new Chess();
const stockfish = STOCKFISH();
let playerTime = 300;
let aiTime = 300;
let timerInterval;
let selectedSquare = null;
let pieceStyle = "unicode"; // or "emoji"
let winCount = parseInt(localStorage.getItem("winCount")) || 0;
document.getElementById("winCount").textContent = winCount;

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
      winCount++;
      localStorage.setItem("winCount", winCount);
      document.getElementById("winCount").textContent = winCount;
    } else if (game.in_stalemate()) {
      document.getElementById("crashSound").play();
      alert("System Crash! Game ended in stalemate.");
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
        squareEl.textContent = getSymbol(piece);
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

  renderHistory();
}

function getSymbol(piece) {
  const unicode = {
    p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
    P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔"
  };
  const emoji = {
    p: "🖤", r: "🏰", n: "🐴", b: "🧙", q: "👑", k: "💀",
    P: "🤍", R: "🏯", N: "🦄", B: "🧝", Q: "👸", K: "😇"
  };
  const set = pieceStyle === "emoji" ? emoji : unicode;
  return set[piece.color === "w" ? piece.type.toUpperCase() : piece.type] || "";
}

function handleClick(square) {
  document.getElementById("clickSound").play();

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

function renderHistory() {
  const historyEl = document.getElementById("moveList");
  const history = game.history();
  historyEl.innerHTML = "";
  history.forEach((move, i) => {
    const li = document.createElement("li");
    li.textContent = `${Math.floor(i / 2) + 1}. ${move}`;
    historyEl.appendChild(li);
  });
}

function toggleStyle() {
  pieceStyle = pieceStyle === "unicode" ? "emoji" : "unicode";
  renderBoard();
}

function startMultiplayer() {
  clearInterval(timerInterval);
  alert("Multiplayer mode coming soon!");
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