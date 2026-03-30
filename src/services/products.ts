import { PAGE_SIZE, PRODUCT_FETCH_RETRY_ATTEMPTS, PRODUCT_FETCH_RETRY_DELAY_MS } from '../constants/products';
import { api } from './api';

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchProductsWithRetry(page: number, category: string, search: string) {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < PRODUCT_FETCH_RETRY_ATTEMPTS; attempt += 1) {
    try {
      return await api.fetchProducts({
        page,
        limit: PAGE_SIZE,
        category: category || undefined,
        search: search || undefined,
      });
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unexpected error while fetching products.');

      if (attempt < PRODUCT_FETCH_RETRY_ATTEMPTS - 1) {
        await wait(PRODUCT_FETCH_RETRY_DELAY_MS);
      }
    }
  }

  throw lastError ?? new Error('Unexpected error while fetching products.');
}
