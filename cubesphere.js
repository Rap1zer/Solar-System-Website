import * as THREE from "three";

class Cubesphere {
  constructor(resolution = 20, scale = 10) {
    this.resolution = resolution;
    this.scale = scale;

    this.geometry = new THREE.BoxGeometry(1, 1, 1, resolution, resolution, resolution);
    this.transformVertices(); // transform cube to sphere
    this.updateNormals(); // update normals after transformation
  }

  // Transform all vertices from cube to sphere
  transformVertices() {
    const posAttribute = this.geometry.attributes.position;
    let vertex = new THREE.Vector3();

    for (let i = 0, l = posAttribute.count; i < l; i++) {
      vertex.fromBufferAttribute(posAttribute, i);
      // Normalize the vertex coordinates to the range [-1, 1]
      vertex = new THREE.Vector3(vertex.x * 2, vertex.y * 2, vertex.z * 2);
      // Transform the vertex from cube to sphere and scale
      vertex = this.cubeToSphere(vertex).multiplyScalar(this.scale);
      // Update the position attribute with the new vertex coordinates
      posAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
  }

  // Update normals of the geometry
  updateNormals() {
    const normalAttribute = this.geometry.attributes.normal;
    const posAttribute = this.geometry.attributes.position;

    for (let i = 0, l = normalAttribute.count; i < l; i++) {
      const vertex = new THREE.Vector3().fromBufferAttribute(posAttribute, i);
      const normal = vertex.normalize();

      normalAttribute.setXYZ(i, normal.x, normal.y, normal.z);
    }
  }

  // Transform a point on the cube to a point on the sphere
  cubeToSphere(p) {
    const x2 = p.x * p.x;
    const y2 = p.y * p.y;
    const z2 = p.z * p.z;
    const x = p.x * Math.sqrt(1 - (y2 + z2) / 2 + (y2 * z2) / 3);
    const y = p.y * Math.sqrt(1 - (z2 + x2) / 2 + (z2 * x2) / 3);
    const z = p.z * Math.sqrt(1 - (x2 + y2) / 2 + (x2 * y2) / 3);
    return new THREE.Vector3(x, y, z);
  }

  // Get the transformed geometry
  getGeometry() {
    return this.geometry;
  }
}

export default Cubesphere;
