import { useEffect, useRef, useState } from 'react';
import { fetchProductsWithRetry } from '../../../services/products';
import type { LoadPhase } from '../../../types/products';
import type { Product } from '../../../types/product';
import type { ProductsState } from '../types';

function getPendingLoadPhase(current: LoadPhase): LoadPhase {
  return current === 'success' ? 'refreshing' : 'loading';
}

export function useProducts(): ProductsState {
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
      setLoadPhase(getPendingLoadPhase);
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

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
  };

  const handleCategoryChange = (value: string) => {
    setLoadPhase(getPendingLoadPhase);
    setErrorMessage('');
    setCategory(value);
    setPage(1);
  };

  const handleRetry = () => {
    setLoadPhase(getPendingLoadPhase);
    setErrorMessage('');
    setRefreshKey(current => current + 1);
  };

  const handlePreviousPage = () => {
    setLoadPhase(getPendingLoadPhase);
    setErrorMessage('');
    setPage(currentPage => Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    setLoadPhase(getPendingLoadPhase);
    setErrorMessage('');
    setPage(currentPage => Math.min(totalPages, currentPage + 1));
  };

  const showEmptyState = loadPhase === 'success' && products.length === 0;
  const showInitialLoader = loadPhase === 'loading' && products.length === 0;
  const showBackgroundLoader = loadPhase === 'refreshing' && products.length > 0;
  const showHardError = loadPhase === 'error' && products.length === 0;
  const showSoftError = loadPhase === 'error' && products.length > 0;

  return {
    category,
    errorMessage,
    loadPhase,
    page,
    products,
    searchInput,
    totalPages,
    canGoNext: page < totalPages,
    canGoPrevious: page > 1,
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
  };
}
