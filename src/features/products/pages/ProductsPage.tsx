import { AlertCircle, Loader2, Search } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from '../../../components/ProductCard';
import { PAGE_SIZE } from '../../../constants/products';
import { Controls } from '../components/Controls';
import { Header } from '../components/Header';
import { Pagination } from '../components/Pagination';
import { useProducts } from '../hooks/useProducts';

export function ProductsPage() {
  const {
    category,
    errorMessage,
    loadPhase,
    page,
    products,
    searchInput,
    totalPages,
    canGoNext,
    canGoPrevious,
    showBackgroundLoader,
    showEmptyState,
    showHardError,
    showInitialLoader,
    showSoftError,
    handleCategoryChange,
    handleNextPage,
    handlePreviousPage,
    handleRetry,
    handleSearchInputChange,
  } = useProducts();

  return (
    <div className="page-shell">
      <div className="catalog-layout">
        <Header />

        <Controls
          category={category}
          searchInput={searchInput}
          onCategoryChange={handleCategoryChange}
          onRetry={handleRetry}
          onSearchChange={handleSearchInputChange}
        />

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
              <button type="button" className="btn-primary" onClick={handleRetry}>
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

        <Pagination
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          currentPage={page}
          isInitialLoading={loadPhase === 'loading'}
          totalPages={totalPages}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
        />
      </div>
    </div>
  );
}
