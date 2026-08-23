/**
 * SUMMIT EVENTS — CHECKOUT & SEAT MAP ENGINE
 * Handles ticket selection, interactive seat grid, multi-step checkout flow, discount codes, and digital ticket issuance.
 */

const SummitCheckout = {
  currentEvent: null,
  selectedTier: null,
  quantity: 1,
  selectedSeats: [],
  appliedPromo: null,
  currentStep: 1,

  /**
   * Initialize checkout modal in DOM if not present
   */
  init() {
    this.createCheckoutModalDOM();
    this.createSeatMapModalDOM();
    this.bindGlobalEvents();
  },

  bindGlobalEvents() {
    // Escape or close buttons
    document.addEventListener("click", (e) => {
      if (e.target.matches(".checkout-modal-close, .checkout-modal-backdrop")) {
        this.closeCheckoutModal();
      }
      if (e.target.matches(".seatmap-modal-close, .seatmap-modal-backdrop")) {
        this.closeSeatMapModal();
      }
    });
  },

  /**
   * Start Checkout for an event and optional tier
   */
  startCheckout(event, defaultTierId = null, preselectedQty = 1) {
    if (typeof event === "string") {
      event = SummitStorage.getEventById(event);
    }
    if (!event) return;

    this.currentEvent = event;
    this.quantity = preselectedQty || 1;
    this.selectedSeats = [];
    this.appliedPromo = null;
    this.currentStep = 1;

    // Pick first tier if none specified
    if (defaultTierId && event.ticketTiers) {
      this.selectedTier = event.ticketTiers.find(t => t.id === defaultTierId) || event.ticketTiers[0];
    } else if (event.ticketTiers && event.ticketTiers.length > 0) {
      this.selectedTier = event.ticketTiers[0];
    } else {
      this.selectedTier = {
        id: "tier-ga",
        name: "General Admission",
        price: event.minPrice || 50,
        fee: Math.round((event.minPrice || 50) * 0.08 * 100) / 100,
        available: 100,
        description: "Full entry access to the event."
      };
    }

    this.renderStep1();
    this.openCheckoutModal();
  },

  openCheckoutModal() {
    const modal = document.getElementById("summit-checkout-modal");
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  },

  closeCheckoutModal() {
    const modal = document.getElementById("summit-checkout-modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  },

  // ----------------- MODAL DOM CREATION -----------------
  createCheckoutModalDOM() {
    if (document.getElementById("summit-checkout-modal")) return;

    const modalHTML = `
      <div id="summit-checkout-modal" class="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <div class="checkout-modal-backdrop"></div>
        <div class="checkout-modal-container animate-scale-up">
          <!-- Modal Header -->
          <div class="checkout-header">
            <div class="checkout-header-info">
              <span class="checkout-brand-badge">SUMMIT SECURE TICKETING</span>
              <h2 id="checkout-title" class="checkout-modal-title">Complete Your Reservation</h2>
            </div>
            <button type="button" class="checkout-modal-close" aria-label="Close Checkout">&times;</button>
          </div>

          <!-- Checkout Stepper Progress -->
          <div class="checkout-stepper">
            <div class="step-node active" data-step="1">
              <span class="step-num">1</span>
              <span class="step-label">Tickets & Seats</span>
            </div>
            <div class="step-divider"></div>
            <div class="step-node" data-step="2">
              <span class="step-num">2</span>
              <span class="step-label">Attendee Info</span>
            </div>
            <div class="step-divider"></div>
            <div class="step-node" data-step="3">
              <span class="step-num">3</span>
              <span class="step-label">Payment</span>
            </div>
            <div class="step-divider"></div>
            <div class="step-node" data-step="4">
              <span class="step-num">4</span>
              <span class="step-label">Pass</span>
            </div>
          </div>

          <!-- Main Dynamic Body -->
          <div id="checkout-dynamic-body" class="checkout-body">
            <!-- Rendered by JS steps -->
          </div>
        </div>
      </div>
    `;

    const div = document.createElement("div");
    div.innerHTML = modalHTML;
    document.body.appendChild(div.firstElementChild);
  },

  updateStepper(stepNumber) {
    this.currentStep = stepNumber;
    const nodes = document.querySelectorAll(".checkout-stepper .step-node");
    nodes.forEach(node => {
      const step = parseInt(node.getAttribute("data-step"));
      if (step === stepNumber) {
        node.className = "step-node active";
      } else if (step < stepNumber) {
        node.className = "step-node completed";
      } else {
        node.className = "step-node";
      }
    });
  },

  // ----------------- CALCULATION HELPERS -----------------
  calculateTotals() {
    if (!this.selectedTier) return { subtotal: 0, fees: 0, discount: 0, total: 0 };

    const tierPrice = this.selectedTier.price;
    const feePerTicket = this.selectedTier.fee || Math.round(tierPrice * 0.08 * 100) / 100;
    
    const subtotal = tierPrice * this.quantity;
    const fees = feePerTicket * this.quantity;
    let discount = 0;

    if (this.appliedPromo) {
      if (this.appliedPromo.discountType === "percent") {
        discount = (subtotal * this.appliedPromo.value) / 100;
      } else if (this.appliedPromo.discountType === "fixed") {
        discount = Math.min(this.appliedPromo.value, subtotal);
      }
    }

    const total = Math.max(0, subtotal + fees - discount);

    return {
      subtotal,
      fees,
      discount,
      total,
      formattedSubtotal: SummitUI.formatCurrency(subtotal),
      formattedFees: SummitUI.formatCurrency(fees),
      formattedDiscount: SummitUI.formatCurrency(discount),
      formattedTotal: SummitUI.formatCurrency(total)
    };
  },

  // ----------------- STEP 1: TICKET SELECTION & SEATS -----------------
  renderStep1() {
    this.updateStepper(1);
    const container = document.getElementById("checkout-dynamic-body");
    const totals = this.calculateTotals();
    const event = this.currentEvent;
    const tiers = event.ticketTiers || [];

    const isSeatedEvent = event.isSeated;
    const requiresSeatPick = this.selectedTier && this.selectedTier.requiresSeatMap;

    let tiersHTML = tiers.map(tier => {
      const isSelected = this.selectedTier && this.selectedTier.id === tier.id;
      const isSoldOut = tier.available <= 0;

      return `
        <div class="checkout-tier-card ${isSelected ? 'selected' : ''} ${isSoldOut ? 'sold-out' : ''}" 
             data-tier-id="${tier.id}">
          <div class="tier-radio">
            <span class="custom-radio ${isSelected ? 'checked' : ''}"></span>
          </div>
          <div class="tier-details">
            <div class="tier-top-row">
              <h4 class="tier-name">${tier.name}</h4>
              <span class="tier-price">${SummitUI.formatCurrency(tier.price)}</span>
            </div>
            <p class="tier-desc">${tier.description || ''}</p>
            <div class="tier-meta">
              <span class="tier-stock ${tier.available < 20 ? 'stock-low' : ''}">
                ${isSoldOut ? 'Sold Out' : `• Only ${tier.available} left`}
              </span>
              ${tier.requiresSeatMap ? '<span class="badge badge-seat">Interactive Seat Choice</span>' : ''}
            </div>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <div class="checkout-grid">
        <!-- Left: Selection -->
        <div class="checkout-main-col">
          <div class="checkout-section-header">
            <div class="event-mini-preview">
              <img src="${event.posterImage || event.heroImage}" alt="${event.title}" class="mini-poster" />
              <div>
                <span class="event-tag">${event.categoryLabel || event.category}</span>
                <h3 class="event-mini-title">${event.title}</h3>
                <p class="event-mini-meta">${event.dateDisplay} • ${event.venueName}</p>
              </div>
            </div>
          </div>

          <h4 class="checkout-subheading">1. Select Ticket Tier</h4>
          <div class="checkout-tiers-list">
            ${tiersHTML}
          </div>

          <div class="checkout-qty-and-seat-row">
            <div class="qty-selector-wrap">
              <label class="field-label">Quantity</label>
              <div class="qty-counter">
                <button type="button" class="qty-btn" id="btn-qty-minus" ${this.quantity <= 1 ? 'disabled' : ''}>-</button>
                <span class="qty-val" id="qty-val-display">${this.quantity}</span>
                <button type="button" class="qty-btn" id="btn-qty-plus" ${this.quantity >= Math.min(8, this.selectedTier ? this.selectedTier.available : 8) ? 'disabled' : ''}>+</button>
              </div>
              <span class="qty-limit-note">Max 8 tickets per transaction</span>
            </div>

            ${isSeatedEvent ? `
              <div class="seat-picker-trigger-wrap">
                <label class="field-label">Seat Assignment</label>
                <button type="button" class="btn btn-secondary btn-seat-select-trigger" id="trigger-seat-map-btn">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>
                  ${this.selectedSeats.length > 0 ? `Selected Seats (${this.selectedSeats.length})` : 'Choose Seats on Map'}
                </button>
                <div class="selected-seats-badge-list" id="selected-seats-badge-list">
                  ${this.selectedSeats.map(s => `<span class="seat-chip">${s}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Promo Code Bar -->
          <div class="checkout-promo-box">
            <label class="field-label">Promotional / Discount Code</label>
            <div class="promo-input-group">
              <input type="text" id="promo-code-input" placeholder="e.g. SUMMIT2026, VIPACCESS" value="${this.appliedPromo ? this.appliedPromo.code : ''}" />
              <button type="button" class="btn btn-outline" id="btn-apply-promo">Apply</button>
            </div>
            ${this.appliedPromo ? `
              <div class="promo-applied-badge">
                <span>Code <strong>${this.appliedPromo.code}</strong> applied (${this.appliedPromo.description})</span>
                <button type="button" class="remove-promo" id="btn-remove-promo">&times;</button>
              </div>
            ` : ''}
            <div class="promo-hint-row">
              <span>Try codes: <strong class="code-pill">SUMMIT2026</strong> (20% off) or <strong class="code-pill">VIPACCESS</strong> ($50 off)</span>
            </div>
          </div>
        </div>

        <!-- Right: Order Summary Sidebar -->
        <div class="checkout-sidebar-col">
          <div class="order-summary-box">
            <h4 class="summary-title">Order Summary</h4>
            <div class="summary-line">
              <span>${this.selectedTier.name} &times; ${this.quantity}</span>
              <span>${totals.formattedSubtotal}</span>
            </div>
            <div class="summary-line">
              <span>Service & Facility Fees</span>
              <span>${totals.formattedFees}</span>
            </div>
            ${totals.discount > 0 ? `
              <div class="summary-line line-discount">
                <span>Discount Applied</span>
                <span>-${totals.formattedDiscount}</span>
              </div>
            ` : ''}
            <div class="summary-divider"></div>
            <div class="summary-total-line">
              <span>Total Amount</span>
              <span class="total-price">${totals.formattedTotal}</span>
            </div>

            <button type="button" class="btn btn-primary btn-block btn-lg" id="btn-proceed-step2">
              Continue to Attendee Info &rarr;
            </button>
            <div class="security-guarantee">
              <svg class="icon-secure" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>Guaranteed 100% Authentic Tickets with Digital QR Pass</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Tier selection events
    container.querySelectorAll(".checkout-tier-card:not(.sold-out)").forEach(card => {
      card.addEventListener("click", () => {
        const tierId = card.getAttribute("data-tier-id");
        this.selectedTier = this.currentEvent.ticketTiers.find(t => t.id === tierId);
        // adjust quantity if exceeds tier availability
        if (this.quantity > this.selectedTier.available) {
          this.quantity = Math.max(1, this.selectedTier.available);
        }
        this.renderStep1();
      });
    });

    // Quantity events
    const btnMinus = document.getElementById("btn-qty-minus");
    const btnPlus = document.getElementById("btn-qty-plus");
    if (btnMinus) {
      btnMinus.addEventListener("click", () => {
        if (this.quantity > 1) {
          this.quantity--;
          // Trim seats if necessary
          if (this.selectedSeats.length > this.quantity) {
            this.selectedSeats = this.selectedSeats.slice(0, this.quantity);
          }
          this.renderStep1();
        }
      });
    }
    if (btnPlus) {
      btnPlus.addEventListener("click", () => {
        const maxAvail = Math.min(8, this.selectedTier ? this.selectedTier.available : 8);
        if (this.quantity < maxAvail) {
          this.quantity++;
          this.renderStep1();
        } else {
          SummitUI.showToast(`Maximum ${maxAvail} tickets available for this tier`, "info");
        }
      });
    }

    // Seat map trigger
    const triggerSeatMapBtn = document.getElementById("trigger-seat-map-btn");
    if (triggerSeatMapBtn) {
      triggerSeatMapBtn.addEventListener("click", () => {
        this.openSeatMapModal();
      });
    }

    // Promo code apply
    const btnApplyPromo = document.getElementById("btn-apply-promo");
    if (btnApplyPromo) {
      btnApplyPromo.addEventListener("click", () => {
        const input = document.getElementById("promo-code-input");
        const code = (input.value || "").trim().toUpperCase();
        if (!code) return;

        const promo = SEED_PROMO_CODES.find(p => p.code === code);
        if (promo) {
          this.appliedPromo = promo;
          SummitUI.showToast(`Promo code "${promo.code}" applied! ${promo.description}`, "success");
          this.renderStep1();
        } else {
          SummitUI.showToast("Invalid promo code. Try SUMMIT2026 or VIPACCESS", "error");
        }
      });
    }

    // Remove promo
    const btnRemovePromo = document.getElementById("btn-remove-promo");
    if (btnRemovePromo) {
      btnRemovePromo.addEventListener("click", () => {
        this.appliedPromo = null;
        this.renderStep1();
      });
    }

    // Quick promo pills click
    container.querySelectorAll(".code-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        const input = document.getElementById("promo-code-input");
        if (input) {
          input.value = pill.textContent;
          if (btnApplyPromo) btnApplyPromo.click();
        }
      });
    });

    // Proceed to Step 2
    const btnProceedStep2 = document.getElementById("btn-proceed-step2");
    if (btnProceedStep2) {
      btnProceedStep2.addEventListener("click", () => {
        // If seated event and requires seat map, ensure seat is picked or auto-assign
        if (this.currentEvent.isSeated && this.selectedSeats.length < this.quantity) {
          // Auto assign remaining seats
          const autoAssigned = [];
          for (let i = 1; i <= this.quantity; i++) {
            autoAssigned.push(`Sec A • Row ${Math.ceil(i/4)} • Seat ${10 + i}`);
          }
          this.selectedSeats = autoAssigned;
        }
        this.renderStep2();
      });
    }
  },

  // ----------------- STEP 2: ATTENDEE INFORMATION -----------------
  renderStep2() {
    this.updateStepper(2);
    const container = document.getElementById("checkout-dynamic-body");
    const totals = this.calculateTotals();
    const user = SummitStorage.getUser();

    container.innerHTML = `
      <div class="checkout-grid">
        <div class="checkout-main-col">
          <h4 class="checkout-subheading">2. Attendee & Contact Information</h4>
          <p class="checkout-step-intro">Your digital passes and receipt will be delivered instantly to this email address.</p>

          <form id="checkout-attendee-form" class="checkout-form">
            <div class="form-row">
              <div class="form-group flex-1">
                <label for="attendee-first-name" class="field-label required">First Name</label>
                <input type="text" id="attendee-first-name" class="form-control" required value="${(user.name || '').split(' ')[0] || ''}" placeholder="Jane" />
              </div>
              <div class="form-group flex-1">
                <label for="attendee-last-name" class="field-label required">Last Name</label>
                <input type="text" id="attendee-last-name" class="form-control" required value="${(user.name || '').split(' ').slice(1).join(' ') || ''}" placeholder="Doe" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label for="attendee-email" class="field-label required">Email Address</label>
                <input type="email" id="attendee-email" class="form-control" required value="${user.email || ''}" placeholder="jane.doe@example.com" />
              </div>
              <div class="form-group flex-1">
                <label for="attendee-phone" class="field-label required">Mobile Phone (For SMS entry pass)</label>
                <input type="tel" id="attendee-phone" class="form-control" required value="${user.phone || '+1 (555) 019-2834'}" placeholder="+1 (555) 000-0000" />
              </div>
            </div>

            <div class="form-group">
              <label for="attendee-badge-title" class="field-label">Company / Badge Title (Optional)</label>
              <input type="text" id="attendee-badge-title" class="form-control" placeholder="e.g. Lead Designer @ Acme Studio" />
            </div>

            <div class="form-check">
              <input type="checkbox" id="chk-save-profile" checked />
              <label for="chk-save-profile">Save this attendee information to my Summit profile for future bookings</label>
            </div>

            <div class="form-check">
              <input type="checkbox" id="chk-agree-terms" required checked />
              <label for="chk-agree-terms">I agree to Summit Events Ticketing Terms and venue entry policies</label>
            </div>
          </form>
        </div>

        <div class="checkout-sidebar-col">
          <div class="order-summary-box">
            <h4 class="summary-title">Order Summary</h4>
            <div class="summary-event-item">
              <strong>${this.currentEvent.title}</strong>
              <div class="text-muted text-sm">${this.selectedTier.name} &times; ${this.quantity}</div>
              ${this.selectedSeats.length > 0 ? `<div class="text-accent text-xs">${this.selectedSeats.join(', ')}</div>` : ''}
            </div>
            <div class="summary-divider"></div>
            <div class="summary-line">
              <span>Subtotal</span>
              <span>${totals.formattedSubtotal}</span>
            </div>
            <div class="summary-line">
              <span>Fees</span>
              <span>${totals.formattedFees}</span>
            </div>
            ${totals.discount > 0 ? `
              <div class="summary-line line-discount">
                <span>Discount</span>
                <span>-${totals.formattedDiscount}</span>
              </div>
            ` : ''}
            <div class="summary-divider"></div>
            <div class="summary-total-line">
              <span>Total</span>
              <span class="total-price">${totals.formattedTotal}</span>
            </div>

            <div class="btn-group-stacked">
              <button type="button" class="btn btn-primary btn-block btn-lg" id="btn-proceed-step3">
                Continue to Payment &rarr;
              </button>
              <button type="button" class="btn btn-ghost btn-block" id="btn-back-step1">
                &larr; Back to Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("btn-back-step1").addEventListener("click", () => this.renderStep1());
    
    document.getElementById("btn-proceed-step3").addEventListener("click", () => {
      const fn = document.getElementById("attendee-first-name").value.trim();
      const ln = document.getElementById("attendee-last-name").value.trim();
      const em = document.getElementById("attendee-email").value.trim();
      const ph = document.getElementById("attendee-phone").value.trim();
      const terms = document.getElementById("chk-agree-terms").checked;

      if (!fn || !ln || !em || !ph) {
        SummitUI.showToast("Please fill in all required attendee fields", "error");
        return;
      }

      if (!terms) {
        SummitUI.showToast("Please accept the terms and entry policies to proceed", "error");
        return;
      }

      this.attendeeData = {
        name: `${fn} ${ln}`,
        email: em,
        phone: ph,
        badgeTitle: (document.getElementById("attendee-badge-title").value || "").trim()
      };

      if (document.getElementById("chk-save-profile").checked) {
        SummitStorage.saveUser({
          name: this.attendeeData.name,
          email: this.attendeeData.email,
          phone: this.attendeeData.phone
        });
      }

      this.renderStep3();
    });
  },

  // ----------------- STEP 3: PAYMENT SIMULATION -----------------
  renderStep3() {
    this.updateStepper(3);
    const container = document.getElementById("checkout-dynamic-body");
    const totals = this.calculateTotals();

    container.innerHTML = `
      <div class="checkout-grid">
        <div class="checkout-main-col">
          <h4 class="checkout-subheading">3. Secure Payment Simulation</h4>
          <p class="checkout-step-intro">Select your preferred payment method. This is an interactive high-fidelity simulation.</p>

          <!-- Payment Tabs -->
          <div class="payment-methods-tabs">
            <button type="button" class="pay-tab active" data-tab="card">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              Credit / Debit Card
            </button>
            <button type="button" class="pay-tab" data-tab="applepay">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/></svg>
              Apple Pay / GPay
            </button>
            <button type="button" class="pay-tab" data-tab="credits">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Summit Patron Pass
            </button>
          </div>

          <!-- Card Form View -->
          <div id="payment-view-card" class="payment-tab-view active">
            <!-- Simulated Credit Card Preview -->
            <div class="interactive-card-visual">
              <div class="card-chip"></div>
              <div class="card-brand-logo">SUMMIT PAY</div>
              <div class="card-number-display" id="card-preview-num">&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242</div>
              <div class="card-bottom-row">
                <div>
                  <span class="card-lbl">CARD HOLDER</span>
                  <span class="card-holder-display" id="card-preview-name">${(this.attendeeData && this.attendeeData.name) || 'ALEXANDER VANCE'}</span>
                </div>
                <div>
                  <span class="card-lbl">EXPIRES</span>
                  <span class="card-exp-display" id="card-preview-exp">12/28</span>
                </div>
              </div>
            </div>

            <form id="simulated-payment-form" class="checkout-form">
              <div class="form-group">
                <label for="card-number" class="field-label required">Card Number</label>
                <div class="input-with-icon">
                  <input type="text" id="card-number" class="form-control" placeholder="4242 4242 4242 4242" value="4242 4242 4242 4242" maxlength="19" required />
                  <span class="card-type-icon">VISA</span>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group flex-1">
                  <label for="card-expiry" class="field-label required">Expiry Date</label>
                  <input type="text" id="card-expiry" class="form-control" placeholder="MM/YY" value="12/28" maxlength="5" required />
                </div>
                <div class="form-group flex-1">
                  <label for="card-cvc" class="field-label required">CVC / CVV</label>
                  <input type="text" id="card-cvc" class="form-control" placeholder="123" value="884" maxlength="4" required />
                </div>
                <div class="form-group flex-1">
                  <label for="card-zip" class="field-label required">Postal Code</label>
                  <input type="text" id="card-zip" class="form-control" placeholder="94158" value="94158" required />
                </div>
              </div>
            </form>
          </div>

          <!-- Apple Pay View -->
          <div id="payment-view-applepay" class="payment-tab-view">
            <div class="oneclick-pay-box">
              <div class="pay-brand-icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.71-.93 2.73 1.01.08 2.02-.48 2.64-1.23z"/></svg>
              </div>
              <h4>Instant 1-Touch Checkout</h4>
              <p>Click below to authorize simulated payment with Touch ID or Face ID.</p>
              <button type="button" class="btn btn-applepay btn-lg" id="btn-apple-pay-simulate">
                Pay with <span class="apple-logo-text">Apple Pay</span>
              </button>
            </div>
          </div>

          <!-- Credits View -->
          <div id="payment-view-credits" class="payment-tab-view">
            <div class="credits-pay-box">
              <h4>Summit Patron Balance</h4>
              <div class="patron-balance-badge">$1,250.00 Available</div>
              <p>Your Patron membership tier includes direct booking allowance. Deduct this purchase directly from your annual credit account.</p>
              <button type="button" class="btn btn-secondary btn-lg" id="btn-credits-pay-simulate">
                Confirm & Deduct ${totals.formattedTotal} from Balance
              </button>
            </div>
          </div>
        </div>

        <div class="checkout-sidebar-col">
          <div class="order-summary-box">
            <h4 class="summary-title">Total Due Now</h4>
            <div class="summary-total-hero">${totals.formattedTotal}</div>
            
            <div class="summary-recap-lines">
              <div class="summary-line">
                <span>Attendee:</span>
                <strong>${this.attendeeData.name}</strong>
              </div>
              <div class="summary-line">
                <span>Delivery:</span>
                <span>${this.attendeeData.email}</span>
              </div>
              <div class="summary-line">
                <span>Seats:</span>
                <span>${this.selectedSeats.join(', ') || 'General Admission'}</span>
              </div>
            </div>

            <div class="btn-group-stacked">
              <button type="button" class="btn btn-primary btn-block btn-lg" id="btn-pay-now">
                Authorize & Complete Order &rarr;
              </button>
              <button type="button" class="btn btn-ghost btn-block" id="btn-back-step2">
                &larr; Back to Attendee Info
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Tabs switching
    container.querySelectorAll(".pay-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        container.querySelectorAll(".pay-tab").forEach(t => t.classList.remove("active"));
        container.querySelectorAll(".payment-tab-view").forEach(v => v.classList.remove("active"));
        tab.classList.add("active");
        const target = tab.getAttribute("data-tab");
        const view = document.getElementById(`payment-view-${target}`);
        if (view) view.classList.add("active");
      });
    });

    // Card input live visual formatting
    const cardInput = document.getElementById("card-number");
    const previewNum = document.getElementById("card-preview-num");
    if (cardInput && previewNum) {
      cardInput.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
        let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
        e.target.value = formatted;
        previewNum.textContent = formatted || "•••• •••• •••• 4242";
      });
    }

    const expInput = document.getElementById("card-expiry");
    const previewExp = document.getElementById("card-preview-exp");
    if (expInput && previewExp) {
      expInput.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2);
        e.target.value = val;
        previewExp.textContent = val || "12/28";
      });
    }

    document.getElementById("btn-back-step2").addEventListener("click", () => this.renderStep2());

    const executePayment = () => {
      this.processOrder();
    };

    document.getElementById("btn-pay-now").addEventListener("click", executePayment);
    const btnApple = document.getElementById("btn-apple-pay-simulate");
    if (btnApple) btnApple.addEventListener("click", executePayment);
    const btnCredits = document.getElementById("btn-credits-pay-simulate");
    if (btnCredits) btnCredits.addEventListener("click", executePayment);
  },

  // ----------------- PROCESS ORDER & GENERATE DIGITAL TICKETS -----------------
  processOrder() {
    const container = document.getElementById("checkout-dynamic-body");
    
    // Show high-impact processing animation
    container.innerHTML = `
      <div class="checkout-processing-state">
        <div class="summit-spinner"></div>
        <h3 class="processing-title">Securing Your Tickets...</h3>
        <p class="processing-desc">Encrypting transaction • Generating deterministic cryptographic QR passes • Reserving seats</p>
      </div>
    `;

    setTimeout(() => {
      const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      const ticketId = "TKT-" + Math.floor(1000 + Math.random() * 9000) + "-" + (this.currentEvent.slug || "PASS").substring(0, 5).toUpperCase();
      const totals = this.calculateTotals();

      const newTicket = {
        id: ticketId,
        orderId: orderId,
        eventId: this.currentEvent.id,
        eventTitle: this.currentEvent.title,
        eventDate: this.currentEvent.date,
        eventDateDisplay: this.currentEvent.dateDisplay,
        eventTimeDisplay: this.currentEvent.timeDisplay,
        venueName: this.currentEvent.venueName,
        venueCity: this.currentEvent.city + ", " + (this.currentEvent.state || ""),
        tierName: this.selectedTier.name,
        tierId: this.selectedTier.id,
        pricePaid: this.selectedTier.price,
        feePaid: this.selectedTier.fee || 0,
        quantity: this.quantity,
        seats: this.selectedSeats.length > 0 ? this.selectedSeats : ["General Admission Floor"],
        attendeeName: this.attendeeData.name,
        attendeeEmail: this.attendeeData.email,
        barcode: String(Math.floor(10000000000000 + Math.random() * 90000000000000)),
        purchaseDate: new Date().toISOString(),
        status: "active",
        accentColor: this.currentEvent.accentColor || "#FF3366"
      };

      const newOrder = {
        orderId: orderId,
        date: new Date().toISOString(),
        eventId: this.currentEvent.id,
        eventTitle: this.currentEvent.title,
        ticketsCount: this.quantity,
        total: totals.total,
        subtotal: totals.subtotal,
        fees: totals.fees,
        discount: totals.discount,
        paymentMethod: "Visa ending in 4242",
        attendeeName: this.attendeeData.name,
        attendeeEmail: this.attendeeData.email,
        ticketIds: [ticketId]
      };

      SummitStorage.saveTicket(newTicket);
      SummitStorage.saveOrder(newOrder);

      this.createdTicket = newTicket;
      this.createdOrder = newOrder;

      SummitUI.showToast("Payment Authorized! Order confirmed 🎉", "success");
      this.renderStep4();
    }, 1100);
  },

  // ----------------- STEP 4: DIGITAL PASS CONFIRMATION -----------------
  renderStep4() {
    this.updateStepper(4);
    const container = document.getElementById("checkout-dynamic-body");
    const ticket = this.createdTicket;
    const event = this.currentEvent;
    const qrSvg = SummitUI.generateQRCodeSVG(`SUMMIT:${ticket.id}:${ticket.orderId}:${ticket.attendeeName}:${ticket.barcode}`, 170, "#000000", "#FFFFFF");

    container.innerHTML = `
      <div class="confirmation-wrap animate-scale-up">
        <div class="confirmation-badge-success">
          <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h3 class="confirmation-title">You're Going!</h3>
        <p class="confirmation-subtitle">Order <strong>#${ticket.orderId}</strong> confirmed. A copy has been dispatched to <strong>${ticket.attendeeEmail}</strong>.</p>

        <!-- Digital Ticket Card Component -->
        <div class="digital-ticket-container" id="digital-ticket-printable">
          <div class="ticket-header-strip" style="background: linear-gradient(135deg, ${ticket.accentColor}, #111);">
            <div class="ticket-brand">SUMMIT DIGITAL PASS</div>
            <div class="ticket-id-tag">${ticket.id}</div>
          </div>

          <div class="ticket-body-content">
            <div class="ticket-hero-details">
              <span class="ticket-event-tag">${event.categoryLabel || event.category}</span>
              <h4 class="ticket-event-title">${ticket.eventTitle}</h4>
              <div class="ticket-meta-grid">
                <div class="meta-item">
                  <span class="meta-lbl">DATE</span>
                  <span class="meta-val">${ticket.eventDateDisplay}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-lbl">TIME / DOORS</span>
                  <span class="meta-val">${ticket.eventTimeDisplay}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-lbl">VENUE</span>
                  <span class="meta-val">${ticket.venueName}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-lbl">LOCATION</span>
                  <span class="meta-val">${ticket.venueCity}</span>
                </div>
              </div>
            </div>

            <div class="ticket-perforated-divider">
              <div class="notch notch-left"></div>
              <div class="perforated-line"></div>
              <div class="notch notch-right"></div>
            </div>

            <div class="ticket-stub-details">
              <div class="stub-info">
                <div class="stub-row">
                  <div>
                    <span class="meta-lbl">ATTENDEE</span>
                    <span class="meta-val text-bold">${ticket.attendeeName}</span>
                  </div>
                  <div>
                    <span class="meta-lbl">TIER</span>
                    <span class="meta-val text-accent">${ticket.tierName}</span>
                  </div>
                </div>
                <div class="stub-row mt-2">
                  <div>
                    <span class="meta-lbl">SEATS</span>
                    <span class="meta-val">${ticket.seats.join(", ")}</span>
                  </div>
                  <div>
                    <span class="meta-lbl">QTY</span>
                    <span class="meta-val">${ticket.quantity} Pass(es)</span>
                  </div>
                </div>
              </div>

              <div class="stub-qr-code">
                ${qrSvg}
                <span class="qr-caption">Scan at Gate • Pass #${ticket.barcode.substring(0, 8)}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="confirmation-actions">
          <button type="button" class="btn btn-primary" id="btn-print-ticket">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Print / Save PDF Pass
          </button>
          <button type="button" class="btn btn-secondary" id="btn-add-calendar">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Add to Calendar (.ics)
          </button>
          <a href="tickets.html" class="btn btn-outline">
            View All in My Tickets &rarr;
          </a>
        </div>
      </div>
    `;

    document.getElementById("btn-print-ticket").addEventListener("click", () => {
      window.print();
    });

    document.getElementById("btn-add-calendar").addEventListener("click", () => {
      SummitUI.downloadCalendarEvent(this.currentEvent);
    });
  },

  // ----------------- INTERACTIVE SEAT MAP MODAL -----------------
  createSeatMapModalDOM() {
    if (document.getElementById("summit-seatmap-modal")) return;

    const modalHTML = `
      <div id="summit-seatmap-modal" class="seatmap-modal" role="dialog" aria-modal="true" aria-labelledby="seatmap-title">
        <div class="seatmap-modal-backdrop"></div>
        <div class="seatmap-modal-container animate-scale-up">
          <div class="seatmap-header">
            <div>
              <span class="seatmap-brand">INTERACTIVE SEAT SELECTOR</span>
              <h3 id="seatmap-title" class="seatmap-modal-title">Select Your Desired Seats</h3>
            </div>
            <button type="button" class="seatmap-modal-close" aria-label="Close Seat Map">&times;</button>
          </div>

          <div class="seatmap-legend">
            <div class="legend-item"><span class="seat-dot seat-vip"></span> VIP Golden Circle ($340)</div>
            <div class="legend-item"><span class="seat-dot seat-prime"></span> Orchestra Prime ($185)</div>
            <div class="legend-item"><span class="seat-dot seat-standard"></span> Standard Tier ($85)</div>
            <div class="legend-item"><span class="seat-dot seat-selected"></span> Selected</div>
            <div class="legend-item"><span class="seat-dot seat-reserved"></span> Unavailable</div>
          </div>

          <!-- Interactive SVG / Visual Grid -->
          <div class="seatmap-viewport">
            <div class="stage-podium">
              <div class="stage-label">▲ STAGE / AUDITORIUM SCREEN ▲</div>
            </div>

            <div class="seat-grid-container" id="interactive-seats-grid">
              <!-- Rendered rows -->
            </div>
          </div>

          <div class="seatmap-footer">
            <div class="seatmap-selection-status">
              <span class="status-lbl">Selected (<span id="seatmap-selected-count">0</span> / <span id="seatmap-required-count">1</span>):</span>
              <div class="seatmap-chips" id="seatmap-chips-container">
                <span class="text-muted">No seats selected yet</span>
              </div>
            </div>
            <button type="button" class="btn btn-primary" id="btn-confirm-seats">
              Confirm Seat Selection
            </button>
          </div>
        </div>
      </div>
    `;

    const div = document.createElement("div");
    div.innerHTML = modalHTML;
    document.body.appendChild(div.firstElementChild);
  },

  openSeatMapModal() {
    const modal = document.getElementById("summit-seatmap-modal");
    if (!modal) return;

    this.renderSeatGrid();
    modal.classList.add("active");
  },

  closeSeatMapModal() {
    const modal = document.getElementById("summit-seatmap-modal");
    if (modal) modal.classList.remove("active");
  },

  renderSeatGrid() {
    const gridEl = document.getElementById("interactive-seats-grid");
    if (!gridEl) return;

    const reqCountEl = document.getElementById("seatmap-required-count");
    if (reqCountEl) reqCountEl.textContent = this.quantity;

    // Build 6 Rows of 16 seats each with aisles
    const rows = [
      { name: "A", tier: "vip", price: 340, unavailable: [3, 4, 11, 12] },
      { name: "B", tier: "vip", price: 340, unavailable: [7, 8] },
      { name: "C", tier: "prime", price: 185, unavailable: [1, 2, 15, 16] },
      { name: "D", tier: "prime", price: 185, unavailable: [5, 6, 9, 10] },
      { name: "E", tier: "standard", price: 85, unavailable: [8, 9, 14] },
      { name: "F", tier: "standard", price: 85, unavailable: [3, 4, 7] }
    ];

    let gridHTML = "";

    rows.forEach(row => {
      gridHTML += `<div class="seat-row"><span class="row-label">${row.name}</span><div class="row-seats">`;
      
      for (let s = 1; s <= 16; s++) {
        const seatId = `Sec A • Row ${row.name} • Seat ${s}`;
        const isUnavailable = row.unavailable.includes(s);
        const isSelected = this.selectedSeats.includes(seatId);

        // Add aisle gap after seat 8
        const aisleClass = s === 8 ? 'has-aisle-right' : '';

        gridHTML += `
          <button type="button" 
                  class="seat-btn seat-${row.tier} ${isUnavailable ? 'unavailable' : ''} ${isSelected ? 'selected' : ''} ${aisleClass}"
                  data-seat-id="${seatId}"
                  data-tier="${row.tier}"
                  data-price="${row.price}"
                  ${isUnavailable ? 'disabled' : ''}
                  title="${seatId} ($${row.price})">
            ${s}
          </button>
        `;
      }

      gridHTML += `</div><span class="row-label">${row.name}</span></div>`;
    });

    gridEl.innerHTML = gridHTML;
    this.updateSeatMapFooter();

    // Bind seat clicks
    gridEl.querySelectorAll(".seat-btn:not(.unavailable)").forEach(btn => {
      btn.addEventListener("click", () => {
        const seatId = btn.getAttribute("data-seat-id");
        const idx = this.selectedSeats.indexOf(seatId);

        if (idx >= 0) {
          // Deselect
          this.selectedSeats.splice(idx, 1);
          btn.classList.remove("selected");
        } else {
          // Check limit
          if (this.selectedSeats.length >= this.quantity) {
            // Replace oldest
            const removed = this.selectedSeats.shift();
            const prevBtn = gridEl.querySelector(`[data-seat-id="${removed}"]`);
            if (prevBtn) prevBtn.classList.remove("selected");
          }
          this.selectedSeats.push(seatId);
          btn.classList.add("selected");
        }

        this.updateSeatMapFooter();
      });
    });

    // Confirm button
    const confirmBtn = document.getElementById("btn-confirm-seats");
    if (confirmBtn) {
      confirmBtn.onclick = () => {
        this.closeSeatMapModal();
        this.renderStep1();
        SummitUI.showToast(`Selected ${this.selectedSeats.length} seat(s)`, "success");
      };
    }
  },

  updateSeatMapFooter() {
    const countEl = document.getElementById("seatmap-selected-count");
    const chipsEl = document.getElementById("seatmap-chips-container");
    if (countEl) countEl.textContent = this.selectedSeats.length;

    if (chipsEl) {
      if (this.selectedSeats.length === 0) {
        chipsEl.innerHTML = `<span class="text-muted">No seats selected yet. Click any available seat above.</span>`;
      } else {
        chipsEl.innerHTML = this.selectedSeats.map(s => `<span class="seat-chip">${s}</span>`).join("");
      }
    }
  }
};

// Auto initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => SummitCheckout.init());
