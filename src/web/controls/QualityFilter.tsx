import { Item } from "../../scripts/items/types/Item";
import { ItemQuality } from "../../scripts/items/types/ItemQuality";

export type QualityFilterValue =
  | "all"
  | "normal"
  | "superior"
  | "magic"
  | "rare"
  | "unique"
  | "set"
  | "runeword"
  | "crafted"
  | "misc";

export interface QualityFilterProps {
  value: string;
  onChange: (value: QualityFilterValue) => void;
}

export function QualityFilter({ value, onChange }: QualityFilterProps) {
  return (
    <div id="quality">
      <p>
        <label for="quality-select">Filter by quality:</label>
      </p>
      <p>
        <select
          id="quality-select"
          value={value}
          onChange={({ currentTarget }) =>
            onChange(currentTarget.value as QualityFilterValue)
          }
        >
          <option value="all">All</option>
          <option value="normal">Non-magical</option>
          <option value="superior">Superior</option>
          <option value="magic">Magic</option>
          <option value="rare">Rare</option>
          <option value="unique">Unique</option>
          <option value="set">Set</option>
          <option value="runeword">Rune word</option>
          <option value="crafted">Crafted</option>
          <option value="misc">Non-equipment</option>
        </select>
      </p>
    </div>
  );
}

export function filterItemsByQuality(
  items: Item[],
  quality: QualityFilterValue
) {
  if (quality === "all") {
    return items;
  }

  return items.filter((item) => {
    switch (quality) {
      case "normal":
        return (item.quality ?? 10) <= ItemQuality.SUPERIOR && !item.runeword;
      case "superior":
        return item.quality === ItemQuality.SUPERIOR && !item.runeword;
      case "magic":
        return item.quality === ItemQuality.MAGIC;
      case "rare":
        return item.quality === ItemQuality.RARE;
      case "unique":
        return item.quality === ItemQuality.UNIQUE;
      case "set":
        return item.quality === ItemQuality.SET;
      case "runeword":
        return item.runeword;
      case "crafted":
        return item.quality === ItemQuality.CRAFTED;
      case "misc":
        return item.simple;
    }
  });
}
