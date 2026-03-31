import { PAGE_SIZE, PRODUCT_FETCH_RETRY_ATTEMPTS, PRODUCT_FETCH_RETRY_DELAY_MS } from '../constants/products';
import type { ProductsQuery } from '../types/products';
import type { PaginatedResponse, Product } from '../types/product';
import { wait } from '../utils/wait';
import { api } from './api';

const productsCache = new Map<string, PaginatedResponse<Product>>();

/**
 * Creates a stable cache key for a specific products query.
 */
function createProductsCacheKey({ page, category, search }: ProductsQuery) {
  return JSON.stringify({
    page,
    category: category || '',
    search: search || '',
  });
}

/**
 * Returns a cached products response when the same page/filter/search query
 * has already been fetched in the current session.
 */
function getCachedProducts(query: ProductsQuery) {
  return productsCache.get(createProductsCacheKey(query));
}

/**
 * Fetches products with a small retry strategy to absorb transient failures
 * from the intentionally slow and flaky API. Successful responses are cached
 * in memory by query key.
 */
async function fetchProductsWithRetry({ page, category, search }: ProductsQuery) {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < PRODUCT_FETCH_RETRY_ATTEMPTS; attempt += 1) {
    try {
      const response = await api.fetchProducts({
        page,
        limit: PAGE_SIZE,
        category: category || undefined,
        search: search || undefined,
      });

      productsCache.set(createProductsCacheKey({ page, category, search }), response);

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unexpected error while fetching products.');

      if (attempt < PRODUCT_FETCH_RETRY_ATTEMPTS - 1) {
        await wait(PRODUCT_FETCH_RETRY_DELAY_MS);
      }
    }
  }

  throw lastError ?? new Error('Unexpected error while fetching products.');
}

export { createProductsCacheKey, getCachedProducts, fetchProductsWithRetry };
