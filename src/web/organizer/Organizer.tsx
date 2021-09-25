import { useCallback, useContext, useState } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import { organize } from "../../scripts/grail/organize";
import {
  downloadAllFiles,
  downloadStash,
  stashToFile,
  writeAllFiles,
} from "../store/store";
import { ExternalLink } from "../routing/ExternalLink";
import "./Organizer.css";
import { deletePages } from "../../scripts/stash/deletePages";
import { Item } from "../../scripts/items/types/Item";
import { DOWNLOAD_CONFIRM } from "../store/singleStashConfirmation";
import { OrganizerSources, SourceSelector } from "./SourceSelector";
import { TargetSelector } from "./TargetSelector";
import { isStash } from "../../scripts/save-file/ownership";

export function Organizer() {
  const { owners, setCollection } = useContext(CollectionContext);

  const [sources, setSources] = useState<OrganizerSources>({
    "": { selected: true, skipPages: 1 },
  });

  const [target, setTarget] = useState("");
  const [emptyPages, setEmptyPages] = useState(0);

  const targetStash = owners.get(target);

  const handleOrganize = useCallback(
    async (singleStash?: boolean) => {
      if (!targetStash || !isStash(targetStash)) {
        return;
      }
      try {
        // TODO: backup before doing all this, to roll back if failed
        const fromOtherSources: Item[] = [];
        if (!singleStash) {
          for (const [name, owner] of owners.entries()) {
            // TODO: take items from characters
            if (!isStash(owner)) {
              continue;
            }
            if (name !== target && sources[name]?.selected) {
              fromOtherSources.push(
                ...deletePages(owner, sources[name]?.skipPages ?? 0)
              );
            }
          }
        }

        organize(
          targetStash,
          fromOtherSources,
          sources[target]?.skipPages,
          emptyPages
        );

        const saveFiles = [];
        let targetFile: File | undefined;
        for (const [name, owner] of owners.entries()) {
          // TODO
          if (!isStash(owner)) {
            continue;
          }
          const file = stashToFile(owner);
          saveFiles.push(file);
          if (name === target) {
            targetFile = file;
          }
        }
        await writeAllFiles(saveFiles);
        // Set the state to force a re-render of the app.
        setCollection(Array.from(owners.values()));
        if (singleStash && targetFile) {
          downloadStash(targetFile, targetFile.name);
        } else {
          await downloadAllFiles(saveFiles);
        }
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message);
        }
        throw e;
      }
    },
    [owners, emptyPages, setCollection, sources, target, targetStash]
  );

  // Doesn't do anything right now, since we only read PlugY stash files
  if (!owners.has("")) {
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

  const nbSources = Object.values(sources).filter(
    (source) => source?.selected
  ).length;

  return (
    <ol id="organizer">
      <li>
        <SourceSelector
          sources={sources}
          setSources={setSources}
          target={target}
        />
      </li>
      <li>
        <TargetSelector
          target={target}
          setTarget={setTarget}
          emptyPages={emptyPages}
          setEmptyPages={setEmptyPages}
        />
      </li>
      <li>Organize the items for me.</li>
      <li>
        <button
          class="button"
          disabled={!targetStash}
          onClick={() => handleOrganize()}
        >
          Download updated save files
        </button>
        {targetStash && nbSources === 1 && sources[target]?.selected && (
          <button
            class="button danger"
            onClick={() =>
              window.confirm(DOWNLOAD_CONFIRM) && handleOrganize(true)
            }
          >
            Download a single stash
          </button>
        )}
      </li>
    </ol>
  );
}
