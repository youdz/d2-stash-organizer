import { Item } from "../types/Item";
import { FIRST_D2R, LAST_LEGACY } from "../../character/parsing/versions";
import { encodeHuffman } from "../parsing/huffman";
import { fromInt, fromString } from "../../save-file/binary";

// 16 less bits for the JM header, 7 less for the item version
export const D2R_OFFSET = -23;

// Indices in the raw string
const D2_ITEM_VERSION_START = 48;
const D2_ITEM_VERSION_END = D2_ITEM_VERSION_START + 10;
const D2R_ITEM_VERSION_START = D2_ITEM_VERSION_START - 16;
const D2R_ITEM_VERSION_END = D2R_ITEM_VERSION_START + 3;

const D2_ITEM_CODE_START = 76;
const D2_ITEM_CODE_END = D2_ITEM_CODE_START + 32;
const D2R_ITEM_CODE_START = D2_ITEM_CODE_START + D2R_OFFSET;
// D2R item code end is dynamic :(

const JM_HEADER = fromString("JM");

export function toD2R(item: Item) {
  if (item.owner.version >= FIRST_D2R) {
    // Item should already be in D2R format.
    return;
  }
  item.raw =
    // Remove the JM header
    item.raw.slice(16, D2_ITEM_VERSION_START) +
    // Replace the version
    item.version +
    item.raw.slice(D2_ITEM_VERSION_END, D2_ITEM_CODE_START) +
    // Replace the code
    encodeHuffman(item.code.padEnd(4, " ")) +
    item.raw.slice(D2_ITEM_CODE_END);

  // Converting items in sockets too
  if (item.filledSockets) {
    for (const socket of item.filledSockets) {
      toD2R(socket);
    }
  }
}

export function toD2(item: Item) {
  if (item.owner.version <= LAST_LEGACY) {
    // Item should already be in legacy format.
    return;
  }
  const codeLength = encodeHuffman(item.code.padEnd(4, " ")).length;
  item.raw =
    // Add the JM header
    JM_HEADER +
    item.raw.slice(0, D2R_ITEM_VERSION_START) +
    // Replace the version
    fromInt(Number(item.version), 10) +
    item.raw.slice(D2R_ITEM_VERSION_END, D2R_ITEM_CODE_START) +
    // Replace the code
    fromString(item.code.padEnd(4, " ")) +
    item.raw.slice(D2R_ITEM_CODE_START + codeLength);

  // Converting items in sockets too
  if (item.filledSockets) {
    for (const socket of item.filledSockets) {
      toD2(socket);
    }
  }
}
