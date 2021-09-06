import { useCallback, useContext, useMemo, useState } from "preact/hooks";
import { CollectionContext } from "../store/CollectionContext";
import { JSXInternal } from "preact/src/jsx";
import { organize } from "../../scripts/grail/organize";
import { downloadStash, stashToFile, writeAllFiles } from "../store/store";
import { ExternalLink } from "../routing/ExternalLink";
import "./Organizer.css";
import { deletePages } from "../../scripts/stash/deletePages";
import { Item } from "../../scripts/items/types/Item";

function numberInputChangeHandler(callback: (value: number) => void) {
  return function (event: JSXInternal.TargetedEvent<HTMLInputElement>) {
    callback(Number((event.target as HTMLInputElement).value));
  };
}

export function Organizer() {
  const { characters, setCollection } = useContext(CollectionContext);

  const [sources, setSources] = useState<Record<string, boolean | undefined>>({
    "": true,
  });
  const [skipPages, setSkipPages] = useState<
    Record<string, number | undefined>
  >({ "": 1 });

  const [target, setTarget] = useState("");
  const [emptyPages, setEmptyPages] = useState(0);

  const sourcesSelector = useMemo(() => {
    const listItems = [];
    for (const name of characters.keys()) {
      listItems.push(
        <li>
          <label>
            <input
              type="checkbox"
              checked={sources[name]}
              onChange={() =>
                setSources((previous) => ({
                  ...previous,
                  [name]: !previous[name],
                }))
              }
            />{" "}
            {name ? (
              <>
                <span class="unique">{name}</span>'s stash
              </>
            ) : (
              <span class="magic">Shared stash</span>
            )}
          </label>
          , except the first{" "}
          <input
            type="number"
            min={0}
            max={99}
            value={skipPages[name] ?? 0}
            onChange={numberInputChangeHandler((value) =>
              setSkipPages((previous) => ({ ...previous, [name]: value }))
            )}
          />{" "}
          pages.
        </li>
      );
    }
    return listItems;
  }, [characters, sources, skipPages]);

  const targetSelector = useMemo(() => {
    const options = [];
    for (const name of characters.keys()) {
      options.push(
        <option value={name}>
          {name ? `${name}'s stash` : "Shared stash"}
        </option>
      );
    }
    return options;
  }, [characters]);

  const targetStash = characters.get(target)?.stash;

  const handleOrganize = useCallback(async () => {
    if (!targetStash) {
      return;
    }
    try {
      // TODO: backup before doing all this, to roll back if failed
      const fromOtherSources: Item[] = [];
      for (const [character, { stash }] of characters.entries()) {
        if (character !== target && sources[character]) {
          fromOtherSources.push(
            ...deletePages(stash, skipPages[character] ?? 0)
          );
        }
      }
      organize(targetStash, fromOtherSources, skipPages[target], emptyPages);

      const saveFiles = [];
      for (const [character, { stash }] of characters.entries()) {
        saveFiles.push(stashToFile(stash));
      }
      await writeAllFiles(saveFiles);
      // Set the state to force a re-render of the app.
      setCollection(Array.from(characters.values()).map(({ stash }) => stash));
      // TODO: download
      // downloadStash(file);
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
      throw e;
    }
  }, [
    characters,
    emptyPages,
    setCollection,
    skipPages,
    sources,
    target,
    targetStash,
  ]);

  // Doesn't do anything right now, since we only read PlugY stash files
  if (!characters.has("")) {
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
    <ol id="organizer">
      <li>
        Take all items from:
        <ul id="sources-selector">{sourcesSelector}</ul>
      </li>
      <li>
        Move them to{" "}
        <select
          id="character-select"
          value={target}
          onChange={({ currentTarget }) => setTarget(currentTarget.value)}
        >
          {targetSelector}
        </select>
        , leaving{" "}
        <input
          type="number"
          min={0}
          max={99}
          value={emptyPages}
          onChange={numberInputChangeHandler(setEmptyPages)}
        />{" "}
        empty page{emptyPages === 1 ? "" : "s"} at the start
      </li>
      <li>
        <button class="button" disabled={!targetStash} onClick={handleOrganize}>
          Organize my items
        </button>
      </li>
    </ol>
  );
}
