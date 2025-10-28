import * as THREE from "three";

function Sun(scene) {
  const color = new THREE.Color("#FDB813");
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  const light = new THREE.PointLight(0xffff00, 1, 100); // Yellow light
  sphere.add(light); // Attach light to the sun mesh

  this.update = function () {};
}

export default Sun;
