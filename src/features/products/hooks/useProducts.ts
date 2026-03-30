import { useEffect, useRef, useState } from 'react';
import { fetchProductsWithRetry, getCachedProducts } from '../../../services/products';
import type { LoadPhase } from '../../../types/products';
import type { Product } from '../../../types/product';
import type { ProductsState } from '../types';

function getPendingLoadPhase(current: LoadPhase): LoadPhase {
  return current === 'success' ? 'refreshing' : 'loading';
}

export function useProducts(): ProductsState {
  const initialCachedResponse = getCachedProducts(1, '', '');
  const categoryRef = useRef('');
  const requestIdRef = useRef(0);
  const [products, setProducts] = useState<Product[]>(initialCachedResponse?.data ?? []);
  const [category, setCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialCachedResponse?.totalPages ?? 0);
  const [loadPhase, setLoadPhase] = useState<LoadPhase>(initialCachedResponse ? 'refreshing' : 'loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    categoryRef.current = category;
  }, [category]);

  const applyCachedProducts = (nextPage: number, nextCategory: string, nextSearch: string) => {
    const cachedResponse = getCachedProducts(nextPage, nextCategory, nextSearch);

    if (!cachedResponse) {
      return false;
    }

    setProducts(cachedResponse.data);
    setTotalPages(cachedResponse.totalPages);
    setLoadPhase('refreshing');

    return true;
  };

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const nextSearchQuery = searchInput.trim();
      const cachedResponse = getCachedProducts(1, categoryRef.current, nextSearchQuery);

      if (cachedResponse) {
        setProducts(cachedResponse.data);
        setTotalPages(cachedResponse.totalPages);
        setLoadPhase('refreshing');
      } else {
        setLoadPhase(getPendingLoadPhase);
      }

      setErrorMessage('');
      setPage(1);
      setSearchQuery(nextSearchQuery);
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
    if (!applyCachedProducts(1, value, searchQuery)) {
      setLoadPhase(getPendingLoadPhase);
    }

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
    const nextPage = Math.max(1, page - 1);

    if (!applyCachedProducts(nextPage, category, searchQuery)) {
      setLoadPhase(getPendingLoadPhase);
    }

    setErrorMessage('');
    setPage(nextPage);
  };

  const handleNextPage = () => {
    const nextPage = Math.min(totalPages, page + 1);

    if (!applyCachedProducts(nextPage, category, searchQuery)) {
      setLoadPhase(getPendingLoadPhase);
    }

    setErrorMessage('');
    setPage(nextPage);
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
