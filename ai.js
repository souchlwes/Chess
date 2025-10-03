function aiMove() {
  const moves = game.moves();
  if (moves.length === 0) return;

  let move;
  if (aiLevel === 'easy') {
    move = moves[Math.floor(Math.random() * moves.length)];
  } else if (aiLevel === 'medium') {
    move = moves.find(m => m.includes('x')) || moves[0];
  } else {
    move = moves[moves.length - 1];
  }

  game.move(move);
  renderBoard();
}