import { Position } from "./position";
import { getBase } from "../../items/getBase";
import { PAGE_HEIGHT, PAGE_WIDTH } from "../../plugy-stash/dimensions";
import { LayoutItem, LayoutResult } from "./types";

export function tiersLayout<T extends LayoutItem>(
  groups: T[][],
  // columns instead of lines
  columns = false,
  // Force each tier on its own page
  multiplePages = false
): LayoutResult<T> {
  const positions = new Map<T, Position>();

  let currentPage = -1;
  let row = 0;
  let col = 0;
  // max height of the current row of items
  let nextRow = 0;

  function newPage() {
    currentPage++;
    row = 0;
    col = 0;
    nextRow = 0;
  }

  // Items of size 2 max, which can be spread evenly on the page
  let smallItems = false;
  for (let tier = 0; tier < groups.length; tier++) {
    if (tier === 0 || multiplePages) {
      newPage();
    } else {
      row = nextRow;
      // Adding empty rows for pretty even presentation when possible
      if (
        smallItems ||
        (0 < nextRow && nextRow < (3 - groups.length + tier) * 3)
      ) {
        smallItems = true;
        row += 2;
      }
      col = 0;
      nextRow = row;
    }

    for (const item of groups[tier]) {
      const base = getBase(item);
      if (
        col + base[columns ? "height" : "width"] >
        (columns ? PAGE_HEIGHT : PAGE_WIDTH)
      ) {
        row = nextRow;
        col = 0;
      }
      if (
        row + base[columns ? "width" : "height"] >
        (columns ? PAGE_WIDTH : PAGE_HEIGHT)
      ) {
        if (!multiplePages) {
          // We ran out of space due to an edge case (like 1-h swords), retry this whole section
          return tiersLayout(groups, columns, true);
        } else {
          // If we were already using multiple pages, just create a new page
          newPage();
        }
      }
      positions.set(item, {
        page: currentPage,
        rows: [columns ? col : row],
        cols: [columns ? row : col],
      });
      col += base[columns ? "height" : "width"];
      nextRow = Math.max(nextRow, row + base[columns ? "width" : "height"]);
    }

    // Check if we can fit all tiers on the same page
    if (!multiplePages && tier === 0 && groups.length > 2) {
      multiplePages = nextRow > 3;
    }
  }

  return { nbPages: currentPage + 1, positions };
}
