import { BinaryStream } from "../../save-file/binary";

type HuffmanEncoding = string | [HuffmanEncoding, HuffmanEncoding] | [];

// Thanks to https://github.com/d07RiV/d07riv.github.io/blob/master/d2r.html#L11-L20
// prettier-ignore
const HUFFMAN: HuffmanEncoding = [[[[["w","u"],[["8",["y",["5",["j",[]]]]],"h"]],["s",[["2","n"],"x"]]],[[["c",["k","f"]],"b"],[["t","m"],["9","7"]]]],[" ",[[[["e","d"],"p"],["g",[[["z","q"],"3"],["v","6"]]]],[["r","l"],["a",[["1",["4","0"]],["i","o"]]]]]]];

const WRITE_LOOKUP = new Map<string, string>();

function populateLookups(encoding: HuffmanEncoding | undefined, path = "") {
  if (!encoding) return;
  if (Array.isArray(encoding)) {
    populateLookups(encoding[0], path + "0");
    populateLookups(encoding[1], path + "1");
  } else {
    WRITE_LOOKUP.set(encoding, path);
  }
}
populateLookups(HUFFMAN);

export function decodeHuffman(stream: BinaryStream, nbChars: number) {
  let result = "";
  for (let i = 0; i < nbChars; i++) {
    let char = HUFFMAN;
    while (Array.isArray(char)) {
      const next = Number(stream.read(1));
      char = char[next];
    }
    result += char;
  }
  return result;
}

export function encodeHuffman(value: string) {
  return value
    .split("")
    .map((char) => {
      const encoded = WRITE_LOOKUP.get(char);
      if (typeof encoded === "undefined") {
        throw new Error(`Failed to huffman encode ${value}.`);
      }
      return encoded;
    })
    .join("");
}
