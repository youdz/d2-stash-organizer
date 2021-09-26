import { useCallback, useContext, useState } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import { organize } from "../../scripts/grail/organize";
import { writeAllFiles } from "../store/store";
import { ExternalLink } from "../routing/ExternalLink";
import "./Organizer.css";
import { deletePages } from "../../scripts/stash/deletePages";
import { Item } from "../../scripts/items/types/Item";
import { DOWNLOAD_CONFIRM } from "../store/singleStashConfirmation";
import { OrganizerSources, SourceSelector } from "./SourceSelector";
import { TargetSelector } from "./TargetSelector";
import { isStash } from "../../scripts/save-file/ownership";
import { toSaveFile } from "../store/parser";
import { downloadAllFiles, downloadStash } from "../store/downloader";

export function Organizer() {
  const { owners, setCollection, hasPlugY } = useContext(CollectionContext);

  // TODO: initialize with the shared stash selected
  const [sources, setSources] = useState<OrganizerSources>([]);

  // TODO: initialize with the shared stash selected
  const [targetIndex, setTargetIndex] = useState(-1);
  const [emptyPages, setEmptyPages] = useState(0);

  // FIXME: transfers to personal stash when shared stash is selected
  const handleOrganize = useCallback(
    async (singleStash?: boolean) => {
      const target = owners[targetIndex];
      if (!target || !isStash(target)) {
        return;
      }
      try {
        // TODO: backup before doing all this, to roll back if failed
        const fromOtherSources: Item[] = [];
        if (!singleStash) {
          owners.forEach((owner, i) => {
            // TODO: take items from characters
            if (!isStash(owner)) {
              return;
            }
            if (i !== targetIndex && sources[i]?.selected) {
              fromOtherSources.push(
                ...deletePages(owner, sources[i]?.skipPages ?? 0)
              );
            }
          });
        }

        organize(
          target,
          fromOtherSources,
          sources[targetIndex]?.skipPages,
          emptyPages
        );

        let targetFile: File | undefined;
        const saveFiles = owners.map((owner, i) => {
          const file = toSaveFile(owner);
          if (i === targetIndex) {
            targetFile = file;
          }
          return file;
        });
        await writeAllFiles(saveFiles);
        // Set the collection to force a re-render of components that use it.
        setCollection(owners);
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
    [owners, emptyPages, setCollection, sources, targetIndex]
  );

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

  const nbSources = Object.values(sources).filter(
    (source) => source?.selected
  ).length;

  return (
    <ol id="organizer">
      <li>
        <SourceSelector
          sources={sources}
          setSources={setSources}
          targetIndex={targetIndex}
        />
      </li>
      <li>
        <TargetSelector
          targetIndex={targetIndex}
          setTargetIndex={setTargetIndex}
          emptyPages={emptyPages}
          setEmptyPages={setEmptyPages}
        />
      </li>
      <li>Organize the items for me.</li>
      <li>
        <button
          class="button"
          disabled={targetIndex < 0}
          onClick={() => handleOrganize()}
        >
          Download updated save files
        </button>
        {targetIndex >= 0 && nbSources === 1 && sources[targetIndex]?.selected && (
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
