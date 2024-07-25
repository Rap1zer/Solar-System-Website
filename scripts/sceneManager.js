import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Lights, Asteroids, Sun } from "./SceneSubjects";

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
    const farPlane = 3000;
    const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    camera.position.set(0, 0, 30);
    return camera;
  }

  function buildOrbitControls() {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
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

  this.update = function () {
    const time = clock.getElapsedTime(); // time passed
    for (let i = 0; i < sceneSubjects.length; i++) sceneSubjects[i].update(time);
    controls.update();
    renderer.render(scene, camera);
  };
}

export default SceneManager;
