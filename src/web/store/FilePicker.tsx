import { stashFromFile, writeStashFile } from "./store";
import { useCallback, useContext, useRef } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import "./FilePicker.css";
import { StashContext } from "./stashContext";
import TargetedEvent = JSXInternal.TargetedEvent;

export function FilePicker() {
  const { stash, setStash } = useContext(StashContext);
  const input = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    async ({ currentTarget }: TargetedEvent<HTMLInputElement>) => {
      const file = currentTarget.files?.[0];
      if (file) {
        await writeStashFile(file);
        const parsed = await stashFromFile(file);
        setStash(parsed);
        // Clear the input so we can re-upload the same file later.
        currentTarget.value = "";
      }
    },
    [setStash]
  );

  return (
    <span id="filepicker">
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
    </span>
  );
}
