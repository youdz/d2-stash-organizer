import { useContext, useMemo } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import { FilePicker } from "../store/FilePicker";
import "./SaveFiles.css";

const dateFormatter = Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
  timeStyle: "medium",
});

export function SaveFiles() {
  const { characters } = useContext(CollectionContext);

  const charactersDetail = useMemo(() => {
    const details = [];
    for (const [name, { stash }] of characters.entries()) {
      details.push(
        <tr>
          <td class={name ? "unique" : "magic"}>{name || "Shared stash"}</td>
          <td>{dateFormatter.format(new Date(stash.lastModified))}</td>
        </tr>
      );
    }
    return details;
  }, [characters]);

  return (
    <>
      <p class="sidenote">
        Simply select your Diablo 2 save folder, and this tool will detect all
        items on every character and in every stash.
      </p>
      <p>
        <FilePicker />
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
