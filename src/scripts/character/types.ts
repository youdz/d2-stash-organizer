import { Item } from "../items/types/Item";

export interface Character {
  filename: string;
  lastModified: number;
  name: string;
  class: number;
  items: Item[];
}
