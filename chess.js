let board = [];
let selected = null;
let currentPlayer = 'white';
let mode = '1v1';
let aiLevel = 'easy';
let playerColor = 'white';

function startGame() {
  mode = document.getElementById('mode').value;
  aiLevel = document.getElementById('aiLevel').value;
  playerColor = document.getElementById('playerColor').value;
  currentPlayer = 'white';
  initBoard();
  renderBoard();
}

function initBoard() {
  board = [
    ['♜','♞','♝','♛','♚','♝','♞','♜'],
    ['♟','♟','♟','♟','♟','♟','♟','♟'],
    ...Array(4).fill(Array(8).fill('')),
    ['♙','♙','♙','♙','♙','♙','♙','♙'],
    ['♖','♘','♗','♕','♔','♗','♘','♖']
  ];
}

function renderBoard() {
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = '';
  board.forEach((row, y) => {
    row.forEach((piece, x) => {
      const square = document.createElement('div');
      square.className = `square ${(x + y) % 2 === 0 ? 'light' : 'dark'}`;
      square.textContent = piece;
      square.onclick = () => handleClick(x, y);
      boardDiv.appendChild(square);
    });
  });
}

function handleClick(x, y) {
  if (selected) {
    movePiece(selected.x, selected.y, x, y);
    selected = null;
  } else {
    selected = { x, y };
  }
  renderBoard();
}

function movePiece(fromX, fromY, toX, toY) {
  board[toY][toX] = board[fromY][fromX];
  board[fromY][fromX] = '';
  currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
  if (mode === 'ai' && currentPlayer !== playerColor) {
    setTimeout(() => aiMove(), 500);
  }
}
