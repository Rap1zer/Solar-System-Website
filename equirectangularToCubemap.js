import * as THREE from "three";
import { saveAs } from "file-saver"; // Optional: For saving files (if needed)

class EquirectangularToCubemap {
  convert(equirectangular, size = 1024, saveToFile = false) {
    this.equirectangularMap = equirectangular;
    this.cubemapSize = size;
    this.saveToFile = saveToFile;

    // Create a canvas if not already existing
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d", { willReadFrequently: true });

    this.canvas.width = this.equirectangularMap.width;
    this.canvas.height = this.equirectangularMap.height;

    this.context.drawImage(this.equirectangularMap, 0, 0);

    return this.convertEquirectangularToCubemap();
  }

  convertEquirectangularToCubemap() {
    const faces = [];
    const faceNames = ["posx", "negx", "posy", "negy", "posz", "negz"];

    for (let i = 0; i < 6; i++) {
      const face = new THREE.DataTexture(
        new Uint8Array(this.cubemapSize * this.cubemapSize * 4),
        this.cubemapSize,
        this.cubemapSize,
        THREE.RGBAFormat
      );
      face.needsUpdate = true;
      faces.push(face);

      for (let y = 0; y < this.cubemapSize; y++) {
        for (let x = 0; x < this.cubemapSize; x++) {
          const direction = this.getCubeMapDirection(i, x, y);
          const color = this.sampleEquirectangularMap(direction);

          const index = (x + y * this.cubemapSize) * 4;
          face.image.data[index + 0] = color.r * 255; // Red
          face.image.data[index + 1] = color.g * 255; // Green
          face.image.data[index + 2] = color.b * 255; // Blue
          face.image.data[index + 3] = 255; // Alpha (fully opaque)
        }
      }

      if (this.saveToFile) {
        this.saveTextureToFile(face, faceNames[i]);
      }
    }

    return faces;
  }

  getCubeMapDirection(face, x, y) {
    const u = ((x + 0.5) / this.cubemapSize) * 2.0 - 1.0;
    const v = ((y + 0.5) / this.cubemapSize) * 2.0 - 1.0;

    switch (face) {
      case 0:
        return new THREE.Vector3(-u, 1, -v); // +Y
      case 1:
        return new THREE.Vector3(-u, -1, v); // -Y
      case 2:
        return new THREE.Vector3(v, -u, -1); // +X
      case 3:
        return new THREE.Vector3(-v, -u, 1); // -X
      case 4:
        return new THREE.Vector3(1, v, u); // -Z
      case 5:
        return new THREE.Vector3(-1, -v, u); // +Z
      default:
        return new THREE.Vector3(0, 0, 0);
    }
  }

  sampleEquirectangularMap(direction) {
    const phi = Math.atan2(direction.z, direction.x);
    const theta = Math.acos(direction.y / direction.length());

    const u = (phi + Math.PI) / (2.0 * Math.PI);
    const v = theta / Math.PI;

    const x = Math.floor(
      THREE.MathUtils.clamp(u * this.equirectangularMap.width, 0, this.equirectangularMap.width - 1)
    );
    const y = Math.floor(
      THREE.MathUtils.clamp(
        (1 - v) * this.equirectangularMap.height,
        0,
        this.equirectangularMap.height - 1
      )
    );

    const imageData = this.context.getImageData(x, y, 1, 1).data;

    const color = new THREE.Color();
    color.setRGB(imageData[0] / 255, imageData[1] / 255, imageData[2] / 255);

    return color;
  }

  saveTextureToFile(texture, fileName) {
    // Convert texture to base64 data URL
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = texture.image.width;
    canvas.height = texture.image.height;

    const imageData = new ImageData(
      new Uint8ClampedArray(texture.image.data.buffer),
      texture.image.width,
      texture.image.height
    );
    context.putImageData(imageData, 0, 0);

    const base64 = canvas.toDataURL();

    // Save using FileSaver.js (optional, if you want to save)
    saveAs(base64, fileName);

    console.log(`Saved ${fileName}`);
  }
}

export default EquirectangularToCubemap;
