export function createSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-") // Replace spaces and non-word characters with dashes
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
}
