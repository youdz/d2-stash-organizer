import { toSaveFile } from "./parser";
import { writeAllFiles } from "./store";
import { downloadAllFiles } from "./downloader";
import { useCallback, useContext } from "preact/hooks";
import { CollectionContext } from "./CollectionContext";

export function useUpdateCollection() {
  const { owners, setCollection } = useContext(CollectionContext);

  return useCallback(
    async function updateCollection() {
      const saveFiles = owners.map((owner) => toSaveFile(owner));
      await writeAllFiles(saveFiles);
      await downloadAllFiles(saveFiles);
      // Set the state to force a re-render of the app.
      setCollection(owners);
    },
    [owners, setCollection]
  );
}
