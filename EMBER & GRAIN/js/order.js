/**
 * EMBER & GRAIN - ORDERING & CHECKOUT CONTROLLER
 * Multi-step checkout, payment simulation, receipt generation, and live order tracking.
 */

const OrderController = {
  state: {
    step: 1,
    orderType: "pickup",
    tipRate: 0.20,
    currentOrderId: null,
    trackingInterval: null
  },

  init() {
    this.bindEvents();
    this.renderOrderPage();
    this.checkUrlForTracking();

    if (window.EG_STORE) {
      window.EG_STORE.subscribe("cart:updated", () => {
        this.renderOrderCartList();
        this.recalculateTotals();
      });
      window.EG_STORE.subscribe("orders:updated", () => {
        if (this.state.currentOrderId) {
          this.renderTrackingView(this.state.currentOrderId);
        }
      });
    }
  },

  checkUrlForTracking() {
    const params = new URLSearchParams(window.location.search);
    const trackId = params.get("track");
    if (trackId && window.EG_STORE) {
      const order = window.EG_STORE.getOrderById(trackId);
      if (order) {
        this.state.currentOrderId = order.id;
        this.goToStep(4);
        this.renderTrackingView(order.id);
      }
    }
  },

  bindEvents() {
    document.querySelectorAll("input[name='order-type']").forEach(radio => {
      radio.addEventListener("change", (e) => {
        this.setOrderType(e.target.value);
      });
    });

    document.querySelectorAll(".tip-pill").forEach(pill => {
      pill.addEventListener("click", (e) => {
        e.preventDefault();
        const rate = parseFloat(pill.dataset.rate);
        this.setTipRate(rate, pill);
      });
    });

    const cardInput = document.getElementById("cc-number");
    if (cardInput) {
      cardInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.substring(0, 16);
        const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
        e.target.value = formatted;
      });
    }

    const expiryInput = document.getElementById("cc-expiry");
    if (expiryInput) {
      expiryInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.substring(0, 4);
        if (value.length >= 3) {
          e.target.value = value.substring(0, 2) + "/" + value.substring(2);
        } else {
          e.target.value = value;
        }
      });
    }

    const cvvInput = document.getElementById("cc-cvv");
    if (cvvInput) {
      cvvInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "").substring(0, 4);
      });
    }
  },

  setOrderType(type) {
    this.state.orderType = type;
    const deliveryFields = document.getElementById("delivery-address-fields");
    const pickupFields = document.getElementById("pickup-time-fields");

    if (deliveryFields) deliveryFields.style.display = type === "delivery" ? "block" : "none";
    if (pickupFields) pickupFields.style.display = type === "pickup" ? "block" : "none";

    document.querySelectorAll(".order-type-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.type === type);
    });

    this.recalculateTotals();
  },

  setTipRate(rate, clickedPill) {
    this.state.tipRate = parseFloat(rate) || 0.20;
    document.querySelectorAll(".tip-pill").forEach(p => p.classList.remove("active"));
    if (clickedPill) clickedPill.classList.add("active");
    this.recalculateTotals();
  },

  recalculateTotals() {
    if (!window.EG_STORE) return;
    const totals = window.EG_STORE.getCartTotals(this.state.tipRate, this.state.orderType);

    const subtotalEl = document.getElementById("checkout-subtotal");
    const taxEl = document.getElementById("checkout-tax");
    const gratuityEl = document.getElementById("checkout-gratuity");
    const deliveryEl = document.getElementById("checkout-delivery");
    const serviceEl = document.getElementById("checkout-service");
    const totalEl = document.getElementById("checkout-total");
    const btnPayTotal = document.getElementById("btn-pay-total");

    if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${totals.tax.toFixed(2)}`;
    if (gratuityEl) gratuityEl.textContent = `$${totals.gratuity.toFixed(2)} (${Math.round(this.state.tipRate * 100)}%)`;
    if (deliveryEl) deliveryEl.textContent = this.state.orderType === "delivery" ? (totals.deliveryFee === 0 ? "Complimentary" : `$${totals.deliveryFee.toFixed(2)}`) : "N/A (Pickup)";
    if (serviceEl) serviceEl.textContent = `$${totals.serviceFee.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;
    if (btnPayTotal) btnPayTotal.textContent = `Pay $${totals.total.toFixed(2)}`;
  },

  renderOrderPage() {
    this.renderOrderCartList();
    this.recalculateTotals();
  },

  renderOrderCartList() {
    const container = document.getElementById("order-cart-items");
    const emptyNotice = document.getElementById("order-empty-notice");
    const checkoutPanels = document.getElementById("order-checkout-panels");
    if (!container) return;

    const cart = window.EG_STORE ? window.EG_STORE.getCart() : [];

    if (cart.length === 0) {
      if (emptyNotice) emptyNotice.style.display = "block";
      if (checkoutPanels) checkoutPanels.style.display = "none";
      container.innerHTML = `
        <div class="cart-empty-state">
          <p>You have not selected any dishes for ordering yet.</p>
          <a href="menu.html" class="btn btn-primary btn-sm" style="margin-top: 12px;">Explore Menu Catalog</a>
        </div>
      `;
      return;
    }

    if (emptyNotice) emptyNotice.style.display = "none";
    if (checkoutPanels) checkoutPanels.style.display = "grid";

    container.innerHTML = cart.map(item => {
      const modifiersText = item.selectedModifiers && item.selectedModifiers.length > 0
        ? item.selectedModifiers.map(m => `<span class="cart-item-mod">+ ${m.name} (+$${parseFloat(m.price).toFixed(2)})</span>`).join("")
        : "";

      return `
        <div class="order-item-row" data-uid="${item.uid}">
          <div class="order-item-thumb">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80'">
          </div>
          <div class="order-item-info">
            <div class="order-item-head">
              <h4 class="order-item-title">${item.name}</h4>
              <span class="order-item-price">$${(parseFloat(item.unitPrice) * parseInt(item.quantity, 10)).toFixed(2)}</span>
            </div>
            ${modifiersText ? `<div class="order-item-mods">${modifiersText}</div>` : ""}
            ${item.specialInstructions ? `<div class="order-item-note">"${item.specialInstructions}"</div>` : ""}
            <div class="order-item-tools">
              <div class="quantity-picker-sm">
                <button type="button" class="qty-btn" onclick="CartController.adjustQuantity('${item.uid}', ${item.quantity - 1})" aria-label="Decrease quantity">−</button>
                <span class="qty-num">${item.quantity}</span>
                <button type="button" class="qty-btn" onclick="CartController.adjustQuantity('${item.uid}', ${item.quantity + 1})" aria-label="Increase quantity">+</button>
              </div>
              <button type="button" class="btn-item-del" onclick="CartController.removeItem('${item.uid}')" aria-label="Remove ${item.name}">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  goToStep(stepNum) {
    this.state.step = stepNum;

    document.querySelectorAll(".checkout-step-indicator-item").forEach(item => {
      const num = parseInt(item.dataset.step, 10);
      item.classList.toggle("active", num === stepNum);
      item.classList.toggle("completed", num < stepNum);
    });

    document.querySelectorAll(".checkout-step-section").forEach(sec => {
      sec.classList.toggle("active", parseInt(sec.dataset.stepSection, 10) === stepNum);
    });

    const panel = document.getElementById("checkout-wizard-container");
    if (panel) {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  },

  validateAndProceedToPayment() {
    const cart = window.EG_STORE ? window.EG_STORE.getCart() : [];
    if (cart.length === 0) {
      if (window.EG_UI) window.EG_UI.toast("Please add dishes to your order first.", "error");
      return;
    }

    const name = document.getElementById("cust-name")?.value?.trim();
    const email = document.getElementById("cust-email")?.value?.trim();
    const phone = document.getElementById("cust-phone")?.value?.trim();

    if (!name || !email || !phone) {
      if (window.EG_UI) window.EG_UI.toast("Please complete your name, email, and phone number.", "error");
      return;
    }

    if (this.state.orderType === "delivery") {
      const address = document.getElementById("deliv-street")?.value?.trim();
      const zip = document.getElementById("deliv-zip")?.value?.trim();
      if (!address || !zip) {
        if (window.EG_UI) window.EG_UI.toast("Please enter your Manhattan street address and zip code.", "error");
        return;
      }
    }

    this.goToStep(3);
  },

  processPayment(paymentMethod = "credit_card") {
    if (paymentMethod === "credit_card") {
      const ccNum = document.getElementById("cc-number")?.value?.replace(/\s+/g, "");
      const ccExp = document.getElementById("cc-expiry")?.value?.trim();
      const ccCvv = document.getElementById("cc-cvv")?.value?.trim();

      if (!ccNum || ccNum.length < 15 || !ccExp || !ccCvv) {
        if (window.EG_UI) window.EG_UI.toast("Please enter a valid credit card number, expiration date, and CVV.", "error");
        return;
      }
    }

    this.showProcessingOverlay();

    setTimeout(() => {
      this.finalizeOrder(paymentMethod);
    }, 2200);
  },

  showProcessingOverlay() {
    let overlay = document.getElementById("eg-payment-processing-overlay");
    if (!overlay) {
      const overlayHtml = `
        <div id="eg-payment-processing-overlay" class="processing-overlay" aria-hidden="true">
          <div class="processing-card">
            <div class="luxury-spinner">
              <div class="spinner-ring"></div>
              <div class="spinner-core"></div>
            </div>
            <h3 id="proc-stage-title" class="processing-title">Authorizing Order</h3>
            <p id="proc-stage-desc" class="processing-desc">Securing payment authorization with card network...</p>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", overlayHtml);
      overlay = document.getElementById("eg-payment-processing-overlay");
    }

    overlay.classList.add("is-open");

    setTimeout(() => {
      const t = document.getElementById("proc-stage-title");
      const d = document.getElementById("proc-stage-desc");
      if (t) t.textContent = "Transmitting to White Oak Hearth";
      if (d) d.textContent = "Chef Julian Mercer's culinary brigade is receiving preparation tickets...";
    }, 1100);
  },

  finalizeOrder(paymentMethod) {
    const overlay = document.getElementById("eg-payment-processing-overlay");
    if (overlay) overlay.classList.remove("is-open");

    const cart = window.EG_STORE ? window.EG_STORE.getCart() : [];
    const totals = window.EG_STORE ? window.EG_STORE.getCartTotals(this.state.tipRate, this.state.orderType) : {};

    const name = document.getElementById("cust-name")?.value?.trim() || "Valued Patron";
    const email = document.getElementById("cust-email")?.value?.trim() || "guest@luxury.com";
    const phone = document.getElementById("cust-phone")?.value?.trim() || "+1 (212) 555-0100";
    const notes = document.getElementById("order-special-notes")?.value?.trim() || "";

    let deliveryDetails = null;
    if (this.state.orderType === "delivery") {
      deliveryDetails = {
        street: document.getElementById("deliv-street")?.value?.trim() || "450 W 14th St",
        apt: document.getElementById("deliv-apt")?.value?.trim() || "Apt 8B",
        zip: document.getElementById("deliv-zip")?.value?.trim() || "10014",
        instructions: document.getElementById("deliv-instructions")?.value?.trim() || "Leave with doorman"
      };
    }

    const orderPayload = {
      orderType: this.state.orderType,
      items: cart,
      totals: totals,
      paymentMethod: paymentMethod,
      customer: { name, email, phone, notes },
      deliveryDetails: deliveryDetails
    };

    const newOrder = window.EG_STORE.createOrder(orderPayload);
    this.state.currentOrderId = newOrder.id;

    window.EG_STORE.clearCart();

    if (window.EG_UI) {
      window.EG_UI.toast(`Order ${newOrder.id} successfully received! Kitchen notified.`, "success");
    }

    this.goToStep(4);
    this.renderTrackingView(newOrder.id);
    this.startOrderProgressionSimulation(newOrder.id);
  },

  renderTrackingView(orderId) {
    const order = window.EG_STORE ? window.EG_STORE.getOrderById(orderId) : null;
    const container = document.getElementById("order-tracking-container");
    if (!order || !container) return;

    const statuses = [
      { key: "placed", title: "Order Placed", desc: "Received by hearth host" },
      { key: "preparing", title: "In the Kitchen", desc: "Wood-fired hearth preparation" },
      { key: "ready", title: order.orderType === "delivery" ? "Out for Delivery" : "Ready for Pickup", desc: order.orderType === "delivery" ? "Courier en route in Manhattan" : "Awaiting at 482 Hudson St" },
      { key: "completed", title: "Completed", desc: "Dining experience concluded" }
    ];

    const currentStatusIdx = statuses.findIndex(s => s.key === order.status);

    container.innerHTML = `
      <div class="tracking-card">
        <div class="tracking-header">
          <div class="tracking-id-badge">
            <span class="trk-label">Order Reference</span>
            <h3 class="trk-val">${order.id}</h3>
          </div>
          <div class="tracking-eta">
            <span class="trk-label">Estimated Preparation Time</span>
            <span class="trk-eta-time">${order.estimatedTime}</span>
          </div>
        </div>

        <div class="tracking-stepper">
          <div class="stepper-bar">
            <div class="stepper-fill" style="width: ${(currentStatusIdx / (statuses.length - 1)) * 100}%"></div>
          </div>
          <div class="stepper-steps-grid">
            ${statuses.map((s, idx) => {
              const isDone = idx <= currentStatusIdx;
              const isCurrent = idx === currentStatusIdx;
              return `
                <div class="stepper-node ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}">
                  <div class="node-icon">
                    ${isDone ? `
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ` : `<span>${idx + 1}</span>`}
                  </div>
                  <span class="node-title">${s.title}</span>
                  <span class="node-desc">${s.desc}</span>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <div class="tracking-summary-panel">
          <div class="tracking-order-info">
            <h4>Dishes in Preparation (${order.items.length})</h4>
            <div class="tracking-items-list">
              ${order.items.map(item => `
                <div class="trk-item-row">
                  <span class="trk-item-qty">${item.quantity}x</span>
                  <span class="trk-item-name">${item.name}</span>
                  <span class="trk-item-price">$${(parseFloat(item.unitPrice) * parseInt(item.quantity, 10)).toFixed(2)}</span>
                </div>
              `).join("")}
            </div>
            
            <div class="trk-totals-breakdown">
              <div class="trk-row">
                <span>Subtotal:</span>
                <span>$${parseFloat(order.totals.subtotal || 0).toFixed(2)}</span>
              </div>
              <div class="trk-row">
                <span>Total Paid:</span>
                <strong>$${parseFloat(order.totals.total || 0).toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <div class="tracking-destination-info">
            <h4>${order.orderType === "delivery" ? "Courier Destination" : "Pickup Location"}</h4>
            ${order.orderType === "delivery" ? `
              <p><strong>${order.customer.name}</strong></p>
              <p>${order.deliveryDetails?.street || '450 W 14th St'}, ${order.deliveryDetails?.apt || ''}</p>
              <p>New York, NY ${order.deliveryDetails?.zip || '10014'}</p>
              <p class="trk-sub-note">Note: "${order.deliveryDetails?.instructions || 'Standard delivery'}"</p>
            ` : `
              <p><strong>Ember & Grain Main Host Stand</strong></p>
              <p>482 Hudson Street, West Village, NY 10014</p>
              <p class="trk-sub-note">Please provide Order ID <strong>${order.id}</strong> to our host upon arrival.</p>
            `}
            
            <div class="tracking-actions">
              <button type="button" class="btn btn-secondary btn-sm" onclick="OrderController.simulateNextStatus('${order.id}')">
                Simulate Next Kitchen Step ➔
              </button>
              <a href="menu.html" class="btn btn-primary btn-sm">Return to Menu</a>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  startOrderProgressionSimulation(orderId) {
    if (this.state.trackingInterval) clearInterval(this.state.trackingInterval);

    let step = 0;
    const stages = ["preparing", "ready", "completed"];

    this.state.trackingInterval = setInterval(() => {
      if (step < stages.length) {
        const nextStatus = stages[step];
        window.EG_STORE.updateOrderStatus(orderId, nextStatus);
        if (window.EG_UI) {
          const labels = {
            preparing: "Kitchen is preparing your wood-fired dishes",
            ready: "Your order is ready!",
            completed: "Order completed. Bon Appetit!"
          };
          window.EG_UI.toast(labels[nextStatus], "info");
        }
        step++;
      } else {
        clearInterval(this.state.trackingInterval);
      }
    }, 12000);
  },

  simulateNextStatus(orderId) {
    const order = window.EG_STORE ? window.EG_STORE.getOrderById(orderId) : null;
    if (!order) return;

    const stages = ["placed", "preparing", "ready", "completed"];
    const idx = stages.indexOf(order.status);
    if (idx < stages.length - 1) {
      const next = stages[idx + 1];
      window.EG_STORE.updateOrderStatus(orderId, next);
      if (window.EG_UI) window.EG_UI.toast(`Order status: ${next.toUpperCase()}`, "info");
    } else {
      if (window.EG_UI) window.EG_UI.toast("Order has reached completion.", "info");
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("order-cart-items") || document.getElementById("order-tracking-container")) {
    OrderController.init();
  }
});
