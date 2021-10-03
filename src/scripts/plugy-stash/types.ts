import { Item } from "../items/types/Item";
import { SaveFile } from "../save-file/types";

export const enum PageFlags {
  NONE = 0,
  SHARED = 1,
  INDEX = 2,
  MAIN_INDEX = 4,
}

export interface PlugyPage {
  flags?: number;
  name: string;
  items: Item[];
}

export interface PlugyStash extends SaveFile {
  personal: boolean;
  // Indicates if the stash was created through this tool instead of PlugY
  nonPlugY?: boolean;
  pageFlags: boolean;
  gold: number;
  pages: PlugyPage[];
}
