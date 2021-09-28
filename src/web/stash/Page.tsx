import { Page, PageFlags } from "../../scripts/stash/types";
import { Item } from "../items/Item";
import "./Page.css";
import { pageName } from "./utils/pageName";
import { useMemo } from "preact/hooks";
import { groupItems } from "../items/groupItems";

export interface PageProps {
  index: number;
  page: Page;
}

export function Page({ page, index }: PageProps) {
  const indexText =
    (page.flags ?? 0) >= PageFlags.MAIN_INDEX
      ? "Main index"
      : (page.flags ?? 0) >= PageFlags.INDEX
      ? "Index"
      : "";

  const grouped = useMemo(() => groupItems(page.items), [page.items]);

  return (
    <section>
      <h3 class="page-title">
        <span>{pageName(page).replace("#", `${index + 1}`)}</span>
        <span>{indexText}</span>
      </h3>
      <table class="page">
        {Array.from(grouped.values()).map((items, index) => (
          <Item
            key={items[0].id ?? index}
            item={items[0]}
            duplicates={items}
            selectable={true}
            withLocation={false}
          />
        ))}
      </table>
    </section>
  );
}
