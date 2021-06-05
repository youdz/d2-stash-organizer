/* eslint-disable @typescript-eslint/no-unused-vars */
import { readFile } from "fs/promises";
import { parseSharedStash } from "./stash/parsing/parseSharedStash";
import { organize } from "./grail/organize";
import { saveStash } from "./stash/saveStash";
import { getAllItems } from "./stash/getAllItems";

const INPUT = "test/stash.sss";
const TEST_OUTPUT = "test/saved.sss";
const DANGER_OUTPUT = INPUT;

async function parseStash() {
  // MrLlama uses 1.13 + PlugY 10.00
  const buffer = await readFile(INPUT);
  const stash = parseSharedStash(buffer);
  console.log(getAllItems(stash));
  // organize(stash);
  // await saveStash(stash, TEST_OUTPUT);
}

void parseStash();
