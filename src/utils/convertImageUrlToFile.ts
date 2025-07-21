export async function convertImageUrlToFile(url: string, filename?: string): Promise<File> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file. Status: ${response.status}`);
  }
  const blob = await response.blob();
  const name = filename || url.split("/").pop()?.split("?").shift() || "file";
  return new File([blob], name, { type: blob.type || "application/octet-stream" });
}
