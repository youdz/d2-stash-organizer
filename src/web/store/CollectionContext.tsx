import { createContext, RenderableProps } from "preact";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { getSavedStashes } from "./store";
import { Item } from "../../scripts/items/types/Item";
import { getAllItems } from "../../scripts/stash/getAllItems";
import { ItemsOwner, ownerName } from "../../scripts/save-file/ownership";

interface Collection {
  // TODO: can this just be an array?
  owner: Map<string, ItemsOwner>;
  allItems: Item[];
}

export interface CollectionContextValue extends Collection {
  setCollection: (owners: ItemsOwner[]) => void;
  setSingleFile: (owner: ItemsOwner) => void;
}

export const CollectionContext = createContext<CollectionContextValue>({
  owner: new Map(),
  allItems: [],
  setCollection: () => undefined,
  setSingleFile: () => undefined,
});

export function CollectionProvider({ children }: RenderableProps<unknown>) {
  const [collection, setInternalCollection] = useState<Collection>({
    owner: new Map(),
    allItems: [],
  });

  const setCollection = useCallback((owners: ItemsOwner[]) => {
    const characters = new Map(
      owners
        .map((owner) => [ownerName(owner), owner] as const)
        .sort(([a], [b]) => a.localeCompare(b))
    );
    const allItems = owners.flatMap((owner) => getAllItems(owner));
    setInternalCollection({ owner: characters, allItems });
  }, []);

  const setSingleFile = useCallback((owner: ItemsOwner) => {
    setInternalCollection((previous) => {
      const owners = new Map(previous.owner);
      owners.set(ownerName(owner), owner);
      const allItems = Array.from(owners.values()).flatMap((o) =>
        getAllItems(o)
      );
      return { owner: owners, allItems };
    });
  }, []);

  const value = useMemo(
    () => ({ ...collection, setCollection, setSingleFile }),
    [collection, setCollection, setSingleFile]
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
