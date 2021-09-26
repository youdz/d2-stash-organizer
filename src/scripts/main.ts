/* eslint-disable @typescript-eslint/no-unused-vars */
import { readFile } from "fs/promises";
import { parseStash } from "./stash/parsing/parseStash";
import { parseCharacter } from "./character/parsing/parseCharacter";
import { transferItem } from "./items/moving/transferItem";
import { ItemStorageType } from "./items/types/ItemLocation";
import { SaveFileWriter } from "./save-file/SaveFileWriter";
import { saveCharacter } from "./character/saveCharacter";

const CHAR = "test/Alpha.d2s";
const STASH = "test/_LOD_SharedStashSave.sss";
const TEST_OUTPUT = "test/saved.sss";
const DANGER_OUTPUT = STASH;

async function main() {
  // TODO:
  //  - when the item is perfect, the 'perfect' text could be in a different color
  //  -  for Eth items, it would be better to have 'Ethereal' tag at the end, so the %perfect tags are aligned nicely
  //  - when you click "next" at the end of the page, it should go to the top of the page
  const buffer = await readFile(CHAR);
  const character = parseCharacter(buffer);
  await saveCharacter(character, "test/copy.d2s");

  // triageNewItems(stash);
  // organize(stash, 1, 5);
  // await saveStash(stash, DANGER_OUTPUT);
}

void main();
