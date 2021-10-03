import { Item } from "../../scripts/items/types/Item";
import { isPlugyStash, ItemsOwner } from "../../scripts/save-file/ownership";
import { PlugyStash } from "../../scripts/plugy-stash/types";
import { Character } from "../../scripts/character/types";
import { ItemStorageType } from "../../scripts/items/types/ItemLocation";

function stringifyPage(items: Item[]) {
  let result = "";
  for (const item of items) {
    result += item.raw;
    for (const socket of item.filledSockets ?? []) {
      result += socket.raw;
    }
  }
  return result;
}

export function findDuplicates(owners: ItemsOwner[]) {
  const byString = new Map<string, [PlugyStash, number]>();
  for (const owner of owners) {
    if (isPlugyStash(owner)) {
      owner.pages.forEach((page, i) => {
        byString.set(stringifyPage(page.items), [owner, i]);
      });
    }
  }

  const duplicates = new Map<Character, [PlugyStash, number]>();
  for (const owner of owners) {
    if (!isPlugyStash(owner)) {
      const duplicate = byString.get(
        stringifyPage(
          owner.items.filter(({ stored }) => stored === ItemStorageType.STASH)
        )
      );
      if (duplicate) {
        duplicates.set(owner, duplicate);
      }
    }
    return duplicates;
  }
}

export function updateCharacterStashes(
  duplicates: Map<Character, [PlugyStash, number]>
) {
  for (const [character, [stash, pageIndex]] of duplicates.entries()) {
    character.items = character.items.filter(
      ({ stored }) => stored !== ItemStorageType.STASH
    );
    character.items.push(...(stash.pages[pageIndex]?.items ?? []));
  }
}
