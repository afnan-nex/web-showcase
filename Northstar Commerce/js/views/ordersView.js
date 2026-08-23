/**
 * NORTHSTAR COMMERCE - Order Confirmation & Receipt View
 */

import { orderStore } from '../store/orderStore.js';
import { formatPrice, getSvgIcon } from '../utils/helpers.js';

export const OrdersView = {
  render(routeParams = {}) {
    const orderId = routeParams.id;
    const order = orderStore.getOrderById(orderId);

    if (!order) {
      return `
        <div class="container" style="padding: var(--space-20) 0; text-align: center;">
          <h2>Order Record Not Found</h2>
          <p class="text-muted" style="margin: var(--space-4) 0 var(--space-8);">We could not find an order reference matching "${orderId}".</p>
          <a href="#/account" class="btn btn-primary">Return to Client Portal</a>
        </div>
      `;
    }

    return `
      <div class="container" style="padding: var(--space-8) 0 var(--space-20);">
        <div class="order-success-hero">
          <div class="order-success-icon">
            ${getSvgIcon('check')}
          </div>
          <div class="text-xs text-uppercase font-semibold" style="letter-spacing: 0.1em; color: var(--color-success); margin-bottom: 6px;">
            Transaction Confirmed
          </div>
          <h1 style="font-size: var(--text-4xl); margin-bottom: var(--space-2);">Thank You for Your Acquisition</h1>
          <p class="text-lead" style="margin-bottom: var(--space-4);">
            Your order reference is <strong class="font-mono" style="color: var(--color-text-primary);">${order.orderId}</strong>.
          </p>
          <p class="text-sm text-muted" style="max-width: 480px; margin: 0 auto var(--space-8);">
            A confirmation dispatch notice and tax invoice have been transmitted to <strong>${order.customer.email}</strong>.
          </p>

          <!-- Order Status Timeline Tracker -->
          <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-6); text-align: left; margin-bottom: var(--space-8);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
              <span style="font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Dispatch Timeline</span>
              <span class="badge badge-dark">${order.status}</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-2); text-align: center; position: relative;">
              <div>
                <div style="width: 14px; height: 14px; border-radius: 50%; background: var(--color-success); margin: 0 auto 6px;"></div>
                <div style="font-size: 11px; font-weight: 600;">Authorized</div>
                <div class="text-xs text-muted">Complete</div>
              </div>
              <div>
                <div style="width: 14px; height: 14px; border-radius: 50%; background: ${order.status === 'Processing' ? 'var(--color-accent)' : 'var(--color-success)'}; margin: 0 auto 6px;"></div>
                <div style="font-size: 11px; font-weight: 600;">Atelier Packing</div>
                <div class="text-xs text-muted">In Progress</div>
              </div>
              <div>
                <div style="width: 14px; height: 14px; border-radius: 50%; background: var(--color-border); margin: 0 auto 6px;"></div>
                <div style="font-size: 11px; font-weight: 600;">Courier Handoff</div>
                <div class="text-xs text-muted">${order.carrier}</div>
              </div>
              <div>
                <div style="width: 14px; height: 14px; border-radius: 50%; background: var(--color-border); margin: 0 auto 6px;"></div>
                <div style="font-size: 11px; font-weight: 600;">Doorstep Delivery</div>
                <div class="text-xs text-muted">Estimated 3–5 Days</div>
              </div>
            </div>
          </div>

          <!-- Order Receipt Card -->
          <div class="order-receipt-card">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--space-6); padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-border);">
              <div>
                <h3 style="font-size: var(--text-lg);">Itemized Receipt</h3>
                <span class="text-xs text-muted font-mono">Invoice Date: ${new Date(order.date).toLocaleDateString()}</span>
              </div>
              <button type="button" class="btn btn-outline btn-sm" onclick="window.print();">
                Print Tax Receipt
              </button>
            </div>

            <!-- Items List -->
            <div style="display: flex; flex-direction: column; gap: var(--space-4); margin-bottom: var(--space-6);">
              ${order.items.map(item => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-border-subtle);">
                  <div style="display: flex; align-items: center; gap: var(--space-4);">
                    <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 75px; object-fit: cover; border-radius: var(--radius-xs); background: var(--color-bg-alt);" />
                    <div>
                      <div class="text-xs text-muted text-uppercase">${item.brand}</div>
                      <div style="font-weight: 600; font-size: var(--text-sm);">${item.name}</div>
                      <div class="text-xs text-muted">${item.color} • ${item.size} • Qty: ${item.quantity}</div>
                    </div>
                  </div>
                  <div style="font-weight: 700; font-size: var(--text-sm);">
                    ${formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Breakdown -->
            <div style="display: flex; justify-content: flex-end; margin-bottom: var(--space-6);">
              <div style="width: 280px; display: flex; flex-direction: column; gap: 6px; font-size: var(--text-sm);">
                <div class="flex justify-between">
                  <span class="text-muted">Subtotal</span>
                  <span>${formatPrice(order.subtotal)}</span>
                </div>
                ${order.discount > 0 ? `
                  <div class="flex justify-between" style="color: var(--color-danger);">
                    <span>Discount (${order.couponCode || 'PROMO'})</span>
                    <span>-${formatPrice(order.discount)}</span>
                  </div>
                ` : ''}
                <div class="flex justify-between">
                  <span class="text-muted">Courier Shipping</span>
                  <span>${order.shippingFee === 0 ? '<span style="color: var(--color-success); font-weight: 600;">FREE</span>' : formatPrice(order.shippingFee)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted">Estimated Tax</span>
                  <span>${formatPrice(order.tax)}</span>
                </div>
                <div class="divider-subtle" style="margin: 4px 0;"></div>
                <div class="flex justify-between" style="font-size: var(--text-md); font-weight: 700;">
                  <span>Total Paid</span>
                  <span>${formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            <!-- Customer Destination Strip -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); background-color: var(--color-bg-alt); padding: var(--space-4) var(--space-6); border-radius: var(--radius-xs); font-size: var(--text-xs);">
              <div>
                <strong style="display: block; margin-bottom: 4px;">Fulfillment Destination:</strong>
                <div>${order.customer.fullName}</div>
                <div class="text-muted">${order.customer.address}</div>
                <div class="text-muted">${order.customer.city}, ${order.customer.state} ${order.customer.postalCode}</div>
                <div class="text-muted">${order.customer.country}</div>
              </div>
              <div>
                <strong style="display: block; margin-bottom: 4px;">Payment Authorization:</strong>
                <div>${order.payment.method} (ending in ${order.payment.last4})</div>
                <div class="text-muted">Tracking: ${order.trackingNumber}</div>
                <div class="text-muted">Courier: ${order.carrier}</div>
              </div>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div style="display: flex; justify-content: center; gap: var(--space-4); margin-top: var(--space-8);">
            <a href="#/shop" class="btn btn-primary btn-lg">Explore Catalog</a>
            <a href="#/account" class="btn btn-outline btn-lg">View Order History</a>
          </div>
        </div>
      </div>
    `;
  },

  attachEvents(container) {}
};
