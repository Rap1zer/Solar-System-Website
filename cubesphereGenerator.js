import * as THREE from "three";

class CubeSphereGenerator {
  constructor(size = 5, resolution = 1) {
    this.size = size;
    this.resolution = resolution;
    this.parent = new THREE.Object3D();

    this.directions = [
      new THREE.Vector3(0, 1, 0), // +Y
      new THREE.Vector3(0, -1, 0), // -Y
      new THREE.Vector3(1, 0, 0), // +X
      new THREE.Vector3(-1, 0, 0), // -X
      new THREE.Vector3(0, 0, 1), // +Z
      new THREE.Vector3(0, 0, -1), // -Z
    ];

    this.generateCubesphere();
  }

  updateSphereMesh(size, resolution) {
    this.size = size;
    this.resolution = resolution;

    for (let i = 0; i < 6; i++) {
      const mesh = this.parent.children[i].getObjectByName("Mesh").geometry;
      this.updateFace(mesh, this.directions[i]);
    }
  }

  generateCubesphere() {
    const meshes = [];
    const materials = [];

    for (let i = 0; i < 6; i++) {
      const geometry = new THREE.BufferGeometry();
      const material = new THREE.MeshStandardMaterial({ color: 0xffa500 });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = "Mesh";

      const child = new THREE.Object3D();
      child.add(mesh);

      this.parent.add(child);

      meshes.push(geometry);
      materials.push(material);

      this.updateFace(geometry, this.directions[i]);
    }
  }

  updateFace(geometry, direction) {
    const verticesPerRow = Math.pow(2, this.resolution) + 1;
    const vertices = this.getSphereVertices(
      verticesPerRow,
      this.size,
      direction
    );
    const triangles = this.getTriangles(verticesPerRow);
    const uvs = this.calculateUVs(verticesPerRow);

    //console.log(vertices);
    const positions = [];
    for (const vertex of vertices) {
      positions.push(vertex.x, vertex.y, vertex.z);
    }
    console.log(positions);
    console.log(new Float32Array(positions));

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(positions), 3)
    );
    geometry.setIndex(triangles);
    geometry.setAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array(uvs.flat()), 2)
    );

    geometry.computeVertexNormals();
  }

  getSphereVertices(verticesPerRow, size, localUp) {
    const vertices = [];

    const dx = new THREE.Vector3(localUp.y, localUp.z, localUp.x);
    const dy = new THREE.Vector3();
    dy.crossVectors(localUp, dx);

    for (let i = 0; i < verticesPerRow; i++) {
      for (let j = 0; j < verticesPerRow; j++) {
        const yVertexPercent = i / (verticesPerRow - 1);
        const xVertexPercent = j / (verticesPerRow - 1);

        const pointOnCube = localUp
          .clone()
          .addScaledVector(dx, (xVertexPercent - 0.5) * 2)
          .addScaledVector(dy, (yVertexPercent - 0.5) * 2);

        const vertex =
          CubeSphereGenerator.cubeToSphere(pointOnCube).multiplyScalar(size);

        vertices.push(vertex);
      }
    }

    return vertices;
  }

  calculateUVs(verticesPerRow) {
    const uvs = [];

    for (let i = 0; i < verticesPerRow; i++) {
      for (let j = 0; j < verticesPerRow; j++) {
        uvs.push(
          new THREE.Vector2(i / (verticesPerRow - 1), j / (verticesPerRow - 1))
        );
      }
    }

    return uvs;
  }

  static cubeToSphere(p) {
    const x2 = p.x * p.x;
    const y2 = p.y * p.y;
    const z2 = p.z * p.z;

    const x = p.x * Math.sqrt(1 - (y2 + z2) / 2 + (y2 * z2) / 3);
    const y = p.y * Math.sqrt(1 - (z2 + x2) / 2 + (z2 * x2) / 3);
    const z = p.z * Math.sqrt(1 - (x2 + y2) / 2 + (x2 * y2) / 3);

    return new THREE.Vector3(x, y, z);
  }

  getTriangles(verticesPerRow) {
    const triangles = [];
    const vertexCount = verticesPerRow * verticesPerRow;

    for (
      let i = 0, triangleCounter = 0;
      triangleCounter < vertexCount - verticesPerRow;
      i += 6
    ) {
      if (i !== 0 && (i / 6 + 1) % verticesPerRow === 0) {
        triangleCounter++;
        continue;
      }

      triangles.push(
        triangleCounter,
        triangleCounter + verticesPerRow + 1,
        triangleCounter + verticesPerRow,
        triangleCounter,
        triangleCounter + 1,
        triangleCounter + verticesPerRow + 1
      );

      triangleCounter++;
    }

    return triangles;
  }
}

export default CubeSphereGenerator;
