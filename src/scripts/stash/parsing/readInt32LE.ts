export function readInt32LE(buffer: Uint8Array, offset: number) {
  offset = offset >>> 0;

  return (
    buffer[offset] |
    (buffer[offset + 1] << 8) |
    (buffer[offset + 2] << 16) |
    (buffer[offset + 3] << 24)
  );
}
