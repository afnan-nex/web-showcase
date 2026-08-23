/**
 * EMBER & GRAIN - EDITORIAL MENU HUB CONTROLLER
 * Search, multi-attribute filtering, dietary tags, favorites, quick view modal.
 */

const MenuController = {
  state: {
    category: "all",
    searchQuery: "",
    activeDietaryFilters: [],
    sortBy: "default",
    showOnlyFavorites: false
  },
  lastFocusedElement: null,

  init() {
    this.bindEvents();
    this.renderMenu();

    if (window.EG_STORE) {
      window.EG_STORE.subscribe("favorites:updated", () => {
        this.updateFavoriteButtons();
        if (this.state.showOnlyFavorites) {
          this.renderMenu();
        }
      });
    }
  },

  bindEvents() {
    // Search input with debounce
    const searchInput = document.getElementById("menu-search-input");
    if (searchInput) {
      let debounceTimeout;
      searchInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          this.state.searchQuery = e.target.value.trim().toLowerCase();
          this.renderMenu();
        }, 120);
      });
    }

    // Category Tabs
    document.querySelectorAll("[data-menu-category]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const cat = btn.getAttribute("data-menu-category");
        this.setCategory(cat);
      });
    });

    // Dietary Filter Pills
    document.querySelectorAll("[data-dietary-filter]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const filter = btn.getAttribute("data-dietary-filter");
        this.toggleDietaryFilter(filter, btn);
      });
    });

    // Favorites Filter Toggle
    const favToggle = document.getElementById("toggle-favorites-filter");
    if (favToggle) {
      favToggle.addEventListener("click", (e) => {
        e.preventDefault();
        this.state.showOnlyFavorites = !this.state.showOnlyFavorites;
        favToggle.classList.toggle("active", this.state.showOnlyFavorites);
        this.renderMenu();
      });
    }

    // Sort Select
    const sortSelect = document.getElementById("menu-sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.state.sortBy = e.target.value;
        this.renderMenu();
      });
    }

    // Modal Close
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-action='close-quick-view']") || e.target.classList.contains("quick-view-backdrop")) {
        this.closeQuickView();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeQuickView();
      }
    });
  },

  setCategory(category) {
    this.state.category = category;
    document.querySelectorAll("[data-menu-category]").forEach(btn => {
      const isCurrent = btn.getAttribute("data-menu-category") === category;
      btn.classList.toggle("active", isCurrent);
      btn.setAttribute("aria-selected", isCurrent ? "true" : "false");
    });
    this.renderMenu();
  },

  toggleDietaryFilter(filter, btnElement) {
    const idx = this.state.activeDietaryFilters.indexOf(filter);
    if (idx > -1) {
      this.state.activeDietaryFilters.splice(idx, 1);
      btnElement.classList.remove("active");
    } else {
      this.state.activeDietaryFilters.push(filter);
      btnElement.classList.add("active");
    }
    this.renderMenu();
  },

  getFilteredItems() {
    let items = [...(window.EG_DATA?.MENU_ITEMS || [])];

    if (this.state.category !== "all") {
      items = items.filter(i => i.category === this.state.category);
    }

    if (this.state.activeDietaryFilters.length > 0) {
      items = items.filter(item => {
        return this.state.activeDietaryFilters.every(f => 
          (item.dietary || []).some(d => d.toLowerCase().includes(f.toLowerCase()))
        );
      });
    }

    if (this.state.showOnlyFavorites && window.EG_STORE) {
      const favs = window.EG_STORE.getFavorites();
      items = items.filter(i => favs.includes(i.id));
    }

    if (this.state.searchQuery) {
      const q = this.state.searchQuery;
      items = items.filter(item => 
        (item.name || "").toLowerCase().includes(q) ||
        (item.description || "").toLowerCase().includes(q) ||
        (item.story && item.story.toLowerCase().includes(q)) ||
        (item.pairing && item.pairing.toLowerCase().includes(q)) ||
        (item.dietary || []).some(d => d.toLowerCase().includes(q))
      );
    }

    if (this.state.sortBy === "price-asc") {
      items.sort((a, b) => a.price - b.price);
    } else if (this.state.sortBy === "price-desc") {
      items.sort((a, b) => b.price - a.price);
    } else if (this.state.sortBy === "name-asc") {
      items.sort((a, b) => a.name.localeCompare(b.name));
    }

    return items;
  },

  renderMenu() {
    const container = document.getElementById("menu-grid-container");
    const countEl = document.getElementById("menu-results-count");
    if (!container) return;

    const items = this.getFilteredItems();

    if (countEl) {
      countEl.textContent = `Showing ${items.length} ${items.length === 1 ? 'culinary creation' : 'culinary creations'}`;
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div class="menu-empty-state">
          <div class="empty-icon">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3>No Gastronomic Creations Found</h3>
          <p>We could not find any menu dishes matching your filter criteria. Try resetting your search or filters.</p>
          <button type="button" class="btn btn-secondary btn-sm" onclick="MenuController.resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    if (this.state.category === "all" && !this.state.searchQuery && this.state.activeDietaryFilters.length === 0 && !this.state.showOnlyFavorites) {
      const categories = [
        { id: "breakfast", title: "Morning & Hearth Brunch", subtitle: "Ancient grains, fresh wood-fired sourdough, farm eggs" },
        { id: "starters", title: "Starters & Small Plates", subtitle: "Raw bar, ember-blistered heirloom vegetables, bone marrow" },
        { id: "mains", title: "Wood-Fired Hearth Mains", subtitle: "Dry-aged prime meats, wild cedar cod, ancient grain risottos" },
        { id: "desserts", title: "Pastry & Confections", subtitle: "Smoked chocolate, wood-roasted fruit tarts, grain panna cotta" },
        { id: "drinks", title: "Libations & Botanical Elixirs", subtitle: "Smoked whiskeys, heritage cocktails, rare European vintages" }
      ];

      container.innerHTML = categories.map(cat => {
        const catItems = items.filter(i => i.category === cat.id);
        if (catItems.length === 0) return "";

        return `
          <section class="menu-category-section" id="cat-section-${cat.id}">
            <div class="menu-category-header">
              <span class="eyebrow">${cat.id.toUpperCase()}</span>
              <h2 class="category-title">${cat.title}</h2>
              <p class="category-subtitle">${cat.subtitle}</p>
            </div>
            <div class="menu-category-grid">
              ${catItems.map(item => this.renderMenuItemCard(item)).join("")}
            </div>
          </section>
        `;
      }).join("");
    } else {
      container.innerHTML = `
        <div class="menu-category-grid">
          ${items.map(item => this.renderMenuItemCard(item)).join("")}
        </div>
      `;
    }

    this.updateFavoriteButtons();
  },

  renderMenuItemCard(item) {
    const isFav = window.EG_STORE ? window.EG_STORE.isFavorite(item.id) : false;
    const isFeatured = item.featured;

    return `
      <article class="menu-card ${isFeatured ? 'featured-card' : ''}" data-item-id="${item.id}">
        <div class="menu-card-img-wrap" onclick="MenuController.openQuickView('${item.id}')" tabindex="0" role="button" aria-label="View culinary details for ${item.name}" onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); MenuController.openQuickView('${item.id}'); }">
          <img src="${item.image}" alt="${item.name}" loading="lazy" class="menu-card-img" onerror="this.src='https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80'">
          <div class="menu-card-overlay">
            <span class="btn-quick-view">Quick View</span>
          </div>
          <button 
            type="button" 
            class="btn-favorite-heart ${isFav ? 'is-fav' : ''}" 
            onclick="event.stopPropagation(); MenuController.toggleFav('${item.id}')"
            aria-label="${isFav ? 'Remove from favorites' : 'Save to favorites'}"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        <div class="menu-card-content">
          <div class="menu-card-tags">
            ${(item.dietary || []).map(d => `<span class="tag-badge ${d === 'Signature' ? 'signature' : ''}">${d}</span>`).join("")}
          </div>

          <div class="menu-card-header">
            <h3 class="menu-card-title" onclick="MenuController.openQuickView('${item.id}')">${item.name}</h3>
            <div class="menu-card-price">$${parseFloat(item.price).toFixed(2)}</div>
          </div>

          <p class="menu-card-desc">${item.description}</p>

          ${item.allergens && item.allergens.length > 0 ? `
            <div class="menu-card-allergens">
              <span class="allergen-label">Allergens:</span>
              <span class="allergen-list">${item.allergens.join(", ")}</span>
            </div>
          ` : ''}

          <div class="menu-card-footer">
            <button type="button" class="btn btn-primary btn-sm btn-order-item" onclick="CartController.openModifierModal('${item.id}')" aria-label="Add ${item.name} to order">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Add to Order</span>
            </button>
            <button type="button" class="btn-card-details" onclick="MenuController.openQuickView('${item.id}')">
              <span>Details</span>
            </button>
          </div>
        </div>
      </article>
    `;
  },

  toggleFav(itemId) {
    if (window.EG_STORE) {
      const isNowFav = window.EG_STORE.toggleFavorite(itemId);
      if (window.EG_UI) {
        window.EG_UI.toast(
          isNowFav ? "Saved to your culinary favorites" : "Removed from favorites",
          "info"
        );
      }
    }
  },

  updateFavoriteButtons() {
    if (!window.EG_STORE) return;
    document.querySelectorAll(".btn-favorite-heart").forEach(btn => {
      const card = btn.closest(".menu-card");
      if (card) {
        const id = card.dataset.itemId;
        const isFav = window.EG_STORE.isFavorite(id);
        btn.classList.toggle("is-fav", isFav);
        const svg = btn.querySelector("svg");
        if (svg) svg.setAttribute("fill", isFav ? "currentColor" : "none");
      }
    });
  },

  resetFilters() {
    this.state.category = "all";
    this.state.searchQuery = "";
    this.state.activeDietaryFilters = [];
    this.state.sortBy = "default";
    this.state.showOnlyFavorites = false;

    const searchInput = document.getElementById("menu-search-input");
    if (searchInput) searchInput.value = "";

    const sortSelect = document.getElementById("menu-sort-select");
    if (sortSelect) sortSelect.value = "default";

    document.querySelectorAll("[data-menu-category]").forEach(b => {
      const isAll = b.getAttribute("data-menu-category") === "all";
      b.classList.toggle("active", isAll);
      b.setAttribute("aria-selected", isAll ? "true" : "false");
    });
    document.querySelectorAll("[data-dietary-filter]").forEach(b => b.classList.remove("active"));
    document.getElementById("toggle-favorites-filter")?.classList.remove("active");

    this.renderMenu();
  },

  openQuickView(itemId) {
    this.lastFocusedElement = document.activeElement;
    const item = window.EG_DATA.MENU_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    let modal = document.getElementById("eg-quick-view-modal");
    if (!modal) {
      const modalHtml = `
        <div id="eg-quick-view-modal" class="quick-view-backdrop" aria-hidden="true">
          <div class="quick-view-modal" role="dialog" aria-modal="true" aria-labelledby="qv-modal-dish-title">
            <button class="quick-view-close" data-action="close-quick-view" aria-label="Close modal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div id="quick-view-body" class="quick-view-body"></div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", modalHtml);
      modal = document.getElementById("eg-quick-view-modal");
    }

    const body = document.getElementById("quick-view-body");
    if (!body) return;

    const isFav = window.EG_STORE ? window.EG_STORE.isFavorite(item.id) : false;

    body.innerHTML = `
      <div class="qv-layout">
        <div class="qv-img-column">
          <img src="${item.image}" alt="${item.name}" class="qv-image" onerror="this.src='https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'">
        </div>
        <div class="qv-content-column">
          <div class="qv-header">
            <div class="qv-tags">
              ${(item.dietary || []).map(d => `<span class="tag-badge ${d === 'Signature' ? 'signature' : ''}">${d}</span>`).join("")}
            </div>
            <h2 id="qv-modal-dish-title" class="qv-title">${item.name}</h2>
            <div class="qv-price">$${parseFloat(item.price).toFixed(2)}</div>
          </div>

          <p class="qv-desc">${item.description}</p>

          ${item.story ? `
            <div class="qv-story-box">
              <span class="qv-story-label">Culinary Heritage & Hearth Craft</span>
              <p class="qv-story-text">${item.story}</p>
            </div>
          ` : ''}

          <div class="qv-meta-list">
            ${item.pairing ? `
              <div class="qv-meta-item">
                <span class="qv-meta-label">Master Sommelier Pairing:</span>
                <span class="qv-meta-value">${item.pairing}</span>
              </div>
            ` : ''}
            <div class="qv-meta-item">
              <span class="qv-meta-label">Est. Preparation Time:</span>
              <span class="qv-meta-value">${item.prepTime || '15-20 min'}</span>
            </div>
            ${item.allergens && item.allergens.length > 0 ? `
              <div class="qv-meta-item">
                <span class="qv-meta-label">Allergen Notice:</span>
                <span class="qv-meta-value">${item.allergens.join(", ")}</span>
              </div>
            ` : ''}
          </div>

          <div class="qv-actions">
            <button type="button" class="btn btn-primary btn-block" onclick="MenuController.closeQuickView(); CartController.openModifierModal('${item.id}')">
              <span>Add to Order — $${parseFloat(item.price).toFixed(2)}</span>
            </button>
            <button type="button" class="btn btn-secondary" onclick="MenuController.toggleFav('${item.id}'); MenuController.openQuickView('${item.id}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span>${isFav ? 'Saved in Favorites' : 'Save to Favorites'}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";

    const closeBtn = modal.querySelector(".quick-view-close");
    if (closeBtn) closeBtn.focus();
  },

  closeQuickView() {
    const modal = document.getElementById("eg-quick-view-modal");
    if (modal) {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
        this.lastFocusedElement = null;
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("menu-grid-container")) {
    MenuController.init();
  }
});
