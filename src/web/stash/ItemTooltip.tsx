import { Item } from "../../scripts/items/types/Item";
import "./ItemTooltip.css";
import { getBase } from "../../scripts/items/getBase";
import { colorClass } from "./utils/colorClass";
import { useRef, useState } from "preact/hooks";

let UNIQUE_ID = 0;

export function ItemTooltip({ item }: { item: Item }) {
  const [tooltipId] = useState(() => `item-tooltip-${UNIQUE_ID++}`);
  const className = colorClass(item);

  if (item.simple) {
    return <span class={className}>{item.name}</span>;
  }

  const base = getBase(item);

  const magicMods =
    item.modifiers?.map(
      ({ description }) => description && <div class="magic">{description}</div>
    ) ?? [];
  if (item.ethereal || item.sockets) {
    const toDisplay = [
      item.ethereal && "Ethereal",
      item.sockets && `Socketed (${item.sockets})`,
    ].filter((m) => !!m);
    magicMods?.push(<div class="magic">{toDisplay.join(", ")}</div>);
  }

  const setItemMods = item.setModifiers?.flatMap((mods) =>
    mods.map(
      ({ description }) => description && <div class="set">{description}</div>
    )
  );

  return (
    <span class="tooltip-container">
      <span
        class={`tooltip-trigger ${className}`}
        tabIndex={0}
        aria-describedby={tooltipId}
      >
        {item.name}
      </span>
      <div id={tooltipId} class="tooltip-content" role="tooltip">
        <div class={className}>{item.name}</div>
        <div class={className}>{base?.name}</div>
        <div>Item Level: {item.level}</div>
        {"def" in base && (
          <div>
            Defense:{" "}
            <span class={item.enhancedDefense ? "magic" : ""}>
              {item.defense}
            </span>
          </div>
        )}
        {item.durability && (
          <div>
            Durability: {item.durability?.[0]} of{" "}
            {item.durability[1] + (item.extraDurability ?? 0)}
          </div>
        )}
        {/* TODO: requirements */}
        {magicMods}
        {setItemMods}
        {/* TODO: Set mods */}
      </div>
    </span>
  );
}
