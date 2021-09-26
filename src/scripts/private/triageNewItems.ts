import { Stash } from "../stash/types";
import { getAllItems } from "../stash/getAllItems";
import { compare } from "../items/comparison/compare";
import { ItemQuality } from "../items/types/ItemQuality";

const FIRST_PAGE = 1;
const LAST_PAGE = 6;

export function triageNewItems(stash: Stash) {
  const toTriage = stash.pages
    .slice(FIRST_PAGE, LAST_PAGE + 1)
    .flatMap(({ items }) => items);
  const previouslyFound = getAllItems(stash, LAST_PAGE + 1);
  const worse = new Set<string>();
  const better = new Set<string>();
  const review = new Map<string, ReturnType<typeof compare>[]>();
  for (const item of toTriage) {
    if (item.quality !== ItemQuality.UNIQUE && item.quality !== ItemQuality.SET)
      continue;
    const name = item.name!;
    const duplicates = previouslyFound.filter(
      ({ quality, unique }) =>
        item.quality === quality && item.unique === unique
    );
    if (duplicates.length === 0) {
      better.add(name);
      continue;
    }
    for (const duplicate of duplicates) {
      const diff = compare(item, duplicate);
      if (diff.every(({ value }) => value <= 0)) {
        // If we have a strictly better item, we can just ignore the rest (eth or non eth version, for instance)
        worse.add(name);
        better.delete(name);
        review.delete(name);
        break;
      } else if (diff.every(({ value }) => value > 0)) {
        better.add(name);
      } else {
        let diffs = review.get(name);
        if (!diffs) {
          diffs = [];
          review.set(name, diffs);
        }
        diffs.push(diff);
      }
    }
  }
  console.log(`\x1b[32mKeep:\n${new Array(...better).join("\n")}\n\x1b[39m`);
  console.log(`\x1b[31mSell:\n${new Array(...worse).join("\n")}\n\x1b[39m`);
  console.log(`\x1b[33mReview:\x1b[39m`);
  for (const [name, diff] of review.entries()) {
    console.log(name, diff);
  }
}
