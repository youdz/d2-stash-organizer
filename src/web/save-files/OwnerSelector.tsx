import {
  isPlugyStash,
  ItemsOwner,
  SHARED_STASH_NAME,
} from "../../scripts/save-file/ownership";
import { PrettyOwnerName } from "./PrettyOwnerName";
import { useContext, useMemo, useState } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import "./OwnerSelector.css";
import { PlugyStash } from "../../scripts/plugy-stash/types";
import { LAST_LEGACY } from "../../scripts/character/parsing/versions";

export interface OwnerSelectorProps {
  selected?: ItemsOwner;
  onChange(newSelected: ItemsOwner): void;
  onlyStashes?: boolean;
}

export function OwnerSelector({
  selected,
  onChange,
  onlyStashes,
}: OwnerSelectorProps) {
  const { owners, hasPlugY } = useContext(CollectionContext);

  // Using state so it's stable
  const [newStash] = useState<PlugyStash>(() => ({
    filename: "SharedStash.d2x",
    lastModified: Date.now(),
    version: LAST_LEGACY,
    personal: false,
    nonPlugY: true,
    gold: 0,
    pageFlags: true,
    pages: [],
  }));

  const sharedStashExists = useMemo(
    () => owners.some((owner) => isPlugyStash(owner) && owner.nonPlugY),
    [owners]
  );

  let possible = owners;
  if (onlyStashes) {
    possible = owners.filter(isPlugyStash);
  }

  return (
    <ul class="owner-selector">
      {possible.map((owner) => (
        <li>
          <label>
            <input
              type="radio"
              name="target"
              checked={selected === owner}
              onChange={() => onChange(owner)}
            />{" "}
            <PrettyOwnerName owner={owner} />
          </label>
        </li>
      ))}
      {!hasPlugY && !sharedStashExists && (
        <li>
          <label>
            <input
              type="radio"
              name="target"
              checked={selected === newStash}
              onChange={() => onChange(newStash)}
            />{" "}
            Create a new <span class="magic">{SHARED_STASH_NAME}</span> for me
          </label>
        </li>
      )}
    </ul>
  );
}
