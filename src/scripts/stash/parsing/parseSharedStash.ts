import { strict as assert } from "assert";
import { parsePage } from "./parsePage";
import { Stash } from "../types";

export function parseSharedStash(raw: Buffer) {
  assert.equal(raw.toString("utf-8", 0, 3), "SSS");
  // File version
  assert.equal(raw.toString("utf-8", 4, 6), "02");
  const stash: Stash = {
    gold: raw.readInt32LE(6),
    // Number of pages: raw.readInt32LE(10),
    pages: [],
  };
  let currentPage = raw.indexOf("ST", 14);
  while (currentPage >= 0) {
    const nextPage = raw.indexOf("ST", currentPage + 2);
    stash.pages.push(
      parsePage(raw.slice(currentPage, nextPage >= 0 ? nextPage : undefined))
    );
    currentPage = nextPage;
  }
  return stash;
}
