import { Item } from "../items/types/Item";
import { SaveFile } from "../save-file/types";

export interface Character extends SaveFile {
  name: string;
  class: number;
  items: Item[];
}
