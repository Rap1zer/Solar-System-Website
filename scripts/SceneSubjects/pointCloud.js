import * as THREE from "three";
import vertexShader from "../shaders/asteroidVert.glsl";
import fragmentShader from "../shaders/asteroidFrag.glsl";

function PointCloud(scene) {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      M: { value: 0 }, // mean anomaly
      n: { value: 0 }, // mean motion
      e: { value: 0 }, // eccentricity
      a: { value: 0 }, // semimajor axis
      i: { value: 0 }, // inclination
      longOfNode: { value: 0 }, // longitude of ascending node
      peri: { value: 0 }, // argument of perihelion
    },
    vertexShader,
    fragmentShader,
  });

  const numPoints = 5000;
  const diameter = 600;
  const height = 10;

  const vertices = new Float32Array(numPoints * 3);
  const colors = new Float32Array(numPoints * 3);

  for (let i = 0; i < vertices.length; i += 3) {
    const angle = Math.random() * Math.PI * 2;
    const dist = (Math.random() - 0.5) * diameter;
    vertices[i] = Math.cos(angle) * dist;
    vertices[i + 1] = (Math.random() - 0.5) * height;
    vertices[i + 2] = Math.sin(angle) * dist;

    colors[i] = 0.3 + Math.random() * 0.7;
    colors[i + 1] = 0.3 + Math.random() * 0.7;
    colors[i + 2] = 0.3 + Math.random() * 0.7;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  this.update = function (time) {
    points.material.uniforms.time.value = time;
  };
}

export default PointCloud;
