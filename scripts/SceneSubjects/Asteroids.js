import * as THREE from "three";
import vertexShader from "../shaders/asteroidVert.glsl";
import fragmentShader from "../shaders/asteroidFrag.glsl";
import loadMsgpack from "../fileReaders/msgpackLoader";

class Asteroids {
  points;
  constructor(scene) {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader,
      fragmentShader,
    });

    loadMsgpack("/simulationData/asteroidOrbitalData.msgpack").then((data) => {
      const numPoints = data.length;

      const vertices = new Float32Array(numPoints * 3);
      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

      const numOrbitalAttributes = Object.keys(data[0]).length;
      const orbitalAttributes = new Array(numOrbitalAttributes)
        .fill()
        .map(() => new Float32Array(numPoints));
      let limit = 0;

      data.forEach((obj, index) => {
        if (limit >= 500) return;
        limit++;
        Object.keys(obj).forEach((key, pairIndex) => {
          const value = obj[key];
          orbitalAttributes[pairIndex][index] = value;
        });
      });
      geometry.setAttribute("a", new THREE.BufferAttribute(orbitalAttributes[0], 1));
      geometry.setAttribute("e", new THREE.BufferAttribute(orbitalAttributes[1], 1));
      geometry.setAttribute("i", new THREE.BufferAttribute(orbitalAttributes[2], 1));
      geometry.setAttribute("om", new THREE.BufferAttribute(orbitalAttributes[3], 1));
      geometry.setAttribute("w", new THREE.BufferAttribute(orbitalAttributes[4], 1));
      geometry.setAttribute("M", new THREE.BufferAttribute(orbitalAttributes[5], 1));
      geometry.setAttribute("n", new THREE.BufferAttribute(orbitalAttributes[6], 1));
    });

    this.points = new THREE.Points(geometry, material);
    scene.add(this.points);
  }

  update(time) {
    this.points.material.uniforms.time.value = time * 500;
  }
}

export default Asteroids;
