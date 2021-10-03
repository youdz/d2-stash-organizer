import { Item } from "../items/types/Item";
import { SaveFile } from "../save-file/types";

export interface D2rPage {
  gold: number;
  items: Item[];
}

export interface D2rStash extends SaveFile {
  pages: D2rPage[];
}
