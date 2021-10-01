import {
  isStash,
  ItemsOwner,
  SHARED_STASH_NAME,
} from "../../scripts/save-file/ownership";
import { PrettyOwnerName } from "./PrettyOwnerName";
import { useContext, useMemo, useState } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import "./OwnerSelector.css";
import { Stash } from "../../scripts/stash/types";

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
  const [newStash] = useState<Stash>(() => ({
    filename: "SharedStash.d2x",
    lastModified: Date.now(),
    personal: false,
    nonPlugY: true,
    gold: 0,
    pageFlags: true,
    pages: [],
  }));

  const sharedStashExists = useMemo(
    () => owners.some((owner) => isStash(owner) && owner.nonPlugY),
    [owners]
  );

  let possible = owners;
  if (onlyStashes) {
    possible = owners.filter(isStash);
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
