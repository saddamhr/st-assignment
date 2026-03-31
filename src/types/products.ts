export type LoadPhase = 'idle' | 'loading' | 'refreshing' | 'success' | 'error';

export type ProductsQuery = {
  page: number;
  category: string;
  search: string;
};
