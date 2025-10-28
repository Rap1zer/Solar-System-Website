// Asteroids.js
import * as THREE from "three";
import vertexShader from "../shaders/asteroidVert.glsl";
import fragmentShader from "../shaders/asteroidFrag.glsl";
import { fetchAsteroidData } from "../fileReaders/fetchAsteroidData";
import { coloursAsFloats } from "../orbitClass";

class Asteroids {
  points;
  geometry;
  material;

  constructor(scene) {
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.ShaderMaterial({
      uniforms: { 
        time: { value: 0 }, 
        au: { value: 30 }, 
        orbitColors: { value: coloursAsFloats } 
      },
      vertexShader,
      fragmentShader,
      glslVersion: THREE.GLSL3,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    scene.add(this.points);

    this.loadData("/simulationData/asteroidOrbitalData.msgpack");
  }

  async loadData(url) {
    try {
      const { attributeArrays, numPoints } = await fetchAsteroidData(url);

      // Setup positions (empty for now, computed in shader)
      const positions = new Float32Array(numPoints * 3);
      this.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      // Set orbital attributes
      Object.entries(attributeArrays).forEach(([name, array]) => {
        this.geometry.setAttribute(name, new THREE.BufferAttribute(array, 1));
      });

      console.log(`Loaded ${numPoints} asteroids`);
      console.log("Asteroid attributes:", attributeArrays);
    } catch (err) {
      console.error("Failed to load asteroid data:", err);
    }
  }

  update(time) {
    this.material.uniforms.time.value = time * 30;
  }
}

export default Asteroids;
