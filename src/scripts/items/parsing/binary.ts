export interface BinaryStream {
  readonly raw: string;
  // If position is not specified, calls to these read the stream in sequence
  read(size: number, position?: number): string;
  readInt(size: number, position?: number): number;
  readBool(position?: number): boolean;
}

export function binaryStream(buffer: Buffer): BinaryStream {
  const binary = toBinary(buffer);
  let nextIndex = 0;
  const stream = {
    raw: binary,
    read(length: number, position = nextIndex) {
      const slice = binary.slice(position, position + length);
      nextIndex = position + length;
      return slice;
    },
    readInt(size: number, position = nextIndex) {
      return toInt(stream.read(size, position));
    },
    readBool(position = nextIndex) {
      return stream.read(1, position) === "1";
    },
  };
  return stream;
}

function toInt(binary: string) {
  return parseInt(binary.split("").reverse().join(""), 2);
}

export function fromInt(n: number, size: number) {
  return n.toString(2).padStart(size, "0").split("").reverse().join("");
}

function toBinary(buffer: Buffer) {
  return buffer.reduce((binary, byte) => binary + fromInt(byte, 8), "");
}

export function fromBinary(binary: string) {
  const bytes = [];
  for (let i = 0; i < binary.length / 8; i++) {
    bytes.push(toInt(binary.slice(8 * i, 8 * (i + 1))));
  }
  return Buffer.from(bytes);
}
