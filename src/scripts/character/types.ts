import { Item } from "../items/types/Item";
import { SaveFile } from "../save-file/types";

export interface Character extends SaveFile {
  name: string;
  class: number;
  hasCorpse: boolean;
  hasMercenary: boolean;
  characterData: Uint8Array;
  golem: Uint8Array;
  items: Item[];
}
