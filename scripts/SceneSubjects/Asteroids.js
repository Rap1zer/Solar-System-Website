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
      glslVersion: THREE.GLSL3,
    });

    loadMsgpack("/simulationData/asteroidOrbitalData.msgpack").then((data) => {
      const numPoints = data.length;

      const vertices = new Float32Array(numPoints * 3);
      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

      const orbitalAttributes = Object.keys(data[0]).map(() => new Float32Array(numPoints));

      data.forEach((obj, i) => {
        Object.values(obj).forEach((value, pairIndex) => {
          orbitalAttributes[pairIndex][i] = value;
        });
      });

      const attributeKeys = ["a", "e", "i", "om", "w", "M", "n"];
      attributeKeys.forEach((key, index) => {
        geometry.setAttribute(key, new THREE.BufferAttribute(orbitalAttributes[index], 1));
      });
    });

    this.points = new THREE.Points(geometry, material);
    scene.add(this.points);
  }

  update(time) {
    this.points.material.uniforms.time.value = time * 500;
  }
}

export default Asteroids;
