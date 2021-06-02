import { Item } from "../../items/types/Item";

export function sortAndGroupBy(
  items: Item[],
  prop: (item: Item) => number,
  desc = false
) {
  return items
    .sort((a: Item, b: Item) => (desc ? -1 : 1) * (prop(a) - prop(b)))
    .reduce<Item[][]>((groups, item) => {
      let lastGroup = groups[groups.length - 1];
      if (!lastGroup || prop(lastGroup[0]) !== prop(item)) {
        lastGroup = [];
        groups.push(lastGroup);
      }
      lastGroup.push(item);
      return groups;
    }, []);
}
