import { isStash, ItemsOwner } from "../../scripts/save-file/ownership";
import { PrettyOwnerName } from "./PrettyOwnerName";
import { useContext } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import "./OwnerSelector.css";

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
  let { owners } = useContext(CollectionContext);

  if (onlyStashes) {
    owners = owners.filter(isStash);
  }

  return (
    <ul class="owner-selector">
      {owners.map((owner) => (
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
    </ul>
  );
}
