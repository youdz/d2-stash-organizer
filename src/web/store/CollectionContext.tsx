import { createContext, RenderableProps } from "preact";
import { Stash } from "../../scripts/stash/types";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { getSavedStashes } from "./store";
import { Item } from "../../scripts/items/types/Item";
import { getAllItems } from "../../scripts/stash/getAllItems";
import { characterName } from "../../scripts/stash/characterName";

interface Collection {
  characters: Map<
    string,
    {
      stash: Stash;
    }
  >;
  allItems: Item[];
}

export interface CollectionContextValue extends Collection {
  setCollection: (stashes: Stash[]) => void;
  setSingleStash: (stash: Stash) => void;
}

export const CollectionContext = createContext<CollectionContextValue>({
  characters: new Map(),
  allItems: [],
  setCollection: () => undefined,
  setSingleStash: () => undefined,
});

export function CollectionProvider({ children }: RenderableProps<unknown>) {
  const [collection, setInternalCollection] = useState<Collection>({
    characters: new Map(),
    allItems: [],
  });

  const setCollection = useCallback((stashes: Stash[]) => {
    const characters = new Map(
      stashes
        .map((stash) => [characterName(stash), { stash }] as const)
        .sort(([a], [b]) => a.localeCompare(b))
    );
    const allItems = stashes.flatMap((stash) => getAllItems(stash));
    setInternalCollection({ characters, allItems });
  }, []);

  const setSingleStash = useCallback((stash: Stash) => {
    setInternalCollection((previous) => {
      const characters = new Map(previous.characters);
      characters.set(characterName(stash), { stash });
      const allItems = Array.from(characters.values()).flatMap(({ stash }) =>
        getAllItems(stash)
      );
      return { characters, allItems };
    });
  }, []);

  const value = useMemo(
    () => ({ ...collection, setCollection, setSingleStash }),
    [collection, setCollection, setSingleStash]
  );

  // Initialize with the stash found in storage
  useEffect(() => {
    getSavedStashes()
      .then((stashes) => Promise.all(stashes).then(setCollection))
      .catch(() => undefined);
  }, [setCollection]);

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
}
