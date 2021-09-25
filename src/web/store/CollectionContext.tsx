import { createContext, RenderableProps } from "preact";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { getSavedStashes } from "./store";
import { Item } from "../../scripts/items/types/Item";
import { getAllItems } from "../../scripts/stash/getAllItems";
import { ItemsOwner, ownerName } from "../../scripts/save-file/ownership";

interface Collection {
  owners: ItemsOwner[];
  allItems: Item[];
}

export interface CollectionContextValue extends Collection {
  setCollection: (owners: ItemsOwner[]) => void;
  setSingleFile: (owner: ItemsOwner) => void;
}

export const CollectionContext = createContext<CollectionContextValue>({
  owners: [],
  allItems: [],
  setCollection: () => undefined,
  setSingleFile: () => undefined,
});

export function CollectionProvider({ children }: RenderableProps<unknown>) {
  const [collection, setInternalCollection] = useState<Collection>({
    owners: [],
    allItems: [],
  });

  const setCollection = useCallback((owners: ItemsOwner[]) => {
    owners.sort((a, b) => ownerName(a).localeCompare(ownerName(b)));
    // FIXME: items are duplicated between the character file and the first page of the PlugY stash!
    const allItems = owners.flatMap((owner) => getAllItems(owner));
    setInternalCollection({ owners, allItems });
  }, []);

  const setSingleFile = useCallback((owner: ItemsOwner) => {
    setInternalCollection((previous) => {
      const newOwners = [...previous.owners];
      const existing = newOwners.findIndex(
        (o) => o.filename === owner.filename
      );
      if (existing >= 0) {
        newOwners.splice(existing, 1, owner);
      } else {
        newOwners.push(owner);
      }
      const allItems = newOwners.flatMap((o) => getAllItems(o));
      return { owners: newOwners, allItems };
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
