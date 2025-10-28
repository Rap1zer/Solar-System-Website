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

  if (columns["class"]) {
    const orbitClassMap = {
      AMO: 0, // Amor NEO
      APO: 1, // Apollo NEO
      ATE: 2, // Aten NEO
      IEO: 3, // Inner-Earth Object (Atira)
      MCA: 4, // Mars-crossing
      IMB: 5, // Inner main belt
      MBA: 6, // Middle main belt
      OMB: 7, // Outer main belt
      CEN: 8, // Centaur
      TJN: 9, // Trojan
      TNO: 10, // Trans-Neptunian
      AST: 11, // Unspecified asteroid
    };

    columns["class"] = columns["class"].map(c => orbitClassMap[c] ?? -1);
  }

  // Convert JS arrays to Float32Array for numeric columns
  for (const [name, arr] of Object.entries(columns)) {
    attributeArrays[name] = new Float32Array(arr);
  }

  // Optional alias
  if (attributeArrays["ma"]) {
    attributeArrays["M"] = attributeArrays["ma"];
    delete attributeArrays["ma"];
  } else if (attributeArrays["class"]) {
    attributeArrays["classId"] = attributeArrays["class"];
  }

  return { attributeArrays, numPoints };
}
