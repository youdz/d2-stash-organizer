import { Item } from "../../scripts/items/types/Item";
import { AdditionalInfo } from "./AdditionalInfo";
import "./Item.css";
import { ItemTooltip } from "./ItemTooltip";
import { ItemLocationDesc } from "./ItemLocationDesc";
import { useContext } from "preact/hooks";
import { SelectionContext } from "../transfer/SelectionContext";

export interface ItemProps {
  item: Item;
  quantity: number;
  selectable: boolean;
  withLocation: boolean;
}

export function Item({ item, quantity, selectable, withLocation }: ItemProps) {
  const { selectedItems, toggleItem } = useContext(SelectionContext);

  return (
    <tr class="item">
      {selectable && (
        <td>
          <input
            type="checkbox"
            checked={selectedItems.has(item)}
            onChange={() => toggleItem(item)}
            aria-label={item.name}
          />
        </td>
      )}
      <th scope="row" aria-label={item.name}>
        <ItemTooltip item={item} />
      </th>
      <td>
        <AdditionalInfo item={item} quantity={quantity} />
      </td>
      {withLocation && (
        <td>
          <ItemLocationDesc item={item} />
        </td>
      )}
    </tr>
  );
}
