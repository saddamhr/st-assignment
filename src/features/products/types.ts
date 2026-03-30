import type { LoadPhase } from '../../types/products';
import type { Product } from '../../types/product';

export type ControlsProps = {
  category: string;
  searchInput: string;
  onCategoryChange: (value: string) => void;
  onRetry: () => void;
  onSearchChange: (value: string) => void;
};

export type PaginationProps = {
  canGoNext: boolean;
  canGoPrevious: boolean;
  currentPage: number;
  isInitialLoading: boolean;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onNextPage: () => void;
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
};

export type ProductsState = {
  category: string;
  errorMessage: string;
  loadPhase: LoadPhase;
  page: number;
  products: Product[];
  searchInput: string;
  totalItems: number;
  totalPages: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  showBackgroundLoader: boolean;
  showEmptyState: boolean;
  showHardError: boolean;
  showInitialLoader: boolean;
  showSoftError: boolean;
  handleCategoryChange: (value: string) => void;
  handleNextPage: () => void;
  handlePageChange: (page: number) => void;
  handlePreviousPage: () => void;
  handleRetry: () => void;
  handleSearchInputChange: (value: string) => void;
};
