import { Position } from "./position";
import { getBase } from "../../items/getBase";
import { ALL_ROWS, PAGE_WIDTH } from "../../plugy-stash/dimensions";
import { LayoutItem, LayoutResult } from "./types";

export function singleLineLayout<T extends LayoutItem>(
  groups: T[][]
): LayoutResult<T> {
  const positions = new Map<T, Position>();

  let col = 0;
  for (const group of groups) {
    for (const item of group) {
      const base = getBase(item);
      if (col + base.width > PAGE_WIDTH) {
        throw new Error(`Single-line layout ran out of space for ${item.name}`);
      }
      positions.set(item, { page: 0, rows: ALL_ROWS, cols: [col] });
      col += base.width;
    }
  }

  return { nbPages: Math.sign(groups.length), positions };
}
