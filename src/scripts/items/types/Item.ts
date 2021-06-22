import { ItemQuality } from "./ItemQuality";
import { ItemLocation } from "./ItemLocation";
import { Modifier } from "./Modifier";

export interface Item {
  raw: string;

  identified: boolean;
  socketed: boolean;
  simple: boolean;
  ethereal: boolean;
  personalized: boolean;
  runeword: boolean;

  location: ItemLocation;
  stored: number;

  column: number;
  row: number;

  code: string;

  sockets?: number;
  filledSockets?: Item[];

  id?: number;
  level?: number;
  quality?: ItemQuality;

  picture?: number;
  classSpecificAffix?: number;
  qualityModifier?: number;

  unique?: number;
  runewordId?: number;
  perfectionScore?: number;

  prefixes?: number[];
  suffixes?: number[];

  name?: string;

  defense?: number;
  durability?: [current: number, max: number];
  quantity?: number;

  modifiers?: Modifier[];

  // Pretty description of the item. Right now it'll be only mods,
  // but we can add things like item level, level req or base item
  // TODO: ethereal, defense, number of sockets, durability
  // TODO: test groups + base + sockets with Moser's.
  // TODO: (low priority) order of charges on Todesfaelle Flamme is wrong
  description?: string[];
}
