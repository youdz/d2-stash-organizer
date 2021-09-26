import { Item } from "../items/types/Item";
import { SaveFile } from "../save-file/types";

export interface Character extends SaveFile {
  version: number;
  name: string;
  class: number;
  characterData: Uint8Array;
  golem: Uint8Array;
  items: Item[];
}
