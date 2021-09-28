import { Item } from "../../scripts/items/types/Item";
import { AdditionalInfo } from "./AdditionalInfo";
import "./Item.css";
import { ItemTooltip } from "./ItemTooltip";
import { ItemLocationDesc } from "./ItemLocationDesc";
import { useCallback, useContext } from "preact/hooks";
import { SelectionContext } from "../transfer/SelectionContext";

export interface ItemProps {
  item: Item;
  duplicates?: Item[];
  selectable: boolean;
  withLocation: boolean;
}

export function Item({
  item,
  duplicates,
  selectable,
  withLocation,
}: ItemProps) {
  const { selectedItems, toggleItem, selectAll, unselectAll } =
    useContext(SelectionContext);

  const handleSelect = useCallback(() => {
    if (!duplicates) {
      toggleItem(item);
    } else {
      if (selectedItems.has(item)) {
        unselectAll(duplicates);
      } else {
        selectAll(duplicates);
      }
    }
  }, [duplicates, item, selectAll, selectedItems, toggleItem, unselectAll]);

  return (
    <tr class="item">
      {selectable && (
        <td>
          <input
            type="checkbox"
            checked={selectedItems.has(item)}
            onChange={handleSelect}
            aria-label={item.name}
          />
        </td>
      )}
      <th scope="row" aria-label={item.name}>
        <ItemTooltip item={item} />
      </th>
      <td>
        <AdditionalInfo item={item} quantity={duplicates?.length} />
      </td>
      {withLocation && (
        <td>
          <ItemLocationDesc item={item} />
        </td>
      )}
    </tr>
  );
}
