import { parsePage } from "./parsePage";
import { Stash } from "../types";
import { readInt32LE } from "./readInt32LE";
import { indexOf } from "./indexOf";

// Can't use Node's Buffer because this needs to run in the browser
export function parseSharedStash(raw: Uint8Array) {
  if (String.fromCharCode(...raw.slice(0, 3)) !== "SSS") {
    throw new Error("This tool can only parse shared stash files.");
  }
  const version = String.fromCharCode(...raw.slice(4, 6));
  let currentPage = 10;
  const stash: Stash = {
    pageFlags: true,
    gold: 0,
    pages: [],
  };
  // logic for no shared stash gold vs shared stash gold
  if (version === "02") {
    stash.gold = readInt32LE(raw, 6);
    currentPage = currentPage + 4;
  } else if (version !== "01") {
    throw new Error("Your version of PlugY is too old.");
  }
  while (currentPage >= 0) {
    const nextPage = indexOf(raw, "ST", currentPage + 2);
    stash.pages.push(
      parsePage(raw.slice(currentPage, nextPage >= 0 ? nextPage : undefined))
    );
    currentPage = nextPage;
  }
  stash.pageFlags = typeof stash.pages[0]?.flags !== "undefined";
  return stash;
}
