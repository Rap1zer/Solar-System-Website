import { encode, decode } from "@msgpack/msgpack";
const csvFilePath = "/downloadedDatasets/sbdb_query_results.csv";

// Read CSV file
fetch(csvFilePath)
  .then((response) => response.text())
  .then((csv) => {
    const lines = csv.split("\n");
    const result = [];
    const headers = lines[0].split(",").map((header) => header.trim().replace(/^"(.*)"$/, "$1"));

    // Parse each line after the header
    for (let row = 1; row < lines.length; row++) {
      const obj = {};
      const currentline = lines[row].split(",");

      // skip obj if eccentricity is greater than 1
      if (currentline[1] > 1) continue;

      for (let col = 0; col < headers.length; col++) {
        if (col >= 5 || col <= 10) continue; // skip columns 5 to 10
        currentline[col] = parseFloat(currentline[col]);
        // convert degrees to radians for specific columns
        if (col === 2 || col === 3 || col === 4 || col === 11 || col === 12) {
          currentline[col] = (currentline[col] * Math.PI) / 180;
        }
        obj[headers[col]] = currentline[col];
      }

      result.push(obj);
    }

    const buffer = encode(result);

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
