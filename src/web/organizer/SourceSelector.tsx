import { StateUpdater, useCallback, useContext, useEffect } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import { numberInputChangeHandler } from "./numberInputChangeHandler";
import { PrettyOwnerName } from "../save-files/PrettyOwnerName";
import { isStash } from "../../scripts/save-file/ownership";

export type OrganizerSources = Array<
  | {
      selected: boolean;
      skipPages: number;
    }
  | undefined
>;

export interface SourceSelectorProps {
  sources: OrganizerSources;
  setSources: StateUpdater<OrganizerSources>;
  targetIndex: number;
}

export function SourceSelector({
  sources,
  setSources,
  targetIndex,
}: SourceSelectorProps) {
  const { owners } = useContext(CollectionContext);

  const toggleSelected = useCallback(
    (index: number, value?: boolean) => {
      setSources((previous) => {
        const newSources = [...previous];
        newSources[index] = {
          selected:
            typeof value === "undefined" ? !previous[index]?.selected : value,
          skipPages: previous[index]?.skipPages ?? 0,
        };
        return newSources;
      });
    },
    [setSources]
  );

  const changeSkipPages = useCallback(
    (index: number, value: number) => {
      setSources((previous) => {
        const newSources = [...previous];
        newSources[index] = {
          selected: !!previous[index]?.selected,
          skipPages: value,
        };
        return newSources;
      });
    },
    [setSources]
  );

  // Force the target to always be selected as a source
  useEffect(() => {
    if (!sources[targetIndex]?.selected) {
      toggleSelected(targetIndex, true);
    }
  }, [sources, targetIndex, toggleSelected]);

  return (
    <>
      Take all items from:
      <ul id="sources-selector">
        {owners.map((owner, i) => (
          <li>
            <label>
              <input
                type="checkbox"
                checked={!!sources[i]?.selected}
                disabled={i === targetIndex}
                onChange={() => toggleSelected(i)}
              />{" "}
              <PrettyOwnerName owner={owner} />
            </label>
            {/* TODO: Make this much clearer for non-stash */}
            {isStash(owner) && (
              <>
                , except the first{" "}
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={sources[i]?.skipPages ?? 0}
                  onChange={numberInputChangeHandler((value) =>
                    changeSkipPages(i, value)
                  )}
                />{" "}
                pages.
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
