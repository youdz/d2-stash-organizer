/* eslint-disable @typescript-eslint/no-unused-vars */
import { readFile } from "fs/promises";
import { parseCharacter } from "./character/parsing/parseCharacter";
import { saveCharacter } from "./character/saveCharacter";
import { parsePlugyStash } from "./plugy-stash/parsing/parsePlugyStash";
import { savePlugyStash } from "./plugy-stash/savePlugyStash";
import { toD2 } from "./items/moving/conversion";
import { LAST_LEGACY } from "./character/parsing/versions";
import { addPage } from "./plugy-stash/addPage";
import { transferItem } from "./items/moving/transferItem";
import { ItemStorageType } from "./items/types/ItemLocation";
import { parseD2rStash } from "./d2r-stash/parsing/parseD2rStash";
import { saveD2rStash } from "./d2r-stash/saveD2rStash";

const CHAR = "test/d2r/D2rSorc.d2s";
const STASH = "test/d2r/SharedStashSoftCoreV2_pot_page1_2x2.d2i";
const TEST_OUTPUT = "test/saved.sss";
const DANGER_OUTPUT = STASH;

async function main() {
  // TODO:
  //  - when the item is perfect, the 'perfect' text could be in a different color
  //  -  for Eth items, it would be better to have 'Ethereal' tag at the end, so the %perfect tags are aligned nicely
  //  - when you click "next" at the end of the page, it should go to the top of the page
  // const stash = parseD2rStash(await readFile(STASH));
  // console.log(stash);

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
  // await saveD2rStash(stash, "test/output.d2i");

  const original = await readFile(STASH);
  const output = await readFile("test/output.d2i");
  original.forEach((byte, i) => {
    if (output[i] !== byte) {
      console.log("Mismatch!");
    }
  });

  // triageNewItems(stash);
  // organize(stash, 1, 5);
  // await saveStash(stash, DANGER_OUTPUT);
}

void main();
