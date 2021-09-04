import { Position } from "./position";
import { PAGE_HEIGHT, PAGE_WIDTH } from "../../stash/dimensions";
import { LayoutItem, LayoutResult } from "./types";

function runeIndex(rune: LayoutItem) {
  return Number(rune.code.slice(1));
}

export function runesLayout<T extends LayoutItem>([
  runes,
]: T[][]): LayoutResult<T> {
  const positions = new Map<T, Position>();

  runes.sort((a, b) => runeIndex(a) - runeIndex(b));

  // We want empty groups for absent runes, to leave extra empty lines.
  const groups: T[][] = [];
  let currentRune = 0;
  // 1 = El, 33 = Zod
  for (let i = 1; i < 34; i++) {
    const group: T[] = [];
    while (currentRune < runes.length && runeIndex(runes[currentRune]) === i) {
      group.push(runes[currentRune]);
      currentRune++;
    }
    groups.push(group);
  }

  let currentPage = 0;
  let row = -2;
  let col = 0;

  function positionGroup(group: T[], fullPage: boolean): void {
    for (const item of group) {
      if (col + 1 > PAGE_WIDTH) {
        row++;
        col = 0;
      }
      if (row + 1 > PAGE_HEIGHT) {
        currentPage++;
        row = 0;
        col = 0;
        // We avoid breaking a single rune list over two pages
        if (!fullPage) {
          return positionGroup(group, true);
        }
      }
      positions.set(item, { page: currentPage, rows: [row], cols: [col] });
      col++;
    }
  }

  for (const group of groups) {
    // Leave one empty row between each rune level
    row += 2;
    col = 0;
    positionGroup(group, row === 0);
  }

  return { nbPages: currentPage + 1, positions };
}
