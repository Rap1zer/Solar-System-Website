import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Asteroids, Sun } from "./SceneSubjects";
import Stats from 'stats.js';

function SceneManager(canvas) {
  const screenDimensions = {
    width: canvas.clientWidth,
    height: canvas.clientHeight,
  };

  const scene = new THREE.Scene();
  const renderer = buildRenderer(screenDimensions);
  const camera = buildCamera(screenDimensions);
  const controls = buildOrbitControls(camera, canvas);
  const sceneSubjects = createSceneSubjects(scene);
  // buildHelpers(scene);

  function buildRenderer({ width, height }) {
    const renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById("bg"),
    });
    renderer.setSize(width, height);

    return renderer;
  }

  function buildCamera({ width, height }) {
    const aspectRatio = width / height;
    const fieldOfView = 75;
    const nearPlane = 0.1;
    const farPlane = 7000;
    const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    camera.position.set(0, -20, 240);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
    return camera;
  }

  function buildOrbitControls() {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.minPolarAngle = THREE.MathUtils.degToRad(5);
    controls.maxPolarAngle = THREE.MathUtils.degToRad(175);
    controls.object.up.set(0, 0, 1);
    return controls;
  }

  function buildHelpers(scene) {
    const gridHelper = new THREE.GridHelper(200, 50);
    scene.add(gridHelper);
  }

  function createSceneSubjects(scene) {
    const sceneSubjects = [new Asteroids(scene), new Sun(scene)];

    return sceneSubjects;
  }

  const clock = new THREE.Clock();
  clock.start();

  // const stats = new Stats();
  // stats.showPanel(0); // fps
  // document.body.appendChild(stats.dom);

  this.update = function () {
    // stats.begin();

    const time = clock.getElapsedTime(); // time passed
    for (let i = 0; i < sceneSubjects.length; i++) sceneSubjects[i].update(time);
    controls.update();
    renderer.render(scene, camera);

    // stats.end();
  };
}

export default SceneManager;
