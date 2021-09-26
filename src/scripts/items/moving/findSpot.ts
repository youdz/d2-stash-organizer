import { Item } from "../types/Item";
import { collision } from "./collision";
import { outOfBounds } from "./outOfBounds";

export function findSpot(
  item: Item,
  page: Item[],
  height: number,
  width: number
): [col: number, row: number] | undefined {
  let col = 0;
  let row = 0;
  // This makes transferring items quadratic and I just don't care.
  // If we hit performance issues, we can start making this more complicated.
  while (row < height && col < width) {
    const target = { ...item, row, column: col };
    if (
      !outOfBounds(target, height, width) &&
      !page.some((existing) => collision(target, existing))
    ) {
      return [col, row];
    }
    row++;
    if (row >= height) {
      row = 0;
      col++;
    }
  }
}
