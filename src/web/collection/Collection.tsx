import "./Collection.css";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import { Item } from "../items/Item";
import { groupItems } from "../items/groupItems";
import { Pagination } from "../controls/Pagination";
import "../controls/Controls.css";
import { Search, searchItems } from "../controls/Search";
import {
  filterItemsByQuality,
  QualityFilter,
  QualityFilterValue,
} from "../controls/QualityFilter";

export function Collection() {
  const { allItems } = useContext(CollectionContext);
  const [search, setSearch] = useState("");
  const [quality, setQuality] = useState<QualityFilterValue>("all");
  const [pageSize, setPageSize] = useState(20);
  const [firstItem, setFirstItem] = useState(0);

  const filteredItems = useMemo(
    () => filterItemsByQuality(searchItems(allItems, search), quality),
    [allItems, search, quality]
  );

  // We group simple items together with a quantity, leave others alone
  const groupedItems = useMemo(
    () => groupItems(filteredItems),
    [filteredItems]
  );

  // Reset to the first page when the collection changes
  useEffect(() => {
    setFirstItem(0);
  }, [allItems]);

  return (
    <>
      <div class="controls">
        <Search value={search} onChange={setSearch}>
          Search for an item:
        </Search>
        <QualityFilter value={quality} onChange={setQuality} />
        <div>
          <p>
            <label for="page-size-select">Items per page:</label>
          </p>
          <p>
            <select
              id="page-size-select"
              value={pageSize}
              onChange={({ currentTarget }) =>
                setPageSize(Number(currentTarget.value))
              }
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </p>
        </div>
      </div>

      <Pagination
        nbEntries={groupedItems.length}
        pageSize={pageSize}
        currentEntry={firstItem}
        onChange={setFirstItem}
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
            .slice(firstItem, firstItem + pageSize)
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
