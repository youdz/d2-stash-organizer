export function indexOf(
  buffer: Uint8Array,
  possibleValues: string[],
  offset = 0
) {
  const charStops: [number, number][] = [];
  for (const value of possibleValues) {
    if (value.length !== 2) {
      throw new Error("indexOf was written for exactly 2-char strings");
    }
    charStops.push([value.charCodeAt(0), value.charCodeAt(1)]);
  }

  for (let i = offset; i < buffer.byteLength - 1; i++) {
    for (const [first, second] of charStops) {
      if (buffer[i] === first && buffer[i + 1] === second) {
        return i;
      }
    }
  }
  return -1;
}
