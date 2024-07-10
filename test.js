import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Wireframe } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
});
renderer.setSize(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);
directionalLight.position.set(10, 15, 12);
directionalLight.target.position.set(0, 0, 0); // Set target position

const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(lightHelper);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;

let geometry = new THREE.BoxGeometry(300, 300, 300, 20, 20, 20);
const posAttribute = geometry.attributes.position;
let vertex = new THREE.Vector3();

for (var i = 0, l = posAttribute.count; i < l; i++) {
  vertex.fromBufferAttribute(posAttribute, i);
  vertex = new THREE.Vector3(vertex.x / 150, vertex.y / 150, vertex.z / 150);
  vertex = cubeToSphere(vertex).multiplyScalar(10);
  posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
}
posAttribute.needsUpdate = true;

const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ wireframe: true }));
scene.add(mesh);

camera.position.setZ(20);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}

animate();

function cubeToSphere(p) {
  const x2 = p.x * p.x;
  const y2 = p.y * p.y;
  const z2 = p.z * p.z;

  const x = p.x * Math.sqrt(1 - (y2 + z2) / 2 + (y2 * z2) / 3);
  const y = p.y * Math.sqrt(1 - (z2 + x2) / 2 + (z2 * x2) / 3);
  const z = p.z * Math.sqrt(1 - (x2 + y2) / 2 + (x2 * y2) / 3);

  return new THREE.Vector3(x, y, z);
}
