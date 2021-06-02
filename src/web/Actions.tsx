import { FilePicker } from "./FilePicker";
import { Stash } from "../scripts/stash/types";

export interface ActionsProps {
  stash: Stash | null;
  onSaveFileChange: (stash: Stash) => void;
  onOrganize: () => void;
}

export function Actions({ stash, onSaveFileChange, onOrganize }: ActionsProps) {
  return (
    <>
      <FilePicker onChange={onSaveFileChange} />
      <button class="button" disabled={!stash} onClick={onOrganize}>
        Organize my stash
      </button>
    </>
  );
}
