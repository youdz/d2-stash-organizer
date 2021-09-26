import { SaveFileWriter } from "../../save-file/SaveFileWriter";
import { Item } from "../types/Item";
import { fromBinary } from "../../save-file/binary";

export function writeItemList(writer: SaveFileWriter, items: Item[]) {
  writer.writeString("JM");
  writer.writeInt16LE(items.length);
  for (const item of items) {
    writer.write(fromBinary(item.raw));
    for (const socket of item.filledSockets ?? []) {
      writer.write(fromBinary(socket.raw));
    }
  }
}
