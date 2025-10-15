// utils/fetchAsteroidData.js
import loadMsgpack from "./msgpackLoader";

/**
 * Fetches and prepares asteroid orbital data from Msgpack.
 * Returns a promise that resolves to an object:
 * {
 *   attributeArrays: { a: Float32Array, e: Float32Array, ... },
 *   numPoints: number
 * }
 */
export async function fetchAsteroidData(url) {
  const data = await loadMsgpack(url);
  const numPoints = data.length;

  const attributeKeys = [
    { key: "a", name: "a" },
    { key: "e", name: "e" },
    { key: "i", name: "i" },
    { key: "om", name: "om" },
    { key: "w", name: "w" },
    { key: "ma", name: "M" }, // map 'ma' -> 'M'
    { key: "n", name: "n" },
  ];

  const attributes = {};
  attributeKeys.forEach(({ name }) => {
    attributes[name] = new Float32Array(numPoints);
  });

  data.forEach((obj, i) => {
    attributeKeys.forEach(({ key, name }) => {
      attributes[name][i] = obj[key];
    });
  });

  return { attributeArrays: attributes, numPoints };
}
