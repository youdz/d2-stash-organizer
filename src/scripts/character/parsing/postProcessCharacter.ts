import { Character } from "../types";
import { postProcessItem } from "../../items/post-processing/postProcessItem";
import { ownerName } from "../../save-file/ownership";

/**
 * Performs all operations that are not actually parsing, but that we need for our scripts and UI.
 * This includes generating human-friendly descriptions for the items,
 * making mods more searchable or sortable, etc.
 */
export function postProcessCharacter(character: Character) {
  const characterName = ownerName(character);
  for (const item of character.items) {
    item.owner = item.mercenary
      ? `${characterName}'s mercenary`
      : characterName;
    postProcessItem(item);
  }
}
