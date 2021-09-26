import { createContext, RenderableProps } from "preact";
import { useCallback, useMemo, useState } from "preact/hooks";
import { Item } from "../../scripts/items/types/Item";

interface SelectionContext {
  selectedItems: Set<Item>;
  toggleItem(item: Item): void;
  selectAll(items: Item[]): void;
  unselectAll(items: Item[]): void;
  resetSelection(): void;
}

export const SelectionContext = createContext<SelectionContext>({
  selectedItems: new Set(),
  toggleItem: () => undefined,
  selectAll: () => undefined,
  unselectAll: () => undefined,
  resetSelection: () => undefined,
});

export function SelectionProvider({ children }: RenderableProps<unknown>) {
  const [selectedItems, setSelectedItems] = useState(new Set<Item>());

  const toggleItem = useCallback((item: Item) => {
    setSelectedItems((previous) => {
      const newSelection = new Set(previous);
      if (newSelection.has(item)) {
        newSelection.delete(item);
      } else {
        newSelection.add(item);
      }
      return newSelection;
    });
  }, []);

  const toggleAll = useCallback(
    (selected: boolean) => (items: Item[]) => {
      setSelectedItems((previous) => {
        const newSelection = new Set(previous);
        for (const item of items) {
          newSelection[selected ? "add" : "delete"](item);
        }
        return newSelection;
      });
    },
    []
  );

  const resetSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  const value = useMemo(
    () => ({
      selectedItems,
      toggleItem,
      selectAll: toggleAll(true),
      unselectAll: toggleAll(false),
      resetSelection,
    }),
    [selectedItems, toggleItem, toggleAll, resetSelection]
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}
