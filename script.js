const chess = new Chess();
let scene, camera, renderer;

function initBoard() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('board-container').appendChild(renderer.domElement);

  // Add lighting
  const light = new THREE.PointLight(0x00ffff, 1, 100);
  light.position.set(0, 10, 10);
  scene.add(light);

  // Create board squares
  const squareSize = 1;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const color = (i + j) % 2 === 0 ? 0xeeeeee : 0x222222;
      const geometry = new THREE.BoxGeometry(squareSize, 0.1, squareSize);
      const material = new THREE.MeshPhongMaterial({ color });
      const square = new THREE.Mesh(geometry, material);
      square.position.set(i - 4, 0, j - 4);
      scene.add(square);
    }
  }

  camera.position.z = 10;
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

document.getElementById('startBtn').addEventListener('click', () => {
  initBoard();
});