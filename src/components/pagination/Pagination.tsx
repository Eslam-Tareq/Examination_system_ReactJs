import type { PaginationProps } from "./pagination.types";

/**
 * Global pagination: use for exams, questions, students, courses, submissions, etc.
 * Renders: Previous | [page numbers: prev, current, next] | Next
 */
const Pagination = ({
  page,
  pageSize,
  total,
  onChange,
  siblingCount = 1,
  className = "",
}: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  const start = Math.max(1, page - siblingCount);
  const end = Math.min(totalPages, page + siblingCount);
  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav
      className={`pagination ${className}`.trim()}
      role="navigation"
      aria-label="Pagination"
    >
      <button
        type="button"
        className="pagination-btn pagination-prev"
        disabled={!hasPrev}
        onClick={() => onChange(prevPage)}
        aria-label="Previous page"
      >
        Previous
      </button>

      <div className="pagination-pages">
        {start > 1 && (
          <>
            <button
              type="button"
              className="pagination-page"
              onClick={() => onChange(1)}
              aria-label="Page 1"
            >
              1
            </button>
            {start > 2 && <span className="pagination-ellipsis">…</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={`pagination-page ${
              p === page ? "pagination-page--current" : ""
            }`}
            onClick={() => p !== page && onChange(p)}
            disabled={p === page}
            aria-label={p === page ? `Current page, page ${p}` : `Page ${p}`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <span className="pagination-ellipsis">…</span>
            )}
            <button
              type="button"
              className="pagination-page"
              onClick={() => onChange(totalPages)}
              aria-label={`Page ${totalPages}`}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        className="pagination-btn pagination-next"
        disabled={!hasNext}
        onClick={() => onChange(nextPage)}
        aria-label="Next page"
      >
        Next
      </button>

      <span className="pagination-info" aria-live="polite">
        Page {page} of {totalPages}
      </span>
    </nav>
  );
};

export default Pagination;
export type { PaginationProps };
