import "./Collection.css";
import { useContext, useMemo, useState } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import { Item } from "../stash/Item";
import { Item as ItemType } from "../../scripts/items/types/Item";
import { isSimpleItem } from "../stash/utils/isSimpleItem";

export function Collection() {
  const { allItems } = useContext(CollectionContext);
  const [currentPage, setCurrentPage] = useState(0);

  // FIXME: bad copy-paste
  // We group simple items together with a quantity, leave others alone
  const groupedItems = useMemo(() => {
    const grouped = new Map<string, { item: ItemType; quantity: number }>();
    let uid = 0;
    for (const item of allItems) {
      if (isSimpleItem(item)) {
        let existing = grouped.get(item.code);
        if (!existing) {
          existing = { item, quantity: 0 };
          grouped.set(item.code, existing);
        }
        existing.quantity++;
      } else {
        grouped.set(`${uid++}`, { item, quantity: 1 });
      }
    }
    return Array.from(grouped.values());
  }, [allItems]);

  return (
    <>
      <table>
        {groupedItems
          .slice(currentPage, currentPage + 20)
          .map(({ item, quantity }, index) => (
            <Item key={item.id ?? index} item={item} quantity={quantity} />
          ))}
      </table>
    </>
  );
}
