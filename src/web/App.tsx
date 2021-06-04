import { render } from "preact";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { getStash } from "./stash";
import "./App.css";
import { Page } from "./Page";
import { Actions } from "./Actions";
import { PAGE_SIZE, Pagination } from "./Pagination";
import { Stash } from "../scripts/stash/types";
import { getBase } from "../scripts/items/getBase";
import { GitHubLink } from "./GitHubLink";
import { GrailTracker } from "./GrailTracker";

export function App() {
  const [stash, setStash] = useState(() => getStash());
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState("");
  const [grailTracker, setGrailTracker] = useState(
    () => window.location.hash === "#grail-tracker"
  );

  useEffect(() => {
    const listener = () => setGrailTracker(location.hash === "#grail-tracker");
    window.addEventListener("hashchange", listener);
    () => window.removeEventListener("hashchange", listener);
  }, []);

  const handleStashChange = useCallback((stash: Stash) => {
    setStash(stash);
    setCurrentPage(0);
  }, []);

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
            name: page.name.replace("#", `${index + 1}`),
            items,
          };
        })
        .filter(({ items }) => items.length > 0);
    }
    return filtered;
  }, [stash, filter]);

  useEffect(() => {
    if (currentPage >= (pages?.length ?? 0)) {
      setCurrentPage(0);
    }
  }, [pages?.length, currentPage]);

  return (
    <div>
      <GitHubLink />
      <h1>Diablo 2 Plugy Stash Organizer</h1>
      <Actions
        grailTracker={grailTracker}
        stash={stash}
        onStashChange={handleStashChange}
        filter={filter}
        setFilter={setFilter}
      />

      {grailTracker && stash && <GrailTracker stash={stash} />}

      {!grailTracker && pages && (
        <>
          <Pagination
            nbPages={pages.length}
            currentPage={currentPage}
            setPage={setCurrentPage}
          />
          {pages
            .slice(currentPage, currentPage + PAGE_SIZE)
            .map((page, index) => (
              <Page page={page} index={index + currentPage} />
            ))}
          <Pagination
            nbPages={pages.length}
            currentPage={currentPage}
            setPage={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}

render(<App />, document.body, document.getElementById("container")!);
