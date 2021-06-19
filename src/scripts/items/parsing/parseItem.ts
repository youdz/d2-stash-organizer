import { ItemQuality } from "../types/ItemQuality";
import { parseSimple } from "./parseSimple";
import { binaryStream } from "./binary";
import { parseQuality } from "./parseQuality";
import { parseQuantified } from "./parseQuantified";
import { parseModifiers } from "./parseModifiers";
import { perfectionScore } from "../comparison/perfectionScore";
import { ItemParsingError } from "../../errors/ItemParsingError";

export function parseItem(raw: Uint8Array) {
  // https://squeek502.github.io/d2itemreader/formats/d2.html
  const stream = binaryStream(raw);
  const item = parseSimple(stream);

  if (!item.simple) {
    try {
      parseQuality(stream, item);
      parseQuantified(stream, item);

      if (item.quality! > ItemQuality.NORMAL || item.runeword) {
        parseModifiers(stream, item);
      }

      if (
        item.runeword ||
        item.quality === ItemQuality.UNIQUE ||
        item.quality === ItemQuality.SET
      ) {
        item.perfectionScore = perfectionScore(item);
      }
    } catch (e) {
      if (e instanceof ItemParsingError) {
        throw e;
      }
      throw new ItemParsingError(item);
    }
  }
  return item;
}
