function aiMove() {
  let moves = [];
  board.forEach((row, y) => {
    row.forEach((piece, x) => {
      if (piece && isAIPiece(piece)) {
        // Try moving to random empty square
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            let nx = x + dx;
            let ny = y + dy;
            if (isValid(nx, ny) && board[ny][nx] === '') {
              moves.push({ fromX: x, fromY: y, toX: nx, toY: ny });
            }
          }
        }
      }
    });
  });

  if (moves.length > 0) {
    let move = pickMove(moves);
    movePiece(move.fromX, move.fromY, move.toX, move.toY);
  }
}

function isAIPiece(piece) {
  return playerColor === 'white' ? piece.startsWith('♜') || piece.startsWith('♟') : piece.startsWith('♖') || piece.startsWith('♙');
}

function isValid(x, y) {
  return x >= 0 && x < 8 && y >= 0 && y < 8;
}

function pickMove(moves) {
  if (aiLevel === 'easy') return moves[Math.floor(Math.random() * moves.length)];
  if (aiLevel === 'medium') return moves[0];
  if (aiLevel === 'hard') return moves[moves.length - 1];
}
