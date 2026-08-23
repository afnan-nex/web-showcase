/**
 * NORTHSTAR COMMERCE - Customer Account & Order History View
 */

import { orderStore } from '../store/orderStore.js';
import { wishlistStore } from '../store/wishlistStore.js';
import { formatPrice, getSvgIcon } from '../utils/helpers.js';
import { Toast } from '../utils/toast.js';

export const AccountView = {
  activeTab: 'orders', // 'orders' | 'profile' | 'addresses'

  render(routeParams = {}) {
    const orders = orderStore.getOrders();
    const profile = orderStore.getProfile();
    const wishlistCount = wishlistStore.getCount();

    return `
      <div class="container" style="padding: var(--space-8) 0 var(--space-20);">
        <header style="margin-bottom: var(--space-8); padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-border);">
          <nav class="shop-breadcrumbs" aria-label="Breadcrumbs" style="margin-bottom: var(--space-2);">
            <a href="#/home">Home</a>
            <span>/</span>
            <span style="color: var(--color-text-primary); font-weight: 600;">Customer Account</span>
          </nav>
          <div style="display: flex; align-items: baseline; justify-content: space-between;">
            <div>
              <h1 style="font-size: var(--text-3xl);">Client Portal</h1>
              <p class="text-sm text-muted">Welcome back, <strong>${profile.fullName || 'Valued Client'}</strong></p>
            </div>
            <span class="badge badge-gold">Northstar Archival Member</span>
          </div>
        </header>

        <div class="account-layout">
          <!-- Left Navigation Sidebar -->
          <aside class="account-sidebar-nav">
            <button type="button" class="account-nav-btn ${this.activeTab === 'orders' ? 'active' : ''}" data-account-tab="orders">
              Order History (${orders.length})
            </button>
            <button type="button" class="account-nav-btn ${this.activeTab === 'profile' ? 'active' : ''}" data-account-tab="profile">
              Personal Information
            </button>
            <button type="button" class="account-nav-btn ${this.activeTab === 'addresses' ? 'account-nav-btn active' : ''}" data-account-tab="addresses">
              Saved Delivery Addresses
            </button>
            <a href="#/wishlist" class="account-nav-btn" style="display: flex; justify-content: space-between;">
              <span>Saved Wishlist</span>
              <span class="text-xs text-muted">(${wishlistCount})</span>
            </a>
          </aside>

          <!-- Right Tab Content -->
          <main class="account-main-content">
            <!-- ================= TAB 1: ORDER HISTORY ================= -->
            <div id="tab-orders" style="${this.activeTab === 'orders' ? 'display: block;' : 'display: none;'}">
              <div class="section-header" style="margin-bottom: var(--space-6);">
                <div class="section-header-title">
                  <h2 style="font-size: var(--text-xl);">Past Acquisitions & Orders</h2>
                  <p>View fulfillment tracking, item breakdown, and digital receipts.</p>
                </div>
              </div>

              ${orders.length > 0 ? `
                <div class="orders-table-card">
                  ${orders.map(order => `
                    <div class="order-row-item">
                      <div style="display: flex; flex-direction: column; gap: 4px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span style="font-family: var(--font-mono); font-weight: 700; font-size: var(--text-sm);">${order.orderId}</span>
                          <span class="badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-dark'}">${order.status}</span>
                        </div>
                        <div class="text-xs text-muted">
                          Placed on ${new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} • ${order.items.length} item(s)
                        </div>
                        <div class="text-xs text-muted font-mono">
                          Tracking: ${order.trackingNumber} (${order.carrier})
                        </div>
                      </div>

                      <div style="display: flex; align-items: center; gap: var(--space-6);">
                        <div style="text-align: right;">
                          <div style="font-size: var(--text-sm); font-weight: 700;">${formatPrice(order.total)}</div>
                          <div class="text-xs text-muted">${order.payment.method}</div>
                        </div>
                        <a href="#/orders/${order.orderId}" class="btn btn-outline btn-sm">
                          View Receipt
                        </a>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-12); text-align: center;">
                  <p class="text-muted" style="margin-bottom: var(--space-4);">No orders found in your customer history.</p>
                  <a href="#/shop" class="btn btn-primary btn-sm">Explore Collection</a>
                </div>
              `}
            </div>

            <!-- ================= TAB 2: PROFILE ================= -->
            <div id="tab-profile" style="${this.activeTab === 'profile' ? 'display: block;' : 'display: none;'}">
              <div class="section-header" style="margin-bottom: var(--space-6);">
                <div class="section-header-title">
                  <h2 style="font-size: var(--text-xl);">Personal Profile</h2>
                  <p>Manage your account contact preferences.</p>
                </div>
              </div>

              <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-6);">
                <form id="account-profile-form">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
                    <div class="form-group">
                      <label class="form-label">Full Name</label>
                      <input type="text" class="form-input" id="profile-name" value="${profile.fullName || ''}" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Email Address</label>
                      <input type="email" class="form-input" id="profile-email" value="${profile.email || ''}" required />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Phone Number</label>
                    <input type="tel" class="form-input" id="profile-phone" value="${profile.phone || ''}" />
                  </div>
                  <button type="submit" class="btn btn-primary btn-sm" style="margin-top: var(--space-2);">
                    Save Preferences
                  </button>
                </form>
              </div>
            </div>

            <!-- ================= TAB 3: ADDRESSES ================= -->
            <div id="tab-addresses" style="${this.activeTab === 'addresses' ? 'display: block;' : 'display: none;'}">
              <div class="section-header" style="margin-bottom: var(--space-6);">
                <div class="section-header-title">
                  <h2 style="font-size: var(--text-xl);">Saved Delivery Address</h2>
                  <p>Primary destination for complimentary insured courier dispatch.</p>
                </div>
              </div>

              <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-6);">
                <form id="account-address-form">
                  <div class="form-group">
                    <label class="form-label">Street Address</label>
                    <input type="text" class="form-input" id="addr-street" value="${profile.address || ''}" required />
                  </div>
                  <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: var(--space-4);">
                    <div class="form-group">
                      <label class="form-label">City</label>
                      <input type="text" class="form-input" id="addr-city" value="${profile.city || ''}" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">State</label>
                      <input type="text" class="form-input" id="addr-state" value="${profile.state || ''}" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Postal Code</label>
                      <input type="text" class="form-input" id="addr-zip" value="${profile.postalCode || ''}" required />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Country</label>
                    <input type="text" class="form-input" id="addr-country" value="${profile.country || 'United States'}" required />
                  </div>
                  <button type="submit" class="btn btn-primary btn-sm" style="margin-top: var(--space-2);">
                    Update Default Address
                  </button>
                </form>
              </div>
            </div>
          </main>
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

    // Switch Tabs
    const tabBtns = container.querySelectorAll('[data-account-tab]');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTab = btn.getAttribute('data-account-tab');
        refresh();
      });
    });

    // Profile form submit
    const profileForm = container.querySelector('#account-profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName = container.querySelector('#profile-name').value;
        const email = container.querySelector('#profile-email').value;
        const phone = container.querySelector('#profile-phone').value;
        orderStore.saveProfile({ fullName, email, phone });
        refresh();
      });
    }

    // Address form submit
    const addressForm = container.querySelector('#account-address-form');
    if (addressForm) {
      addressForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const address = container.querySelector('#addr-street').value;
        const city = container.querySelector('#addr-city').value;
        const state = container.querySelector('#addr-state').value;
        const postalCode = container.querySelector('#addr-zip').value;
        const country = container.querySelector('#addr-country').value;
        orderStore.saveProfile({ address, city, state, postalCode, country });
        refresh();
      });
    }
  }
};
