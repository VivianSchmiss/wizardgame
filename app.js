//    CODE 2:
let scene, camera, renderer;
let score = 0;
const enemySpeed = 0.05;
const enemies = [];

// Initialisierung
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(VRButton.createButton(renderer));

  // Licht
  const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(light);

  // Boden
  const floorGeometry = new THREE.PlaneGeometry(100, 100);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Spieler
  camera.position.set(0, 1.6, 5);
  scene.add(camera);

  // Gegner
  for (let i = 0; i < 5; i++) {
    createEnemy();
  }

  // VR-Controller
  const controller = renderer.xr.getController(0);
  controller.addEventListener("selectstart", onSelectStart);
  scene.add(controller);

  animate();
}

function createEnemy() {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const enemy = new THREE.Mesh(geometry, material);
  enemy.position.set(Math.random() * 10 - 5, 1.5, -Math.random() * 10 - 10);
  enemies.push(enemy);
  scene.add(enemy);
}

function onSelectStart(event) {
  const controller = event.target;
  const intersections = getIntersections(controller);
  if (intersections.length > 0) {
    const enemy = intersections[0].object;
    scene.remove(enemy);
    enemies.splice(enemies.indexOf(enemy), 1);
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    if (score >= 15) {
      alert("Gewonnen!");
    }
    createEnemy();
  }
}

function getIntersections(controller) {
  const tempMatrix = new THREE.Matrix4();
  tempMatrix.identity().extractRotation(controller.matrixWorld);
  const raycaster = new THREE.Raycaster();
  raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
  raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
  return raycaster.intersectObjects(enemies);
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  enemies.forEach((enemy) => {
    enemy.position.z += enemySpeed;
    if (enemy.position.z > camera.position.z) {
      enemy.position.set(Math.random() * 10 - 5, 1.5, -Math.random() * 10 - 10);
    }
  });
  renderer.render(scene, camera);
}

init();
