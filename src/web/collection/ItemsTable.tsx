import { Item as ItemType } from "../../scripts/items/types/Item";
import { useEffect, useMemo, useState } from "preact/hooks";
import { groupItems } from "../items/groupItems";
import { Pagination } from "../controls/Pagination";
import { Item } from "../items/Item";

export interface ItemsTableProps {
  items: ItemType[];
  pageSize: number;
  selectable: boolean;
}

export function ItemsTable({ items, pageSize, selectable }: ItemsTableProps) {
  const [firstItem, setFirstItem] = useState(0);

  // We group simple items together with a quantity, leave others alone
  const groupedItems = useMemo(() => groupItems(items), [items]);

  // Reset to the first page when the list of items changes
  useEffect(() => {
    setFirstItem(0);
  }, [items]);

  return (
    <>
      <Pagination
        nbEntries={groupedItems.length}
        pageSize={pageSize}
        currentEntry={firstItem}
        onChange={setFirstItem}
        text={(first, last) => (
          <>
            Items {first} - {last} out of {groupedItems.length}{" "}
            <span class="sidenote">({items.length} with duplicates)</span>
          </>
        )}
      />
      <table id="collection">
        <thead>
          <tr class="sidenote">
            <th>
              <span class="sr-only">Select</span>
            </th>
            <th>Item</th>
            <th>Characteristics</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {groupedItems
            .slice(firstItem, firstItem + pageSize)
            .map(({ item, quantity }, index) => (
              <Item
                key={item.id ?? index}
                item={item}
                quantity={quantity}
                selectable={selectable}
                withLocation={true}
              />
            ))}
        </tbody>
      </table>
    </>
  );
}
