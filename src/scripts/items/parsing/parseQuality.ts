import { Item } from "../types/Item";
import { BinaryStream } from "../../save-file/binary";
import { ItemQuality } from "../types/ItemQuality";
import {
  MAGIC_PREFIXES,
  MAGIC_SUFFIXES,
  MISC,
  RARE_NAMES,
  RUNEWORDS,
  SET_ITEMS,
  UNIQUE_ITEMS,
} from "../../../game-data";
import { getBase } from "../getBase";

// Modifies the item in place, returns the last index read
export function parseQuality(
  { read, readBool, readInt }: BinaryStream,
  item: Item
) {
  item.id = readInt(32);
  item.level = readInt(7);
  item.quality = readInt(4);

  // Items with multiple pictures
  if (readBool()) {
    item.picture = readInt(3);
  }
  // Class-specific items
  if (readBool()) {
    item.classSpecificAffix = readInt(11);
  }

  switch (item.quality) {
    case ItemQuality.NORMAL:
      item.name = getBase(item).name;
      break;
    case ItemQuality.LOW:
      item.qualityModifier = readInt(3);
      // TODO: use the correct quality prefix
      item.name = `Low Quality ${getBase(item).name}`;
      break;
    case ItemQuality.SUPERIOR:
      item.qualityModifier = readInt(3);
      item.name = `Superior ${getBase(item).name}`;
      break;
    case ItemQuality.MAGIC:
      item.prefixes = [readInt(11)];
      item.suffixes = [readInt(11)];
      item.name = getBase(item).name;
      if (item.prefixes[0]) {
        item.name = `${MAGIC_PREFIXES[item.prefixes[0]].name} ${item.name}`;
      }
      if (item.suffixes[0]) {
        item.name = `${item.name} ${MAGIC_SUFFIXES[item.suffixes[0]].name}`;
      }
      break;
    case ItemQuality.SET:
      item.unique = readInt(12);
      item.name = SET_ITEMS[item.unique].name;
      break;
    case ItemQuality.UNIQUE:
      item.unique = readInt(12);
      item.code === "std" ? item.name = getBase(item).name : item.name = UNIQUE_ITEMS[item.unique].name;
      break;
    case ItemQuality.RARE:
    case ItemQuality.CRAFTED:
      item.name = `${RARE_NAMES[readInt(8)]} ${RARE_NAMES[readInt(8)]}`;
      // Up to 6 affixes, alternating between prefix and suffix
      item.prefixes = [];
      item.suffixes = [];
      for (let i = 0; i < 6; i++) {
        if (readBool()) {
          item[i % 2 ? "suffixes" : "prefixes"]?.push(readInt(11));
        }
      }
      break;
  }

  if (item.runeword) {
    item.runewordId = readInt(12) - 27;
    // Special case for Delirium, I can't figure out why outside of it being the only patched runeword
    if (item.runewordId === 2691) {
      item.runewordId = 21;
    }
    item.name = RUNEWORDS[item.runewordId].name;
    read(4);
  }

  if (item.personalized) {
    let charName = "";
    let charCode: number;
    while ((charCode = readInt(7)) !== 0) {
      charName += String.fromCharCode(charCode);
    }
    item.name = `${charName}'s ${item.name}`;
  }

  if (MISC[item.code]?.type === "book") {
    // Skip 5 unknown bits for tomes
    read(5);
  }

  // Skip unknown "timestamp" bit
  read(1);
}
