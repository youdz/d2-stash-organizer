/* eslint-disable @typescript-eslint/no-unused-vars */
import { readFile } from "fs/promises";
import { parseSharedStash } from "./stash/parsing/parseSharedStash";
import { printGrailProgress } from "./grail/list/grailProgress";

const INPUT = "test/stash.sss";
const TEST_OUTPUT = "test/saved.sss";
const DANGER_OUTPUT = INPUT;

async function parseStash() {
  const buffer = await readFile(INPUT);
  const stash = parseSharedStash(buffer);
  console.log(printGrailProgress(stash));
}

void parseStash();
