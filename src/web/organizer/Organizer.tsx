import { useCallback, useContext, useState } from "preact/hooks";
import { StashContext } from "../store/stashContext";
import { JSXInternal } from "preact/src/jsx";
import { organize } from "../../scripts/grail/organize";
import { downloadStash, stashToFile, writeStashFile } from "../store/store";

function numberInputChangeHandler(callback: (value: number) => void) {
  return function (event: JSXInternal.TargetedEvent<HTMLInputElement>) {
    callback(Number((event.target as HTMLInputElement).value));
  };
}

export function Organizer() {
  const { stash, setStash } = useContext(StashContext);
  const [skipPages, setSkipPages] = useState(1);
  const [emptyPages, setEmptyPages] = useState(0);

  const handleOrganize = useCallback(async () => {
    if (stash) {
      try {
        const clone = { ...stash };
        organize(clone, skipPages, emptyPages);
        const file = stashToFile(clone);
        await writeStashFile(file);
        setStash(clone);
        downloadStash(file);
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message);
        }
        throw e;
      }
    }
  }, [stash, skipPages, emptyPages, setStash]);

  return (
    <>
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
      <p>
        <button class="button" disabled={!stash} onClick={handleOrganize}>
          Organize my stash
        </button>
      </p>
    </>
  );
}
