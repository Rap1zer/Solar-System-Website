import * as THREE from "three";
import vertexShader from "../shaders/asteroidVert.glsl";
import fragmentShader from "../shaders/asteroidFrag.glsl";

function PointCloud(scene) {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader,
    fragmentShader,
  });

  const numPoints = 500;
  const vertices = new Float32Array(numPoints * 3);
  const colors = new Float32Array(numPoints * 3);

  for (let i = 0; i < vertices.length; i += 3) {
    vertices[i] = (Math.random() - 0.5) * 60;
    vertices[i + 1] = 0;
    vertices[i + 2] = (Math.random() - 0.5) * 60;

    colors[i] = 0.3 + Math.random() * 0.7;
    colors[i + 1] = 0.3 + Math.random() * 0.7;
    colors[i + 2] = 0.3 + Math.random() * 0.7;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  this.update = function () {
    points.material.uniforms.time.value = performance.now();
  };
}

export default PointCloud;
