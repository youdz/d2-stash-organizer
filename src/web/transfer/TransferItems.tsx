import { useCallback, useContext, useMemo, useState } from "preact/hooks";
import { SelectionContext } from "./SelectionContext";
import { ItemsTable } from "../collection/ItemsTable";
import "./MoveItems.css";
import { CollectionContext } from "../store/CollectionContext";
import { PrettyOwnerName } from "../save-files/PrettyOwnerName";
import { isStash, ItemsOwner } from "../../scripts/save-file/ownership";
import { ItemStorageType } from "../../scripts/items/types/ItemLocation";
import { addPage } from "../../scripts/stash/addPage";
import { transferItem } from "../../scripts/items/moving/transferItem";

export function TransferItems() {
  const { owners, lastActivePlugyStashPage } = useContext(CollectionContext);
  const { selectedItems, resetSelection } = useContext(SelectionContext);
  const [target, setTarget] = useState<ItemsOwner>();
  const [targetStorage, setTargetStorage] = useState<ItemStorageType>();
  const [error, setError] = useState<string>();

  const items = useMemo(() => Array.from(selectedItems), [selectedItems]);

  const transferItems = useCallback(() => {
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
          setError("Not enough space to transfer all the selected items.");
          return;
        }
      }
    }
    // TODO: download and success
    resetSelection();
  }, [items, target, targetStorage, resetSelection]);

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
        <ul id="source-selector">
          {owners.map((owner) => (
            <li>
              <label>
                <input
                  type="radio"
                  name="target"
                  checked={target === owner}
                  onChange={() => setTarget(owner)}
                />{" "}
                <PrettyOwnerName owner={owner} />
              </label>
            </li>
          ))}
        </ul>
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
          <p>
            These items will be added in new pages after the last page of{" "}
            {target.personal ? "" : "the"} <PrettyOwnerName owner={target} />.
          </p>
        )}
      </div>
      {/* TODO: offer to organize the target if it's a PlugY stash */}
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
