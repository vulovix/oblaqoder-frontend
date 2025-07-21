export async function convertToBase64(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch resource. Status: ${response.status}`);
  }

  const blob = await response.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert to base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob); // This encodes the blob as base64 + includes MIME type
  });
}
