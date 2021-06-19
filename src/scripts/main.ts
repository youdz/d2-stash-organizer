/* eslint-disable @typescript-eslint/no-unused-vars */
import { readFile } from "fs/promises";
import { parseStash } from "./stash/parsing/parseStash";
import { organize } from "./grail/organize";
import { saveStash } from "./stash/saveStash";
import { getAllItems } from "./stash/getAllItems";
import { UNIQUE_ITEMS } from "../game-data";
import { printGrailProgress } from "./grail/list/grailProgress";
import { listGrailUniques } from "./grail/list/listGrailUniques";
import { UNIQUES_ORDER } from "./grail/list/uniquesOrder";

const INPUT = "test/not-working.sss";
const TEST_OUTPUT = "test/saved.sss";
const DANGER_OUTPUT = INPUT;

async function main() {
  // TODO: bulk transfer from personal to shared
  // TODO: - when the item is perfect, the 'perfect' text could be in a different color
  //  -  for Eth items, it would be better to have 'Ethereal' tag at the end, so the %perfect tags are aligned nicely
  //  - when you click "next" at the end of the page, it should go to the top of the page
  // TODO: ignore item_extrablood mod (like Gorefoot)
  const buffer = await readFile(INPUT);
  const stash = parseStash(buffer);
  // organize(stash);
  // await saveStash(stash, TEST_OUTPUT);
}

void main();
