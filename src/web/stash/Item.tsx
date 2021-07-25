import { Item } from "../../scripts/items/types/Item";
import { AdditionalInfo } from "./AdditionalInfo";
import "./Item.css";
import { ItemTooltip } from "./ItemTooltip";

export interface ItemProps {
  item: Item;
  quantity: number;
}

export function Item({ item, quantity }: ItemProps) {
  return (
    <tr class="item">
      <th scope="row">
        <ItemTooltip item={item} />
      </th>
      <td>
        <AdditionalInfo item={item} quantity={quantity} />
      </td>
    </tr>
  );
}
