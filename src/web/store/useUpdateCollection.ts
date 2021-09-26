import { toSaveFile } from "./parser";
import { getSavedStashes, writeAllFiles, writeSaveFile } from "./store";
import { downloadAllFiles, downloadFile } from "./downloader";
import { useCallback, useContext } from "preact/hooks";
import { CollectionContext } from "./CollectionContext";
import { ItemsOwner } from "../../scripts/save-file/ownership";
import { SelectionContext } from "../transfer/SelectionContext";

export function useUpdateCollection() {
  const { owners, setCollection, setSingleFile } =
    useContext(CollectionContext);
  const { resetSelection } = useContext(SelectionContext);

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

  const rollback = useCallback(() => {
    resetSelection();
    return getSavedStashes()
      .then((stashes) => Promise.all(stashes).then(setCollection))
      .catch(() => undefined);
  }, [resetSelection, setCollection]);

  return { updateAllFiles, updateSingleFile, rollback };
}
