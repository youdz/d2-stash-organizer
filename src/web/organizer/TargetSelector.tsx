import { StateUpdater, useContext } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import { numberInputChangeHandler } from "./numberInputChangeHandler";
import { isStash, ownerName } from "../../scripts/save-file/ownership";

export interface TargetSelectorProps {
  targetIndex: number;
  setTargetIndex: StateUpdater<number>;
  emptyPages: number;
  setEmptyPages: StateUpdater<number>;
}

export function TargetSelector({
  targetIndex,
  setTargetIndex,
  emptyPages,
  setEmptyPages,
}: TargetSelectorProps) {
  const { owners } = useContext(CollectionContext);

  return (
    <>
      Move them to{" "}
      <select
        id="character-select"
        value={targetIndex}
        onChange={({ currentTarget }) =>
          setTargetIndex(Number(currentTarget.value))
        }
      >
        {owners.filter(isStash).map((stash, i) => (
          <option value={i}>{ownerName(stash)}</option>
        ))}
      </select>
      , leaving{" "}
      <input
        type="number"
        min={0}
        max={99}
        value={emptyPages}
        onChange={numberInputChangeHandler(setEmptyPages)}
      />{" "}
      empty page{emptyPages === 1 ? "" : "s"} at the start.
    </>
  );
}
