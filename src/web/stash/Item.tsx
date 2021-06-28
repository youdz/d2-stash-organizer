import { Item } from "../../scripts/items/types/Item";
import { colorClass } from "../utils/colorClass";
import { AdditionalInfo } from "./AdditionalInfo";
import "./Item.css";

export interface ItemProps {
  item: Item;
  quantity: number;
}

export function Item({ item, quantity }: ItemProps) {
  return (
    <tr class="item">
      <th scope="row" class={colorClass(item)}>
        {item.name}
      </th>
      <td>
        <AdditionalInfo item={item} quantity={quantity} />
      </td>
    </tr>
  );
}
