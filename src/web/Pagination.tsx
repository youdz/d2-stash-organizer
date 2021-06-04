import "./Pagination.css";

export interface PaginationProps {
  nbPages: number;
  currentPage: number;
  setPage: (update: (previous: number) => number) => void;
}

export const PAGE_SIZE = 10;

export function Pagination({ nbPages, currentPage, setPage }: PaginationProps) {
  return (
    <div class="pagination">
      <button
        class="button"
        disabled={currentPage === 0}
        onClick={() => setPage((n) => n - PAGE_SIZE)}
      >
        Previous
      </button>
      <span>
        Pages {currentPage + 1} - {Math.min(currentPage + PAGE_SIZE, nbPages)}{" "}
        out of {nbPages}
      </span>
      <button
        class="button"
        disabled={currentPage >= nbPages - PAGE_SIZE - 1}
        onClick={() => setPage((n) => n + PAGE_SIZE)}
      >
        Next
      </button>
    </div>
  );
}
