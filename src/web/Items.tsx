import { Item } from "../scripts/items/types/Item";
import { colorClass } from "./utils/colorClass";

export interface ItemListProps {
  items: Item[];
}

export function Items({ items }: ItemListProps) {
  return (
    <>
      {items.map((item) => (
        <div class={`item ${colorClass(item)}`}>{item.name}</div>
      ))}
    </>
  );
}
