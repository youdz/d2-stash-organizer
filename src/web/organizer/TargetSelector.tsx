import { StateUpdater, useContext } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import { numberInputChangeHandler } from "./numberInputChangeHandler";

export interface TargetSelectorProps {
  target: string;
  setTarget: StateUpdater<string>;
  emptyPages: number;
  setEmptyPages: StateUpdater<number>;
}

export function TargetSelector({
  target,
  setTarget,
  emptyPages,
  setEmptyPages,
}: TargetSelectorProps) {
  const { characters } = useContext(CollectionContext);

  return (
    <>
      Move them to{" "}
      <select
        id="character-select"
        value={target}
        onChange={({ currentTarget }) => setTarget(currentTarget.value)}
      >
        {Array.from(characters.keys()).map((name) => (
          <option value={name}>
            {name ? `${name}'s stash` : "Shared stash"}
          </option>
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
