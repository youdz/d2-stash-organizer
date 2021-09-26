import { toSaveFile } from "./parser";
import { writeAllFiles, writeSaveFile } from "./store";
import { downloadAllFiles, downloadFile } from "./downloader";
import { useCallback, useContext } from "preact/hooks";
import { CollectionContext } from "./CollectionContext";
import { ItemsOwner } from "../../scripts/save-file/ownership";

export function useUpdateCollection() {
  const { owners, setCollection, setSingleFile } =
    useContext(CollectionContext);

  const updateAllFiles = useCallback(
    async function () {
      const saveFiles = owners.map((owner) => toSaveFile(owner));
      await writeAllFiles(saveFiles);
      await downloadAllFiles(saveFiles);
      // Set the state to force a re-render of the app.
      setCollection(owners);
    },
    [owners, setCollection]
  );

  const updateSingleFile = useCallback(
    async function (owner: ItemsOwner) {
      const saveFile = toSaveFile(owner);
      await writeSaveFile(saveFile);
      downloadFile(saveFile, saveFile.name);
      // Set the state to force a re-render of the app.
      setSingleFile(owner);
    },
    [setSingleFile]
  );

  return { updateAllFiles, updateSingleFile };
}
