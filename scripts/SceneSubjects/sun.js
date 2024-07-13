import * as THREE from "three";

function Sun(scene) {
  const geometry = new THREE.SphereGeometry(5, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffe8a8 });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  // const light = new THREE.PointLight(0xffff00, 1, 100); // Yellow light
  // sphere.add(light); // Attach light to the sun mesh

  this.update = function () {};
}

export default Sun;
