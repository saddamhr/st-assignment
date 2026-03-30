import type { Product } from '../types/product';

const priceFormatter = new Intl.NumberFormat('en-BD', {
  maximumFractionDigits: 0,
});

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card glass-card">
      <div className="product-card__imageWrap">
        <img className="product-card__image" src={product.imageUrl} alt={product.name} loading="lazy" />
      </div>

      <div className="product-card__content">
        <h2 className="product-card__title clamp-2">{product.name}</h2>
        <p className="product-card__description clamp-2">{product.description}</p>

        <div className="product-card__priceRow">
          <span className="product-card__price">
            &#2547; {priceFormatter.format(product.price * 100)}
          </span>
        </div>
      </div>
    </article>
  );
}

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
