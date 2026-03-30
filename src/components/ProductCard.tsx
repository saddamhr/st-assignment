import type { ProductCardProps } from '../types/productCard';
import { formatPrice } from '../utils/formatPrice';

import './ProductCard.css';

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
          <span className="product-card__price">{formatPrice(product.price * 100)}</span>
        </div>
      </div>
    </article>
  );
}
