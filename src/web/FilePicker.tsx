import { getStash, saveStash } from "./utils/stash";
import { Stash } from "../scripts/stash/types";
import { useCallback, useRef } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import TargetedEvent = JSXInternal.TargetedEvent;

export interface FilePickerProps {
  onChange?: (stash: Stash) => void;
}

export function FilePicker({ onChange }: FilePickerProps) {
  const input = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    async ({ currentTarget }: TargetedEvent<HTMLInputElement>) => {
      const file = currentTarget.files?.[0];
      if (file) {
        const parsed = await saveStash(file);
        onChange?.(parsed);
      }
    },
    [onChange]
  );

  return (
    <div>
      <button class="button" onClick={() => input.current.click()}>
        {!getStash() ? "Upload" : "Update"} my stash
      </button>
      <input
        class="hidden"
        ref={input}
        type="file"
        accept=".sss"
        onChange={handleChange}
      />
    </div>
  );
}
