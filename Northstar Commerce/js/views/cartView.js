/**
 * NORTHSTAR COMMERCE - Full Cart Page View
 */

import { cartStore } from '../store/cartStore.js';
import { formatPrice, getSvgIcon } from '../utils/helpers.js';
import { COUPONS } from '../data/coupons.js';

export const CartView = {
  render() {
    const items = cartStore.getItems();
    const summary = cartStore.getSummary();

    if (items.length === 0) {
      return `
        <div class="container" style="padding: var(--space-20) 0; text-align: center;">
          <div style="max-width: 480px; margin: 0 auto;">
            <div style="width: 72px; height: 72px; border-radius: 50%; background-color: var(--color-bg-alt); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-6);">
              ${getSvgIcon('bag')}
            </div>
            <h1 style="font-size: var(--text-3xl); margin-bottom: var(--space-3);">Your Shopping Bag is Empty</h1>
            <p class="text-sm text-muted" style="margin-bottom: var(--space-8); line-height: 1.6;">
              Items added to your shopping bag will be preserved here. Explore our latest arrivals in tailoring, audio hardware, and homewares.
            </p>
            <a href="#/shop" class="btn btn-primary btn-lg">Explore Catalog</a>
          </div>
        </div>
      `;
    }

    return `
      <div class="container" style="padding: var(--space-8) 0 var(--space-20);">
        <header style="margin-bottom: var(--space-8);">
          <nav class="shop-breadcrumbs" aria-label="Breadcrumbs" style="margin-bottom: var(--space-3);">
            <a href="#/home">Home</a>
            <span>/</span>
            <span style="color: var(--color-text-primary); font-weight: 600;">Shopping Bag (${summary.itemsCount})</span>
          </nav>
          <h1 style="font-size: var(--text-4xl);">Shopping Bag</h1>
        </header>

        <!-- Free shipping banner -->
        <div style="background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-4) var(--space-6); margin-bottom: var(--space-8);">
          ${summary.freeShippingRemaining <= 0 || summary.isFreeShipping ? `
            <div style="display: flex; align-items: center; gap: 8px; color: var(--color-success); font-weight: 600; font-size: var(--text-sm);">
              ${getSvgIcon('check')}
              <span>Complimentary Worldwide Express Delivery unlocked on this order!</span>
            </div>
          ` : `
            <div style="font-size: var(--text-sm); margin-bottom: 6px;">
              Add <strong>${formatPrice(summary.freeShippingRemaining)}</strong> more to your bag for <strong>Complimentary Express Shipping</strong>.
            </div>
            <div class="shipping-bar-track">
              <div class="shipping-bar-progress" style="width: ${summary.freeShippingProgress}%;"></div>
            </div>
          `}
        </div>

        <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: var(--space-12); align-items: start;">
          <!-- Left: Items Table -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); overflow: hidden;">
            <div style="padding: var(--space-4) var(--space-6); border-bottom: 1px solid var(--color-border); font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-muted); display: grid; grid-template-columns: 3fr 1fr 1fr; gap: var(--space-4);">
              <span>Product Item</span>
              <span style="text-align: center;">Quantity</span>
              <span style="text-align: right;">Total</span>
            </div>

            <div style="padding: 0 var(--space-6);">
              ${items.map(item => `
                <div style="display: grid; grid-template-columns: 3fr 1fr 1fr; gap: var(--space-4); align-items: center; padding: var(--space-6) 0; border-bottom: 1px solid var(--color-border-subtle);">
                  <!-- Product info -->
                  <div style="display: flex; gap: var(--space-4); align-items: center;">
                    <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 100px; object-fit: cover; border-radius: var(--radius-xs); background: var(--color-bg-alt);" />
                    <div>
                      <span class="text-xs text-muted text-uppercase" style="letter-spacing: 0.05em;">${item.brand}</span>
                      <h4 style="font-size: var(--text-sm); margin: 2px 0 4px;"><a href="#/product/${item.productId}">${item.name}</a></h4>
                      <div class="text-xs text-muted" style="margin-bottom: 6px;">Variant: ${item.color} • ${item.size}</div>
                      <div class="text-xs font-semibold">${formatPrice(item.price)} each</div>
                      <button type="button" class="btn-link text-xs" data-cart-page-action="remove" data-item-key="${item.key}" style="color: var(--color-danger); margin-top: 6px;">
                        Remove from bag
                      </button>
                    </div>
                  </div>

                  <!-- Quantity Control -->
                  <div style="display: flex; justify-content: center;">
                    <div class="qty-control">
                      <button type="button" class="qty-btn" data-cart-page-action="dec" data-item-key="${item.key}">−</button>
                      <input type="text" class="qty-input" value="${item.quantity}" readonly />
                      <button type="button" class="qty-btn" data-cart-page-action="inc" data-item-key="${item.key}" ${item.quantity >= item.maxStock ? 'disabled' : ''}>+</button>
                    </div>
                  </div>

                  <!-- Total Price -->
                  <div style="text-align: right; font-size: var(--text-base); font-weight: 700;">
                    ${formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Bottom Actions -->
            <div style="padding: var(--space-4) var(--space-6); background-color: var(--color-bg-alt); display: flex; justify-content: space-between; align-items: center;">
              <a href="#/shop" class="btn btn-outline btn-sm">← Continue Shopping</a>
              <button type="button" class="btn-link btn-xs" id="cart-clear-all-btn" style="color: var(--color-danger);">Empty Shopping Bag</button>
            </div>
          </div>

          <!-- Right: Order Summary Card -->
          <div style="display: flex; flex-direction: column; gap: var(--space-6);">
            <!-- Summary Box -->
            <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-6);">
              <h3 style="font-size: var(--text-lg); margin-bottom: var(--space-4); padding-bottom: var(--space-3); border-bottom: 1px solid var(--color-border);">
                Order Summary
              </h3>

              <div style="display: flex; flex-direction: column; gap: var(--space-3); font-size: var(--text-sm); margin-bottom: var(--space-6);">
                <div class="flex justify-between">
                  <span class="text-muted">Subtotal (${summary.itemsCount} items)</span>
                  <span>${formatPrice(summary.subtotal)}</span>
                </div>

                ${summary.discount > 0 ? `
                  <div class="flex justify-between" style="color: var(--color-danger);">
                    <span>Discount (${summary.couponCode})</span>
                    <span>-${formatPrice(summary.discount)}</span>
                  </div>
                ` : ''}

                <div class="flex justify-between">
                  <span class="text-muted">Estimated Shipping</span>
                  <span>${summary.shippingFee === 0 ? '<span style="color: var(--color-success); font-weight: 600;">FREE</span>' : formatPrice(summary.shippingFee)}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-muted">Estimated State Tax (8%)</span>
                  <span>${formatPrice(summary.estimatedTax)}</span>
                </div>

                <div class="divider-subtle" style="margin: 4px 0;"></div>

                <div class="flex justify-between" style="font-size: var(--text-lg); font-weight: 700;">
                  <span>Grand Total</span>
                  <span>${formatPrice(summary.grandTotal)}</span>
                </div>
              </div>

              <!-- Promo Code Input -->
              <div style="margin-bottom: var(--space-6);">
                <label class="form-label" style="margin-bottom: 6px;">Promotional Code</label>
                ${summary.couponCode ? `
                  <div style="display: flex; align-items: center; justify-content: space-between; background: var(--color-bg-alt); padding: 8px 12px; border-radius: var(--radius-xs); font-size: var(--text-xs);">
                    <span style="font-family: var(--font-mono); font-weight: 600;">ACTIVE: ${summary.couponCode}</span>
                    <button type="button" id="cart-page-remove-coupon" style="color: var(--color-danger); text-decoration: underline; font-weight: 600;">Remove</button>
                  </div>
                ` : `
                  <div class="promo-box">
                    <input type="text" class="promo-input" id="cart-page-promo-input" placeholder="e.g. NORTHSTAR15" />
                    <button type="button" class="btn btn-secondary btn-sm" id="cart-page-apply-coupon">Apply</button>
                  </div>
                `}

                <!-- Demo Coupons Shortcuts -->
                <div style="margin-top: var(--space-3);">
                  <span class="text-xs text-muted" style="display: block; margin-bottom: 4px;">Click a demo code to test:</span>
                  <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${COUPONS.filter(c => c.code !== 'EXPIRED25').map(c => `
                      <button type="button" class="badge badge-muted demo-coupon-chip" data-code="${c.code}" style="cursor: pointer;" title="${c.description}">
                        ${c.code}
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>

              <a href="#/checkout" class="btn btn-primary btn-full btn-lg">
                Proceed to Checkout
                ${getSvgIcon('arrowRight')}
              </a>
            </div>

            <!-- Guarantee Icons -->
            <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-4) var(--space-6); font-size: var(--text-xs); color: var(--color-text-secondary); display: flex; flex-direction: column; gap: var(--space-2);">
              <div style="display: flex; align-items: center; gap: 8px;">
                ${getSvgIcon('shield')}
                <span>Encrypted 256-Bit SSL Checkout Protection</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                ${getSvgIcon('refresh')}
                <span>30-Day Doorstep Complimentary Returns</span>
              </div>
            </div>
          </div>
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
      const actionBtn = e.target.closest('[data-cart-page-action]');
      if (actionBtn) {
        const action = actionBtn.getAttribute('data-cart-page-action');
        const itemKey = actionBtn.getAttribute('data-item-key');
        const item = cartStore.getItems().find(i => i.key === itemKey);

        if (action === 'inc' && item) {
          cartStore.updateQuantity(itemKey, item.quantity + 1);
          refresh();
        } else if (action === 'dec' && item) {
          cartStore.updateQuantity(itemKey, item.quantity - 1);
          refresh();
        } else if (action === 'remove' && itemKey) {
          cartStore.removeItem(itemKey);
          refresh();
        }
        return;
      }

      const applyBtn = e.target.closest('#cart-page-apply-coupon');
      if (applyBtn) {
        const input = container.querySelector('#cart-page-promo-input');
        if (input && input.value) {
          cartStore.applyCoupon(input.value.trim());
          refresh();
        }
        return;
      }

      const removeCouponBtn = e.target.closest('#cart-page-remove-coupon');
      if (removeCouponBtn) {
        cartStore.removeCoupon();
        refresh();
        return;
      }

      const demoChip = e.target.closest('.demo-coupon-chip');
      if (demoChip) {
        const code = demoChip.getAttribute('data-code');
        if (code) {
          cartStore.applyCoupon(code);
          refresh();
        }
        return;
      }

      const clearAllBtn = e.target.closest('#cart-clear-all-btn');
      if (clearAllBtn) {
        if (confirm('Are you sure you want to clear your shopping bag?')) {
          cartStore.clear();
          refresh();
        }
        return;
      }
    });
  }
};
