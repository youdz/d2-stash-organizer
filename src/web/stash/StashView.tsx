import { Pagination } from "../controls/Pagination";
import { Page } from "./Page";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { pageName } from "./utils/pageName";
import { CollectionContext } from "../store/CollectionContext";
import { Search } from "../controls/Search";
import "../controls/Controls.css";
import { searchItems } from "../items/searchItems";

const PAGE_SIZE = 10;

export function StashView() {
  const { characters } = useContext(CollectionContext);
  // TODO: if not PlugY, initialize to an actual character because there is no shared stash
  const [character, setCharacter] = useState("");
  const [search, setSearch] = useState("");
  const [quality, setQuality] = useState("0");
  const [currentPage, setCurrentPage] = useState(0);

  const stash = useMemo(() => {
    return characters.get(character)?.stash;
  }, [characters, character]);

  const pages = useMemo(() => {
    let filtered = stash?.pages;
    if (search) {
      filtered = stash?.pages
        .map((page, index) => ({
          ...page,
          name: pageName(page).replace("#", `${index + 1}`),
          items: searchItems(page.items, search, page.name),
        }))
        .filter(({ items }) => items.length > 0);
    }

    const qualityValue = parseInt(quality);
    if (filtered && qualityValue > 0) {
      filtered = filtered
        .map((page) => {
          const items = page.items.filter(
            (item) =>
              item.quality === qualityValue ||
              (item.simple && qualityValue === 2)
          );
          return {
            ...page,
            name: pageName(page),
            items,
          };
        })
        .filter(({ items }) => items.length > 0);
    }

    return filtered;
  }, [stash, search, quality]);

  // Reset to the first page when the stash changes
  useEffect(() => {
    setCurrentPage(0);
  }, [stash]);

  // Make sure we never go page the last page
  useEffect(() => {
    if (currentPage >= (pages?.length ?? 0)) {
      setCurrentPage(0);
    }
  }, [pages?.length, currentPage]);

  const characterOptions = useMemo(() => {
    const options = [];
    for (const name of characters.keys()) {
      options.push(<option value={name}>{name || "Shared stash"}</option>);
    }
    return options;
  }, [characters]);

  if (!pages) {
    return null;
  }

  const pagination = (
    <Pagination
      nbEntries={pages.length}
      pageSize={PAGE_SIZE}
      currentPage={currentPage}
      setPage={setCurrentPage}
      entryType="Pages"
    />
  );

  return (
    <>
      <div class="controls">
        <div id="character">
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
        <div id="quality">
          <p>
            <label for="quality-select">Search for a quality:</label>
          </p>
          <p>
            <select
              id="quality-select"
              value={quality}
              onChange={({ currentTarget }) => setQuality(currentTarget.value)}
            >
              <option value="0">All</option>
              <option value="1">Low</option>
              <option value="2">Normal</option>
              <option value="3">Superior</option>
              <option value="4">Magic</option>
              <option value="5">Set</option>
              <option value="6">Rare</option>
              <option value="7">Unique</option>
              <option value="8">Crafted</option>
            </select>
          </p>
        </div>
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
