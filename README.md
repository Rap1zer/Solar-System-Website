# Solar System Asteroid Simulator
[See the live demo here.](https://melodious-sunburst-6dc0e1.netlify.app/)

A Three.js and WebGL-powered visualisation of 1.4 million NASA small bodies rendered in real time.

## Features
- **GPU-orchestrated orbital mechanics** – a custom GLSL vertex shader ([`asteroidVert.glsl.js`](scripts/shaders/asteroidVert.glsl.js)) numerically solves Kepler's equation each frame so every asteroid advances along its orbit entirely on the GPU, keeping the CPU free for UI and controls.
- **NASA dataset ingestion** – orbital elements from [NASA's Small-Body Database](https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/) are shipped as Msgpack, converted to typed vertex attributes in [`msgpackLoader.js`](scripts/fileReaders/msgpackLoader.js), and streamed straight into a `THREE.Points` cloud via [`Asteroids.js`](scripts/SceneSubjects/Asteroids.js) without stalling the render loop.
- **Asteroid scaling based on NASA data** – point sizes are derived from each body's physical diameter in the NASA dataset, so large asteroids visibly stand out from sub-kilometre objects.
- **Orbit-class colour coding** – asteroid hues are assigned from their orbital class, as seen in [`orbitClass.js`](scripts/orbitClass.js). This makes it easy to distinguish main-belt asteroids, near-Earth objects, Trojans, and more at a glance.
- **Interactive solar observatory** – Vite, Three.js, and OrbitControls work alongside [`sceneManager.js`](scripts/sceneManager.js) and the scene subjects in [`scripts/SceneSubjects`](scripts/SceneSubjects) to drive a responsive scene with performance instrumentation so you can inspect the asteroid belt from any vantage point while monitoring frame time.

## Tech Stack
- **Three.js + WebGL2/GLSL** for rendering, shader-based orbit propagation, and GPU point clouds.
- **Vite** for the build pipeline and dev server.
- **Msgpack tooling** to deliver compact, columnar orbital data to the browser.

## Implementation Notes
- The asteroid renderer is deliberately shader-driven: the CPU uploads orbital elements once, and the GPU updates positions every frame, which is the only feasible way to keep millions of bodies in motion at 60 FPS on consumer hardware.
- I did early experiments with cubespher terrain, and the prototype still lives in the repository for reference ([`cubesphere.js`](scripts/cubesphere.js)).