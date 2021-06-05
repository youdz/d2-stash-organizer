import { LayoutItem, LayoutResult } from "./types";
import { Position } from "./position";
import { getBase } from "../../items/getBase";

export function setLayout<T extends LayoutItem>([
  setItems,
]: T[][]): LayoutResult<T> {
  const positions = new Map<T, Position>();

  // We take the space of the largest shield/weapon, which looks awkward for small ones like wands.
  for (const item of setItems) {
    const { type } = getBase(item);
    switch (type) {
      case "ring":
        positions.set(item, { page: 0, rows: [6], cols: [3, 6] });
        break;
      case "amul":
        positions.set(item, { page: 0, rows: [2], cols: [6] });
        break;
      case "tors":
        positions.set(item, { page: 0, rows: [3], cols: [4] });
        break;
      case "helm":
      case "circ":
      case "phlm":
      case "pelt":
        positions.set(item, { page: 0, rows: [0], cols: [4] });
        break;
      case "glov":
        positions.set(item, { page: 0, rows: [7], cols: [1] });
        break;
      case "belt":
        positions.set(item, { page: 0, rows: [7], cols: [4] });
        break;
      case "boot":
        positions.set(item, { page: 0, rows: [7], cols: [7] });
        break;
      case "shie":
      case "head":
      case "ashd":
        positions.set(item, { page: 0, rows: [2], cols: [7] });
        break;
      default:
        // Special case for Bul-Kathos
        if (item.code === "7wd") {
          positions.set(item, { page: 0, rows: [2], cols: [7] });
          break;
        }
        // All weapon types fall under the default
        positions.set(item, { page: 0, rows: [2], cols: [1] });
    }
  }

  return { nbPages: 1, positions };
}
