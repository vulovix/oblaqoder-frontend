export function proxyURL(url: string): string {
  url = url.replace("/catapi", "https://api.thecatapi.com");
  //
  return url;
}
