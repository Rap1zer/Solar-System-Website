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
      const mesh = this.parent.children[i].geometry;
      this.updateFace(mesh, this.directions[i]);
    }
  }

  generateCubesphere() {
    for (let i = 0; i < 6; i++) {
      const geometry = new THREE.BufferGeometry();
      const material = new THREE.MeshStandardMaterial({ color: 0x9370db });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = "Mesh";
      this.parent.add(mesh);

      this.updateFace(geometry, this.directions[i]);
    }
  }

  updateFace(geometry, direction) {
    const verticesPerRow = Math.pow(2, this.resolution) + 1;
    const vertices = this.getSphereVertices(verticesPerRow, this.size, direction);
    const triangles = this.getTriangles(verticesPerRow);
    const uvs = this.calculateUVs(verticesPerRow);

    const { float32Pos, float32Uvs } = flattenVerticesAndUVs(vertices, uvs);

    geometry.setAttribute("position", new THREE.BufferAttribute(float32Pos, 3));
    geometry.setIndex(triangles);
    geometry.setAttribute("uv", new THREE.BufferAttribute(float32Uvs, 2));

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

        const vertex = CubeSphereGenerator.cubeToSphere(pointOnCube).multiplyScalar(size);

        vertices.push(vertex);
      }
    }

    return vertices;
  }

  calculateUVs(verticesPerRow) {
    const uvs = [];

    for (let i = 0; i < verticesPerRow; i++) {
      for (let j = 0; j < verticesPerRow; j++) {
        uvs.push(new THREE.Vector2(i / (verticesPerRow - 1), j / (verticesPerRow - 1)));
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

    for (let i = 0, triangleCounter = 0; triangleCounter < vertexCount - verticesPerRow; i += 6) {
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

function flattenVerticesAndUVs(vertices, uvs) {
  const float32Pos = new Float32Array(vertices.length * 3);
  for (let i = 0; i < vertices.length; i++) {
    let posIndex = i * 3;
    float32Pos[posIndex] = vertices[i].x;
    float32Pos[posIndex + 1] = vertices[i].y;
    float32Pos[posIndex + 2] = vertices[i].z;
  }

  const float32Uvs = new Float32Array(uvs.length * 2);
  for (let i = 0; i < uvs.length; i++) {
    let uvIndex = i * 2;
    float32Uvs[uvIndex] = uvs[i].x;
    float32Uvs[uvIndex + 1] = uvs[i].y;
  }

  return { float32Pos, float32Uvs };
}

export default CubeSphereGenerator;
