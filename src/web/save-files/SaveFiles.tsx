import { useContext, useMemo, useState } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import { FilePicker } from "./FilePicker";
import "./SaveFiles.css";
import { UPLOAD_CONFIRM } from "../store/singleStashConfirmation";

const dateFormatter = Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
  timeStyle: "medium",
});

export function SaveFiles() {
  const { owner } = useContext(CollectionContext);
  const [allowSingleFile, setAllowSingleFile] = useState(false);

  const charactersDetail = useMemo(() => {
    const details = [];
    for (const [name, { stash }] of owner.entries()) {
      details.push(
        <tr>
          <td class={name ? "unique" : "magic"}>{name || "Shared stash"}</td>
          <td>{dateFormatter.format(new Date(stash.lastModified))}</td>
        </tr>
      );
    }
    return details;
  }, [owner]);

  return (
    <>
      <p class="sidenote">
        Simply select your Diablo 2 save folder, and this tool will detect all
        items on every character and in every stash.
      </p>
      <p>
        <FilePicker folder={true}>
          {owner.size === 0 ? "Upload" : "Refresh"} all my save files
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
            {owner.size === 0 ? "Upload" : "Update"} a single stash
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
