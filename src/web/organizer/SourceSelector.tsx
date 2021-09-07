import { StateUpdater, useCallback, useContext, useEffect } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import { numberInputChangeHandler } from "./numberInputChangeHandler";

export type OrganizerSources = Record<
  string,
  | {
      selected: boolean;
      skipPages: number;
    }
  | undefined
>;

export interface SourceSelectorProps {
  sources: OrganizerSources;
  setSources: StateUpdater<OrganizerSources>;
  target: string;
}

export function SourceSelector({
  sources,
  setSources,
  target,
}: SourceSelectorProps) {
  const { owner } = useContext(CollectionContext);

  const toggleSelected = useCallback(
    (source: string, value?: boolean) => {
      setSources((previous) => ({
        ...previous,
        [source]: {
          selected:
            typeof value === "undefined" ? !previous[source]?.selected : value,
          skipPages: previous[source]?.skipPages ?? 0,
        },
      }));
    },
    [setSources]
  );

  // Force the target to always be selected as a source
  useEffect(() => {
    if (!sources[target]?.selected) {
      toggleSelected(target, true);
    }
  }, [sources, target, toggleSelected]);

  return (
    <>
      Take all items from:
      <ul id="sources-selector">
        {Array.from(owner.keys()).map((name) => (
          <li>
            <label>
              <input
                type="checkbox"
                checked={!!sources[name]?.selected}
                disabled={name === target}
                onChange={() => toggleSelected(name)}
              />{" "}
              {name ? (
                <>
                  <span class="unique">{name}</span>'s stash
                </>
              ) : (
                <span class="magic">Shared stash</span>
              )}
            </label>
            , except the first{" "}
            <input
              type="number"
              min={0}
              max={99}
              value={sources[name]?.skipPages ?? 0}
              onChange={numberInputChangeHandler((value) =>
                setSources((previous) => ({
                  ...previous,
                  [name]: {
                    selected: !!previous[name]?.selected,
                    skipPages: value,
                  },
                }))
              )}
            />{" "}
            pages.
          </li>
        ))}
      </ul>
    </>
  );
}
