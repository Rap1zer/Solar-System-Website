import * as THREE from "three";
import vertexShader from "../shaders/asteroidVert.glsl";
import fragmentShader from "../shaders/asteroidFrag.glsl";
import loadMsgpack from "../msgpackLoader";

function Asteroids(scene) {
  const geometry = new THREE.BufferGeometry();

  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader,
    fragmentShader,
  });

  const numPoints = 2;
  const vertices = new Float32Array(numPoints * 3);
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

  loadMsgpack("/simulationData/asteroidOrbitalData.msgpack").then((data) => {
    const numAttributes = Object.keys(data[0]).length;
    const orbitalAttributes = new Array(numAttributes)
      .fill()
      .map(() => new Float32Array(numPoints));
    let limit = 0;

    data.forEach((obj, index) => {
      if (limit >= numPoints) return;
      limit++;
      Object.keys(obj).forEach((key, pairIndex) => {
        const value = obj[key];
        orbitalAttributes[pairIndex][index] = value;
      });
    });
    console.log(data[0]);
    console.log(typeof data[0].a);
    console.log(typeof data[0].i);
    geometry.setAttribute("a", new THREE.BufferAttribute(orbitalAttributes[0], 1));
    geometry.setAttribute("e", new THREE.BufferAttribute(orbitalAttributes[1], 1));
    geometry.setAttribute("i", new THREE.BufferAttribute(orbitalAttributes[2], 1));
    geometry.setAttribute("M", new THREE.BufferAttribute(orbitalAttributes[3], 1));
    geometry.setAttribute("w", new THREE.BufferAttribute(orbitalAttributes[4], 1));
    geometry.setAttribute("ascNode", new THREE.BufferAttribute(orbitalAttributes[5], 1));
    geometry.setAttribute("n", new THREE.BufferAttribute(orbitalAttributes[6], 1));
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  this.update = function (time) {
    points.material.uniforms.time.value = time * 500;
  };
}

export default Asteroids;
