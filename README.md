# Product Listing Page

A React + TypeScript + Vite implementation of a resilient e-commerce product listing page.

The page fetches products from a deliberately slow and flaky mock API, then presents them in a responsive grid with:
- product cards
- category filtering
- debounced search
- pagination
- loading, empty, and error states
- retry + in-memory caching

## Tech Stack

- React 19
- TypeScript
- Vite
- Plain CSS split by ownership via component/page-level stylesheet files
- Lucide React for icons

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

Preview the production build:

```bash
npm run preview
```

## What Is Implemented

### Product Listing

- Fetches products from [`src/services/api.ts`](./src/services/api.ts)
- Renders products in a responsive grid
- Uses a dedicated `ProductCard` component and a separate skeleton component

### Filtering and Search

- Category filter
- Debounced search input
- Page reset on filter/search change

### Pagination

- Previous / next controls
- Numbered pagination with active state
- Current visible range summary like `Showing 13-24 of 154 products`

### Resilience for a Flaky API

- Retry with delay on fetch failure
- In-memory cache keyed by `page + category + search`
- Cached result hydration for repeated queries
- Background refresh after cache hydration
- Stale-response protection so older requests cannot overwrite newer state
- Separate UI states for:
  - initial loading
  - background refresh
  - hard error
  - soft error
  - empty results

## Architecture

The project is organized with a small feature-first structure for the product listing flow.

```text
src/
  components/
    ProductCard.tsx
    ProductCard.css
    ProductCardSkeleton.tsx
    ProductCardSkeleton.css
  constants/
    products.ts
  features/
    products/
      components/
        Controls.tsx
        Header.tsx
        Pagination.tsx
      hooks/
        useProducts.ts
      pages/
        ProductsPage.tsx
        ProductsPage.css
      types.ts
  services/
    api.ts
    products.ts
  types/
    product.ts
    productCard.ts
    products.ts
  utils/
    formatPrice.ts
```

### Responsibilities

- `App.tsx`
  - mounts the products page
- `features/products/pages/ProductsPage.tsx`
  - page composition and screen assembly
- `features/products/hooks/useProducts.ts`
  - state orchestration, UI transitions, search debounce, cached hydration, and pagination handlers
- `services/products.ts`
  - retry logic and in-memory product cache
- `components/ProductCard.tsx`
  - loaded product card UI
- `components/ProductCardSkeleton.tsx`
  - loading placeholder UI

## Styling Approach

Styling is split by ownership instead of keeping everything in one stylesheet:

- global tokens and base styles in [`src/index.css`](./src/index.css)
- card styles in [`src/components/ProductCard.css`](./src/components/ProductCard.css)
- skeleton styles in [`src/components/ProductCardSkeleton.css`](./src/components/ProductCardSkeleton.css)
- page layout styles in [`src/features/products/pages/ProductsPage.css`](./src/features/products/pages/ProductsPage.css)

Colors are centralized as CSS variables in `:root`.

## Notes

- The API used in this assignment is intentionally flaky.
- Cache is memory-only and resets on full page reload.
- Images come from a third-party placeholder source, so a production version would benefit from a local fallback image strategy.

## Assignment Notes

Additional implementation rationale and tradeoffs are documented in [`DECISIONS.md`](./DECISIONS.md).
