import { StateUpdater } from "preact/hooks";
import "./Pagination.css";

export interface PaginationProps {
  nbPages: number;
  currentPage: number;
  setPage: StateUpdater<number>;
}

export const PAGE_SIZE = 10;

export function Pagination({ nbPages, currentPage, setPage }: PaginationProps) {
  const lastPossible = Math.floor((nbPages - 1) / 10) * 10;

  return (
    <div class="pagination">
      <div style={{ visibility: currentPage === 0 ? "hidden" : "visible" }}>
        <button class="button" onClick={() => setPage(0)}>
          First
        </button>
        <button class="button" onClick={() => setPage((n) => n - PAGE_SIZE)}>
          Previous
        </button>
      </div>
      <span>
        Pages {currentPage + 1} - {Math.min(currentPage + PAGE_SIZE, nbPages)}{" "}
        out of {nbPages}
      </span>
      <div
        style={{
          visibility: currentPage >= lastPossible ? "hidden" : "visible",
        }}
      >
        <button class="button" onClick={() => setPage((n) => n + PAGE_SIZE)}>
          Next
        </button>
        <button class="button" onClick={() => setPage(lastPossible)}>
          Last
        </button>
      </div>
    </div>
  );
}
