import { Stash } from "./types";

// from inclusive, to exclusive
export function getAllItems(stash: Stash, from = 0, to = stash.pages.length) {
  const all = [];
  for (const { items } of stash.pages.slice(from, to)) {
    all.push(...items);
  }
  return all;
}
