# Candidate Decisions & Notes

Please use this file to briefly outline your technical choices and the rationale behind them.

## 1. State Management & Architecture
*Why did you structure your state the way you did? Which patterns did you choose for handling the flaky API requests, loading states, and error handling?*

I structured the page around a feature-first setup so the application entry point stays small and the product-listing logic lives with the product-listing feature. The final shape is split into:
- `features/products/pages` for the screen container and page-specific layout styles
- `features/products/components` for feature UI blocks like controls and pagination
- `features/products/hooks/useProducts.ts` for product-listing state orchestration
- `services/products.ts` for retry and cache-aware fetch behavior
- shared `components`, `types`, `constants`, and `utils` for reusable pieces like the product card and price formatting

State is intentionally divided between:
- user intent state: `page`, `category`, `searchInput`, `searchQuery`
- server/result state: `products`, `totalItems`, `totalPages`, `loadPhase`, `errorMessage`

For the flaky API, I used several resilience patterns together:
- A custom hook (`useProducts`) to centralize state transitions and keep UI components presentational
- Debounced search so rapid typing does not flood a slow API
- Request-id guarding so stale responses cannot overwrite newer user actions
- Retry with delay in the service layer to absorb transient failures
- In-memory caching keyed by `page + category + search` so repeated queries can hydrate immediately
- Background revalidation so cached data is shown quickly but still refreshed
- Separate UI states for initial loading, background refresh, hard error, soft error, and empty results

This combination keeps the page responsive even when the backend is slow or randomly fails, while still keeping the implementation understandable for a take-home assignment.

## 2. Trade-offs and Omissions
*What did you intentionally leave out given the constraints of a take-home assignment? If you had more time, what would you prioritize next?*

I kept the caching strategy intentionally simple: it is an in-memory cache with no expiration, persistence, or invalidation strategy beyond overwriting on fresh success. That is enough to demonstrate resilience and responsiveness, but a production app would likely use a stronger data layer or a clearer cache policy.

I also kept the scope focused on the requested page rather than adding broader app infrastructure such as routing, URL state syncing, analytics, or test coverage.

If I had more time, I would prioritize:
- URL query parameter syncing for shareable filters and page state
- A cache TTL / stale-time strategy and possibly request deduplication
- Automated tests around retry, cache hydration, stale-response protection, and pagination
- Better image fallbacks for third-party image failures
- A more complete pagination model with ellipsis logic for very large page counts
- Accessibility refinements such as stronger live-region messaging and more keyboard-focused interaction testing

## 3. AI Usage
*How did you utilize AI tools (ChatGPT, Copilot, Cursor, etc.) during this assignment? Provide a brief summary of how they assisted you.*

I used AI as a development assistant while completing this assignment. I directed and refined the repository by restructuring it into a feature-oriented architecture, implementing a custom hook, introducing retry and caching mechanisms, separating component and page-level styles, and improving the documentation.

All key ideas and decisions were my own. I maintained full control over the implementation process, including the overall architecture, clean code practices, and technical direction. My choices were guided by my own judgment, the existing repository structure, the behavior of the API, and the assignment requirements.

## 4. Edge Cases Identified
*Did you notice any edge cases or bugs that you didn't have time to fix? Please list them here.*

There are a few known limitations in the final solution:
- The cache is memory-only, so it resets on full reload and does not expire automatically
- The mock API cannot be truly aborted, so stale requests still finish in the background even though stale UI writes are blocked
- The image source depends on an external placeholder service, so a failed image response would still benefit from a local fallback
- Numbered pagination currently shows a limited sliding window of pages; for very large datasets, additional first/last or ellipsis behavior could improve navigation
