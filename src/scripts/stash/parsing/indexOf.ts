export function indexOf(buffer: Uint8Array, value: string, offset = 0) {
  if (value.length !== 2) {
    throw new Error("indexOf was writtent for exactly 2-char strings");
  }
  const first = value.charCodeAt(0);
  const second = value.charCodeAt(1);
  for (let i = offset; i < buffer.byteLength - 1; i++) {
    if (buffer[i] === first && buffer[i + 1] === second) {
      return i;
    }
  }
  return -1;
}
