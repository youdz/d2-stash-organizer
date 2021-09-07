import { Stash } from "../types";
import { writeString } from "../../save-file/writeString";
import { writeInt32LE } from "../../save-file/writeInt32LE";
import { writeInt16LE } from "../../save-file/writeInt16LE";
import { fromBinary } from "../../save-file/binary";

export function generateSaveFile(stash: Stash) {
  const saveFile: number[] = [];
  let offset = 0;
  if (stash.personal) {
    offset = writeString(saveFile, "CSTM", offset);
    offset = writeString(saveFile, "01", offset);
    offset += 4;
  } else {
    offset = writeString(saveFile, "SSS\0", offset);
    offset = writeString(saveFile, "02", offset);
    offset = writeInt32LE(saveFile, stash.gold, offset);
  }
  offset = writeInt32LE(saveFile, stash.pages.length, offset);

  for (const page of stash.pages) {
    offset = writeString(saveFile, "ST", offset);
    if (stash.pageFlags) {
      saveFile[offset] = page.flags!;
      offset += 4;
    }
    offset = writeString(saveFile, page.name, offset);
    offset++;
    offset = writeString(saveFile, "JM", offset);
    offset = writeInt16LE(saveFile, page.items.length, offset);
    for (const item of page.items) {
      offset = saveFile.push(...fromBinary(item.raw));
      for (const socket of item.filledSockets ?? []) {
        offset = saveFile.push(...fromBinary(socket.raw));
      }
    }
  }
  return Uint8Array.from(saveFile);
}
