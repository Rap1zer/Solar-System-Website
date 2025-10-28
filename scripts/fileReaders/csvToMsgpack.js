import { encode } from "@msgpack/msgpack";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path relative to project root
const projectRoot = path.join(__dirname, "..", "..");
const csvFilePath = path.join(projectRoot, "downloadedDatasets", "sbdb_query_results_new.csv");
const msgpackFilePath = path.join(projectRoot, "public/simulationData", "asteroidOrbitalData.msgpack");

const csv = fs.readFileSync(csvFilePath, "utf8");
console.log("CSV loaded successfully");
const lines = csv.split("\n");

// Parse headers
const headers = lines[0].split(",").map(h => h.trim().replace(/^"(.*)"$/, "$1"));

// Columns we care about
const wanted = ["a", "e", "i", "om", "w", "ma", "n", "epoch", "diameter", "class"];

// Initialize empty arrays for each column
const columns = Object.fromEntries(wanted.map(name => [name, []]));

// Process rows
for (let row = 1; row < lines.length; row++) {
  const currentline = lines[row].split(",");
  if (currentline.length !== headers.length) continue;

  const e = parseFloat(currentline[1]);
  if (isNaN(e) || e > 1) continue; // skip invalid eccentricity

  // Push values directly into columns
  for (const name of wanted) {
    const colIdx = headers.indexOf(name);
    let val = currentline[colIdx];

    // Convert numbers
    const isNum = /^\d+(\.\d+)?$/.test(val);
    val = isNum ? parseFloat(val) : val;

    // Convert certain columns from degrees to radians
    if (["i", "om", "w", "ma", "n"].includes(name)) {
      if (typeof val === "number" && !isNaN(val)) val = (val * Math.PI) / 180;
    }

    columns[name].push(val);
  }
}

// Encode columnar structure with Msgpack
const buffer = encode(columns);

fs.writeFileSync(msgpackFilePath, buffer);

console.log("Msgpack file written successfully!");
