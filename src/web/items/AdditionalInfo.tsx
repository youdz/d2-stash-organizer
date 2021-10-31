import { Item } from "../../scripts/items/types/Item";
import { ItemQuality } from "../../scripts/items/types/ItemQuality";
import { getBase } from "../../scripts/items/getBase";
import { isSimpleItem } from "../collection/utils/isSimpleItem";

export interface AdditionalInfoProps {
  item: Item;
  quantity?: number;
}

export function AdditionalInfo({ item, quantity }: AdditionalInfoProps) {
  const relevant = [];

  if (isSimpleItem(item)) {
    relevant.push(`Quantity: ${quantity}`);
  }

  if (
    item.runeword ||
    item.code !== "std" &&
    item.quality === ItemQuality.UNIQUE ||
    item.quality === ItemQuality.SET
  ) {
    if (item.perfectionScore === 100) {
      relevant.push("Perfect");
    } else {
      relevant.push(`${item.perfectionScore}% perfect`);
    }
  }

  if (item.ethereal) {
    relevant.push("Ethereal");
  }

  if (item.runeword) {
    relevant.push(getBase(item).name);
  }

  if (
    (item.quality ?? 10) <= ItemQuality.SUPERIOR &&
    !item.runeword &&
    !!item.sockets
  ) {
    relevant.push(`${item.sockets} sockets`);
  }

  return <>{relevant.join(", ")}</>;
}
