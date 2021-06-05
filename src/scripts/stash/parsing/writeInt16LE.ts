export function writeInt16LE(buffer: number[], value: number, offset: number) {
  value = +value;
  offset = offset >>> 0;
  buffer[offset] = value & 0xff;
  buffer[offset + 1] = value >>> 8;
  return offset + 2;
}
