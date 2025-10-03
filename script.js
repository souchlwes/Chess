const chess = new Chess();
let engine = new Worker('https://cdn.jsdelivr.net/gh/nmrugg/stockfish.js/stockfish.js');
let scene, camera, renderer;
let playerColor = 'white';
let aiColor = 'black';
let selectedSquare = null;
let squareMeshes = {};
let whiteTime = 60;
let blackTime = 60;
let activeTimer = null;
let timerInterval = null;
let historyStack = [];
let redoStack = [];

document.getElementById('startBtn').addEventListener('click', () => {
  playerColor = document.getElementById('playerColor').value;
  aiColor = playerColor === 'white' ? 'black' : 'white';
  const timeControl = parseInt(document.getElementById('timeControl').value);
  whiteTime = timeControl;
  blackTime = timeControl;
  updateClocks();
  initBoard();
  startTimer(chess.turn());
  if (chess.turn() === aiColor) makeAIMove();
});

document.getElementById('undoBtn').addEventListener('click', () => {
  const last = historyStack.pop();
  if (last) {
    redoStack.push(chess.fen());
    chess.load(last);
    updateBoard();
    startTimer(chess.turn());
  }
});

document.getElementById('redoBtn').addEventListener('click', () => {
  const next = redoStack.pop();
  if (next) {
    historyStack.push(chess.fen());
    chess.load(next);
    updateBoard();
    startTimer(chess.turn());
  }
});

function sendToEngine(cmd) {
  engine.postMessage(cmd);
}

engine.onmessage = function(event) {
  const line = event.data;
  if (line.startsWith('bestmove')) {
    const move = line.split(' ')[1];
    historyStack.push(chess.fen());
    chess.move(move);
    updateBoard();
    startTimer(chess.turn());
    if (!chess.game_over()) {
      if (chess.turn() === aiColor) makeAIMove();
    } else {
      endGame('Game Over');
    }
  }
};

function makeAIMove() {
  const fen = chess.fen();
  const level = parseInt(document.getElementById('aiLevel').value);
  sendToEngine('uci');
  sendToEngine('setoption name Skill Level value ' + level);
  sendToEngine('position fen ' + fen);
  sendToEngine('go movetime 1000');
}

function initBoard() {
  chess.reset();
  historyStack = [];
  redoStack = [];
  selectedSquare = null;
  document.getElementById('board-container').innerHTML = '';
  document.getElementById('historyLog').innerHTML = '';

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / 400, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, 400);
  document.getElementById('board-container').appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0x404040);
  const pointLight = new THREE.PointLight(0x00ffff, 1, 100);
  pointLight.position.set(0, 10, 10);
  scene.add(ambientLight, pointLight);

  squareMeshes = {};
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const color = (i + j) % 2 === 0 ? 0xeeeeee : 0x222222;
      const geometry = new THREE.BoxGeometry(1, 0.1, 1);
      const material = new THREE.MeshPhongMaterial({ color });
      const square = new THREE.Mesh(geometry, material);
      square.position.set(i - 4, 0, j - 4);
      square.userData = { file: 'abcdefgh'[i], rank: 8 - j };
      squareMeshes[square.userData.file + square.userData.rank] = square;
      scene.add(square);
    }
  }

  camera.position.set(0, 8, 8);
  camera.lookAt(0, 0, 0);

  animate();
  updateBoard();
  window.addEventListener('click', onBoardClick);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function updateBoard() {
  document.getElementById('historyLog').textContent = chess.history().join(' ');
  updateClocks();
}

function onBoardClick(event) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(Object.values(squareMeshes));

  if (intersects.length > 0) {
    const square = intersects[0].object.userData.file + intersects[0].object.userData.rank;
    handleSquareClick(square);
  }
}

function handleSquareClick(square) {
  if (!selectedSquare) {
    const piece = chess.get(square);
    if (piece && piece.color === playerColor[0]) {
      selectedSquare = square;
      highlightSquare(square, 0x00ff00);
    }
  } else {
    const move = { from: selectedSquare, to: square };
    const result = chess.move(move);
    clearHighlights();
    selectedSquare = null;
    if (result) {
      historyStack.push(chess.fen());
      updateBoard();
      startTimer(chess.turn());
      if (!chess.game_over() && chess.turn() === aiColor) makeAIMove();
    }
  }
}

function highlightSquare(square, color) {
  squareMeshes[square].material.color.setHex(color);
}

function clearHighlights() {
  for (const sq in squareMeshes) {
    const i = 'abcdefgh'.indexOf(sq[0]);
    const j = 8 - parseInt(sq[1]);
    const baseColor = (i + j) % 2 === 0 ? 0xeeeeee : 0x222222;
    squareMeshes[sq].material.color.setHex(baseColor);
  }
}

function updateClocks() {
  document.getElementById('whiteClock').textContent = `White: ${formatTime(whiteTime)}`;
  document.getElementById('blackClock').textContent = `Black: ${formatTime(blackTime)}`;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function startTimer(color) {
  clearInterval(timerInterval);
  activeTimer = color;
  timerInterval = setInterval(() => {
    if (color === 'w') {
      whiteTime--;
      if (whiteTime <= 0) endGame('Black wins on time!');
    } else {
      blackTime--;
      if (blackTime <= 0) endGame('White wins on time!');
    }
    updateClocks();
  }, 1000);
}

function endGame(message) {
  clearInterval(timerInterval);
  alert(message);
}