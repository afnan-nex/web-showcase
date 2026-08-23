/**
 * NORTHSTAR COMMERCE - Standardized Product Card Component
 */

import { formatPrice, renderStars, getSvgIcon } from '../utils/helpers.js';
import { wishlistStore } from '../store/wishlistStore.js';

export function renderProductCard(product) {
  if (!product) return '';

  const isWishlisted = wishlistStore.has(product.id);
  const isSale = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = isSale ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const isSoldOut = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const mainImg = product.images[0];
  const hoverImg = product.images[1] || product.images[0];

  return `
    <article class="product-card ${isSoldOut ? 'sold-out' : ''}" data-product-id="${product.id}" aria-label="${product.name}">
      <div class="product-card-image-wrap">
        <a href="#/product/${product.id}" class="product-card-link" aria-label="View details for ${product.name}">
          <img src="${mainImg}" alt="${product.name} primary angle" class="product-card-image" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'" />
          <img src="${hoverImg}" alt="${product.name} alternate view" class="product-card-image-hover" loading="lazy" onerror="this.style.display='none'" />
        </a>

        <!-- Status Badges -->
        <div class="product-card-badges">
          ${isSoldOut ? `<span class="badge badge-soldout">Sold Out</span>` : ''}
          ${!isSoldOut && product.isNew ? `<span class="badge badge-dark">New Season</span>` : ''}
          ${!isSoldOut && isSale ? `<span class="badge badge-sale">-${discountPercent}%</span>` : ''}
          ${!isSoldOut && isLowStock ? `<span class="badge badge-warning">Only ${product.stock} Left</span>` : ''}
        </div>

        <!-- Wishlist Button -->
        <button type="button" class="product-card-wishlist-btn ${isWishlisted ? 'active' : ''}" data-action="toggle-wishlist" data-product-id="${product.id}" title="${isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}" aria-label="${isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}">
          ${isWishlisted ? getSvgIcon('heartFilled') : getSvgIcon('heart')}
        </button>

        <!-- Quick Actions Overlay -->
        ${!isSoldOut ? `
          <div class="product-card-quick-actions">
            <button type="button" class="product-card-quick-btn" data-action="quick-view" data-product-id="${product.id}" aria-label="Quick view ${product.name}">
              Quick View
            </button>
            <button type="button" class="product-card-quick-btn" data-action="quick-add" data-product-id="${product.id}" aria-label="Quick add ${product.name} to shopping bag">
              + Add to Bag
            </button>
          </div>
        ` : ''}
      </div>

      <div class="product-card-body">
        <div class="product-card-meta">
          <span class="product-card-brand">${product.brand}</span>
          <div class="product-card-rating" title="${product.rating} stars from ${product.reviewsCount} customer reviews">
            ${getSvgIcon('star')}
            <span>${product.rating}</span>
            <span class="text-muted">(${product.reviewsCount})</span>
          </div>
        </div>

        <h3 class="product-card-title">
          <a href="#/product/${product.id}">${product.name}</a>
        </h3>

        ${product.variants?.colors ? `
          <div class="product-card-swatches" title="Available in ${product.variants.colors.length} colorways">
            ${product.variants.colors.slice(0, 4).map(c => `
              <span class="swatch-dot" style="background-color: ${c.hex};" title="${c.name}"></span>
            `).join('')}
            ${product.variants.colors.length > 4 ? `<span class="text-2xs text-muted">+${product.variants.colors.length - 4}</span>` : ''}
          </div>
        ` : ''}

        <div class="product-card-price-wrap">
          <span class="product-card-price">${formatPrice(product.price)}</span>
          ${isSale ? `
            <span class="product-card-price-original">${formatPrice(product.originalPrice)}</span>
            <span class="product-card-discount-tag">Save ${discountPercent}%</span>
          ` : ''}
        </div>
      </div>
    </article>
  `;
}
