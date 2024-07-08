import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CubeSphereGenerator from "./cubesphereGenerator";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
});
renderer.setSize(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

const cubesphereGenerator = new CubeSphereGenerator(1, 2);
cubesphereGenerator.parent.children.forEach((child) => {
  scene.add(child);
});
scene.add(cubesphereGenerator.parent);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

camera.position.setZ(30);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}

animate();
