/**
 * NORTHSTAR COMMERCE - Quick View Modal Component
 */

import { productStore } from '../store/productStore.js';
import { cartStore } from '../store/cartStore.js';
import { wishlistStore } from '../store/wishlistStore.js';
import { formatPrice, renderStars, getSvgIcon } from '../utils/helpers.js';

export const QuickViewModal = {
  modalEl: null,
  currentProduct: null,
  selectedColor: null,
  selectedSize: null,
  quantity: 1,

  init() {
    this.modalEl = document.getElementById('quick-view-modal');
    if (!this.modalEl) return;

    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl || e.target.closest('.modal-close-btn')) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e && e.key === 'Escape' && this.modalEl.classList.contains('open')) {
        this.close();
      }
    });

    this.attachEvents();
  },

  open(productId) {
    const product = productStore.getProductById(productId);
    if (!product) return;

    this.currentProduct = product;
    this.selectedColor = product.variants?.colors?.[0]?.name || 'Standard';
    this.selectedSize = product.variants?.sizes?.[0] || 'Standard';
    this.quantity = 1;

    this.render();
    this.modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('open');
    document.body.style.overflow = '';
  },

  attachEvents() {
    this.modalEl.addEventListener('click', (e) => {
      const colorBtn = e.target.closest('[data-qv-color]');
      if (colorBtn) {
        this.selectedColor = colorBtn.getAttribute('data-qv-color');
        this.render();
        return;
      }

      const sizeBtn = e.target.closest('[data-qv-size]');
      if (sizeBtn) {
        this.selectedSize = sizeBtn.getAttribute('data-qv-size');
        this.render();
        return;
      }

      const thumbBtn = e.target.closest('[data-qv-thumb]');
      if (thumbBtn) {
        const src = thumbBtn.getAttribute('data-qv-thumb');
        const mainImg = this.modalEl.querySelector('.qv-main-img');
        if (mainImg) mainImg.src = src;
        this.modalEl.querySelectorAll('.qv-thumb').forEach(t => t.classList.remove('active'));
        thumbBtn.classList.add('active');
        return;
      }

      const qtyAction = e.target.closest('[data-qv-qty]');
      if (qtyAction) {
        const type = qtyAction.getAttribute('data-qv-qty');
        if (type === 'inc' && this.quantity < this.currentProduct.stock) {
          this.quantity++;
        } else if (type === 'dec' && this.quantity > 1) {
          this.quantity--;
        }
        const qtyInput = this.modalEl.querySelector('.qv-qty-val');
        if (qtyInput) qtyInput.value = this.quantity;
        return;
      }

      const addBtn = e.target.closest('[data-action="qv-add-to-cart"]');
      if (addBtn && this.currentProduct) {
        cartStore.addItem(this.currentProduct, { color: this.selectedColor, size: this.selectedSize }, this.quantity);
        this.close();
        return;
      }

      const wishlistBtn = e.target.closest('[data-action="qv-wishlist"]');
      if (wishlistBtn && this.currentProduct) {
        wishlistStore.toggle(this.currentProduct);
        this.render();
        return;
      }
    });
  },

  render() {
    if (!this.modalEl || !this.currentProduct) return;
    const p = this.currentProduct;
    const isWishlisted = wishlistStore.has(p.id);
    const isSale = p.originalPrice && p.originalPrice > p.price;
    const discountPercent = isSale ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
    const isSoldOut = p.stock <= 0;

    const cardEl = this.modalEl.querySelector('.modal-card');
    if (!cardEl) return;
    cardEl.className = 'modal-card quick-view-card';

    cardEl.innerHTML = `
      <button type="button" class="modal-close-btn" aria-label="Close modal">
        ${getSvgIcon('close')}
      </button>

      <!-- Left Gallery -->
      <div style="display: flex; flex-direction: column; gap: var(--space-3);">
        <div style="aspect-ratio: 4/5; overflow: hidden; border-radius: var(--radius-xs); background: var(--color-bg-alt);">
          <img src="${p.images[0]}" alt="${p.name}" class="qv-main-img" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="display: flex; gap: var(--space-2); overflow-x: auto;">
          ${p.images.map((img, idx) => `
            <button type="button" class="qv-thumb ${idx === 0 ? 'active' : ''}" data-qv-thumb="${img}" style="width: 60px; height: 75px; flex-shrink: 0; border: 1px solid var(--color-border); border-radius: var(--radius-xs); overflow: hidden; background: var(--color-bg-alt); padding: 0;">
              <img src="${img}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Right Info -->
      <div style="display: flex; flex-direction: column;">
        <span class="text-uppercase text-muted" style="margin-bottom: 4px;">${p.brand}</span>
        <h2 style="font-size: var(--text-2xl); margin-bottom: var(--space-2);">${p.name}</h2>

        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: var(--space-4);">
          ${renderStars(p.rating, 14)}
          <span class="text-xs text-muted">${p.rating} (${p.reviewsCount} reviews)</span>
        </div>

        <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: var(--space-4); padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-border);">
          <span style="font-size: var(--text-xl); font-weight: 700;">${formatPrice(p.price)}</span>
          ${isSale ? `
            <span style="font-size: var(--text-base); color: var(--color-text-muted); text-decoration: line-through;">${formatPrice(p.originalPrice)}</span>
            <span class="badge badge-sale">Save ${discountPercent}%</span>
          ` : ''}
        </div>

        <p style="font-size: var(--text-sm); color: var(--color-text-secondary); margin-bottom: var(--space-4); line-height: 1.5;">
          ${p.shortDescription}
        </p>

        <!-- Color Selector -->
        ${p.variants?.colors ? `
          <div style="margin-bottom: var(--space-4);">
            <div style="font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; margin-bottom: 6px;">
              Color: <span style="color: var(--color-text-secondary); font-weight: 400;">${this.selectedColor}</span>
            </div>
            <div style="display: flex; gap: 8px;">
              ${p.variants.colors.map(c => `
                <button type="button" class="swatch-dot ${this.selectedColor === c.name ? 'active' : ''}" data-qv-color="${c.name}" style="background-color: ${c.hex}; width: 24px; height: 24px; border: 2px solid ${this.selectedColor === c.name ? 'var(--color-accent)' : 'transparent'}; box-shadow: 0 0 0 1px var(--color-border);" title="${c.name}"></button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Size Selector -->
        ${p.variants?.sizes ? `
          <div style="margin-bottom: var(--space-4);">
            <div style="font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; margin-bottom: 6px;">
              Size / Variant: <span style="color: var(--color-text-secondary); font-weight: 400;">${this.selectedSize}</span>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${p.variants.sizes.map(s => `
                <button type="button" class="btn btn-outline btn-sm ${this.selectedSize === s ? 'btn-primary' : ''}" data-qv-size="${s}" style="padding: 4px 10px; font-size: 12px;">
                  ${s}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Stock Indicator -->
        <div style="margin-bottom: var(--space-4);">
          ${isSoldOut ? `
            <span class="badge badge-soldout">Currently Out of Stock</span>
          ` : p.stock <= 3 ? `
            <span class="badge badge-warning">Low Stock — Only ${p.stock} units remaining</span>
          ` : `
            <span class="badge badge-success">In Stock (${p.stock} units ready to ship)</span>
          `}
        </div>

        <!-- Action Row -->
        ${!isSoldOut ? `
          <div style="display: flex; gap: var(--space-3); margin-top: auto;">
            <div class="qty-control" style="height: 44px;">
              <button type="button" class="qty-btn" data-qv-qty="dec" style="width: 36px;">−</button>
              <input type="text" class="qty-input qv-qty-val" value="${this.quantity}" readonly style="width: 36px; font-size: 14px;" />
              <button type="button" class="qty-btn" data-qv-qty="inc" style="width: 36px;">+</button>
            </div>
            <button type="button" class="btn btn-primary" data-action="qv-add-to-cart" style="flex: 1; height: 44px;">
              Add to Bag • ${formatPrice(p.price * this.quantity)}
            </button>
            <button type="button" class="btn-icon" data-action="qv-wishlist" style="width: 44px; height: 44px; color: ${isWishlisted ? 'var(--color-danger)' : 'inherit'};" title="Save to wishlist">
              ${isWishlisted ? getSvgIcon('heartFilled') : getSvgIcon('heart')}
            </button>
          </div>
        ` : `
          <button type="button" class="btn btn-secondary btn-full" disabled style="margin-top: auto;">
            Sold Out
          </button>
        `}

        <a href="#/product/${p.id}" class="btn btn-link btn-sm" style="text-align: center; margin-top: var(--space-4);" onclick="document.getElementById('quick-view-modal').classList.remove('open'); document.body.style.overflow='';">
          View Complete Product Specifications →
        </a>
      </div>
    `;
  }
};
