import { EndOfStreamError } from "../errors/EndOfStreamError";

export interface BinaryStream {
  readonly raw: string;
  // If position is not specified, calls to these read the stream in sequence
  read(size: number, position?: number): string;
  readInt(size: number, position?: number): number;
  readBool(position?: number): boolean;
  remainingBits(): number;
}

export function binaryStream(buffer: Uint8Array): BinaryStream {
  const binary = toBinary(buffer);
  let nextIndex = 0;
  const stream = {
    raw: binary,
    read(length: number, position = nextIndex) {
      if (position + length > binary.length) {
        throw new EndOfStreamError();
      }
      nextIndex = position + length;
      return binary.slice(position, position + length);
    },
    readInt(size: number, position = nextIndex) {
      return toInt(stream.read(size, position));
    },
    readBool(position = nextIndex) {
      return stream.read(1, position) === "1";
    },
    remainingBits() {
      return binary.length - nextIndex;
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

function toBinary(buffer: Uint8Array) {
  return buffer.reduce((binary, byte) => binary + fromInt(byte, 8), "");
}

export function fromBinary(binary: string) {
  const bytes = [];
  for (let i = 0; i < binary.length / 8; i++) {
    bytes.push(toInt(binary.slice(8 * i, 8 * (i + 1))));
  }
  return bytes;
}
