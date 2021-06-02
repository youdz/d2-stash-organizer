import { Item } from "../items/types/Item";

export const enum PageFlags {
  NONE = 0,
  SHARED = 1,
  INDEX = 2,
  MAIN_INDEX = 4,
}

export interface Page {
  flags: number;
  name: string;
  items: Item[];
}

export interface Stash {
  gold: number;
  pages: Page[];
}
