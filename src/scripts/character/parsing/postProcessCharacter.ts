import { Character } from "../types";
import { postProcessItem } from "../../items/post-processing/postProcessItem";
import { ownerName } from "../../save-file/ownership";

/**
 * Performs all operations that are not actually parsing, but that we need for our scripts and UI.
 * This includes generating human-friendly descriptions for the items,
 * making mods more searchable or sortable, etc.
 */
export function postProcessCharacter(character: Character) {
  for (const item of character.items) {
    item.owner = character;
    // if (item.corpse) {
    //   item.owner = `${characterName}'s corpse`;
    // } else if (item.mercenary) {
    //   item.owner = `${characterName}'s mercenary`;
    // } else {
    //   item.owner = characterName;
    // }
    postProcessItem(item);
  }
}
