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
  document.getElementById('board-container').innerHTML = '';
  document.getElementById('history').innerHTML = '';
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('board-container').appendChild(renderer.domElement);

  const light = new THREE.PointLight(0x00ffff, 1, 100);
  light.position.set(0, 10, 10);
  scene.add(light);

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

  camera.position.z = 10;
  animate();
  updateBoard();
  window.addEventListener('click', onBoardClick);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function updateBoard() {
  document.getElementById('history').textContent = chess.history().join(' ');
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
      highlightSquare(square, [43dcd9a7-70db-4a1f-b0ae-981daa162054](https://github.com/ruanvalente/origamid/tree/08d21800775d80bfbbc007cee39983bc81acf996/javascript-es6+%2Fmodulos%2Fmod-07%2Fmod-07.md?citationMarker=43dcd9a7-70db-4a1f-b0ae-981daa162054 "1")[43dcd9a7-70db-4a1f-b0ae-981daa162054](https://github.com/lzh-yi/Web-Fork-/tree/024b3e55587afdf9f05a677613a75f24e3d1803e/03-CSS%E8%BF%9B%E9%98%B6%2F04-%E5%A6%82%E4%BD%95%E8%AE%A9%E4%B8%80%E4%B8%AA%E5%85%83%E7%B4%A0%E6%B0%B4%E5%B9%B3%E5%9E%82%E7%9B%B4%E5%B1%85%E4%B8%AD%EF%BC%9F.md?citationMarker=43dcd9a7-70db-4a1f-b0ae-981daa162054 "2")[43dcd9a7-70db-4a1f-b0ae-981daa162054](https://github.com/perfectphony/test/tree/3c2f54fe916aebab8da9cf78c19aa984c3d5560d/poliphoni.js?citationMarker=43dcd9a7-70db-4a1f-b0ae-981daa162054 "3")[43dcd9a7-70db-4a1f-b0ae-981daa162054](https://github.com/alexandrkov90/buildMove/tree/3f1534a69ad6028c65692d34e0f43b57302ef2f5/build.js?citationMarker=43dcd9a7-70db-4a1f-b0ae-981daa162054 "4")