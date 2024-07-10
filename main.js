import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Cubesphere from "./cubesphere";

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

// const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(lightHelper);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;

const cubesphere = new Cubesphere(300).getGeometry();
const planet = new THREE.Mesh(cubesphere, new THREE.MeshStandardMaterial({ color: 0xd68c59 }));

// const loader = new THREE.TextureLoader();
// cubesphereGenerator.parent.children.forEach((child, index) => {
//   if (child instanceof THREE.Mesh) {
//     const surfaceMat = loader.load(`./textures/surface map/${index}.png`);
//     const normalMat = loader.load(`./textures/normal map/${index}.png`);
//     const displacementMap = loader.load(`./textures/displacement map/${index}.png`);
//     child.material = new THREE.MeshStandardMaterial({
//       map: surfaceMat,
//       normalMap: normalMat,
//       normalScale: new THREE.Vector2(2, 2),
//       displacementMap: displacementMap,
//       displacementScale: 0.1,
//     });
//   }
// });

scene.add(planet);

camera.position.setZ(20);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}

animate();
