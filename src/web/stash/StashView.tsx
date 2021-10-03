import { Pagination } from "../controls/Pagination";
import { Page } from "./Page";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { pageName } from "./utils/pageName";
import { CollectionContext } from "../store/CollectionContext";
import { Search, searchItems } from "../controls/Search";
import "../controls/Controls.css";
import {
  filterItemsByQuality,
  QualityFilter,
  QualityFilterValue,
} from "../controls/QualityFilter";
import {
  isPlugyStash,
  isStash,
  ownerName,
} from "../../scripts/save-file/ownership";
import { characterPages } from "./characterPages";
import { SelectAll } from "../controls/SelectAll";

const PAGE_SIZE = 10;

export function StashView() {
  const { owners, lastActivePlugyStashPage } = useContext(CollectionContext);
  const [ownerIndex, setOwnerIndex] = useState(() =>
    Math.max(
      0,
      owners.findIndex((owner) => isPlugyStash(owner) && !owner.personal)
    )
  );
  const [search, setSearch] = useState("");
  const [quality, setQuality] = useState<QualityFilterValue>("all");
  const [currentPage, setCurrentPage] = useState(0);

  const owner = owners[ownerIndex];

  const rawPages = useMemo(() => {
    if (!owner) {
      return [];
    }
    if (isStash(owner)) {
      return owner.pages;
    } else {
      return characterPages(owner, !!lastActivePlugyStashPage?.get(owner));
    }
  }, [owner, lastActivePlugyStashPage]);

  const filteredPages = useMemo(() => {
    return (
      rawPages
        .map((page, index) => ({
          ...page,
          name: pageName(page).replace("#", `${index + 1}`),
          items: filterItemsByQuality(
            searchItems(page.items, search, "name" in page ? page.name : ""),
            quality
          ),
        }))
        .filter(({ items }) => items.length > 0) ?? []
    );
  }, [rawPages, search, quality]);

  const filteredItems = useMemo(
    () => filteredPages.flatMap(({ items }) => items),
    [filteredPages]
  );

  // Reset to the first page when the owner changes
  useEffect(() => {
    setCurrentPage(0);
  }, [owner]);

  const pagination = (
    <Pagination
      nbEntries={filteredPages.length}
      pageSize={PAGE_SIZE}
      currentEntry={currentPage}
      onChange={setCurrentPage}
      text={(first, last) =>
        `Pages ${first} - ${last} out of ${filteredPages.length}`
      }
    />
  );

  return (
    <>
      <div class="controls">
        <div>
          <p>
            <label for="character-select">Select a character:</label>
          </p>
          <p>
            <select
              id="character-select"
              value={ownerIndex}
              onChange={({ currentTarget }) =>
                setOwnerIndex(Number(currentTarget.value))
              }
            >
              {owners.map((owner, i) => (
                <option value={i}>{ownerName(owner)}</option>
              ))}
            </select>
          </p>
        </div>
        <Search value={search} onChange={setSearch}>
          Search for an item or a page:
        </Search>
        <QualityFilter value={quality} onChange={setQuality} />
        <SelectAll items={filteredItems} />
      </div>
      {pagination}
      {/* Need an extra div because Preact doesn't seem to like maps flat with non-mapped elements */}
      <div>
        {filteredPages
          .slice(currentPage, currentPage + PAGE_SIZE)
          .map((page, index) => (
            <Page key={index} page={page} index={index + currentPage} />
          ))}
      </div>
      {pagination}
    </>
  );
}
