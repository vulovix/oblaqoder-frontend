export async function convertToBase64(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image. Status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const mimeType = response.headers.get("content-type");
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error("Error converting image to Base64:", error);
    throw error;
  }
}
