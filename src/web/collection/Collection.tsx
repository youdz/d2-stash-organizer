import "./Collection.css";
import { useContext, useMemo, useState } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import { Item } from "./Item";
import { groupItems } from "./groupItems";

export function Collection() {
  const { allItems } = useContext(CollectionContext);
  const [currentPage, setCurrentPage] = useState(0);

  // We group simple items together with a quantity, leave others alone
  const groupedItems = useMemo(() => groupItems(allItems), [allItems]);

  return (
    <>
      <table id="collection">
        <thead>
          <tr class="sidenote">
            <th>Item</th>
            <th>Characteristics</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {groupedItems
            .slice(currentPage, currentPage + 20)
            .map(({ item, quantity }, index) => (
              <Item
                key={item.id ?? index}
                item={item}
                quantity={quantity}
                withLocation={true}
              />
            ))}
        </tbody>
      </table>
    </>
  );
}
