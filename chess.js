const game = new Chess();
let selectedSquare = null;
let mode = '1v1';
let aiLevel = 'easy';
let playerColor = 'white';

function startGame() {
  mode = document.getElementById('mode').value;
  aiLevel = document.getElementById('aiLevel').value;
  playerColor = document.getElementById('playerColor').value;
  game.reset();
  renderBoard();
}

function renderBoard() {
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = '';
  const board = game.board();
  const flip = playerColor === 'black';

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const square = document.createElement('div');
      const file = flip ? 7 - x : x;
      const rank = flip ? y : 7 - y;
      const piece = board[rank][file];

      square.className = `square ${(file + rank) % 2 === 0 ? 'light' : 'dark'}`;
      square.dataset.square = `${'abcdefgh'[file]}${rank + 1}`;
      square.textContent = piece ? (piece.color === 'w' ? piece.type.toUpperCase() : piece.type) : '';
      square.onclick = () => handleClick(square.dataset.square);
      boardDiv.appendChild(square);
    }
  }
}

function handleClick(square) {
  if (selectedSquare) {
    const move = game.move({ from: selectedSquare, to: square, promotion: 'q' });
    selectedSquare = null;
    if (move) {
      renderBoard();
      if (mode === 'ai' && game.turn() !== playerColor[0]) {
        setTimeout(aiMove, 500);
      }
    }
  } else {
    selectedSquare = square;
  }
}