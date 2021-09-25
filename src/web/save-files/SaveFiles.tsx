import { useContext, useMemo, useState } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import { FilePicker } from "./FilePicker";
import "./SaveFiles.css";
import { UPLOAD_CONFIRM } from "../store/singleStashConfirmation";
import { isStash, ownerName } from "../../scripts/save-file/ownership";

const dateFormatter = Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
  timeStyle: "medium",
});

export function SaveFiles() {
  const { owners } = useContext(CollectionContext);
  const [allowSingleFile, setAllowSingleFile] = useState(false);

  const charactersDetail = useMemo(() => {
    const details = [];
    for (const owner of owners) {
      details.push(
        <tr>
          <td class={isStash(owner) && !owner.personal ? "magic" : "unique"}>
            {ownerName(owner)}
          </td>
          <td>{dateFormatter.format(new Date(owner.lastModified))}</td>
        </tr>
      );
    }
    return details;
  }, [owners]);

  return (
    <>
      <p class="sidenote">
        Simply select your Diablo 2 save folder, and this tool will detect all
        items on every character and in every stash.
      </p>
      <p>
        <FilePicker folder={true}>
          {owners.length === 0 ? "Upload" : "Refresh"} all my save files
        </FilePicker>
        {!allowSingleFile && (
          <button
            class="button sidenote"
            onClick={() =>
              window.confirm(UPLOAD_CONFIRM) && setAllowSingleFile(true)
            }
          >
            Let me select a single file
          </button>
        )}
        {allowSingleFile && (
          <FilePicker folder={false}>
            {owners.length === 0 ? "Upload" : "Update"} a single stash
          </FilePicker>
        )}
      </p>
      <table id="save-files">
        <tr>
          <th>Character name</th>
          <th>Save date</th>
        </tr>
        {charactersDetail}
      </table>
    </>
  );
}
