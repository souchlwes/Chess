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
      squareMeshes[43dcd9a7-70db-4a1f-b0ae-981daa162054](https://github.com/ruanvalente/origamid/tree/08d21800775d80bfbbc007cee39983bc81acf996/javascript-es6+%2Fmodulos%2Fmod-07%2Fmod-07.md?citationMarker=43dcd9a7-70db-4a1f-b0ae-981daa162054 "1")[43dcd9a7-70db-4a1f-b0ae-981daa162054](https://github.com/lzh-yi/Web-Fork-/tree/024b3e55587afdf9f05a677613a75f24e3d1803e/03-CSS%E8%BF%9B%E9%98%B6%2F04-%E5%A6%82%E4%BD%95%E8%AE%A9%E4%B8%80%E4%B8%AA%E5%85%83%E7%B4%A0%E6%B0%B4%E5%B9%B3%E5%9E%82%E7%9B%B4%E5%B1%85%E4%B8%AD%EF%BC%9F.md?citationMarker=43dcd9a7-70db-4a1f-b0ae-981daa162054 "2")[square.userData