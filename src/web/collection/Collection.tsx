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

const PAGE_SIZE = 20;

export function Collection() {
  const { allItems } = useContext(CollectionContext);
  const [search, setSearch] = useState("");
  const [quality, setQuality] = useState<QualityFilterValue>("all");
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
      </div>

      <Pagination
        nbEntries={groupedItems.length}
        pageSize={PAGE_SIZE}
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
            .slice(firstItem, firstItem + PAGE_SIZE)
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
