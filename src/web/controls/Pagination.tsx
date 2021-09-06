import { StateUpdater, useEffect } from "preact/hooks";
import "./Pagination.css";

export interface PaginationProps {
  nbEntries: number;
  pageSize: number;
  currentEntry: number;
  onChange: StateUpdater<number>;
  entryType: string;
}

export function Pagination({
  nbEntries,
  pageSize,
  currentEntry,
  onChange,
  entryType,
}: PaginationProps) {
  const lastPossible = Math.floor((nbEntries - 1) / pageSize) * pageSize;

  // Make sure we never go page the last page
  useEffect(() => {
    if (currentEntry >= nbEntries) {
      onChange(0);
    }
  }, [nbEntries, currentEntry, onChange]);

  return (
    <div class="pagination">
      <div style={{ visibility: currentEntry === 0 ? "hidden" : "visible" }}>
        <button class="button" onClick={() => onChange(0)}>
          First
        </button>
        <button class="button" onClick={() => onChange((n) => n - pageSize)}>
          Previous
        </button>
      </div>
      <span>
        {entryType} {currentEntry + 1} -{" "}
        {Math.min(currentEntry + pageSize, nbEntries)} out of {nbEntries}
      </span>
      <div
        style={{
          visibility: currentEntry >= lastPossible ? "hidden" : "visible",
        }}
      >
        <button class="button" onClick={() => onChange((n) => n + pageSize)}>
          Next
        </button>
        <button class="button" onClick={() => onChange(lastPossible)}>
          Last
        </button>
      </div>
    </div>
  );
}
