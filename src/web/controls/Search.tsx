import { RenderableProps } from "preact";
import { Item } from "../../scripts/items/types/Item";
import { getBase } from "../../scripts/items/getBase";

export interface SearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function Search({
  value,
  onChange,
  children,
}: RenderableProps<SearchProps>) {
  return (
    <div id="search">
      <p>
        <label for="search-input">{children}</label>
      </p>
      <p>
        <input
          id="search-input"
          type="search"
          value={value}
          onInput={({ currentTarget }) => onChange(currentTarget.value)}
        />
      </p>
    </div>
  );
}

export function searchItems(items: Item[], search: string, ignore?: string) {
  if (!search) {
    return items;
  }

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
