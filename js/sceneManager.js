import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function SceneManager(canvas) {
  const screenDimensions = {
    width: canvas.width,
    height: canvas.height,
  };

  const scene = new THREE.Scene();
  const renderer = buildRenderer(screenDimensions);
  const camera = buildCamera(screenDimensions);
  const controls = buildOrbitControls(camera, canvas);
  const sceneSubjects = createSceneSubjects();

  function buildRenderer({ width, height }) {
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
    renderer.setPixelRatio(DPR);
    renderer.setSize(width, height);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    return renderer;
  }

  function buildCamera({ width, height }) {
    const aspectRatio = width / height;
    const fieldOfView = 60;
    const nearPlane = 1;
    const farPlane = 100;
    const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

    return camera;
  }

  function buildOrbitControls() {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    return controls;
  }

  function createSceneSubjects(scene) {
    const sceneSubjects = [];

    return sceneSubjects;
  }

  this.update = function () {
    for (let i = 0; i < sceneSubjects.length; i++) sceneSubjects[i].update();
    controls.update();
    renderer.render(scene, camera);
  };
}

export default SceneManager;
