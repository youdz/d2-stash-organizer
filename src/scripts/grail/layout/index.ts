import { LayoutItem, LayoutResult, LayoutType } from "./types";
import { singleLineLayout } from "./singleLineLayout";
import { tiersLayout } from "./tiersLayout";
import { singleColumnLayout } from "./singleColumnLayout";
import { setLayout } from "./setLayout";
import { linesLayout } from "./linesLayout";
import { runesLayout } from "./runesLayout";

export function layout<T extends LayoutItem = LayoutItem>(
  layout: LayoutType | undefined,
  items: T[][]
): LayoutResult<T> {
  switch (layout) {
    case "single-line":
      return singleLineLayout(items);
    case "single-column":
      return singleColumnLayout(items);
    case "set":
      return setLayout(items);
    case "runes":
      return runesLayout(items);
    case "tier-lines":
      return tiersLayout(items, false);
    case "tier-columns":
      return tiersLayout(items, true);
    default:
      return linesLayout(items);
  }
}

export * from "./types";
