import { PAGE_SIZE, Pagination } from "./Pagination";
import { Page } from "./Page";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { getBase } from "../../scripts/items/getBase";
import { pageName } from "./utils/pageName";
import { StashContext } from "../store/stashContext";
import {
  ITEM_STATS,
  ItemStat,
  STAT_GROUPS,
  StatDescription,
} from "../../game-data";
import { describeSingleMod } from "../../scripts/items/post-processing/describeSingleMod";

const SORTABLE_MOD_FUNCS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 19, 20];

// FIXME: remove magic/elemental min and max damage mods
const SORTABLE_MODS: StatDescription[] = [
  ...STAT_GROUPS,
  ...ITEM_STATS.filter((stat): stat is ItemStat => !!stat),
].filter((stat) => SORTABLE_MOD_FUNCS.includes(stat.descFunc));

export function StashView() {
  const { stash } = useContext(StashContext);
  const [search, setSearch] = useState("");
  const [quality, setQuality] = useState("0");
  const [currentPage, setCurrentPage] = useState(0);

  const pages = useMemo(() => {
    let filtered = stash?.pages;
    if (search) {
      const lcFilters = search
        .toLocaleLowerCase()
        .match(/(?<=")[^"]+(?=")|[^"\s]+/g)!;
      filtered = stash?.pages
        .map((page, index) => {
          const items = page.items.filter((item) => {
            const base = getBase(item);
            return lcFilters.every(
              (filter) =>
                page.name.toLocaleLowerCase().includes(filter) ||
                item.name?.toLocaleLowerCase().includes(filter) ||
                base.name.toLocaleLowerCase().includes(filter) ||
                item.search.includes(filter)
            );
          });

          return {
            ...page,
            name: pageName(page).replace("#", `${index + 1}`),
            items,
          };
        })
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
              type="search"
              value={search}
              onInput={({ currentTarget }) => setSearch(currentTarget.value)}
            />
          </p>
        </div>
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
        {/*<div id="sort-container">*/}
        {/*  <p>*/}
        {/*    <label for="sort">TODO: Sort by</label>*/}
        {/*  </p>*/}
        {/*  <p>*/}
        {/*    <select id="sort">*/}
        {/*      <option value="">Stash order</option>*/}
        {/*      {SORTABLE_MODS.map((statDesc) => (*/}
        {/*        <option value={statDesc.stat}>*/}
        {/*          {describeSingleMod(*/}
        {/*            { id: -1, priority: -1, stat: statDesc.stat, value: 0 },*/}
        {/*            statDesc*/}
        {/*          )?.replace("0", "X")}*/}
        {/*        </option>*/}
        {/*      ))}*/}
        {/*    </select>*/}
        {/*  </p>*/}
        {/*</div>*/}
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
