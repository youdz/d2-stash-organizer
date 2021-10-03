/* eslint-disable @typescript-eslint/no-unused-vars */
import { readFile } from "fs/promises";
import { parseCharacter } from "./character/parsing/parseCharacter";
import { saveCharacter } from "./character/saveCharacter";
import { parseStash } from "./stash/parsing/parseStash";
import { saveStash } from "./stash/saveStash";
import { toD2 } from "./items/moving/conversion";
import { LAST_LEGACY } from "./character/parsing/versions";
import { addPage } from "./stash/addPage";
import { transferItem } from "./items/moving/transferItem";
import { ItemStorageType } from "./items/types/ItemLocation";

const CHAR = "test/d2r/D2rSorc.d2s";
const STASH = "test/output.sss";
const TEST_OUTPUT = "test/saved.sss";
const DANGER_OUTPUT = STASH;

async function main() {
  // TODO:
  //  - when the item is perfect, the 'perfect' text could be in a different color
  //  -  for Eth items, it would be better to have 'Ethereal' tag at the end, so the %perfect tags are aligned nicely
  //  - when you click "next" at the end of the page, it should go to the top of the page
  const stash = parseStash(await readFile(STASH));
  // const character = parseCharacter(await readFile(CHAR));
  //
  // const stash = {
  //   filename: "output.sss",
  //   lastModified: Date.now(),
  //   version: LAST_LEGACY,
  //   personal: false,
  //   gold: 0,
  //   pageFlags: true,
  //   pages: [],
  // };
  //
  // let pageIndex = stash.pages.length;
  // addPage(stash, "Transferred");
  // for (const item of character.items) {
  //   if (!transferItem(item, stash, ItemStorageType.STASH, pageIndex)) {
  //     // We ran out of space, we insert a new page
  //     addPage(stash, "Transferred");
  //     pageIndex++;
  //     // Don't forget to re-transfer the failed item
  //     transferItem(item, stash, ItemStorageType.STASH, pageIndex);
  //   }
  // }
  // await saveStash(stash, "test/output.sss");

  // const original = await readFile(CHAR);
  // const output = await readFile("test/output.d2s");
  // original.forEach((byte, i) => {
  //   if (output[i] !== byte) {
  //     console.log("Mismatch!");
  //   }
  // });

  // triageNewItems(stash);
  // organize(stash, 1, 5);
  // await saveStash(stash, DANGER_OUTPUT);
}

void main();
