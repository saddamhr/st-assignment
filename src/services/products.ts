import { PAGE_SIZE, PRODUCT_FETCH_RETRY_ATTEMPTS, PRODUCT_FETCH_RETRY_DELAY_MS } from '../constants/products';
import { api } from './api';
import type { PaginatedResponse, Product } from '../types/product';

const productsCache = new Map<string, PaginatedResponse<Product>>();

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getProductsCacheKey(page: number, category: string, search: string) {
  return JSON.stringify({
    page,
    category: category || '',
    search: search || '',
  });
}

export function getCachedProducts(page: number, category: string, search: string) {
  return productsCache.get(getProductsCacheKey(page, category, search));
}

export async function fetchProductsWithRetry(page: number, category: string, search: string) {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < PRODUCT_FETCH_RETRY_ATTEMPTS; attempt += 1) {
    try {
      const response = await api.fetchProducts({
        page,
        limit: PAGE_SIZE,
        category: category || undefined,
        search: search || undefined,
      });

      productsCache.set(getProductsCacheKey(page, category, search), response);

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
