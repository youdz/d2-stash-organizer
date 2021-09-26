import { Stash } from "../types";
import { fromBinary } from "../../save-file/binary";
import { SaveFileWriter } from "../../save-file/SaveFileWriter";

export function generateSaveFile(stash: Stash) {
  const writer = new SaveFileWriter();
  if (stash.personal) {
    writer.writeString("CSTM");
    writer.writeString("01");
    writer.skip(4);
  } else {
    writer.writeString("SSS\0");
    writer.writeString("02");
    writer.writeInt32LE(stash.gold);
  }
  writer.writeInt32LE(stash.pages.length);

  for (const page of stash.pages) {
    writer.writeString("ST");
    if (stash.pageFlags) {
      writer.write([page.flags!]);
      writer.skip(3);
    }
    writer.writeString(page.name);
    writer.skip(1);
    writer.writeString("JM");
    writer.writeInt16LE(page.items.length);
    for (const item of page.items) {
      writer.write(fromBinary(item.raw));
      for (const socket of item.filledSockets ?? []) {
        writer.write(fromBinary(socket.raw));
      }
    }
  }
  return writer.done();
}
