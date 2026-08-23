/**
 * NORTHSTAR COMMERCE - Slide-Over Cart Drawer Component
 */

import { cartStore } from '../store/cartStore.js';
import { formatPrice, getSvgIcon } from '../utils/helpers.js';

export const DrawerCart = {
  drawerEl: null,
  overlayEl: null,

  init() {
    this.drawerEl = document.getElementById('drawer-cart');
    this.overlayEl = document.getElementById('drawer-overlay');

    if (!this.drawerEl) return;

    // Listen for cart changes to re-render drawer
    cartStore.subscribe(() => {
      this.render();
    });

    // Close buttons and overlay clicks
    const closeBtn = this.drawerEl.querySelector('.drawer-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    if (this.overlayEl) {
      this.overlayEl.addEventListener('click', () => this.close());
    }

    // Attach delegated events
    this.attachEvents();
    this.render();
  },

  open() {
    if (!this.drawerEl) return;
    this.render();
    this.drawerEl.classList.add('open');
    if (this.overlayEl) this.overlayEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  close() {
    if (!this.drawerEl) return;
    this.drawerEl.classList.remove('open');
    if (this.overlayEl) this.overlayEl.classList.remove('active');
    document.body.style.overflow = '';
  },

  attachEvents() {
    this.drawerEl.addEventListener('click', (e) => {
      const target = e.target.closest('[data-cart-action]');
      if (!target) return;

      const action = target.getAttribute('data-cart-action');
      const itemKey = target.getAttribute('data-item-key');

      if (action === 'increase' && itemKey) {
        const item = cartStore.getItems().find(i => i.key === itemKey);
        if (item) cartStore.updateQuantity(itemKey, item.quantity + 1);
      } else if (action === 'decrease' && itemKey) {
        const item = cartStore.getItems().find(i => i.key === itemKey);
        if (item) cartStore.updateQuantity(itemKey, item.quantity - 1);
      } else if (action === 'remove' && itemKey) {
        cartStore.removeItem(itemKey);
      } else if (action === 'apply-coupon') {
        const input = this.drawerEl.querySelector('.promo-input');
        if (input && input.value) {
          cartStore.applyCoupon(input.value.trim());
          input.value = '';
        }
      } else if (action === 'remove-coupon') {
        cartStore.removeCoupon();
      } else if (action === 'checkout') {
        this.close();
        window.location.hash = '#/checkout';
      } else if (action === 'view-cart') {
        this.close();
        window.location.hash = '#/cart';
      }
    });

    // Enter key in coupon input
    this.drawerEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.classList.contains('promo-input')) {
        e.preventDefault();
        const code = e.target.value.trim();
        if (code) {
          cartStore.applyCoupon(code);
          e.target.value = '';
        }
      }
    });
  },

  render() {
    if (!this.drawerEl) return;
    const items = cartStore.getItems();
    const summary = cartStore.getSummary();

    const bodyEl = this.drawerEl.querySelector('.drawer-cart-body');
    const footerEl = this.drawerEl.querySelector('.drawer-cart-footer');
    const countBadge = this.drawerEl.querySelector('.drawer-cart-count');
    const shippingBarEl = this.drawerEl.querySelector('.shipping-bar-wrap');

    if (countBadge) {
      countBadge.textContent = `(${summary.itemsCount})`;
    }

    // Free shipping progress bar
    if (shippingBarEl && shippingBarEl.style) {
      if (items.length > 0) {
        shippingBarEl.style.display = 'block';
        if (summary.freeShippingRemaining <= 0 || summary.isFreeShipping) {
          shippingBarEl.innerHTML = `
            <div class="shipping-bar-text" style="color: var(--color-success); font-weight: 600;">
              ✓ You've unlocked Complimentary Express Delivery!
            </div>
            <div class="shipping-bar-track">
              <div class="shipping-bar-progress free" style="width: 100%;"></div>
            </div>
          `;
        } else {
          shippingBarEl.innerHTML = `
            <div class="shipping-bar-text">
              Add <strong>${formatPrice(summary.freeShippingRemaining)}</strong> more to claim <strong>Free Express Shipping</strong>
            </div>
            <div class="shipping-bar-track">
              <div class="shipping-bar-progress" style="width: ${summary.freeShippingProgress}%;"></div>
            </div>
          `;
        }
      } else {
        shippingBarEl.style.display = 'none';
      }
    }

    if (!bodyEl) return;

    // Body content (items or empty state)
    if (items.length === 0) {
      bodyEl.innerHTML = `
        <div class="cart-empty-state">
          ${getSvgIcon('bag')}
          <h4>Your Bag is Empty</h4>
          <p class="text-sm text-muted" style="max-width: 260px;">Explore our curated collection of luxury apparel, precision electronics, and design objects.</p>
          <a href="#/shop" class="btn btn-secondary btn-sm" onclick="document.getElementById('drawer-cart').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('active'); document.body.style.overflow='';">Explore Collection</a>
        </div>
      `;
      if (footerEl && footerEl.style) footerEl.style.display = 'none';
      return;
    }

    if (footerEl && footerEl.style) footerEl.style.display = 'flex';

    bodyEl.innerHTML = items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <div>
            <h4 class="cart-item-title"><a href="#/product/${item.productId}" onclick="document.getElementById('drawer-cart').classList.remove('open'); document.getElementById('drawer-overlay').classList.remove('active'); document.body.style.overflow='';">${item.name}</a></h4>
            <div class="cart-item-variant">${item.color} • ${item.size}</div>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
          </div>
          <div class="cart-item-actions">
            <div class="qty-control">
              <button type="button" class="qty-btn" data-cart-action="decrease" data-item-key="${item.key}" aria-label="Decrease">−</button>
              <input type="text" class="qty-input" value="${item.quantity}" readonly />
              <button type="button" class="qty-btn" data-cart-action="increase" data-item-key="${item.key}" ${item.quantity >= item.maxStock ? 'disabled' : ''} aria-label="Increase">+</button>
            </div>
            <button type="button" class="cart-item-remove" data-cart-action="remove" data-item-key="${item.key}" title="Remove item">
              ${getSvgIcon('trash')}
            </button>
          </div>
        </div>
        <div style="text-align: right; font-size: var(--text-sm); font-weight: 700;">
          ${formatPrice(item.price * item.quantity)}
        </div>
      </div>
    `).join('');

    // Footer content
    if (footerEl) {
      footerEl.innerHTML = `
        ${summary.couponCode ? `
          <div style="display: flex; align-items: center; justify-content: space-between; background: var(--color-bg-alt); padding: 8px 12px; border-radius: var(--radius-xs); font-size: var(--text-xs);">
            <span style="font-family: var(--font-mono); font-weight: 600;">CODE: ${summary.couponCode}</span>
            <button type="button" data-cart-action="remove-coupon" style="color: var(--color-danger); text-decoration: underline; font-weight: 600;">Remove</button>
          </div>
        ` : `
          <div class="promo-box">
            <input type="text" class="promo-input" placeholder="Promo code (e.g. NORTHSTAR15)" />
            <button type="button" class="btn btn-secondary btn-sm" data-cart-action="apply-coupon">Apply</button>
          </div>
        `}

        <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 4px;">
          <div class="cart-summary-row">
            <span>Subtotal</span>
            <span>${formatPrice(summary.subtotal)}</span>
          </div>
          ${summary.discount > 0 ? `
            <div class="cart-summary-row" style="color: var(--color-danger);">
              <span>Discount (${summary.couponCode})</span>
              <span>-${formatPrice(summary.discount)}</span>
            </div>
          ` : ''}
          <div class="cart-summary-row">
            <span>Estimated Shipping</span>
            <span>${summary.shippingFee === 0 ? 'FREE' : formatPrice(summary.shippingFee)}</span>
          </div>
          <div class="divider-subtle" style="margin: 4px 0;"></div>
          <div class="cart-summary-row cart-summary-total">
            <span>Estimated Total</span>
            <span>${formatPrice(summary.grandTotal)}</span>
          </div>
        </div>

        <button type="button" class="btn btn-primary btn-full" data-cart-action="checkout">
          Proceed to Checkout
        </button>
        <button type="button" class="btn btn-link btn-sm" data-cart-action="view-cart" style="text-align: center; margin-top: 2px;">
          View Full Bag Details
        </button>
      `;
    }
  }
};
