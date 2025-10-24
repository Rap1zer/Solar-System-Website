import { encode } from "@msgpack/msgpack";
const csvFilePath = "/downloadedDatasets/sbdb_query_results_new.csv";

// Read CSV file
fetch(csvFilePath)
  .then((response) => response.text())
  .then((csv) => {
    const lines = csv.split("\n");
    const result = [];
    const headers = lines[0].split(",").map((header) => header.trim().replace(/^"(.*)"$/, "$1"));

    // Parse each line after the header
    for (let row = 1; row < lines.length; row++) {
      const currentline = lines[row].split(",");

      // skip invalid or empty lines
      if (currentline.length !== headers.length) continue;

      // skip object if eccentricity > 1 (column 1)
      const e = parseFloat(currentline[1]);
      if (isNaN(e) || e > 1) continue;

      const rowArr = [];

      for (let col = 0; col < headers.length; col++) {
        let val = currentline[col];
        const isNum = /^\d+(\.\d+)?$/.test(val);
        val = isNum ? parseFloat(val) : val;

        if (col === 2 || col === 3 || col === 4 || col === 11 || col === 12) {
          val = (val * Math.PI) / 180;
        }

        rowArr.push(val);
      }

      result.push(rowArr);
    }

    const buffer = encode([headers, result]);

    const blob = new Blob([buffer], { type: "application/msgpack" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "asteroidOrbitalData.msgpack";
    a.click();
    URL.revokeObjectURL(url);

    console.log("File has been written successfully!");
  })
  .catch((err) => {
    console.error("Error reading CSV file:", err);
  });
