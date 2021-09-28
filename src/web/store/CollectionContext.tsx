import { createContext, RenderableProps } from "preact";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "preact/hooks";
import { getSavedStashes } from "./store";
import { Item } from "../../scripts/items/types/Item";
import { getAllItems } from "../../scripts/stash/getAllItems";
import {
  isStash,
  ItemsOwner,
  ownerName,
} from "../../scripts/save-file/ownership";
import { Character } from "../../scripts/character/types";
import { Stash } from "../../scripts/stash/types";
import { findDuplicates } from "./plugyDuplicates";
import { ItemStorageType } from "../../scripts/items/types/ItemLocation";
import { SelectionContext } from "../transfer/SelectionContext";

interface Collection {
  owners: ItemsOwner[];
  allItems: Item[];
  hasPlugY: boolean;
  /*
   * PlugY copies the last active stash page to the .d2s file on save, which results in duplicates for us.
   * If we find a PlugY stash for a character, we ignore the character's stash items.
   */
  lastActivePlugyStashPage?: Map<Character, [Stash, number]>;
}

export interface CollectionContextValue extends Collection {
  setCollection: (owners: ItemsOwner[]) => void;
  setSingleFile: (owner: ItemsOwner) => void;
}

export const CollectionContext = createContext<CollectionContextValue>({
  owners: [],
  allItems: [],
  hasPlugY: false,
  setCollection: () => undefined,
  setSingleFile: () => undefined,
});

function formatCollection(owners: ItemsOwner[]): Collection {
  owners.sort((a, b) => ownerName(a).localeCompare(ownerName(b)));
  const hasPlugY = owners.some((owner) => isStash(owner) && !owner.nonPlugY);
  const lastActivePlugyStashPage = hasPlugY
    ? findDuplicates(owners)
    : undefined;
  const allItems = owners.flatMap((owner) => {
    let items = getAllItems(owner);
    if (!isStash(owner) && lastActivePlugyStashPage?.has(owner)) {
      items = items.filter((item) => item.stored !== ItemStorageType.STASH);
    }
    return items;
  });
  return { owners, allItems, hasPlugY, lastActivePlugyStashPage };
}

export function CollectionProvider({ children }: RenderableProps<unknown>) {
  const { resetSelection } = useContext(SelectionContext);
  const [collection, setInternalCollection] = useState<Collection>({
    owners: [],
    allItems: [],
    hasPlugY: false,
  });

  const setCollection = useCallback(
    (owners: ItemsOwner[]) => {
      setInternalCollection(formatCollection(owners));
      resetSelection();
    },
    [resetSelection]
  );

  const setSingleFile = useCallback(
    (owner: ItemsOwner) => {
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
        return formatCollection(newOwners);
      });
      resetSelection();
    },
    [resetSelection]
  );

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
