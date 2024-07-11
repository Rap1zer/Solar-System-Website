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
directionalLight.target.position.set(0, 0, 0);

// const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(lightHelper);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;

const cubesphere = new Cubesphere(20).getGeometry();
const loader = new THREE.TextureLoader();
const materials = new Array(6);
for (let i = 0; i < 6; i++) {
  const diffuseTexture = setTexture("DiffuseMap", loader, i);
  const normalTexture = setTexture("NormalMap", loader, i);
  const displacementTexture = setTexture("DisplacementMap", loader, i);
  materials[i] = new THREE.MeshStandardMaterial({
    map: diffuseTexture,
    normalMap: normalTexture,
    normalScale: new THREE.Vector2(2, 2),
    displacementMap: displacementTexture,
    displacementScale: 0.3,
  });
}

function setTexture(folderName, loader, i) {
  const texture = loader.load(`/textures/${folderName}/${i}.png`);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

const planet = new THREE.Mesh(cubesphere, materials);

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
scene.add(planet);

camera.position.setZ(20);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
