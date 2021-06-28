import { Stash } from "../../scripts/stash/types";
import { PAGE_SIZE, Pagination } from "./Pagination";
import { Page } from "./Page";
import { useEffect, useMemo, useState } from "preact/hooks";
import { getBase } from "../../scripts/items/getBase";
import { pageName } from "../utils/pageName";

export interface StashProps {
  stash: Stash | undefined;
  // TODO: move this to stash only, but requires a layout change
  filter: string;
}

export function StashView({ stash, filter }: StashProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = useMemo(() => {
    let filtered = stash?.pages;
    if (filter) {
      const lcFilter = filter.toLocaleLowerCase();
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
  }, [stash, filter]);

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
      <Pagination
        nbPages={pages.length}
        currentPage={currentPage}
        setPage={setCurrentPage}
      />
      {pages.slice(currentPage, currentPage + PAGE_SIZE).map((page, index) => (
        <Page page={page} index={index + currentPage} />
      ))}
      <Pagination
        nbPages={pages.length}
        currentPage={currentPage}
        setPage={setCurrentPage}
      />
    </>
  );
}
