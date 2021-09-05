import { StateUpdater } from "preact/hooks";
import "./Pagination.css";

export interface PaginationProps {
  nbEntries: number;
  pageSize: number;
  currentPage: number;
  setPage: StateUpdater<number>;
  entryType: string;
}

export function Pagination({
  nbEntries,
  pageSize,
  currentPage,
  setPage,
  entryType,
}: PaginationProps) {
  const lastPossible = Math.floor((nbEntries - 1) / 10) * 10;

  return (
    <div class="pagination">
      <div style={{ visibility: currentPage === 0 ? "hidden" : "visible" }}>
        <button class="button" onClick={() => setPage(0)}>
          First
        </button>
        <button class="button" onClick={() => setPage((n) => n - pageSize)}>
          Previous
        </button>
      </div>
      <span>
        {entryType} {currentPage + 1} -{" "}
        {Math.min(currentPage + pageSize, nbEntries)} out of {nbEntries}
      </span>
      <div
        style={{
          visibility: currentPage >= lastPossible ? "hidden" : "visible",
        }}
      >
        <button class="button" onClick={() => setPage((n) => n + pageSize)}>
          Next
        </button>
        <button class="button" onClick={() => setPage(lastPossible)}>
          Last
        </button>
      </div>
    </div>
  );
}
