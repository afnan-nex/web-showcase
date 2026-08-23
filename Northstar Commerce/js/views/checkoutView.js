/**
 * NORTHSTAR COMMERCE - Multi-Step Checkout View
 */

import { cartStore } from '../store/cartStore.js';
import { orderStore } from '../store/orderStore.js';
import { formatPrice, getSvgIcon } from '../utils/helpers.js';
import { Toast } from '../utils/toast.js';

export const CheckoutView = {
  currentStep: 1, // 1: Shipping Info, 2: Shipping Method, 3: Payment, 4: Review

  formData: {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    shippingMethod: 'standard',
    shippingMethodName: 'Standard Tracked Delivery (3-5 Days)',
    paymentMethod: 'credit-card',
    cardNumber: '•••• •••• •••• ••••',
    cardName: 'YOUR NAME',
    cardExpiry: 'MM/YY',
    cardCvv: ''
  },

  render() {
    const items = cartStore.getItems();
    const summary = cartStore.getSummary();
    const profile = orderStore.getProfile();

    if (items.length === 0) {
      return `
        <div class="container" style="padding: var(--space-20) 0; text-align: center;">
          <h2>Your bag is empty</h2>
          <p class="text-muted" style="margin: var(--space-4) 0 var(--space-8);">Add items to your bag before proceeding to checkout.</p>
          <a href="#/shop" class="btn btn-primary">Discover Catalog</a>
        </div>
      `;
    }

    // Prepopulate from customer profile if fields are empty
    if (!this.formData.email && profile.email) {
      this.formData.email = profile.email;
      const names = (profile.fullName || '').split(' ');
      this.formData.firstName = names[0] || '';
      this.formData.lastName = names.slice(1).join(' ') || '';
      this.formData.phone = profile.phone || '';
      this.formData.address = profile.address || '';
      this.formData.city = profile.city || '';
      this.formData.state = profile.state || '';
      this.formData.postalCode = profile.postalCode || '';
      this.formData.cardName = profile.fullName ? profile.fullName.toUpperCase() : 'YOUR NAME';
    }

    return `
      <div class="checkout-page container">
        <header style="margin-bottom: var(--space-8);">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <nav class="shop-breadcrumbs" aria-label="Breadcrumbs" style="margin-bottom: var(--space-2);">
                <a href="#/cart">Shopping Bag</a>
                <span>/</span>
                <span style="color: var(--color-text-primary); font-weight: 600;">Secure Checkout</span>
              </nav>
              <h1 style="font-size: var(--text-3xl);">Checkout</h1>
            </div>
            <button type="button" class="btn btn-outline btn-sm" id="checkout-autofill-btn" style="background: var(--color-bg-alt);">
              ⚡ Auto-Fill Demo Info
            </button>
          </div>
        </header>

        <!-- Stepper Navigation -->
        <div class="checkout-stepper">
          <div class="checkout-step-item ${this.currentStep === 1 ? 'active' : this.currentStep > 1 ? 'completed' : ''}">
            <span class="checkout-step-num">${this.currentStep > 1 ? '✓' : '1'}</span>
            <span>1. Information</span>
          </div>
          <div class="checkout-step-item ${this.currentStep === 2 ? 'active' : this.currentStep > 2 ? 'completed' : ''}">
            <span class="checkout-step-num">${this.currentStep > 2 ? '✓' : '2'}</span>
            <span>2. Shipping</span>
          </div>
          <div class="checkout-step-item ${this.currentStep === 3 ? 'active' : this.currentStep > 3 ? 'completed' : ''}">
            <span class="checkout-step-num">${this.currentStep > 3 ? '✓' : '3'}</span>
            <span>3. Payment</span>
          </div>
          <div class="checkout-step-item ${this.currentStep === 4 ? 'active' : ''}">
            <span class="checkout-step-num">4</span>
            <span>4. Review & Place</span>
          </div>
        </div>

        <div class="checkout-grid">
          <!-- Left: Step Forms -->
          <div class="checkout-main-forms">
            <!-- ================= STEP 1: CONTACT & SHIPPING ADDRESS ================= -->
            <div id="checkout-step-1" style="${this.currentStep === 1 ? 'display: block;' : 'display: none;'}">
              <div class="checkout-section-card">
                <h3 class="checkout-section-title">
                  <span>Contact Information</span>
                  <span class="text-xs text-muted">Step 1 of 4</span>
                </h3>
                <div class="form-group">
                  <label class="form-label">Email Address *</label>
                  <input type="email" class="form-input" id="co-email" required value="${this.formData.email}" placeholder="alexander.wright@atelier.io" />
                </div>
                <div class="form-group">
                  <label class="form-label">Phone Number (For courier delivery SMS updates) *</label>
                  <input type="tel" class="form-input" id="co-phone" required value="${this.formData.phone}" placeholder="+1 (555) 234-5678" />
                </div>
              </div>

              <div class="checkout-section-card">
                <h3 class="checkout-section-title">Shipping Address</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
                  <div class="form-group">
                    <label class="form-label">First Name *</label>
                    <input type="text" class="form-input" id="co-firstname" required value="${this.formData.firstName}" placeholder="Alexander" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Last Name *</label>
                    <input type="text" class="form-input" id="co-lastname" required value="${this.formData.lastName}" placeholder="Wright" />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Street Address *</label>
                  <input type="text" class="form-input" id="co-address" required value="${this.formData.address}" placeholder="420 Madison Avenue" />
                </div>

                <div class="form-group">
                  <label class="form-label">Apartment, Suite, Unit (Optional)</label>
                  <input type="text" class="form-input" id="co-apartment" value="${this.formData.apartment}" placeholder="Suite 1800" />
                </div>

                <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: var(--space-4);">
                  <div class="form-group">
                    <label class="form-label">City *</label>
                    <input type="text" class="form-input" id="co-city" required value="${this.formData.city}" placeholder="New York" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">State / Region *</label>
                    <input type="text" class="form-input" id="co-state" required value="${this.formData.state}" placeholder="NY" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Postal Code *</label>
                    <input type="text" class="form-input" id="co-zip" required value="${this.formData.postalCode}" placeholder="10017" />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Country</label>
                  <select class="form-select" id="co-country">
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="France">France</option>
                  </select>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center;">
                <a href="#/cart" class="btn btn-link btn-sm">← Back to Bag</a>
                <button type="button" class="btn btn-primary" id="co-btn-step-1-next">
                  Continue to Shipping Method →
                </button>
              </div>
            </div>

            <!-- ================= STEP 2: SHIPPING METHOD ================= -->
            <div id="checkout-step-2" style="${this.currentStep === 2 ? 'display: block;' : 'display: none;'}">
              <div class="checkout-section-card">
                <div style="display: flex; justify-content: space-between; padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-border-subtle); margin-bottom: var(--space-4); font-size: var(--text-sm);">
                  <div>
                    <span class="text-muted">Ship to: </span>
                    <strong>${this.formData.address}, ${this.formData.city}, ${this.formData.state} ${this.formData.postalCode}</strong>
                  </div>
                  <button type="button" class="btn-link text-xs" id="co-edit-address-btn">Change</button>
                </div>

                <h3 class="checkout-section-title">Select Shipping Method</h3>

                <div class="shipping-methods-list">
                  <!-- Standard -->
                  <label class="shipping-method-option ${this.formData.shippingMethod === 'standard' ? 'selected' : ''}">
                    <div style="display: flex; align-items: center; gap: var(--space-3);">
                      <input type="radio" name="co-ship-method" value="standard" ${this.formData.shippingMethod === 'standard' ? 'checked' : ''} style="accent-color: var(--color-accent);" />
                      <div>
                        <div style="font-weight: 600; font-size: var(--text-sm);">Standard Tracked Delivery (3–5 Business Days)</div>
                        <div class="text-xs text-muted">Dispatched via DHL Ground / USPS Priority</div>
                      </div>
                    </div>
                    <div style="font-weight: 700; font-size: var(--text-sm);">
                      ${summary.isFreeShipping ? '<span style="color: var(--color-success);">FREE</span>' : '$15.00'}
                    </div>
                  </label>

                  <!-- Express -->
                  <label class="shipping-method-option ${this.formData.shippingMethod === 'express' ? 'selected' : ''}">
                    <div style="display: flex; align-items: center; gap: var(--space-3);">
                      <input type="radio" name="co-ship-method" value="express" ${this.formData.shippingMethod === 'express' ? 'checked' : ''} style="accent-color: var(--color-accent);" />
                      <div>
                        <div style="font-weight: 600; font-size: var(--text-sm);">Express Priority Air (1–2 Business Days)</div>
                        <div class="text-xs text-muted">DHL Air Express with signature confirmation</div>
                      </div>
                    </div>
                    <div style="font-weight: 700; font-size: var(--text-sm);">$25.00</div>
                  </label>

                  <!-- Overnight White Glove -->
                  <label class="shipping-method-option ${this.formData.shippingMethod === 'overnight' ? 'selected' : ''}">
                    <div style="display: flex; align-items: center; gap: var(--space-3);">
                      <input type="radio" name="co-ship-method" value="overnight" ${this.formData.shippingMethod === 'overnight' ? 'checked' : ''} style="accent-color: var(--color-accent);" />
                      <div>
                        <div style="font-weight: 600; font-size: var(--text-sm);">White-Glove Next Day Morning Delivery</div>
                        <div class="text-xs text-muted">Hand-carried courier with scheduled delivery window</div>
                      </div>
                    </div>
                    <div style="font-weight: 700; font-size: var(--text-sm);">$45.00</div>
                  </label>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center;">
                <button type="button" class="btn btn-outline btn-sm" id="co-btn-step-2-back">← Back to Information</button>
                <button type="button" class="btn btn-primary" id="co-btn-step-2-next">
                  Continue to Payment →
                </button>
              </div>
            </div>

            <!-- ================= STEP 3: PAYMENT ================= -->
            <div id="checkout-step-3" style="${this.currentStep === 3 ? 'display: block;' : 'display: none;'}">
              <!-- Live Interactive Credit Card Preview -->
              <div class="credit-card-preview">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: var(--text-xs); letter-spacing: 0.15em; font-weight: 700;">NORTHSTAR ATELIER</span>
                  <div class="card-preview-chip"></div>
                </div>
                <div class="card-preview-number" id="card-preview-num-el">${this.formData.cardNumber || '•••• •••• •••• ••••'}</div>
                <div class="card-preview-bottom">
                  <div>
                    <div style="font-size: 9px; opacity: 0.7;">CARDHOLDER</div>
                    <div id="card-preview-name-el" style="font-weight: 600;">${this.formData.cardName || 'YOUR NAME'}</div>
                  </div>
                  <div>
                    <div style="font-size: 9px; opacity: 0.7;">EXPIRES</div>
                    <div id="card-preview-exp-el" style="font-weight: 600;">${this.formData.cardExpiry || 'MM/YY'}</div>
                  </div>
                </div>
              </div>

              <div class="checkout-section-card">
                <h3 class="checkout-section-title">Payment Method</h3>

                <div style="display: flex; gap: var(--space-4); margin-bottom: var(--space-6);">
                  <label class="form-checkbox-label" style="flex: 1; padding: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-xs);">
                    <input type="radio" name="co-payment-type" value="credit-card" checked style="accent-color: var(--color-accent);" />
                    <span style="font-weight: 600;">Credit / Debit Card</span>
                  </label>
                  <label class="form-checkbox-label" style="flex: 1; padding: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-xs);">
                    <input type="radio" name="co-payment-type" value="apple-pay" style="accent-color: var(--color-accent);" />
                    <span>Apple / Google Pay</span>
                  </label>
                </div>

                <div id="credit-card-fields-group">
                  <div class="form-group">
                    <label class="form-label">Card Number *</label>
                    <input type="text" class="form-input font-mono" id="co-card-num" maxlength="19" placeholder="4242 •••• •••• 4242" value="${this.formData.cardNumber === '•••• •••• •••• ••••' ? '4242 8812 9934 4242' : this.formData.cardNumber}" />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Cardholder Name *</label>
                    <input type="text" class="form-input" id="co-card-name" placeholder="Alexander Wright" value="${this.formData.cardName}" />
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
                    <div class="form-group">
                      <label class="form-label">Expiration (MM/YY) *</label>
                      <input type="text" class="form-input font-mono" id="co-card-exp" maxlength="5" placeholder="12/28" value="${this.formData.cardExpiry === 'MM/YY' ? '12/28' : this.formData.cardExpiry}" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">CVV Security Code *</label>
                      <input type="password" class="form-input font-mono" id="co-card-cvv" maxlength="4" placeholder="•••" value="842" />
                    </div>
                  </div>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center;">
                <button type="button" class="btn btn-outline btn-sm" id="co-btn-step-3-back">← Back to Shipping</button>
                <button type="button" class="btn btn-primary" id="co-btn-step-3-next">
                  Review Complete Order →
                </button>
              </div>
            </div>

            <!-- ================= STEP 4: REVIEW & PLACE ORDER ================= -->
            <div id="checkout-step-4" style="${this.currentStep === 4 ? 'display: block;' : 'display: none;'}">
              <div class="checkout-section-card">
                <h3 class="checkout-section-title">Final Order Confirmation</h3>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); font-size: var(--text-sm); margin-bottom: var(--space-6); padding-bottom: var(--space-6); border-bottom: 1px solid var(--color-border-subtle);">
                  <div>
                    <div class="text-xs text-muted text-uppercase" style="letter-spacing: 0.05em; margin-bottom: 4px;">Delivering To:</div>
                    <div style="font-weight: 600;">${this.formData.firstName} ${this.formData.lastName}</div>
                    <div class="text-muted">${this.formData.address}</div>
                    <div class="text-muted">${this.formData.city}, ${this.formData.state} ${this.formData.postalCode}</div>
                    <div class="text-muted">${this.formData.email} • ${this.formData.phone}</div>
                  </div>
                  <div>
                    <div class="text-xs text-muted text-uppercase" style="letter-spacing: 0.05em; margin-bottom: 4px;">Method & Payment:</div>
                    <div style="font-weight: 600;">${this.formData.shippingMethodName}</div>
                    <div class="text-muted" style="margin-top: 4px;">Paid via: Credit Card (ending in 4242)</div>
                    <div style="color: var(--color-success); font-size: var(--text-xs); margin-top: 4px;">✓ Instant Verification Active</div>
                  </div>
                </div>

                <!-- Items Review Strip -->
                <div style="display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-6);">
                  ${items.map(item => `
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: var(--text-sm);">
                      <div style="display: flex; align-items: center; gap: var(--space-3);">
                        <img src="${item.image}" alt="${item.name}" style="width: 48px; height: 58px; object-fit: cover; border-radius: var(--radius-xs);" />
                        <div>
                          <div style="font-weight: 600;">${item.name}</div>
                          <div class="text-xs text-muted">${item.color} • ${item.size} × ${item.quantity}</div>
                        </div>
                      </div>
                      <div style="font-weight: 700;">${formatPrice(item.price * item.quantity)}</div>
                    </div>
                  `).join('')}
                </div>

                <div style="background-color: var(--color-bg-alt); padding: var(--space-4); border-radius: var(--radius-xs); font-size: var(--text-xs); color: var(--color-text-secondary); line-height: 1.5; margin-bottom: var(--space-6);">
                  By selecting <strong>"Authorize & Place Order"</strong>, you agree to Northstar Commerce's terms of service and acknowledge that your payment method will be charged <strong>${formatPrice(summary.grandTotal)}</strong>.
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <button type="button" class="btn btn-outline btn-sm" id="co-btn-step-4-back">← Edit Payment</button>
                  <button type="button" class="btn btn-primary btn-lg" id="co-btn-place-order" style="min-width: 240px;">
                    Authorize & Place Order (${formatPrice(summary.grandTotal)})
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Sticky Order Summary Sidebar -->
          <aside class="checkout-summary-sidebar" style="position: sticky; top: calc(var(--header-height) + var(--space-4));">
            <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-6);">
              <h3 style="font-size: var(--text-md); font-weight: 600; margin-bottom: var(--space-4); padding-bottom: var(--space-3); border-bottom: 1px solid var(--color-border);">
                Summary (${summary.itemsCount} items)
              </h3>

              <div style="display: flex; flex-direction: column; gap: var(--space-3); max-height: 240px; overflow-y: auto; margin-bottom: var(--space-4); padding-right: 4px;">
                ${items.map(item => `
                  <div style="display: flex; align-items: center; justify-content: space-between; font-size: var(--text-xs);">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <img src="${item.image}" alt="${item.name}" style="width: 36px; height: 44px; object-fit: cover; border-radius: 2px;" />
                      <div>
                        <div style="font-weight: 600; max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
                        <div class="text-muted">Qty: ${item.quantity}</div>
                      </div>
                    </div>
                    <div style="font-weight: 600;">${formatPrice(item.price * item.quantity)}</div>
                  </div>
                `).join('')}
              </div>

              <div class="divider-subtle"></div>

              <div style="display: flex; flex-direction: column; gap: 6px; font-size: var(--text-xs); margin-bottom: var(--space-4);">
                <div class="flex justify-between">
                  <span class="text-muted">Subtotal</span>
                  <span>${formatPrice(summary.subtotal)}</span>
                </div>
                ${summary.discount > 0 ? `
                  <div class="flex justify-between" style="color: var(--color-danger);">
                    <span>Discount (${summary.couponCode})</span>
                    <span>-${formatPrice(summary.discount)}</span>
                  </div>
                ` : ''}
                <div class="flex justify-between">
                  <span class="text-muted">Shipping</span>
                  <span>${summary.shippingFee === 0 ? '<span style="color: var(--color-success); font-weight: 600;">FREE</span>' : formatPrice(summary.shippingFee)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted">Estimated Tax (8%)</span>
                  <span>${formatPrice(summary.estimatedTax)}</span>
                </div>
                <div class="divider-subtle" style="margin: 4px 0;"></div>
                <div class="flex justify-between" style="font-size: var(--text-base); font-weight: 700;">
                  <span>Grand Total</span>
                  <span>${formatPrice(summary.grandTotal)}</span>
                </div>
              </div>

              <!-- Promo Code in Checkout -->
              ${summary.couponCode ? `
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; background: var(--color-bg-alt); padding: 6px 10px; border-radius: 2px;">
                  <span style="font-family: var(--font-mono); font-weight: 600;">CODE: ${summary.couponCode}</span>
                  <span style="color: var(--color-success); font-weight: 600;">Applied</span>
                </div>
              ` : `
                <div class="promo-box">
                  <input type="text" class="promo-input" id="co-sidebar-promo-input" placeholder="Promo code" />
                  <button type="button" class="btn btn-secondary btn-sm" id="co-sidebar-apply-btn">Apply</button>
                </div>
              `}
            </div>
          </aside>
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

    // Auto-fill Demo Information button
    const autofillBtn = container.querySelector('#checkout-autofill-btn');
    if (autofillBtn) {
      autofillBtn.addEventListener('click', () => {
        this.formData.email = 'alexander.wright@atelier.io';
        this.formData.phone = '+1 (555) 234-5678';
        this.formData.firstName = 'Alexander';
        this.formData.lastName = 'Wright';
        this.formData.address = '420 Madison Avenue';
        this.formData.apartment = 'Suite 1800';
        this.formData.city = 'New York';
        this.formData.state = 'NY';
        this.formData.postalCode = '10017';
        this.formData.country = 'United States';
        this.formData.cardNumber = '4242 8812 9934 4242';
        this.formData.cardName = 'ALEXANDER WRIGHT';
        this.formData.cardExpiry = '12/28';
        Toast.success('Populated form with verified demo customer details.');
        refresh();
      });
    }

    // Step 1: Validate & Next
    const step1Next = container.querySelector('#co-btn-step-1-next');
    if (step1Next) {
      step1Next.addEventListener('click', () => {
        const email = container.querySelector('#co-email')?.value.trim();
        const phone = container.querySelector('#co-phone')?.value.trim();
        const firstName = container.querySelector('#co-firstname')?.value.trim();
        const lastName = container.querySelector('#co-lastname')?.value.trim();
        const address = container.querySelector('#co-address')?.value.trim();
        const city = container.querySelector('#co-city')?.value.trim();
        const state = container.querySelector('#co-state')?.value.trim();
        const zip = container.querySelector('#co-zip')?.value.trim();

        if (!email || !firstName || !lastName || !address || !city || !state || !zip) {
          Toast.error('Please complete all required shipping fields.');
          return;
        }

        this.formData.email = email;
        this.formData.phone = phone || '+1 (555) 000-0000';
        this.formData.firstName = firstName;
        this.formData.lastName = lastName;
        this.formData.address = address;
        this.formData.apartment = container.querySelector('#co-apartment')?.value.trim() || '';
        this.formData.city = city;
        this.formData.state = state;
        this.formData.postalCode = zip;
        this.formData.country = container.querySelector('#co-country')?.value || 'United States';

        this.currentStep = 2;
        refresh();
      });
    }

    // Step 2: Shipping method change & Next
    const shipRadios = container.querySelectorAll('input[name="co-ship-method"]');
    shipRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const method = e.target.value;
        this.formData.shippingMethod = method;
        cartStore.setShippingMethod(method);

        if (method === 'standard') this.formData.shippingMethodName = 'Standard Tracked Delivery (3–5 Days)';
        if (method === 'express') this.formData.shippingMethodName = 'Express Priority Air (1–2 Days)';
        if (method === 'overnight') this.formData.shippingMethodName = 'White-Glove Next Day Morning Delivery';

        refresh();
      });
    });

    const step2Next = container.querySelector('#co-btn-step-2-next');
    const step2Back = container.querySelector('#co-btn-step-2-back');
    const editAddress = container.querySelector('#co-edit-address-btn');

    if (step2Next) {
      step2Next.addEventListener('click', () => {
        this.currentStep = 3;
        refresh();
      });
    }
    if (step2Back || editAddress) {
      const backHandler = () => {
        this.currentStep = 1;
        refresh();
      };
      if (step2Back) step2Back.addEventListener('click', backHandler);
      if (editAddress) editAddress.addEventListener('click', backHandler);
    }

    // Step 3: Card live inputs & Next
    const cardNumInput = container.querySelector('#co-card-num');
    const cardNameInput = container.querySelector('#co-card-name');
    const cardExpInput = container.querySelector('#co-card-exp');

    if (cardNumInput) {
      cardNumInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
        val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = val;
        this.formData.cardNumber = val || '•••• •••• •••• ••••';
        const el = container.querySelector('#card-preview-num-el');
        if (el) el.textContent = this.formData.cardNumber;
      });
    }

    if (cardNameInput) {
      cardNameInput.addEventListener('input', (e) => {
        this.formData.cardName = e.target.value.toUpperCase() || 'YOUR NAME';
        const el = container.querySelector('#card-preview-name-el');
        if (el) el.textContent = this.formData.cardName;
      });
    }

    if (cardExpInput) {
      cardExpInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2);
        e.target.value = val;
        this.formData.cardExpiry = val || 'MM/YY';
        const el = container.querySelector('#card-preview-exp-el');
        if (el) el.textContent = this.formData.cardExpiry;
      });
    }

    const step3Next = container.querySelector('#co-btn-step-3-next');
    const step3Back = container.querySelector('#co-btn-step-3-back');

    if (step3Next) {
      step3Next.addEventListener('click', () => {
        this.currentStep = 4;
        refresh();
      });
    }
    if (step3Back) {
      step3Back.addEventListener('click', () => {
        this.currentStep = 2;
        refresh();
      });
    }

    // Step 4: Final Place Order Action
    const placeOrderBtn = container.querySelector('#co-btn-place-order');
    const step4Back = container.querySelector('#co-btn-step-4-back');

    if (step4Back) {
      step4Back.addEventListener('click', () => {
        this.currentStep = 3;
        refresh();
      });
    }

    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', () => {
        placeOrderBtn.disabled = true;
        placeOrderBtn.innerHTML = `
          <span style="display: inline-block; animation: spin 1s linear infinite; margin-right: 8px;">↻</span>
          Authorizing Transaction...
        `;

        setTimeout(() => {
          try {
            const order = orderStore.createOrder(this.formData);
            this.currentStep = 1; // reset stepper
            window.location.hash = `#/orders/${order.orderId}`;
          } catch (err) {
            Toast.error(err.message || 'Payment failed.');
            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'Authorize & Place Order';
          }
        }, 1200);
      });
    }

    // Promo code in sidebar
    const sidebarApply = container.querySelector('#co-sidebar-apply-btn');
    if (sidebarApply) {
      sidebarApply.addEventListener('click', () => {
        const input = container.querySelector('#co-sidebar-promo-input');
        if (input && input.value) {
          cartStore.applyCoupon(input.value.trim());
          refresh();
        }
      });
    }
  }
};
