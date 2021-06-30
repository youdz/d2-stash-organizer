import { Page, PageFlags } from "../../scripts/stash/types";
import { Item } from "./Item";
import { Item as ItemType } from "../../scripts/items/types/Item";
import "./Page.css";
import { isSimpleItem } from "./utils/isSimpleItem";
import { pageName } from "./utils/pageName";

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

  // We group simple items together with a quantity, leave others alone
  const grouped = new Map<string, { item: ItemType; quantity: number }>();
  let uid = 0;
  for (const item of page.items) {
    if (isSimpleItem(item)) {
      let existing = grouped.get(item.code);
      if (!existing) {
        existing = { item, quantity: 0 };
        grouped.set(item.code, existing);
      }
      existing.quantity++;
    } else {
      grouped.set(`${uid++}`, { item, quantity: 1 });
    }
  }

  return (
    <section>
      <h3 class="page-title">
        <span>{pageName(page).replace("#", `${index + 1}`)}</span>
        <span>{indexText}</span>
      </h3>
      <table class="page">
        {Array.from(grouped.values()).map(({ item, quantity }, index) => (
          <Item key={item.id ?? index} item={item} quantity={quantity} />
        ))}
      </table>
    </section>
  );
}
