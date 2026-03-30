import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationProps } from '../types';

export function Pagination({
  canGoNext,
  canGoPrevious,
  currentPage,
  isInitialLoading,
  totalPages,
  onNextPage,
  onPreviousPage,
}: PaginationProps) {
  return (
    <nav className="pagination-panel glass-panel" aria-label="Pagination">
      <div className="pagination-panel__summary">
        Page {Math.min(currentPage, Math.max(totalPages, 1))} of {Math.max(totalPages, 1)}
      </div>

      <div className="pagination-panel__actions">
        <button
          type="button"
          className="pagination-button"
          onClick={onPreviousPage}
          disabled={!canGoPrevious || isInitialLoading}
        >
          <ChevronLeft size={18} aria-hidden="true" />
          Previous
        </button>

        <button
          type="button"
          className="pagination-button pagination-button--primary"
          onClick={onNextPage}
          disabled={!canGoNext || isInitialLoading || totalPages === 0}
        >
          Next
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
