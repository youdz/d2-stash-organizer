import { grailProgress } from "../../scripts/grail/list/grailProgress";
import { useContext, useMemo, useState } from "preact/hooks";
import { JSX } from "preact";
import "./GrailTracker.css";
import { CollectionContext } from "../store/CollectionContext";
import { GrailSummary } from "./GrailSummary";

const TIER_NAMES = ["Normal", "Exceptional", "Elite"];

const toClassName = (b: boolean) => (b ? "found" : "missing");

export function GrailTracker() {
  const { allItems } = useContext(CollectionContext);
  const [filter, setFilter] = useState("all");

  const progress = useMemo(() => grailProgress(allItems), [allItems]);

  const sections = useMemo(() => {
    const sections: JSX.Element[] = [];
    for (const [section, tiers] of progress) {
      tiers.forEach((tier, i) => {
        const items = [];
        for (const { item, normal, ethereal, perfect } of tier) {
          if (
            (normal && filter === "missing") ||
            (perfect && filter === "perfect") ||
            ((typeof ethereal === "undefined" || ethereal) &&
              filter === "ethereal")
          ) {
            continue;
          }
          items.push(
            <tr>
              <th scope="row" class={"set" in item ? "set" : "unique"}>
                {item.name}
              </th>
              <td class={toClassName(normal)}>Normal</td>
              {typeof ethereal === "undefined" ? (
                <td>
                  <span aria-label="Not applicable" />
                </td>
              ) : (
                <td class={toClassName(ethereal)}>Ethereal</td>
              )}
              <td class={toClassName(perfect)}>Perfect</td>
            </tr>
          );
        }
        if (items.length === 0) {
          return;
        }
        const sectionName =
          tiers.length > 1 ? `${TIER_NAMES[i]} ${section.name}` : section.name;
        sections.push(
          <tbody>
            <tr>
              <td colSpan={4}>{sectionName}</td>
            </tr>
            {items}
          </tbody>
        );
      });
    }
    return sections;
  }, [filter, progress]);

  return (
    <>
      <div class="controls">
        <GrailSummary />
        <div>
          <p>
            <label for="grail-filter">Show:</label>
          </p>
          <p>
            <select
              id="grail-filter"
              value={filter}
              onChange={({ currentTarget }) => setFilter(currentTarget.value)}
            >
              <option value="all">All items</option>
              <option value="missing">Missing items</option>
              <option value="ethereal">Missing ethereal items</option>
              <option value="perfect">Missing perfect items</option>
            </select>
          </p>
        </div>
      </div>
      <table id="grail-tracker">{sections}</table>
    </>
  );
}
