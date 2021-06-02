import { Modifier } from "../types/Modifier";
import { Item } from "../types/Item";
import {
  PROPERTIES,
  SetItem,
  SKILL_TABS,
  UniqueItem,
} from "../../../game-data";
import { getBase } from "../getBase";

const SPECIAL_PROPS = ["sock"];

export function generatePerfectItem(uniqueOrSet: UniqueItem | SetItem): Item {
  const ranges =
    "modifiers" in uniqueOrSet
      ? uniqueOrSet.modifiers
      : [...uniqueOrSet.baseModifiers, ...uniqueOrSet.setModifiers];
  const modifiers: Modifier[] = [];
  for (const { prop, min, max, param } of ranges) {
    if (SPECIAL_PROPS.includes(prop)) {
      continue;
    }
    const { stats } = PROPERTIES[prop];
    const previous = modifiers[modifiers.length - 1];
    for (const { stat, type } of stats) {
      switch (type) {
        case "proc":
          modifiers.push({
            stat,
            level: max!,
            spell: Number(param!),
            chance: min!,
          });
          break;
        case "charges":
          modifiers.push({
            stat,
            level: max!,
            spell: Number(param!),
            charges: min!,
            maxCharges: min!,
          });
          break;
        case "all":
          if (!("value" in previous)) {
            throw new Error("No previous mod to copy");
          }
          modifiers.push({
            stat,
            value: previous.value,
            param: previous.param,
          });
          break;
        case "min":
          modifiers.push({
            stat,
            value: min!,
          });
          break;
        case "param":
          modifiers.push({
            stat,
            value: Number(param!),
          });
          break;
        case "max":
        case "other":
          modifiers.push({
            stat,
            value: max!,
            param: param
              ? stat === "item_addskill_tab"
                ? SKILL_TABS[Number(param)].id
                : Number(param)
              : undefined,
          });
          break;
      }
    }
  }

  const socketsProp = ranges.find(({ prop }) => prop === "sock");
  const base = getBase(uniqueOrSet);
  const nbSockets = Math.min(
    socketsProp?.max || Number(socketsProp?.param) || 0,
    base.maxSockets || 0
  );

  return {
    raw: "",
    identified: true,
    socketed: !!nbSockets,
    simple: false,
    ethereal: ranges.some(({ prop }) => prop === "ethereal"),
    runeword: false,
    location: 0,
    stored: 0,
    column: 0,
    row: 0,
    code: uniqueOrSet.code,
    name: uniqueOrSet.name,
    sockets: nbSockets,
    defense: "def" in base ? base.def[1] : undefined,
    modifiers,
  };
}
