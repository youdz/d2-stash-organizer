import { PlugyStash } from "./types";

// Deletes a range of pages and returns all the items they contained
export function deletePages(
  stash: PlugyStash,
  from: number,
  to = stash.pages.length
) {
  const removed = stash.pages.splice(from, to - from);
  const allItems = [];
  for (const { items } of removed) {
    allItems.push(...items);
  }
  return allItems;
}
