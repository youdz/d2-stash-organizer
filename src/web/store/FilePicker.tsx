import { stashFromFile, writeAllFiles } from "./store";
import { useCallback, useContext, useRef } from "preact/hooks";
import { CollectionContext } from "./CollectionContext";

export function FilePicker() {
  const { characters, setCollection } = useContext(CollectionContext);
  const input = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(async () => {
    if (input.current?.files) {
      const usableFiles = [];
      for (const file of input.current.files) {
        // Only use the root files in case there is a backup folder
        if (file.webkitRelativePath.split("/").length > 2) {
          continue;
        }
        if (file.name.endsWith(".sss") || file.name.endsWith(".d2x")) {
          usableFiles.push(file);
        }
      }
      await writeAllFiles(usableFiles);
      setCollection(
        await Promise.all(usableFiles.map((file) => stashFromFile(file)))
      );
      // Clear the input so we can re-upload the same file later.
      input.current.value = "";
    }
  }, [setCollection]);

  return (
    <span id="filepicker">
      <button class="button" onClick={() => input.current?.click()}>
        {characters.size === 0 ? "Upload" : "Update"} my save files
      </button>
      <input
        class="hidden"
        ref={input}
        type="file"
        accept=".sss,.d2x"
        // @ts-expect-error FIXME
        directory
        webkitdirectory
        multiple
        onChange={handleChange}
      />
    </span>
  );
}
