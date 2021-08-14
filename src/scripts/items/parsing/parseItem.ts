import { ItemQuality } from "../types/ItemQuality";
import { parseSimple } from "./parseSimple";
import { binaryStream } from "./binary";
import { parseQuality } from "./parseQuality";
import { parseQuantified } from "./parseQuantified";
import { parseModifiers } from "./parseModifiers";
import { ItemParsingError } from "../../errors/ItemParsingError";

export function parseItem(raw: Uint8Array) {
  // https://squeek502.github.io/d2itemreader/formats/d2.html
  const stream = binaryStream(raw);
  const item = parseSimple(stream);

  if (!item.simple) {
    // If the id is cut short, it means it contained a "JM" which was identified as a boundary
    if (stream.remainingBits() < 32) {
      return false;
    }
    try {
      parseQuality(stream, item);
      parseQuantified(stream, item);

      if (item.quality! > ItemQuality.NORMAL || item.runeword) {
        parseModifiers(stream, item);
      }
    } catch (e) {
      if (e instanceof ItemParsingError) {
        throw e;
      }
      throw new ItemParsingError(item, (e as Error).message);
    }
  }
  return item;
}
