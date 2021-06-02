import { SETS } from "../../../game-data";

const CATEGORIES = [
  [{ name: "Low level sets", maxLevel: 20 }],
  [{ name: "Mid level sets", maxLevel: 60 }],
  [{ name: "High level sets", maxLevel: 100 }],
];

export interface SetSection {
  name: string;
  shortName: string;
  set: string;
}

export const SETS_ORDER: SetSection[][] = [];

// Currently one section per set, to easily storing extras in a page right after the set.
const allSets = Object.entries(SETS);
let minLevel = 0;
for (const [{ maxLevel }] of CATEGORIES) {
  SETS_ORDER.push(
    allSets
      .filter(([, { levelReq }]) => minLevel <= levelReq && levelReq < maxLevel)
      .sort(([, a], [, b]) => a.levelReq - b.levelReq)
      .map(([set, { name }]) => {
        // lastIndexOf because of M'avina
        const nameEnd = name.lastIndexOf("'");
        if (
          nameEnd >= 0 &&
          !name.startsWith("Death") &&
          !name.startsWith("Heaven") &&
          !name.startsWith("Orphan")
        ) {
          name = name.slice(0, nameEnd);
        }
        let shortName = name;
        let shortNameEnd = name.indexOf("'", 4);
        if (shortNameEnd < 0) {
          shortNameEnd = name.indexOf(" ", 4);
        }
        if (shortNameEnd > 0) {
          shortName = name.slice(0, shortNameEnd);
        }
        if (shortName.startsWith("The ")) {
          shortName = shortName.slice(4);
        }
        return { name, shortName, set };
      })
  );
  minLevel = maxLevel;
}
