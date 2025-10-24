import loadMsgpack from "./msgpackLoader";

/**
 * Fetches asteroid orbital data from columnar Msgpack.
 * Returns typed arrays without nested loops.
 */
export async function fetchAsteroidData(url) {
  // Load Msgpack (column-oriented)
  const columns = await loadMsgpack(url);

  const attributeArrays = {};
  const numPoints = columns[Object.keys(columns)[0]].length; // number of rows

  // Convert JS arrays to Float32Array for numeric columns
  for (const [name, arr] of Object.entries(columns)) {
    attributeArrays[name] = new Float32Array(arr);
  }

  // Optional alias
  if (attributeArrays["ma"]) {
    attributeArrays["M"] = attributeArrays["ma"];
    delete attributeArrays["ma"];
  }

  return { attributeArrays, numPoints };
}
