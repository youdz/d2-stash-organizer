import { useCallback, useContext, useState } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import { organize } from "../../scripts/grail/organize";
import { ExternalLink } from "../routing/ExternalLink";
import "./Organizer.css";
import { numberInputChangeHandler } from "./numberInputChangeHandler";
import { OwnerSelector } from "../save-files/OwnerSelector";
import { useUpdateCollection } from "../store/useUpdateCollection";
import { isStash, ItemsOwner } from "../../scripts/save-file/ownership";
import { updateCharacterStashes } from "../store/plugyDuplicates";

export function Organizer() {
  const { lastActivePlugyStashPage, hasPlugY } = useContext(CollectionContext);
  const { updateSingleFile, rollback } = useUpdateCollection();

  const [stash, setStash] = useState<ItemsOwner>();
  const [skipPages, setSkipPages] = useState(1);
  const [emptyPages, setEmptyPages] = useState(0);

  const handleOrganize = useCallback(async () => {
    if (stash && isStash(stash)) {
      try {
        organize(stash, [], skipPages, emptyPages);
        if (lastActivePlugyStashPage) {
          updateCharacterStashes(lastActivePlugyStashPage);
        }
        await updateSingleFile(stash);
      } catch (e) {
        if (e instanceof Error) {
          await rollback();
          setStash(undefined);
          alert(e.message);
        } else {
          throw e;
        }
      }
    }
  }, [emptyPages, skipPages, stash, updateSingleFile, rollback]);

  if (!hasPlugY) {
    return (
      <p>
        This feature requires{" "}
        <ExternalLink href="http://plugy.free.fr/">
          PlugY's extended stash
        </ExternalLink>
        . It allows you to organize your collection across hundreds of pages in
        just one click, whether in the shared stash or in a character's personal
        stash.
      </p>
    );
  }

  return (
    <>
      <p>Select a stash to organize:</p>
      <OwnerSelector selected={stash} onChange={setStash} onlyStashes={true} />
      <p>
        <label>
          Do not touch the first{" "}
          <input
            type="number"
            min={0}
            max={99}
            value={skipPages}
            onChange={numberInputChangeHandler(setSkipPages)}
          />{" "}
          page{skipPages === 1 ? "" : "s"}.
        </label>
      </p>
      <p>
        <label>
          Leave{" "}
          <input
            type="number"
            min={0}
            max={99}
            value={emptyPages}
            onChange={numberInputChangeHandler(setEmptyPages)}
          />{" "}
          empty page{emptyPages === 1 ? "" : "s"} at the start.
        </label>
      </p>
      <p>
        <button class="button" disabled={!stash} onClick={handleOrganize}>
          Organize my stash
        </button>
      </p>
    </>
  );
}
