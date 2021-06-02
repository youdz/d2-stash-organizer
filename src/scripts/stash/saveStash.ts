import { open } from "fs/promises";
import { Stash } from "./types";
import { fromBinary } from "../items/parsing/binary";

export async function saveStash(stash: Stash, path: string) {
  const fileHandle = await open(path, "w");
  const stashHeader = Buffer.alloc(14);
  stashHeader.write("SSS\0");
  // File version
  stashHeader.write("02", 4);
  stashHeader.writeInt32LE(stash.gold, 6);
  stashHeader.writeInt32LE(stash.pages.length, 10);
  await fileHandle.appendFile(stashHeader);

  for (const page of stash.pages) {
    const nameLength = Buffer.byteLength(page.name);
    const pageHeader = Buffer.alloc(11 + nameLength);
    pageHeader.write("ST");
    pageHeader.writeInt8(page.flags, 2);
    pageHeader.write(page.name, 6);
    pageHeader.write("JM", 7 + nameLength);
    pageHeader.writeInt16LE(page.items.length, 9 + nameLength);
    await fileHandle.appendFile(pageHeader);
    for (const item of page.items) {
      await fileHandle.appendFile(fromBinary(item.raw));
      for (const socket of item.filledSockets ?? []) {
        await fileHandle.appendFile(fromBinary(socket.raw));
      }
    }
  }

  await fileHandle.close();
}
