import { stashFromFile, writeAllFiles, writeStashFile } from "../store/store";
import { RenderableProps } from "preact";
import { useCallback, useContext, useRef } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";

export interface FilePickerProps {
  folder: boolean;
}

export function FilePicker({
  folder,
  children,
}: RenderableProps<FilePickerProps>) {
  const { setCollection, setSingleFile } = useContext(CollectionContext);
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
      if (folder) {
        await writeAllFiles(usableFiles);
        setCollection(
          await Promise.all(usableFiles.map((file) => stashFromFile(file)))
        );
      } else {
        const file = usableFiles[0];
        await writeStashFile(file);
        setSingleFile(await stashFromFile(file));
      }
      // Clear the input so we can re-upload the same file later.
      input.current.value = "";
    }
  }, [folder, setCollection, setSingleFile]);

  const inputAttrs = folder
    ? { directory: true, webkitdirectory: true, multiple: true }
    : { accept: ".sss,.d2x" };

  return (
    <span class="filepicker">
      <button
        class={folder ? "button" : "button danger"}
        onClick={() => input.current?.click()}
      >
        {children}
      </button>
      <input
        class="hidden"
        ref={input}
        type="file"
        {...inputAttrs}
        onChange={handleChange}
      />
    </span>
  );
}
