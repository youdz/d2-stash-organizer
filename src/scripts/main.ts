/* eslint-disable @typescript-eslint/no-unused-vars */
import { readFile } from "fs/promises";
import { parseCharacter } from "./character/parsing/parseCharacter";
import { saveCharacter } from "./character/saveCharacter";

const CHAR = "test/output.d2s";
const STASH = "test/_LOD_SharedStashSave.sss";
const TEST_OUTPUT = "test/saved.sss";
const DANGER_OUTPUT = STASH;

async function main() {
  // TODO:
  //  - when the item is perfect, the 'perfect' text could be in a different color
  //  -  for Eth items, it would be better to have 'Ethereal' tag at the end, so the %perfect tags are aligned nicely
  //  - when you click "next" at the end of the page, it should go to the top of the page
  const character = parseCharacter(await readFile(CHAR));
  // const stash = parseStash(await readFile(STASH));
  // for (const item of stash.pages[0].items) {
  //   if (!transferItem(item, stash, ItemStorageType.CUBE)) {
  //     break;
  //   }
  //   console.log(`${item.name} at ${item.column}, ${item.row}`);
  // }
  // console.log("CHARACTER");
  // console.log(
  //   character.items
  //     .filter(({ stored, corpse }) => corpse)
  //     .map(({ name }) => name)
  // );
  // console.log("STASH");
  // console.log(stash.pages[0].items.map(({ name }) => name));
  // await saveCharacter(character, "test/output.d2s");
  // await saveStash(stash, STASH);

  // triageNewItems(stash);
  // organize(stash, 1, 5);
  // await saveStash(stash, DANGER_OUTPUT);
}

void main();
