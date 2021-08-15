import { Stash } from "./types";

// from inclusive, to exclusive
export function getAllItems(
  stash: Stash,
  includeSockets = false,
  from = 0,
  to = stash.pages.length
) {
  const all = [];
  for (const { items } of stash.pages.slice(from, to)) {
    all.push(...items);
    if (includeSockets) {
      for (const item of items) {
        if (item.filledSockets) {
          all.push(...item.filledSockets);
        }
      }
    }
  }
  return all;
}
