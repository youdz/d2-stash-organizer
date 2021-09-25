import { ComponentChild } from "preact";
import { StateUpdater, useEffect } from "preact/hooks";
import "./Pagination.css";

export interface PaginationProps {
  nbEntries: number;
  pageSize: number;
  currentEntry: number;
  onChange: StateUpdater<number>;
  text: (first: number, last: number) => ComponentChild;
}

export function Pagination({
  nbEntries,
  pageSize,
  currentEntry,
  onChange,
  text,
}: PaginationProps) {
  const lastPossible = Math.floor((nbEntries - 1) / pageSize) * pageSize;

  // Make sure we never go page the last page
  useEffect(() => {
    if (currentEntry >= nbEntries) {
      onChange(0);
    }
  }, [nbEntries, currentEntry, onChange]);

  if (lastPossible <= 0) {
    return null;
  }

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
        {text(currentEntry + 1, Math.min(currentEntry + pageSize, nbEntries))}
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
