import { useCallback, useContext, useMemo, useState } from "preact/hooks";
import { SelectionContext } from "./SelectionContext";
import { ItemsTable } from "../collection/ItemsTable";
import "./TransferItems.css";
import { CollectionContext } from "../store/CollectionContext";
import { PrettyOwnerName } from "../save-files/PrettyOwnerName";
import {
  isCharacter,
  isPlugyStash,
  isStash,
  ItemsOwner,
} from "../../scripts/save-file/ownership";
import { ItemStorageType } from "../../scripts/items/types/ItemLocation";
import { useUpdateCollection } from "../store/useUpdateCollection";
import { numberInputChangeHandler } from "../organizer/numberInputChangeHandler";
import { organize } from "../../scripts/grail/organize";
import { OwnerSelector } from "../save-files/OwnerSelector";
import { updateCharacterStashes } from "../store/plugyDuplicates";
import { bulkTransfer } from "../../scripts/items/moving/bulkTransfer";

export function TransferItems() {
  const { lastActivePlugyStashPage } = useContext(CollectionContext);
  const { updateAllFiles, rollback } = useUpdateCollection();
  const { selectedItems } = useContext(SelectionContext);
  const [target, setTarget] = useState<ItemsOwner>();
  const [targetStorage, setTargetStorage] = useState<ItemStorageType>();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

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
      bulkTransfer(target, items, targetStorage);
      if (isPlugyStash(target) && (withOrganize || target.nonPlugY)) {
        organize(target, [], skipPages);
      }
      if (lastActivePlugyStashPage) {
        updateCharacterStashes(lastActivePlugyStashPage);
      }
      await updateAllFiles(target);
      setSuccess(`${items.length} items transferred!`);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
        await rollback();
        setTarget(undefined);
      } else {
        throw e;
      }
    }
  }, [
    items,
    skipPages,
    target,
    targetStorage,
    updateAllFiles,
    rollback,
    withOrganize,
    lastActivePlugyStashPage,
  ]);

  if (items.length === 0 && !error && !success) {
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
  if (target && isCharacter(target)) {
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
        {target &&
          (isCharacter(target) ||
            (isPlugyStash(target) && !target.nonPlugY)) && (
            <div class="arrow">&#8594;</div>
          )}
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
        {target && isPlugyStash(target) && !target.nonPlugY && (
          <ul id="organize-selector">
            <li>
              <label>
                <input
                  type="radio"
                  name="organize"
                  checked={!withOrganize}
                  onChange={() => setWithOrganize(false)}
                />{" "}
                Just add the items at the end of {target.personal ? "" : "my"}{" "}
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
                Organize {target.personal ? "" : "my"}{" "}
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
        <span class="success">{success}</span>
      </p>

      <h4>Selected items</h4>
      <ItemsTable items={items} selectable={false} pageSize={10} />
    </div>
  );
}
