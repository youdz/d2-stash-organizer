import { parsePage } from "./parsePage";
import { Stash } from "../types";
import { readInt32LE } from "./readInt32LE";
import { indexOf } from "./indexOf";

// Can't use Node's Buffer because this needs to run in the browser
export function parseSharedStash(raw: Uint8Array) {
  if (String.fromCharCode(...raw.slice(0, 3)) !== "SSS") {
    throw new Error("This tool can only parse shared stash files.");
  }
  if (String.fromCharCode(...raw.slice(4, 6)) !== "02") {
    throw new Error("Your version of PlugY is way too old.");
  }
  const stash: Stash = {
    gold: readInt32LE(raw, 6),
    // Number of pages: readInt32LE(raw, 10),
    pages: [],
  };
  let currentPage = 14;
  while (currentPage >= 0) {
    const nextPage = indexOf(raw, "ST", currentPage + 2);
    stash.pages.push(
      parsePage(raw.slice(currentPage, nextPage >= 0 ? nextPage : undefined))
    );
    currentPage = nextPage;
  }
  return stash;
}
