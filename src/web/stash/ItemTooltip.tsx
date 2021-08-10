import { Item } from "../../scripts/items/types/Item";
import "./ItemTooltip.css";
import { getBase } from "../../scripts/items/getBase";
import { getRanges } from "../../scripts/items/getRanges";
import { colorClass } from "./utils/colorClass";
import { useState } from "preact/hooks";
import { PROPERTIES } from "../../game-data";

let UNIQUE_ID = 0;

export function ItemTooltip({ item }: { item: Item }) {
  const [tooltipId] = useState(() => `item-tooltip-${UNIQUE_ID++}`);
  const className = colorClass(item);

  if (item.simple) {
    return <span class={className}>{item.name}</span>;
  }

  const rangeMap = getRanges(item).reduce(function(map: {[prop: string]: number[]}, range) {
    if (range.min && range.max && range.min !== range.max && !["levelup-skill", "death-skill"].includes(range.prop)){
      const { stats } = PROPERTIES[range.prop];
      for (const { stat } of stats) {
        map[stat] = [range.min, range.max];
      }
    }
    return map;
  }, {});
  const base = getBase(item);

  const getRangeDesc = function (stat: string){
    const range = rangeMap[stat];
    return range !== undefined ? ` [${range[0]} - ${range[1]}]` : "";
  }

  const getSocketsRangeDesc = function (){
    const range = rangeMap["item_numsockets"];
    return range !== undefined ? ` [${range[0]} - ${Math.min(range[1]!, base.maxSockets)}]` : "";
  }

  const magicMods =
    item.modifiers?.map(
      ({ stat, description }) => description && <div class="magic">{description} <span class="socketed">{getRangeDesc(stat)}</span></div>
    ) ?? [];
  if (item.ethereal || item.sockets) {
    const toDisplay = [
      item.ethereal && "Ethereal",
      item.sockets && `Socketed (${item.sockets})`,
    ].filter((m) => !!m);
    magicMods?.push(<div class="magic">{toDisplay.join(", ")}<span class="socketed">{getSocketsRangeDesc()}</span></div>);
  }

  const setItemMods = item.setItemModifiers?.flatMap((mods) =>
    mods.map(
      ({ description }) => description && <div class="set">{description}</div>
    )
  );

  const setGlobalMods = item.setGlobalModifiers?.flatMap((mods) =>
    mods.map(
      ({ description }) =>
        description && <div class="unique">{description}</div>
    )
  );
  setGlobalMods?.unshift(<br />);

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
              <span class="socketed">
                {" "}[{base.def[0]} - {base.def[1]}]
              </span>
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
        {setGlobalMods}
      </div>
    </span>
  );
}
