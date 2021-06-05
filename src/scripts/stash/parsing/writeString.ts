export function writeString(buffer: number[], value: string, offset: number) {
  for (let i = 0; i < value.length; i++) {
    buffer[offset + i] = value.charCodeAt(i);
  }
  return offset + value.length;
}
