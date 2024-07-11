import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Lights from "./SceneSubjects/lighting";

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
  console.log(screenDimensions);

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
    const farPlane = 1000;
    const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

    return camera;
  }

  function buildOrbitControls() {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    return controls;
  }

  function createSceneSubjects(scene) {
    const sceneSubjects = [new Lights(scene)];

    return sceneSubjects;
  }

  this.update = function () {
    for (let i = 0; i < sceneSubjects.length; i++) sceneSubjects[i].update();
    controls.update();
    renderer.render(scene, camera);
  };
}

export default SceneManager;
