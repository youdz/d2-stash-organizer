import { getBase } from "../../scripts/items/getBase";
import { Item } from "../../scripts/items/types/Item";

export function searchItems(items: Item[], search: string, ignore?: string) {
  const lcFilters = search
    .toLocaleLowerCase()
    .split(/"([^"]*)"|\s+/)
    .filter(Boolean);

  return items.filter((item) => {
    const base = getBase(item);
    return lcFilters.every(
      (filter) =>
        ignore?.toLocaleLowerCase().includes(filter) ||
        item.name?.toLocaleLowerCase().includes(filter) ||
        base.name.toLocaleLowerCase().includes(filter) ||
        item.search.includes(filter)
    );
  });
}
