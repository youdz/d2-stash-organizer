import { PAGE_SIZE, Pagination } from "./Pagination";
import { Page } from "./Page";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { getBase } from "../../scripts/items/getBase";
import { pageName } from "./utils/pageName";
import { StashContext } from "../store/stashContext";

export function StashView() {
  const { stash } = useContext(StashContext);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const pages = useMemo(() => {
    let filtered = stash?.pages;
    if (search) {
      const lcFilter = search.toLocaleLowerCase();
      filtered = stash?.pages
        .map((page, index) => {
          let items = page.items;
          if (!page.name.toLocaleLowerCase().includes(lcFilter)) {
            items = page.items.filter((item) => {
              const base = getBase(item);
              return (
                item.name?.toLocaleLowerCase().includes(lcFilter) ||
                base.name.toLocaleLowerCase().includes(lcFilter)
              );
            });
          }

          return {
            ...page,
            name: pageName(page).replace("#", `${index + 1}`),
            items,
          };
        })
        .filter(({ items }) => items.length > 0);
    }
    return filtered;
  }, [stash, search]);

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

  if (!pages) {
    return null;
  }

  return (
    <>
      <div class="controls">
        <div id="search">
          <p>
            <label for="search-input">Search for an item or a page:</label>
          </p>
          <p>
            <input
              id="search-input"
              type="text"
              value={search}
              onInput={({ currentTarget }) => setSearch(currentTarget.value)}
            />
          </p>
        </div>
        <div id="filter">
          <p>
            <label for="filter-select">TODO: filter by mod</label>
          </p>
          <p>
            <select id="filter-select" multiple>
              <option>Resist all</option>
              <option>Magic find</option>
            </select>
          </p>
        </div>
      </div>
      <Pagination
        nbPages={pages.length}
        currentPage={currentPage}
        setPage={setCurrentPage}
      />
      {/* Need an extra div because Preact doesn't seem to like maps flat with non-mapped elements */}
      <div>
        {pages
          .slice(currentPage, currentPage + PAGE_SIZE)
          .map((page, index) => (
            <Page key={index} page={page} index={index + currentPage} />
          ))}
      </div>
      <Pagination
        nbPages={pages.length}
        currentPage={currentPage}
        setPage={setCurrentPage}
      />
    </>
  );
}
