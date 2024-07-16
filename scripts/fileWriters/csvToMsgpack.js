import { encode } from "@msgpack/msgpack";
const csvFilePath = "/downloadedDatasets/sbdb_query_results.csv";

// Read CSV file
fetch(csvFilePath)
  .then((response) => response.text())
  .then((csv) => {
    const lines = csv.split("\n");
    const result = [];
    const headers = lines[0].split(",").map((header) => header.trim().replace(/^"(.*)"$/, "$1"));

    // Parse each line after the header
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(",");

      for (let j = 0; j < headers.length; j++) {
        // convert degrees to radians for specific columns
        if (j === 2 || j === 3 || j === 4 || j === 11 || j === 12) {
          currentline[j] = (parseFloat(currentline[j]) * Math.PI) / 180;
        }
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    const buffer = encode(result);

    const blob = new Blob([buffer], { type: "application/msgpack" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "asteroidData.msgpack";
    a.click();
    URL.revokeObjectURL(url);

    console.log("File has been written successfully!");
  })
  .catch((err) => {
    console.error("Error reading CSV file:", err);
  });
