import { decode } from "@msgpack/msgpack";

async function loadMsgpack(url) {
  try {
    // Fetch the encoded data file
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch encoded data");
    }

    const buffer = await response.arrayBuffer();

    const decodedData = decode(new Uint8Array(buffer));
    console.log(decodedData);

    return decodedData; // Return decoded data if needed
  } catch (error) {
    console.error("Error fetching or decoding encoded data:", error);
    throw error; // Re-throw the error or handle as needed
  }
}

export default loadMsgpack;
