import './ProductCardSkeleton.css';

export function ProductCardSkeleton() {
  return (
    <div className="product-card glass-card product-card--skeleton" aria-hidden="true">
      <div className="skeleton-block skeleton-block--image" />
      <div className="product-card__content">
        <span className="skeleton-block skeleton-block--title" />
        <span className="skeleton-block skeleton-block--title skeleton-block--titleShort" />
        <span className="skeleton-block skeleton-block--text" />
        <span className="skeleton-block skeleton-block--price" />
      </div>
    </div>
  );
}
