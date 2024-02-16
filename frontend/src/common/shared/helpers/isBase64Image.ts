export function isBase64Image(input: any): boolean {
  const base64Regex = /^data:image\/[a-z]+;base64,/;
  return base64Regex.test(input);
}
