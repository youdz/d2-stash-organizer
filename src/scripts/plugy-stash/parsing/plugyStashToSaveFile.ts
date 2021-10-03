import { PlugyStash } from "../types";
import { SaveFileWriter } from "../../save-file/SaveFileWriter";
import { writeItemList } from "../../items/parsing/writeItemList";

export function plugyStashToSaveFile(stash: PlugyStash) {
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
    writeItemList(writer, page.items);
  }
  return writer.done();
}
