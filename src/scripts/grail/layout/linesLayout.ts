import { Position } from "./position";
import { getBase } from "../../items/getBase";
import { PAGE_HEIGHT, PAGE_WIDTH } from "../../plugy-stash/dimensions";
import { LayoutItem, LayoutResult } from "./types";

export function linesLayout<T extends LayoutItem>(
  groups: T[][]
): LayoutResult<T> {
  const positions = new Map<T, Position>();
  if (groups.length === 0) {
    return { nbPages: 0, positions };
  }

  let currentPage = 0;
  let row = 0;
  let col = 0;
  // max height of the current row of items
  let nextRow = 0;

  function positionGroup(group: T[], fullPage: boolean): void {
    for (const item of group) {
      const base = getBase(item);
      if (col + base.width > PAGE_WIDTH) {
        row = nextRow;
        col = 0;
      }
      if (row + base.height > PAGE_HEIGHT) {
        currentPage++;
        row = 0;
        col = 0;
        nextRow = 0;
        // We avoid breaking a group from the bottom of a previous page
        if (!fullPage) {
          return positionGroup(group, true);
        }
      }
      positions.set(item, { page: currentPage, rows: [row], cols: [col] });
      col += base.width;
      nextRow = Math.max(nextRow, row + base.height);
    }
  }

  for (const group of groups) {
    row = nextRow;
    col = 0;
    positionGroup(group, row === 0);
  }

  return { nbPages: currentPage + 1, positions };
}
