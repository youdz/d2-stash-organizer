/* eslint-disable @typescript-eslint/no-unused-vars */
import { readFile } from "fs/promises";
import { parseSharedStash } from "./stash/parsing/parseSharedStash";
import { saveStash } from "./stash/saveStash";
import { organize } from "./grail/organize";

const INPUT = "test/stash.sss";
const TEST_OUTPUT = "test/saved.sss";
const DANGER_OUTPUT = INPUT;

async function parseStash() {
  const buffer = await readFile(INPUT);
  const stash = parseSharedStash(buffer);
  organize(stash, 1, 4);
  await saveStash(stash, DANGER_OUTPUT);
}

void parseStash();
