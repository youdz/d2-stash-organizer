import { stashFromFile, writeStashFile } from "./utils/store";
import { Stash } from "../scripts/stash/types";
import { useCallback, useRef } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import TargetedEvent = JSXInternal.TargetedEvent;

export interface FilePickerProps {
  stash: Stash | undefined;
  onChange?: (stash: Stash) => void;
}

export function FilePicker({ stash, onChange }: FilePickerProps) {
  const input = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    async ({ currentTarget }: TargetedEvent<HTMLInputElement>) => {
      const file = currentTarget.files?.[0];
      if (file) {
        await writeStashFile(file);
        const parsed = await stashFromFile(file);
        onChange?.(parsed);
      }
    },
    [onChange]
  );

  return (
    <div>
      <button class="button" onClick={() => input.current.click()}>
        {!stash ? "Upload" : "Update"} my stash
      </button>
      <input
        class="hidden"
        ref={input}
        type="file"
        accept=".sss,.d2x"
        onChange={handleChange}
      />
    </div>
  );
}
