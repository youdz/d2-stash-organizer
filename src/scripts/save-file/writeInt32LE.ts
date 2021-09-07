export function writeInt32LE(buffer: number[], value: number, offset: number) {
  buffer[offset] = value & 0xff;
  buffer[offset + 1] = value >>> 8;
  buffer[offset + 2] = value >>> 16;
  buffer[offset + 3] = value >>> 24;
  return offset + 4;
}
