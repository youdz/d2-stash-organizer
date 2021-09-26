import { useCallback, useContext, useMemo, useState } from "preact/hooks";
import { SelectionContext } from "./SelectionContext";
import { ItemsTable } from "../collection/ItemsTable";
import "./TransferItems.css";
import { CollectionContext } from "../store/CollectionContext";
import { PrettyOwnerName } from "../save-files/PrettyOwnerName";
import { isStash, ItemsOwner } from "../../scripts/save-file/ownership";
import { ItemStorageType } from "../../scripts/items/types/ItemLocation";
import { addPage } from "../../scripts/stash/addPage";
import { transferItem } from "../../scripts/items/moving/transferItem";
import { useUpdateCollection } from "../store/useUpdateCollection";
import { numberInputChangeHandler } from "../organizer/numberInputChangeHandler";
import { organize } from "../../scripts/grail/organize";
import { OwnerSelector } from "../save-files/OwnerSelector";

export function TransferItems() {
  const { lastActivePlugyStashPage } = useContext(CollectionContext);
  const { updateAllFiles } = useUpdateCollection();
  const { selectedItems, resetSelection } = useContext(SelectionContext);
  const [target, setTarget] = useState<ItemsOwner>();
  const [targetStorage, setTargetStorage] = useState<ItemStorageType>();
  const [error, setError] = useState<string>();

  const [withOrganize, setWithOrganize] = useState<boolean>(false);
  const [skipPages, setSkipPages] = useState(0);

  const items = useMemo(() => Array.from(selectedItems), [selectedItems]);

  const transferItems = useCallback(async () => {
    if (!target) {
      setError("Please select where you want to transfer the items.");
      return;
    }
    if (!isStash(target) && !targetStorage) {
      setError(
        "Please select where you want to store the items on your character."
      );
      return;
    }
    setError(undefined);
    try {
      if (isStash(target)) {
        let pageIndex = target.pages.length;
        addPage(target, "Transferred");
        for (const item of items) {
          if (!transferItem(item, target, ItemStorageType.STASH, pageIndex)) {
            // We ran out of space, we insert a new page
            addPage(target, "Transferred");
            pageIndex++;
            // Don't forget to re-transfer the failed item
            transferItem(item, target, ItemStorageType.STASH, pageIndex);
          }
        }
      } else {
        for (const item of items) {
          if (!transferItem(item, target, targetStorage)) {
            // TODO: The previous items have already been transferred, we need to roll back
            setError("Not enough space to transfer all the selected items.");
            return;
          }
        }
      }
      // FIXME: After a PlugY stash transfer, the character still has the items.
      if (isStash(target) && withOrganize) {
        organize(target, [], skipPages);
      }
      await updateAllFiles();
      resetSelection();
      // TODO: navigate
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        throw e;
      }
    }
  }, [
    items,
    resetSelection,
    skipPages,
    target,
    targetStorage,
    updateAllFiles,
    withOrganize,
  ]);

  if (items.length === 0) {
    return (
      <p>
        You have not selected any items yet. Go through your{" "}
        <a href="#collection">Collection</a> or{" "}
        <a href="#characters">Characters</a> and select the items you want to
        transfer.
      </p>
    );
  }

  let supportedStorageTypes: ItemStorageType[] | undefined;
  if (target && !isStash(target)) {
    supportedStorageTypes = [ItemStorageType.INVENTORY, ItemStorageType.CUBE];
    if (!lastActivePlugyStashPage?.has(target)) {
      supportedStorageTypes.push(ItemStorageType.STASH);
    }
  }

  return (
    <div id="transfer-items">
      <p>
        You have currently selected <span class="magic">{items.length}</span>{" "}
        items (full list below).
      </p>
      <p>Select where you want to transfer them:</p>
      <div class="selectors">
        <OwnerSelector selected={target} onChange={setTarget} />
        {target && <div class="arrow">&#8594;</div>}
        {supportedStorageTypes && (
          <ul id="storage-selector">
            {supportedStorageTypes.map((storage) => (
              <li>
                <label>
                  <input
                    type="radio"
                    name="storage"
                    checked={targetStorage === storage}
                    onChange={() => setTargetStorage(storage)}
                  />{" "}
                  {storage === ItemStorageType.INVENTORY
                    ? "Inventory"
                    : storage === ItemStorageType.CUBE
                    ? "Cube"
                    : "Stash"}
                </label>
              </li>
            ))}
          </ul>
        )}
        {target && isStash(target) && (
          <ul id="organize-selector">
            <li>
              <label>
                <input
                  type="radio"
                  name="organize"
                  checked={!withOrganize}
                  onChange={() => setWithOrganize(false)}
                />{" "}
                Just add the items at the end of {target.personal ? "" : "the"}{" "}
                <PrettyOwnerName owner={target} />.
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="organize"
                  checked={withOrganize}
                  onChange={() => setWithOrganize(true)}
                />{" "}
                Organize {target.personal ? "" : "the"}{" "}
                <PrettyOwnerName owner={target} /> for me
              </label>
              , except the first{" "}
              <input
                type="number"
                min={0}
                max={99}
                value={skipPages}
                onChange={numberInputChangeHandler((value) =>
                  setSkipPages(value)
                )}
              />{" "}
              pages.
            </li>
          </ul>
        )}
      </div>
      <p>
        <button class="button" onClick={transferItems}>
          Transfer my items
        </button>
        <span class="error danger">{error}</span>
      </p>

      <h4>Selected items</h4>
      <ItemsTable items={items} selectable={false} pageSize={10} />
    </div>
  );
}
