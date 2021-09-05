import "./Collection.css";
import { useContext, useMemo, useState } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import { Item } from "../items/Item";
import { groupItems } from "../items/groupItems";
import { Pagination } from "../controls/Pagination";
import "../controls/Controls.css";
import { Search } from "../controls/Search";
import { searchItems } from "../items/searchItems";

const PAGE_SIZE = 20;

export function Collection() {
  const { allItems } = useContext(CollectionContext);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(
    () => searchItems(allItems, search),
    [allItems, search]
  );

  // We group simple items together with a quantity, leave others alone
  const groupedItems = useMemo(
    () => groupItems(filteredItems),
    [filteredItems]
  );

  return (
    <>
      <div class="controls">
        <Search value={search} onChange={setSearch}>
          Search for an item:
        </Search>
      </div>

      <Pagination
        nbEntries={groupedItems.length}
        pageSize={PAGE_SIZE}
        currentPage={currentPage}
        setPage={setCurrentPage}
        entryType="Items"
      />
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
            .slice(currentPage, currentPage + PAGE_SIZE)
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
