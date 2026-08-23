/**
 * EMBER & GRAIN - CART CONTROLLER & MODIFIERS MODAL
 * Manages global slide-out cart drawer, modifier selector modal, and cart badges.
 */

const CartController = {
  activeItemForModifiers: null,
  lastFocusedElement: null,

  init() {
    this.renderCartDrawer();
    this.bindEvents();
    this.updateBadges();

    if (window.EG_STORE) {
      window.EG_STORE.subscribe("cart:updated", () => {
        this.updateBadges();
        this.renderCartContent();
      });
    }
  },

  bindEvents() {
    // Open cart drawer triggers
    document.querySelectorAll("[data-action='open-cart']").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openCart();
      });
    });

    // Close cart drawer on backdrop or close button
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-action='close-cart']") || e.target.classList.contains("cart-drawer-backdrop")) {
        this.closeCart();
      }
    });

    // Escape key closes modals/cart
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeCart();
        this.closeModifierModal();
      }
    });
  },

  openCart() {
    this.lastFocusedElement = document.activeElement;
    const drawer = document.getElementById("eg-cart-drawer");
    const backdrop = document.getElementById("eg-cart-backdrop");
    if (drawer && backdrop) {
      this.renderCartContent();
      drawer.classList.add("is-open");
      backdrop.classList.add("is-open");
      document.body.style.overflow = "hidden";

      const closeBtn = drawer.querySelector(".cart-drawer-close");
      if (closeBtn) closeBtn.focus();
    }
  },

  closeCart() {
    const drawer = document.getElementById("eg-cart-drawer");
    const backdrop = document.getElementById("eg-cart-backdrop");
    if (drawer && backdrop) {
      drawer.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      document.body.style.overflow = "";
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
        this.lastFocusedElement = null;
      }
    }
  },

  updateBadges() {
    const count = window.EG_STORE ? window.EG_STORE.getCartCount() : 0;
    document.querySelectorAll(".cart-badge-count").forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? "inline-flex" : "none";
    });
  },

  renderCartDrawer() {
    if (document.getElementById("eg-cart-drawer")) return;

    const drawerHtml = `
      <div id="eg-cart-backdrop" class="cart-drawer-backdrop" aria-hidden="true"></div>
      <aside id="eg-cart-drawer" class="cart-drawer" role="dialog" aria-modal="true" aria-label="Your Culinary Order">
        <div class="cart-drawer-header">
          <div class="cart-drawer-title-wrap">
            <span class="eyebrow">Your Selection</span>
            <h3 class="cart-drawer-title">Curated Order</h3>
          </div>
          <button class="cart-drawer-close" data-action="close-cart" aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div id="eg-cart-items-container" class="cart-drawer-body">
          <!-- Dynamically populated -->
        </div>

        <div id="eg-cart-footer-container" class="cart-drawer-footer">
          <!-- Dynamically populated -->
        </div>
      </aside>

      <!-- Modifier Customization Modal -->
      <div id="eg-modifier-modal" class="modifier-modal-backdrop" aria-hidden="true">
        <div class="modifier-modal" role="dialog" aria-modal="true" aria-labelledby="modifier-modal-title">
          <button class="modifier-modal-close" onclick="CartController.closeModifierModal()" aria-label="Close customization dialog">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div id="eg-modifier-modal-content" class="modifier-modal-inner">
            <!-- Dynamically populated -->
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", drawerHtml);
  },

  renderCartContent() {
    const container = document.getElementById("eg-cart-items-container");
    const footer = document.getElementById("eg-cart-footer-container");
    if (!container || !footer) return;

    const cart = window.EG_STORE.getCart();
    const totals = window.EG_STORE.getCartTotals(0.20, "pickup");

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h4>Your order is empty</h4>
          <p>Explore our wood-fired hearth menu and add your favorite gastronomic creations.</p>
          <a href="menu.html" class="btn btn-primary btn-sm" onclick="CartController.closeCart()">Explore Menu Catalog</a>
        </div>
      `;
      footer.innerHTML = "";
      return;
    }

    container.innerHTML = cart.map(item => {
      const modifiersText = item.selectedModifiers && item.selectedModifiers.length > 0
        ? item.selectedModifiers.map(m => `<span class="cart-item-mod">+ ${m.name} (+$${parseFloat(m.price).toFixed(2)})</span>`).join("")
        : "";

      return `
        <div class="cart-item" data-uid="${item.uid}">
          <div class="cart-item-img-wrap">
            <img src="${item.image}" alt="${item.name}" loading="lazy" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80'">
          </div>
          <div class="cart-item-details">
            <div class="cart-item-header">
              <h4 class="cart-item-name">${item.name}</h4>
              <span class="cart-item-price">$${(parseFloat(item.unitPrice) * parseInt(item.quantity, 10)).toFixed(2)}</span>
            </div>
            ${modifiersText ? `<div class="cart-item-modifiers">${modifiersText}</div>` : ""}
            ${item.specialInstructions ? `<p class="cart-item-notes">"${item.specialInstructions}"</p>` : ""}
            
            <div class="cart-item-actions">
              <div class="quantity-picker-sm">
                <button type="button" class="qty-btn" onclick="CartController.adjustQuantity('${item.uid}', ${item.quantity - 1})" aria-label="Decrease quantity for ${item.name}">−</button>
                <span class="qty-num" aria-live="polite">${item.quantity}</span>
                <button type="button" class="qty-btn" onclick="CartController.adjustQuantity('${item.uid}', ${item.quantity + 1})" aria-label="Increase quantity for ${item.name}">+</button>
              </div>
              <button type="button" class="cart-item-remove" onclick="CartController.removeItem('${item.uid}')" aria-label="Remove ${item.name} from order">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    footer.innerHTML = `
      <div class="cart-summary-breakdown">
        <div class="summary-row">
          <span>Subtotal (${totals.itemCount} items)</span>
          <span>$${totals.subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Estimated NYC Sales Tax (8.875%)</span>
          <span>$${totals.tax.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Culinary Service Fee</span>
          <span>$${totals.serviceFee.toFixed(2)}</span>
        </div>
        <div class="summary-row summary-total">
          <span>Est. Subtotal</span>
          <span>$${(totals.subtotal + totals.tax + totals.serviceFee).toFixed(2)}</span>
        </div>
      </div>
      
      <div class="cart-drawer-buttons">
        <a href="order.html" class="btn btn-primary btn-block" onclick="CartController.closeCart()">
          <span>Proceed to Checkout</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
        <button type="button" class="btn-clear-cart" onclick="CartController.clearAll()">Clear Order</button>
      </div>
    `;
  },

  adjustQuantity(uid, newQty) {
    window.EG_STORE.updateCartQuantity(uid, newQty);
  },

  removeItem(uid) {
    window.EG_STORE.removeFromCart(uid);
    if (window.EG_UI) window.EG_UI.toast("Item removed from order", "info");
  },

  clearAll() {
    if (confirm("Are you sure you wish to clear your current selection?")) {
      window.EG_STORE.clearCart();
      if (window.EG_UI) window.EG_UI.toast("Your order has been cleared.", "info");
    }
  },

  // --- MODIFIERS MODAL LOGIC ---
  openModifierModal(itemId) {
    this.lastFocusedElement = document.activeElement;
    const item = window.EG_DATA.MENU_ITEMS.find(m => m.id === itemId);
    if (!item) return;

    this.activeItemForModifiers = item;
    const modal = document.getElementById("eg-modifier-modal");
    const container = document.getElementById("eg-modifier-modal-content");
    if (!modal || !container) return;

    const hasModifiers = item.modifiers && item.modifiers.length > 0;

    let modifiersHtml = "";
    if (hasModifiers) {
      modifiersHtml = item.modifiers.map((modGroup, groupIdx) => `
        <fieldset class="modifier-group" data-group-index="${groupIdx}">
          <legend class="modifier-group-header">
            <h5>${modGroup.name}</h5>
            <span class="modifier-type-badge">${modGroup.type === 'radio' ? 'Select 1' : 'Optional Add-ons'}</span>
          </legend>
          <div class="modifier-options-list">
            ${modGroup.options.map((opt, optIdx) => `
              <label class="modifier-option-label">
                <input 
                  type="${modGroup.type}" 
                  name="mod_group_${groupIdx}" 
                  value="${optIdx}" 
                  data-name="${opt.label}" 
                  data-price="${opt.price}"
                  ${opt.default ? 'checked' : ''} 
                  onchange="CartController.recalcModifierModalPrice()"
                />
                <span class="modifier-opt-title">${opt.label}</span>
                <span class="modifier-opt-price">${opt.price > 0 ? `+$${opt.price.toFixed(2)}` : 'Included'}</span>
              </label>
            `).join("")}
          </div>
        </fieldset>
      `).join("");
    } else {
      modifiersHtml = `<p class="text-muted" style="font-size: 0.86rem; padding: 12px; background-color: var(--color-bg-tertiary); border-radius: var(--radius-xs);">This signature dish is crafted to Chef Julian Mercer's exact recipe with no substitutions required.</p>`;
    }

    container.innerHTML = `
      <div class="mod-modal-header">
        <div class="mod-modal-img-wrap">
          <img src="${item.image}" alt="${item.name}" class="mod-modal-img" onerror="this.src='https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80'">
        </div>
        <div class="mod-modal-info">
          <div class="mod-modal-tags">
            ${(item.dietary || []).map(d => `<span class="dietary-badge">${d}</span>`).join("")}
          </div>
          <h3 id="modifier-modal-title" class="mod-modal-title">${item.name}</h3>
          <p class="mod-modal-desc">${item.description}</p>
          <div class="mod-modal-base-price">Base Price: <strong>$${item.price.toFixed(2)}</strong></div>
        </div>
      </div>

      <form id="modifier-form" onsubmit="event.preventDefault(); CartController.submitModifierForm();">
        <div class="mod-modal-body">
          ${modifiersHtml}

          <div class="modifier-group">
            <label class="form-label" for="modifier-special-notes">Special Preparation Notes for the Kitchen (Optional)</label>
            <textarea id="modifier-special-notes" class="textarea-luxury textarea-sm" placeholder="Any dietary nuances or specific kitchen requests..."></textarea>
          </div>
        </div>

        <div class="mod-modal-footer">
          <div class="mod-modal-qty">
            <label class="form-label" for="modal-item-qty" style="margin-bottom: 0; margin-right: 8px;">Qty:</label>
            <div class="quantity-picker">
              <button type="button" class="qty-btn" onclick="CartController.adjustModalQty(-1)" aria-label="Decrease quantity">−</button>
              <input type="number" id="modal-item-qty" value="1" min="1" max="20" readonly aria-label="Quantity">
              <button type="button" class="qty-btn" onclick="CartController.adjustModalQty(1)" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-add-modal">
            <span id="modal-submit-text">Add to Order — $${item.price.toFixed(2)}</span>
          </button>
        </div>
      </form>
    `;

    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    this.recalcModifierModalPrice();

    const firstInput = container.querySelector("input, textarea, button");
    if (firstInput) firstInput.focus();
  },

  closeModifierModal() {
    const modal = document.getElementById("eg-modifier-modal");
    if (modal) {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
      this.activeItemForModifiers = null;
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
        this.lastFocusedElement = null;
      }
    }
  },

  adjustModalQty(delta) {
    const input = document.getElementById("modal-item-qty");
    if (!input) return;
    let val = parseInt(input.value, 10) || 1;
    val = Math.max(1, Math.min(20, val + delta));
    input.value = val;
    this.recalcModifierModalPrice();
  },

  recalcModifierModalPrice() {
    if (!this.activeItemForModifiers) return;
    const basePrice = parseFloat(this.activeItemForModifiers.price) || 0;
    const qty = parseInt(document.getElementById("modal-item-qty")?.value || 1, 10);

    let modExtra = 0;
    const form = document.getElementById("modifier-form");
    if (form) {
      const checkedInputs = form.querySelectorAll("input:checked");
      checkedInputs.forEach(input => {
        const p = parseFloat(input.dataset.price || 0);
        if (!isNaN(p)) modExtra += p;
      });
    }

    const unitPrice = basePrice + modExtra;
    const totalPrice = unitPrice * qty;

    const submitText = document.getElementById("modal-submit-text");
    if (submitText) {
      submitText.textContent = `Add to Order — $${totalPrice.toFixed(2)}`;
    }
  },

  submitModifierForm() {
    if (!this.activeItemForModifiers) return;
    const form = document.getElementById("modifier-form");
    const qty = parseInt(document.getElementById("modal-item-qty")?.value || 1, 10);
    const notes = document.getElementById("modifier-special-notes")?.value?.trim() || "";

    const selectedMods = [];
    if (form) {
      const checked = form.querySelectorAll("input:checked");
      checked.forEach(inp => {
        selectedMods.push({
          name: inp.dataset.name,
          price: parseFloat(inp.dataset.price || 0)
        });
      });
    }

    window.EG_STORE.addToCart(this.activeItemForModifiers, qty, selectedMods, notes);

    if (window.EG_UI) {
      window.EG_UI.toast(`Added ${qty}x ${this.activeItemForModifiers.name} to order`, "success");
    }

    this.closeModifierModal();
    this.openCart();
  },

  quickAdd(itemId) {
    const item = window.EG_DATA.MENU_ITEMS.find(m => m.id === itemId);
    if (!item) return;

    if (item.modifiers && item.modifiers.length > 0) {
      this.openModifierModal(itemId);
    } else {
      window.EG_STORE.addToCart(item, 1, [], "");
      if (window.EG_UI) {
        window.EG_UI.toast(`Added ${item.name} to order`, "success");
      }
      this.openCart();
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  CartController.init();
});
