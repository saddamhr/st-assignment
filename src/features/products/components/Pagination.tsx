import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationProps } from '../types';

function getVisiblePages(currentPage: number, totalPages: number) {
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - maxVisiblePages + 1));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
}

export function Pagination({
  canGoNext,
  canGoPrevious,
  currentPage,
  isInitialLoading,
  pageSize,
  totalItems,
  totalPages,
  onNextPage,
  onPageChange,
  onPreviousPage,
}: PaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1);
  const safeCurrentPage = Math.min(currentPage, safeTotalPages);
  const firstItemNumber = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const lastItemNumber = totalItems === 0 ? 0 : Math.min(safeCurrentPage * pageSize, totalItems);
  const visiblePages = getVisiblePages(safeCurrentPage, safeTotalPages);

  return (
    <nav className="pagination-panel glass-panel" aria-label="Pagination">
      <div className="pagination-panel__summary">
        <p className="pagination-panel__headline">
          Showing <strong>{firstItemNumber}-{lastItemNumber}</strong> of <strong>{totalItems}</strong> products
        </p>
        {/* <span className="pagination-panel__meta">
          Page {safeCurrentPage} of {safeTotalPages}
        </span> */}
      </div>

      <div className="pagination-panel__actions">
        <button
          type="button"
          className="pagination-button pagination-button--icon"
          onClick={onPreviousPage}
          disabled={!canGoPrevious || isInitialLoading}
          aria-label="Go to previous page"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>

        <ol className="pagination-list" aria-label="Page list">
          {visiblePages.map(pageNumber => (
            <li key={pageNumber}>
              <button
                type="button"
                className={`pagination-pageButton ${pageNumber === safeCurrentPage ? 'pagination-pageButton--active' : ''}`}
                onClick={() => onPageChange(pageNumber)}
                disabled={isInitialLoading}
                aria-current={pageNumber === safeCurrentPage ? 'page' : undefined}
                aria-label={`Go to page ${pageNumber}`}
              >
                {pageNumber}
              </button>
            </li>
          ))}
        </ol>

        <button
          type="button"
          className="pagination-button pagination-button--icon pagination-button--primary"
          onClick={onNextPage}
          disabled={!canGoNext || isInitialLoading || totalPages === 0}
          aria-label="Go to next page"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
