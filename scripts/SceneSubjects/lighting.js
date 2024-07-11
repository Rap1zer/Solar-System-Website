import * as THREE from "three";
function Lights(scene) {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  scene.add(directionalLight);
  directionalLight.position.set(10, 15, 12);
  directionalLight.target.position.set(0, 0, 0);

  this.update = function () {};
}

export default Lights;
