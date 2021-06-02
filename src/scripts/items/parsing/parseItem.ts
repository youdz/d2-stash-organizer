import { ItemQuality } from "../types/ItemQuality";
import { parseSimple } from "./parseSimple";
import { binaryStream } from "./binary";
import { parseQuality } from "./parseQuality";
import { parseQuantified } from "./parseQuantified";
import { parseModifiers } from "./parseModifiers";

export function parseItem(raw: Buffer) {
  // https://squeek502.github.io/d2itemreader/formats/d2.html
  const stream = binaryStream(raw);
  const item = parseSimple(stream);

  if (!item.simple) {
    parseQuality(stream, item);
    parseQuantified(stream, item);

    if (item.quality! > ItemQuality.NORMAL || item.runeword) {
      parseModifiers(stream, item);
    }
  }
  return item;
}
