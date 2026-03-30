import { RefreshCw, Search } from 'lucide-react';
import { CATEGORIES } from '../../../constants/products';
import type { ControlsProps } from '../types';

export function Controls({
  category,
  searchInput,
  onCategoryChange,
  onRetry,
  onSearchChange,
}: ControlsProps) {
  return (
    <section className="controls-panel glass-panel" aria-label="Product controls">
      <label className="search-field">
        <Search size={18} aria-hidden="true" />
        <span className="sr-only">Search products</span>
        <input
          type="search"
          value={searchInput}
          onChange={event => onSearchChange(event.target.value)}
          placeholder="Search by name or description"
          aria-label="Search products by name or description"
        />
      </label>

      <label className="select-field">
        <span className="sr-only">Filter by category</span>
        <select
          value={category}
          onChange={event => onCategoryChange(event.target.value)}
          aria-label="Filter products by category"
        >
          <option value="">All categories</option>
          {CATEGORIES.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <button type="button" className="action-button" onClick={onRetry} aria-label="Retry loading products">
        <RefreshCw size={18} aria-hidden="true" />
        Retry
      </button>
    </section>
  );
}
