import { parseSimple } from "./parseSimple";
import { binaryStream } from "../../save-file/binary";
import { parseQuality } from "./parseQuality";
import { parseQuantified } from "./parseQuantified";
import { parseModifiers } from "./parseModifiers";
import { ItemParsingError } from "../../errors/ItemParsingError";
import { SaveFileReader } from "../../save-file/SaveFileReader";

export function parseItem(reader: SaveFileReader) {
  // https://squeek502.github.io/d2itemreader/formats/d2.html
  const stream = binaryStream(reader);
  reader.peek = true;
  const header = reader.readString(2);
  if (header !== "JM") {
    throw new Error(`Unexpected header ${header} for an item`);
  }
  reader.peek = false;
  const item = parseSimple(stream);

  if (!item.simple) {
    // If the id is cut short, it means it contained a "JM" which was identified as a boundary
    try {
      parseQuality(stream, item);
      parseQuantified(stream, item);
      parseModifiers(stream, item);
    } catch (e) {
      if (e instanceof ItemParsingError) {
        throw e;
      }
      throw new ItemParsingError(item, (e as Error).message);
    }
  }

  item.raw = stream.raw();
  return item;
}
