import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight, Loader2, RefreshCw, Search } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from './components/ProductCard';
import { api } from './services/api';
import type { Product } from './types/product';

const PAGE_SIZE = 12;
const CATEGORIES = ['Electronics', 'Clothing', 'Home', 'Outdoors'];

type LoadPhase = 'idle' | 'loading' | 'refreshing' | 'success' | 'error';

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchProductsWithRetry(page: number, category: string, search: string) {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await api.fetchProducts({
        page,
        limit: PAGE_SIZE,
        category: category || undefined,
        search: search || undefined,
      });
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unexpected error while fetching products.');

      if (attempt === 0) {
        await wait(450);
      }
    }
  }

  throw lastError ?? new Error('Unexpected error while fetching products.');
}

function App() {
  const requestIdRef = useRef(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadPhase, setLoadPhase] = useState<LoadPhase>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setLoadPhase(current => (current === 'success' ? 'refreshing' : 'loading'));
      setErrorMessage('');
      setPage(1);
      setSearchQuery(searchInput.trim());
    }, 350);

    return () => window.clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    let active = true;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    fetchProductsWithRetry(page, category, searchQuery)
      .then(response => {
        if (!active || requestId !== requestIdRef.current) {
          return;
        }

        setProducts(response.data);
        setTotalPages(response.totalPages);
        setLoadPhase('success');
      })
      .catch((error: Error) => {
        if (!active || requestId !== requestIdRef.current) {
          return;
        }

        setLoadPhase('error');
        setErrorMessage(error.message);
      });

    return () => {
      active = false;
    };
  }, [category, page, refreshKey, searchQuery]);

  const showEmptyState = loadPhase === 'success' && products.length === 0;
  const showInitialLoader = loadPhase === 'loading' && products.length === 0;
  const showBackgroundLoader = loadPhase === 'refreshing' && products.length > 0;
  const showHardError = loadPhase === 'error' && products.length === 0;
  const showSoftError = loadPhase === 'error' && products.length > 0;
  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className="page-shell">
      <div className="catalog-layout">
        <header className="glass-panel hero-panel">
          <div>
            <h1 className="hero-panel__title">Premium Products</h1>
            <p className="hero-panel__copy">
              Browse our collection. Handling the flaky API gracefully is part of the challenge.
            </p>
          </div>
        </header>

        <section className="controls-panel glass-panel" aria-label="Product controls">
          <label className="search-field">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Search products</span>
            <input
              type="search"
              value={searchInput}
              onChange={event => setSearchInput(event.target.value)}
              placeholder="Search by name or description"
              aria-label="Search products by name or description"
            />
          </label>

          <label className="select-field">
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={event => {
                setLoadPhase(current => (current === 'success' ? 'refreshing' : 'loading'));
                setErrorMessage('');
                setCategory(event.target.value);
                setPage(1);
              }}
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

          <button
            type="button"
            className="action-button"
            onClick={() => {
              setLoadPhase(current => (current === 'success' ? 'refreshing' : 'loading'));
              setErrorMessage('');
              setRefreshKey(current => current + 1);
            }}
            aria-label="Retry loading products"
          >
            <RefreshCw size={18} aria-hidden="true" />
            Retry
          </button>
        </section>

        {showSoftError ? (
          <div className="status-banner status-banner--warning" role="status" aria-live="polite">
            <AlertCircle size={18} aria-hidden="true" />
            <span>{errorMessage} Showing the last successful results.</span>
          </div>
        ) : null}

        {showBackgroundLoader ? (
          <div className="status-banner status-banner--loading" role="status" aria-live="polite">
            <Loader2 size={18} className="spin" aria-hidden="true" />
            <span>Refreshing products…</span>
          </div>
        ) : null}

        <main aria-busy={loadPhase === 'loading' || loadPhase === 'refreshing'}>
          {showHardError ? (
            <section className="feedback-panel glass-panel" role="alert">
              <AlertCircle size={28} aria-hidden="true" />
              <h2>Products are temporarily unavailable</h2>
              <p>{errorMessage}</p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setLoadPhase(current => (current === 'success' ? 'refreshing' : 'loading'));
                  setErrorMessage('');
                  setRefreshKey(current => current + 1);
                }}
              >
                Try again
              </button>
            </section>
          ) : null}

          {showEmptyState ? (
            <section className="feedback-panel glass-panel" aria-live="polite">
              <Search size={28} aria-hidden="true" />
              <h2>No products match this filter</h2>
              <p>Adjust the category or search query to widen the results.</p>
            </section>
          ) : null}

          {showInitialLoader ? (
            <section className="product-grid" aria-label="Loading products">
              {Array.from({ length: PAGE_SIZE }, (_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </section>
          ) : null}

          {!showHardError && !showInitialLoader && !showEmptyState ? (
            <section className="product-grid" aria-label="Product results">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </section>
          ) : null}
        </main>

        <nav className="pagination-panel glass-panel" aria-label="Pagination">
          <div className="pagination-panel__summary">
            Page {Math.min(page, Math.max(totalPages, 1))} of {Math.max(totalPages, 1)}
          </div>

          <div className="pagination-panel__actions">
            <button
              type="button"
              className="pagination-button"
              onClick={() => {
                setLoadPhase(current => (current === 'success' ? 'refreshing' : 'loading'));
                setErrorMessage('');
                setPage(currentPage => Math.max(1, currentPage - 1));
              }}
              disabled={!canGoPrevious || loadPhase === 'loading'}
            >
              <ChevronLeft size={18} aria-hidden="true" />
              Previous
            </button>

            <button
              type="button"
              className="pagination-button pagination-button--primary"
              onClick={() => {
                setLoadPhase(current => (current === 'success' ? 'refreshing' : 'loading'));
                setErrorMessage('');
                setPage(currentPage => Math.min(totalPages, currentPage + 1));
              }}
              disabled={!canGoNext || loadPhase === 'loading' || totalPages === 0}
            >
              Next
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default App;
