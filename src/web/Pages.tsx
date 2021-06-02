import { Page } from "../scripts/stash/types";
import { Items } from "./Items";

export interface ItemListProps {
  pages: Page[];
}

export function Pages({ pages }: ItemListProps) {
  return (
    <>
      {pages.map((page, index) => (
        <>
          <h2>{page.name.replace("#", `${index + 1}`)}</h2>
          <Items items={page.items} />
        </>
      ))}
    </>
  );
}
