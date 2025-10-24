import { encode } from "@msgpack/msgpack";

const csvFilePath = "/downloadedDatasets/sbdb_query_results_new.csv";

// Read CSV file and convert to column-oriented Msgpack
fetch(csvFilePath)
  .then((response) => response.text())
  .then((csv) => {
    const lines = csv.split("\n");

    // Parse headers
    const headers = lines[0].split(",").map(h => h.trim().replace(/^"(.*)"$/, "$1"));

    // Columns we care about
    const wanted = ["a", "e", "i", "om", "w", "ma", "n", "epoch"];
    
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

        // Convert certain columns from degrees → radians
        if (["i", "om", "w", "M", "n"].includes(name) || [2,3,4,11,12].includes(colIdx)) {
          if (!isNaN(val)) val = (val * Math.PI) / 180;
        }

        columns[name].push(val);
      }
    }

    // Encode columnar structure with Msgpack
    const buffer = encode(columns);

    const blob = new Blob([buffer], { type: "application/msgpack" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "asteroidOrbitalData_columnar.msgpack";
    a.click();
    URL.revokeObjectURL(url);

    console.log("Columnar Msgpack file written successfully!");
  })
  .catch((err) => {
    console.error("Error reading CSV file:", err);
  });
