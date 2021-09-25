import { useContext, useMemo } from "preact/hooks";
import { SelectionContext } from "./SelectionContext";
import { ItemsTable } from "../collection/ItemsTable";

export function MoveItems() {
  const { selectedItems } = useContext(SelectionContext);

  const items = useMemo(() => Array.from(selectedItems), [selectedItems]);

  // TODO: actual logic to move items, obviously

  return (
    <>
      <p>Items to move:</p>
      <ItemsTable items={items} selectable={false} pageSize={20} />
    </>
  );
}
