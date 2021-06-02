import { Position } from "./position";
import { getBase } from "../../items/getBase";
import { ALL_COLUMNS, PAGE_HEIGHT } from "../../stash/dimensions";
import { LayoutItem, LayoutResult } from "./types";

export function singleColumnLayout<T extends LayoutItem>(
  groups: T[][]
): LayoutResult<T> {
  const positions = new Map<T, Position>();

  let row = 0;
  for (const group of groups) {
    for (const item of group) {
      const base = getBase(item);
      if (row + base.height > PAGE_HEIGHT) {
        throw new Error(
          `Single-column layout ran out of space for ${item.name}`
        );
      }
      positions.set(item, { page: 0, rows: [row], cols: ALL_COLUMNS });
      row += base.height;
    }
  }

  return { nbPages: Math.sign(groups.length), positions };
}
