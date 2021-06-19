import { Item } from "../items/types/Item";
import { getBase } from "../items/getBase";

export class ItemParsingError extends Error {
  constructor(item: Item, message?: string) {
    let itemDescription = item.name;
    if (!itemDescription) {
      try {
        itemDescription = getBase(item).name;
      } catch (e) {
        itemDescription = `item with code ${item.code}`;
      }
    }
    itemDescription += ` at row ${item.row}, column ${item.column}`;

    let fullMessage = `Failed to parse ${itemDescription}`;
    if (message) {
      fullMessage += `: ${message}`;
    }

    super(fullMessage);
    this.name = "ItemParsingError";
  }
}
