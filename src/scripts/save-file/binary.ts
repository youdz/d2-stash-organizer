import { SaveFileReader } from "./SaveFileReader";

export interface BinaryStream {
  // If position is not specified, calls to these read the stream in sequence
  skip(size: number): false;
  read(size: number, position?: number): string;
  readInt(size: number, position?: number): number;
  readBool(position?: number): boolean;
  done(): string;
}

export function binaryStream(reader: SaveFileReader) {
  // Trying not to convert the entire stash for every item, that would be too heavy
  let binary = "";

  let nextIndex = 0;
  const stream: BinaryStream = {
    skip(length: number) {
      nextIndex = nextIndex + length;
      return false;
    },
    read(length: number, position = nextIndex) {
      const missingBits = position + length - binary.length;
      if (missingBits > 0) {
        binary += toBinary(reader.read(Math.ceil(missingBits / 8)));
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

    done() {
      return binary.slice(0, nextIndex);
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

export function fromString(s: string) {
  return s
    .split("")
    .map((char) => fromInt(char.charCodeAt(0), 8))
    .join("");
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
