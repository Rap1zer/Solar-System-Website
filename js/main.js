import SceneManager from "./sceneManager.js";

const canvas = document.getElementById("bg");
const sceneManager = new SceneManager(canvas);

bindEventListeners();
animate();

function bindEventListeners() {}

function animate() {
  requestAnimationFrame(animate);
  sceneManager.update();
}
