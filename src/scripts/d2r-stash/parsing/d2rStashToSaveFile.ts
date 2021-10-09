import { SaveFileWriter } from "../../save-file/SaveFileWriter";
import { writeItemList } from "../../items/parsing/writeItemList";
import { D2rStash } from "../types";

export function d2rStashToSaveFile(stash: D2rStash) {
  const writer = new SaveFileWriter();
  for (const page of stash.pages) {
    const pageStart = writer.nextIndex;
    writer.writeInt32LE(parseInt("aa55aa55", 16));
    writer.skip(4);
    writer.writeInt32LE(stash.version);
    writer.writeInt32LE(page.gold);
    const lengthPosition = writer.nextIndex;
    writer.skip(48);
    writeItemList(writer, page.items);
    // Retroactively add the length
    const pageEnd = writer.nextIndex;
    writer.writeInt32LE(pageEnd - pageStart, lengthPosition);
    // Reposition at the end
    writer.write([], pageEnd);
  }
  return writer.done();
}
