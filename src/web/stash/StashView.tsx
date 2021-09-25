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
import { isStash } from "../../scripts/save-file/ownership";

const PAGE_SIZE = 10;

export function StashView() {
  const { owners } = useContext(CollectionContext);
  // TODO: if not PlugY, initialize to an actual character because there is no shared stash
  const [character, setCharacter] = useState("");
  const [search, setSearch] = useState("");
  const [quality, setQuality] = useState<QualityFilterValue>("all");
  const [currentPage, setCurrentPage] = useState(0);

  const stash = useMemo(() => {
    const owner = owners.get(character);
    if (owner && isStash(owner)) {
      return owner;
    }
    return;
  }, [owners, character]);

  const pages = useMemo(() => {
    return stash?.pages
      .map((page, index) => ({
        ...page,
        name: pageName(page).replace("#", `${index + 1}`),
        items: filterItemsByQuality(
          searchItems(page.items, search, page.name),
          quality
        ),
      }))
      .filter(({ items }) => items.length > 0);
  }, [stash, search, quality]);

  // Reset to the first page when the stash changes
  useEffect(() => {
    setCurrentPage(0);
  }, [stash]);

  const characterOptions = useMemo(() => {
    const options = [];
    for (const name of owners.keys()) {
      options.push(<option value={name}>{name || "Shared stash"}</option>);
    }
    return options;
  }, [owners]);

  if (!pages) {
    return null;
  }

  const pagination = (
    <Pagination
      nbEntries={pages.length}
      pageSize={PAGE_SIZE}
      currentEntry={currentPage}
      onChange={setCurrentPage}
      entryType="Pages"
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
              value={character}
              onChange={({ currentTarget }) =>
                setCharacter(currentTarget.value)
              }
            >
              {characterOptions}
            </select>
          </p>
        </div>
        <Search value={search} onChange={setSearch}>
          Search for an item or a page:
        </Search>
        <QualityFilter value={quality} onChange={setQuality} />
      </div>
      {pagination}
      {/* Need an extra div because Preact doesn't seem to like maps flat with non-mapped elements */}
      <div>
        {pages
          .slice(currentPage, currentPage + PAGE_SIZE)
          .map((page, index) => (
            <Page key={index} page={page} index={index + currentPage} />
          ))}
      </div>
      {pagination}
    </>
  );
}
