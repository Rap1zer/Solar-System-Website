import * as THREE from "three";
import vertexShader from "../shaders/asteroidVert.glsl";
import fragmentShader from "../shaders/asteroidFrag.glsl";

function PointCloud(scene) {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      M: { value: 102.95 }, // mean anomaly at epoch
      n: { value: 0.2141 }, // mean motion
      e: { value: 0.079 }, // eccentricity
      a: { value: 2.767 }, // semimajor axis
      i: { value: 10.59 }, // inclination
      longOfNode: { value: 80.25 }, // longitude of ascending node
      peri: { value: 73.36 }, // argument of perihelion
    },
    vertexShader,
    fragmentShader,
  });

  const numPoints = 5;
  const diameter = 60;
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
    points.material.uniforms.time.value = time * 1000;
    // Access the position attribute of the geometry
    const positions = points.geometry.attributes.position.array;

    // Assuming the position is a Float32Array and each vertex has 3 components (x, y, z)
    const x = positions[0];
    const y = positions[1];
    const z = positions[2];

    console.log(`Position of first vertex: x = ${x}, y = ${y}, z = ${z}`);
  };
}

export default PointCloud;
