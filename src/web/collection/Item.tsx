import { Item } from "../../scripts/items/types/Item";
import { AdditionalInfo } from "./AdditionalInfo";
import "./Item.css";
import { ItemTooltip } from "./ItemTooltip";
import { ItemLocationDesc } from "./ItemLocationDesc";

export interface ItemProps {
  item: Item;
  quantity: number;
  withLocation: boolean;
}

export function Item({ item, quantity, withLocation }: ItemProps) {
  return (
    <tr class="item">
      <th scope="row">
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
