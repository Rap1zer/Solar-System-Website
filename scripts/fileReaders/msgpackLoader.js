import { decode } from "@msgpack/msgpack";

async function loadMsgpack(url) {
  try {
    // Fetch the encoded data file
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch encoded data");
    }

    const buffer = await response.arrayBuffer();

    const decodedData = decode(buffer);

    return decodedData;
  } catch (error) {
    console.error("Error fetching or decoding encoded data:", error);
    throw error;
  }
}

export default loadMsgpack;
