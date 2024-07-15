import * as THREE from "three";
import vertexShader from "../shaders/asteroidVert.glsl";
import fragmentShader from "../shaders/asteroidFrag.glsl";

function PointCloud(scene) {
  const geometry = new THREE.BufferGeometry();

  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      M: { value: THREE.MathUtils.degToRad(102.95) }, // mean anomaly at epoch
      n: { value: THREE.MathUtils.degToRad(0.2141) }, // mean motion
      e: { value: 0.079 }, // eccentricity
      a: { value: 2.767 }, // semimajor axis
      i: { value: THREE.MathUtils.degToRad(10.59) }, // inclination
      ascendingNode: { value: THREE.MathUtils.degToRad(80.25) }, // longitude of ascending node
      w: { value: THREE.MathUtils.degToRad(73.36) }, // argument of perihelion
    },
    vertexShader,
    fragmentShader,
  });

  const numPoints = 1;
  const vertices = new Float32Array(numPoints * 3);
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  this.update = function (time) {
    points.material.uniforms.time.value = time * 500;
  };
}

export default PointCloud;
