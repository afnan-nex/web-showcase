/**
 * NORTHSTAR COMMERCE - Wishlist View
 */

import { wishlistStore } from '../store/wishlistStore.js';
import { productStore } from '../store/productStore.js';
import { cartStore } from '../store/cartStore.js';
import { formatPrice, getSvgIcon, renderStars } from '../utils/helpers.js';
import { Toast } from '../utils/toast.js';

export const WishlistView = {
  render() {
    const itemIds = wishlistStore.getItems();
    const allProducts = productStore.getAllProducts();
    const items = itemIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean);

    if (items.length === 0) {
      return `
        <div class="container" style="padding: var(--space-20) 0; text-align: center;">
          <div style="max-width: 480px; margin: 0 auto;">
            <div style="width: 72px; height: 72px; border-radius: 50%; background-color: var(--color-bg-alt); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-6);">
              ${getSvgIcon('heart')}
            </div>
            <h1 style="font-size: var(--text-3xl); margin-bottom: var(--space-3);">Your Saved Wishlist is Empty</h1>
            <p class="text-sm text-muted" style="margin-bottom: var(--space-8); line-height: 1.6;">
              Curate your personal collection. Tap the heart icon on any design piece in our catalog to save items for future acquisition.
            </p>
            <a href="#/shop" class="btn btn-primary btn-lg">Explore Catalog</a>
          </div>
        </div>
      `;
    }

    return `
      <div class="container" style="padding: var(--space-8) 0 var(--space-20);">
        <header style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: var(--space-8); padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-border);">
          <div>
            <nav class="shop-breadcrumbs" aria-label="Breadcrumbs" style="margin-bottom: var(--space-3);">
              <a href="#/home">Home</a>
              <span>/</span>
              <span style="color: var(--color-text-primary); font-weight: 600;">Saved Wishlist (${items.length})</span>
            </nav>
            <h1 style="font-size: var(--text-4xl);">Saved Wishlist</h1>
          </div>

          <div style="display: flex; gap: var(--space-3);">
            <button type="button" class="btn btn-primary btn-sm" id="wishlist-move-all-btn">
              Move All In-Stock to Bag
            </button>
            <button type="button" class="btn btn-outline btn-sm" id="wishlist-clear-all-btn" style="color: var(--color-danger);">
              Clear Wishlist
            </button>
          </div>
        </header>

        <div class="grid grid-cols-4">
          ${items.map(product => {
            const isSoldOut = product.stock <= 0;
            const isSale = product.originalPrice && product.originalPrice > product.price;
            return `
              <article class="product-card" data-product-id="${product.id}">
                <div class="product-card-image-wrap">
                  <a href="#/product/${product.id}">
                    <img src="${product.images[0]}" alt="${product.name}" class="product-card-image" />
                  </a>
                  <button type="button" class="product-card-wishlist-btn active" data-wishlist-action="remove" data-product-id="${product.id}" title="Remove from wishlist">
                    ${getSvgIcon('close')}
                  </button>
                </div>
                <div class="product-card-body">
                  <div class="product-card-meta">
                    <span class="product-card-brand">${product.brand}</span>
                    <span class="text-xs ${isSoldOut ? 'text-muted' : 'text-success'} font-semibold">
                      ${isSoldOut ? 'Sold Out' : 'In Stock'}
                    </span>
                  </div>
                  <h3 class="product-card-title"><a href="#/product/${product.id}">${product.name}</a></h3>
                  <div class="product-card-price-wrap" style="margin-bottom: var(--space-4);">
                    <span class="product-card-price">${formatPrice(product.price)}</span>
                    ${isSale ? `<span class="product-card-price-original">${formatPrice(product.originalPrice)}</span>` : ''}
                  </div>
                  ${!isSoldOut ? `
                    <button type="button" class="btn btn-secondary btn-full btn-sm" data-wishlist-action="move-to-cart" data-product-id="${product.id}">
                      Move to Bag
                    </button>
                  ` : `
                    <button type="button" class="btn btn-outline btn-full btn-sm" disabled>
                      Sold Out
                    </button>
                  `}
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  attachEvents(container) {
    if (!container) return;

    const refresh = () => {
      container.innerHTML = this.render();
      this.attachEvents(container);
    };

    container.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-wishlist-action="remove"]');
      if (removeBtn) {
        const id = removeBtn.getAttribute('data-product-id');
        wishlistStore.remove(id);
        Toast.info('Item removed from wishlist.');
        refresh();
        return;
      }

      const moveToCartBtn = e.target.closest('[data-wishlist-action="move-to-cart"]');
      if (moveToCartBtn) {
        const id = moveToCartBtn.getAttribute('data-product-id');
        const product = productStore.getProductById(id);
        if (product) {
          cartStore.addItem(product);
          wishlistStore.remove(id);
          refresh();
        }
        return;
      }

      const moveAllBtn = e.target.closest('#wishlist-move-all-btn');
      if (moveAllBtn) {
        const itemIds = wishlistStore.getItems();
        let addedCount = 0;
        itemIds.forEach(id => {
          const product = productStore.getProductById(id);
          if (product && product.stock > 0) {
            cartStore.addItem(product);
            wishlistStore.remove(id);
            addedCount++;
          }
        });
        if (addedCount > 0) {
          Toast.success(`Moved ${addedCount} items to your shopping bag.`);
          refresh();
        } else {
          Toast.info('No available in-stock items to move.');
        }
        return;
      }

      const clearAllBtn = e.target.closest('#wishlist-clear-all-btn');
      if (clearAllBtn) {
        if (confirm('Clear all saved items in your wishlist?')) {
          wishlistStore.clear();
          refresh();
        }
        return;
      }
    });
  }
};
