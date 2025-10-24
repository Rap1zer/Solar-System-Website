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
  const [headers, rows] = await loadMsgpack(url);
  const numPoints = rows.length;

  // columns we care about, but now by column index
  // Find column indices by header name once
  const wanted = ["a", "e", "i", "om", "w", "ma", "n", "epoch"];
  const idx = Object.fromEntries(
    wanted.map(name => [name, headers.indexOf(name)])
  );

  // Pre-allocate typed arrays
  const attributes = Object.fromEntries(
    wanted.map(name => [name, new Float32Array(numPoints)])
  );

  // Fill typed arrays by index
  for (let i = 0; i < numPoints; i++) {
    const row = rows[i];
    for (const name of wanted) {
      attributes[name][i] = row[idx[name]];
    }
  }

  // If you still want ma -> M alias:
  attributes["M"] = attributes["ma"];
  delete attributes["ma"];

  return { attributeArrays: attributes, numPoints };
}