import { binaryStream } from "../../save-file/binary";
import { ITEM_STATS } from "../../../game-data";
import { SaveFileReader } from "../../save-file/SaveFileReader";

export function parseAttributes(reader: SaveFileReader) {
  const header = reader.readString(2, 765);
  if (header !== "gf") {
    throw new Error(`Unexpected header ${header} for an attributes list`);
  }
  // Maximum 51 bytes of attributes data
  const stream = binaryStream(reader.read(51, 767));
  let attribute: number;
  while ((attribute = stream.readInt(9)) !== 511) {
    // This is the value of the attribute, we do not need it
    stream.readInt(ITEM_STATS[attribute]?.charSize ?? 0);
  }
  // Reposition the reader where we stopped
  reader.read(0, 767 + 51 - Math.floor(stream.remainingBits() / 8));
}
