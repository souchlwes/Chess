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
  const squares = game.SQUARES;
  const flip = playerColor === 'black';

  for (let rank = 8; rank >= 1; rank--) {
    for (let file = 0; file < 8; file++) {
      const fileChar = 'abcdefgh'[file];
      const squareId = fileChar + rank;
      const square = document.createElement('div');
      const piece = game.get(squareId);

      square.className = `square ${(file + rank) % 2 === 0 ? 'light' : 'dark'}`;
      square.dataset.square = squareId;
      square.textContent = piece ? (piece.color === 'w' ? piece.type.toUpperCase() : piece.type) : '';
      square.onclick = () => handleClick(squareId);
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