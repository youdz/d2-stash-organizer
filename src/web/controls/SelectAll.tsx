import { Item } from "../../scripts/items/types/Item";
import { useContext, useMemo } from "preact/hooks";
import { SelectionContext } from "../transfer/SelectionContext";

export interface SelectAllProps {
  items: Item[];
}

export function SelectAll({ items }: SelectAllProps) {
  const { selectedItems, selectAll, unselectAll } =
    useContext(SelectionContext);

  const allSelected = useMemo(
    () => items.every((item) => selectedItems.has(item)),
    [items, selectedItems]
  );

  return (
    <div>
      <button
        class="button"
        onClick={() => (allSelected ? unselectAll(items) : selectAll(items))}
      >
        {allSelected ? "Unselect" : "Select"} all {items.length} item
        {items.length > 1 ? "s" : ""}
      </button>
    </div>
  );
}
