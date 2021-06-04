import { FilePicker } from "./FilePicker";
import { Stash } from "../scripts/stash/types";
import "./Actions.css";
import { useCallback, useState } from "preact/hooks";
import { organize } from "../scripts/grail/organize";
import { saveStash } from "./stash";
import { JSXInternal } from "preact/src/jsx";
import { GrailSummary } from "./GrailSummary";

export interface ActionsProps {
  grailTracker: boolean;
  stash: Stash | null;
  onStashChange: (stash: Stash) => void;
  filter: string;
  setFilter: (value: string) => void;
}

function numberInputChangeHandler(callback: (value: number) => void) {
  return function (event: JSXInternal.TargetedEvent<HTMLInputElement>) {
    callback(Number((event.target as HTMLInputElement).value));
  };
}

export function Actions({
  grailTracker,
  stash,
  onStashChange,
  filter,
  setFilter,
}: ActionsProps) {
  const [skipPages, setSkipPages] = useState(1);
  const [emptyPages, setEmptyPages] = useState(0);

  const handleOrganize = useCallback(async () => {
    if (stash) {
      organize(stash, skipPages, emptyPages);
      const clone = { ...stash };
      await saveStash(clone);
      onStashChange(clone);
    }
  }, [stash, skipPages, emptyPages, onStashChange]);

  return (
    <>
      <div id="action-bar">
        <FilePicker onChange={onStashChange} />
        {!grailTracker && stash && (
          <>
            <button class="button" disabled={!stash} onClick={handleOrganize}>
              Organize my stash
            </button>
            <a class="button" href="#grail-tracker">
              See my Grail
            </a>
          </>
        )}
        {grailTracker && stash && (
          <a class="button" href="#stash">
            See my stash
          </a>
        )}
      </div>
      {!grailTracker && stash && (
        <div id="controls">
          <div id="organize-params">
            <p>When organizing:</p>
            <p>
              <label>
                Do not touch the first{" "}
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={skipPages}
                  onChange={numberInputChangeHandler(setSkipPages)}
                />{" "}
                page{skipPages === 1 ? "" : "s"}.
              </label>
            </p>
            <p>
              <label>
                Leave{" "}
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={emptyPages}
                  onChange={numberInputChangeHandler(setEmptyPages)}
                />{" "}
                empty page{emptyPages === 1 ? "" : "s"} at the start.
              </label>
            </p>
          </div>
          <div id="grail-summary">
            <GrailSummary stash={stash} />
          </div>
          <div id="filter">
            <p>
              <label for="filter-input">Search for an item or a page:</label>
            </p>
            <p>
              <input
                id="filter-input"
                type="text"
                value={filter}
                onInput={({ currentTarget }) => setFilter(currentTarget.value)}
              />
            </p>
          </div>
        </div>
      )}
    </>
  );
}
