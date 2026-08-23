/**
 * NORTHSTAR COMMERCE - Shop / Catalog View with Multi-Facet Filters & Sorting
 */

import { productStore } from '../store/productStore.js';
import { renderProductCard } from '../components/productCard.js';
import { formatPrice, getSvgIcon } from '../utils/helpers.js';

export const ShopView = {
  state: {
    category: 'all',
    searchQuery: '',
    minPrice: 0,
    maxPrice: 1000,
    selectedBrands: [],
    minRating: 0,
    inStockOnly: false,
    onSaleOnly: false,
    sortBy: 'featured',
    viewMode: 'grid-3', // 'grid-4' | 'grid-3' | 'grid-2' | 'list'
    mobileFilterOpen: false
  },

  render(routeParams = {}, queryParams = {}) {
    // Initialize filter state from route & query
    if (routeParams.category) this.state.category = routeParams.category;
    if (queryParams.category) this.state.category = queryParams.category;
    if (queryParams.q) this.state.searchQuery = queryParams.q;
    if (queryParams.sort) this.state.sortBy = queryParams.sort;
    if (queryParams.sale === 'true') this.state.onSaleOnly = true;

    const categories = productStore.getCategories();
    const brands = productStore.getBrands();
    const currentCategoryObj = categories.find(c => c.id === this.state.category);

    const filteredProducts = productStore.filterAndSort({
      category: this.state.category,
      searchQuery: this.state.searchQuery,
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice,
      brands: this.state.selectedBrands,
      minRating: this.state.minRating,
      inStockOnly: this.state.inStockOnly,
      onSaleOnly: this.state.onSaleOnly,
      sortBy: this.state.sortBy
    });

    const hasActiveFilters = this.state.category !== 'all' ||
      this.state.searchQuery !== '' ||
      this.state.minPrice > 0 ||
      this.state.maxPrice < 1000 ||
      this.state.selectedBrands.length > 0 ||
      this.state.minRating > 0 ||
      this.state.inStockOnly ||
      this.state.onSaleOnly;

    return `
      <div class="shop-page container">
        <!-- Shop Header & Breadcrumbs -->
        <header class="shop-header">
          <nav class="shop-breadcrumbs" aria-label="Breadcrumb">
            <a href="#/home">Home</a>
            <span>/</span>
            <a href="#/shop">Catalog</a>
            ${this.state.category !== 'all' ? `
              <span>/</span>
              <span style="color: var(--color-text-primary); font-weight: 600;">${currentCategoryObj ? currentCategoryObj.name : this.state.category}</span>
            ` : ''}
          </nav>

          <div class="shop-title-row">
            <div>
              <h1 style="font-size: var(--text-3xl);">
                ${this.state.category !== 'all' ? (currentCategoryObj?.name || 'Category') : 'Complete Catalog'}
              </h1>
              <p class="text-sm text-muted" style="margin-top: 4px; max-width: 640px;">
                ${currentCategoryObj?.description || 'Explore our full repository of luxury outerwear, audio transducers, mechanical tools, and artisanal living objects.'}
              </p>
            </div>
            <div style="display: flex; align-items: center; gap: var(--space-4);">
              <!-- Mobile Filter Drawer Trigger -->
              <button type="button" class="btn btn-outline btn-sm mobile-filter-btn" id="open-mobile-filters-btn" style="display: none;">
                ${getSvgIcon('filter')}
                <span>Filters ${hasActiveFilters ? '• Active' : ''}</span>
              </button>
              <div class="text-sm text-muted" style="font-weight: 500;">
                Showing <strong>${filteredProducts.length}</strong> items
              </div>
            </div>
          </div>
        </header>

        <div class="shop-layout">
          <!-- Left Filter Sidebar (Desktop & Mobile Drawer) -->
          <aside class="shop-filters-sidebar ${this.state.mobileFilterOpen ? 'mobile-open' : ''}" id="shop-filter-aside">
            <div class="filters-header">
              <span style="font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">Refine By</span>
              <div style="display: flex; align-items: center; gap: var(--space-3);">
                ${hasActiveFilters ? `
                  <button type="button" class="btn-link btn-xs" id="clear-all-filters-btn" style="color: var(--color-danger); font-size: 11px;">Clear All</button>
                ` : ''}
                <button type="button" class="action-btn mobile-filter-close-btn" id="close-mobile-filters-btn" style="display: none; width: 32px; height: 32px;" aria-label="Close filters">
                  ${getSvgIcon('close')}
                </button>
              </div>
            </div>

            <!-- In-catalog Search Filter -->
            <div class="filter-group">
              <div class="filter-group-title">Search</div>
              <input type="text" id="shop-filter-search" class="form-input" placeholder="Keyword, brand..." value="${this.state.searchQuery}" style="padding: 6px 10px; font-size: 13px;" />
            </div>

            <!-- Category Filter -->
            <div class="filter-group">
              <div class="filter-group-title">Category</div>
              <div class="filter-options-list">
                ${categories.map(cat => `
                  <label class="filter-checkbox-item">
                    <span style="display: flex; align-items: center; gap: 8px;">
                      <input type="radio" name="shop-category" value="${cat.id}" ${this.state.category === cat.id ? 'checked' : ''} style="accent-color: var(--color-accent);" />
                      <span style="${this.state.category === cat.id ? 'font-weight: 600; color: var(--color-text-primary);' : ''}">${cat.name}</span>
                    </span>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Price Range Filter -->
            <div class="filter-group">
              <div class="filter-group-title">
                <span>Price</span>
                <span class="filter-count" id="price-display-val">${formatPrice(this.state.minPrice)} – ${formatPrice(this.state.maxPrice)}</span>
              </div>
              <input type="range" id="shop-price-slider" min="0" max="1000" step="25" value="${this.state.maxPrice}" style="width: 100%; accent-color: var(--color-accent); cursor: pointer;" aria-label="Price range filter slider" />
              <div class="price-range-inputs">
                <div class="price-input-box">
                  <span>$</span>
                  <input type="number" id="min-price-input" min="0" max="1000" value="${this.state.minPrice}" aria-label="Minimum price" />
                </div>
                <span class="text-muted">–</span>
                <div class="price-input-box">
                  <span>$</span>
                  <input type="number" id="max-price-input" min="0" max="1000" value="${this.state.maxPrice}" aria-label="Maximum price" />
                </div>
              </div>
            </div>

            <!-- Brand Filter -->
            <div class="filter-group">
              <div class="filter-group-title">Brand / Atelier</div>
              <div class="filter-options-list" style="max-height: 180px; overflow-y: auto;">
                ${brands.map(b => `
                  <label class="filter-checkbox-item">
                    <span style="display: flex; align-items: center; gap: 8px;">
                      <input type="checkbox" class="shop-brand-checkbox" value="${b}" ${this.state.selectedBrands.includes(b) ? 'checked' : ''} style="accent-color: var(--color-accent);" />
                      <span>${b}</span>
                    </span>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Rating Filter -->
            <div class="filter-group">
              <div class="filter-group-title">Minimum Rating</div>
              <div class="filter-options-list">
                <label class="filter-checkbox-item">
                  <span style="display: flex; align-items: center; gap: 6px;">
                    <input type="radio" name="shop-rating" value="0" ${this.state.minRating === 0 ? 'checked' : ''} style="accent-color: var(--color-accent);" />
                    <span>All Ratings</span>
                  </span>
                </label>
                <label class="filter-checkbox-item">
                  <span style="display: flex; align-items: center; gap: 6px;">
                    <input type="radio" name="shop-rating" value="4.8" ${this.state.minRating === 4.8 ? 'checked' : ''} style="accent-color: var(--color-accent);" />
                    <span>★ 4.8 & above</span>
                  </span>
                </label>
                <label class="filter-checkbox-item">
                  <span style="display: flex; align-items: center; gap: 6px;">
                    <input type="radio" name="shop-rating" value="4.5" ${this.state.minRating === 4.5 ? 'checked' : ''} style="accent-color: var(--color-accent);" />
                    <span>★ 4.5 & above</span>
                  </span>
                </label>
              </div>
            </div>

            <!-- Toggles (In Stock & Sale) -->
            <div class="filter-group" style="margin-bottom: 0;">
              <div class="filter-options-list">
                <label class="form-checkbox-label">
                  <input type="checkbox" class="form-checkbox" id="shop-instock-toggle" ${this.state.inStockOnly ? 'checked' : ''} />
                  <span>In Stock Only</span>
                </label>
                <label class="form-checkbox-label" style="margin-top: 6px;">
                  <input type="checkbox" class="form-checkbox" id="shop-sale-toggle" ${this.state.onSaleOnly ? 'checked' : ''} />
                  <span>Special Archive Releases</span>
                </label>
              </div>
            </div>

            <!-- Mobile Apply Filters Action -->
            <button type="button" class="btn btn-primary btn-full mobile-apply-filters-btn" id="mobile-apply-btn" style="display: none; margin-top: var(--space-6);">
              Apply Filters (${filteredProducts.length} items)
            </button>
          </aside>

          <!-- Right Main Catalog Area -->
          <main class="shop-products-main">
            <!-- Catalog Top Toolbar -->
            <div class="catalog-top-bar">
              <div style="display: flex; align-items: center; gap: var(--space-4);">
                <label for="catalog-sort-select" style="font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted);">
                  Sort:
                </label>
                <select id="catalog-sort-select" class="form-select" style="width: auto; padding: 4px 10px; font-size: 13px;">
                  <option value="featured" ${this.state.sortBy === 'featured' ? 'selected' : ''}>Curated / Featured</option>
                  <option value="newest" ${this.state.sortBy === 'newest' ? 'selected' : ''}>New Season First</option>
                  <option value="price-asc" ${this.state.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
                  <option value="price-desc" ${this.state.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
                  <option value="rating" ${this.state.sortBy === 'rating' ? 'selected' : ''}>Highest Customer Rating</option>
                  <option value="name-asc" ${this.state.sortBy === 'name-asc' ? 'selected' : ''}>Alphabetical (A–Z)</option>
                </select>
              </div>

              <!-- View Switchers (Grid / List) -->
              <div style="display: flex; align-items: center; gap: 6px;">
                <button type="button" class="btn-icon" data-view-mode="grid-3" style="width: 34px; height: 34px; font-size: 11px; font-weight: 700; ${this.state.viewMode === 'grid-3' ? 'background: var(--color-accent); color: #fff;' : ''}" title="3-Column Grid">3</button>
                <button type="button" class="btn-icon" data-view-mode="grid-4" style="width: 34px; height: 34px; font-size: 11px; font-weight: 700; ${this.state.viewMode === 'grid-4' ? 'background: var(--color-accent); color: #fff;' : ''}" title="4-Column Grid">4</button>
                <button type="button" class="btn-icon" data-view-mode="grid-2" style="width: 34px; height: 34px; font-size: 11px; font-weight: 700; ${this.state.viewMode === 'grid-2' ? 'background: var(--color-accent); color: #fff;' : ''}" title="2-Column Grid">2</button>
                <button type="button" class="btn-icon" data-view-mode="list" style="width: 34px; height: 34px; font-size: 11px; font-weight: 700; ${this.state.viewMode === 'list' ? 'background: var(--color-accent); color: #fff;' : ''}" title="List View">≡</button>
              </div>
            </div>

            <!-- Active Filters Chip Bar -->
            ${hasActiveFilters ? `
              <div class="active-filter-chips">
                ${this.state.category !== 'all' ? `
                  <span class="filter-chip-removable">
                    Category: ${currentCategoryObj?.name || this.state.category}
                    <button type="button" data-remove-filter="category" aria-label="Remove category filter">&times;</button>
                  </span>
                ` : ''}
                ${this.state.searchQuery ? `
                  <span class="filter-chip-removable">
                    "${this.state.searchQuery}"
                    <button type="button" data-remove-filter="search" aria-label="Remove search filter">&times;</button>
                  </span>
                ` : ''}
                ${this.state.maxPrice < 1000 || this.state.minPrice > 0 ? `
                  <span class="filter-chip-removable">
                    ${formatPrice(this.state.minPrice)} – ${formatPrice(this.state.maxPrice)}
                    <button type="button" data-remove-filter="price" aria-label="Remove price filter">&times;</button>
                  </span>
                ` : ''}
                ${this.state.selectedBrands.map(b => `
                  <span class="filter-chip-removable">
                    ${b}
                    <button type="button" data-remove-brand="${b}" aria-label="Remove ${b} brand filter">&times;</button>
                  </span>
                `).join('')}
                ${this.state.inStockOnly ? `
                  <span class="filter-chip-removable">
                    In Stock Only
                    <button type="button" data-remove-filter="instock" aria-label="Remove in-stock filter">&times;</button>
                  </span>
                ` : ''}
                ${this.state.onSaleOnly ? `
                  <span class="filter-chip-removable">
                    Special Archive
                    <button type="button" data-remove-filter="sale" aria-label="Remove sale filter">&times;</button>
                  </span>
                ` : ''}
                ${this.state.minRating > 0 ? `
                  <span class="filter-chip-removable">
                    ★ ${this.state.minRating}+
                    <button type="button" data-remove-filter="rating" aria-label="Remove rating filter">&times;</button>
                  </span>
                ` : ''}
                <button type="button" class="btn-link btn-xs" id="clear-all-chips-btn" style="color: var(--color-danger); align-self: center; margin-left: 8px;">Reset All</button>
              </div>
            ` : ''}

            <!-- Products Grid or Empty State -->
            ${filteredProducts.length > 0 ? `
              <div class="${this.state.viewMode === 'list' ? 'grid-list-view' : this.state.viewMode === 'grid-4' ? 'grid grid-cols-4' : this.state.viewMode === 'grid-2' ? 'grid grid-cols-2' : 'grid grid-cols-3'}" id="shop-product-grid">
                ${filteredProducts.map(p => renderProductCard(p)).join('')}
              </div>
            ` : `
              <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-16) var(--space-8); text-align: center;">
                <div style="width: 56px; height: 56px; border-radius: 50%; background-color: var(--color-bg-alt); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-4);">
                  ${getSvgIcon('search')}
                </div>
                <h3 style="margin-bottom: var(--space-2);">No Products Match Your Criteria</h3>
                <p class="text-sm text-muted" style="max-width: 380px; margin: 0 auto var(--space-6);">Try adjusting your price range, clearing brand selections, or searching for a broader term.</p>
                <button type="button" class="btn btn-secondary btn-sm" id="empty-reset-filters-btn">Reset All Filters</button>
              </div>
            `}
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

    // Mobile filter drawer triggers
    const openMobileFiltersBtn = container.querySelector('#open-mobile-filters-btn');
    const closeMobileFiltersBtn = container.querySelector('#close-mobile-filters-btn');
    const mobileApplyBtn = container.querySelector('#mobile-apply-btn');
    const filterAside = container.querySelector('#shop-filter-aside');

    if (openMobileFiltersBtn && filterAside) {
      openMobileFiltersBtn.addEventListener('click', () => {
        filterAside.classList.add('mobile-open');
        document.body.style.overflow = 'hidden';
      });
    }

    if (closeMobileFiltersBtn && filterAside) {
      closeMobileFiltersBtn.addEventListener('click', () => {
        filterAside.classList.remove('mobile-open');
        document.body.style.overflow = '';
      });
    }

    if (mobileApplyBtn && filterAside) {
      mobileApplyBtn.addEventListener('click', () => {
        filterAside.classList.remove('mobile-open');
        document.body.style.overflow = '';
        refresh();
      });
    }

    // Category Radio
    const catRadios = container.querySelectorAll('input[name="shop-category"]');
    catRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.state.category = e.target.value;
        refresh();
      });
    });

    // Search Input
    const searchInput = container.querySelector('#shop-filter-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.state.searchQuery = e.target.value;
        const gridEl = container.querySelector('#shop-product-grid');
        const matches = productStore.filterAndSort({
          category: this.state.category,
          searchQuery: this.state.searchQuery,
          minPrice: this.state.minPrice,
          maxPrice: this.state.maxPrice,
          brands: this.state.selectedBrands,
          minRating: this.state.minRating,
          inStockOnly: this.state.inStockOnly,
          onSaleOnly: this.state.onSaleOnly,
          sortBy: this.state.sortBy
        });
        if (gridEl) {
          gridEl.innerHTML = matches.map(p => renderProductCard(p)).join('');
        }
      });
    }

    // Price Slider & Number Inputs
    const priceSlider = container.querySelector('#shop-price-slider');
    const maxPriceInput = container.querySelector('#max-price-input');
    const minPriceInput = container.querySelector('#min-price-input');

    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        this.state.maxPrice = Number(e.target.value);
        if (maxPriceInput) maxPriceInput.value = this.state.maxPrice;
        const disp = container.querySelector('#price-display-val');
        if (disp) disp.textContent = `${formatPrice(this.state.minPrice)} – ${formatPrice(this.state.maxPrice)}`;
      });
      priceSlider.addEventListener('change', () => refresh());
    }

    if (maxPriceInput) {
      maxPriceInput.addEventListener('change', (e) => {
        this.state.maxPrice = Number(e.target.value);
        refresh();
      });
    }

    if (minPriceInput) {
      minPriceInput.addEventListener('change', (e) => {
        this.state.minPrice = Number(e.target.value);
        refresh();
      });
    }

    // Brand Checkboxes
    const brandCheckboxes = container.querySelectorAll('.shop-brand-checkbox');
    brandCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const checked = Array.from(container.querySelectorAll('.shop-brand-checkbox:checked')).map(el => el.value);
        this.state.selectedBrands = checked;
        refresh();
      });
    });

    // Rating Radio
    const ratingRadios = container.querySelectorAll('input[name="shop-rating"]');
    ratingRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.state.minRating = Number(e.target.value);
        refresh();
      });
    });

    // In Stock Toggle
    const inStockToggle = container.querySelector('#shop-instock-toggle');
    if (inStockToggle) {
      inStockToggle.addEventListener('change', (e) => {
        this.state.inStockOnly = e.target.checked;
        refresh();
      });
    }

    // Sale Toggle
    const saleToggle = container.querySelector('#shop-sale-toggle');
    if (saleToggle) {
      saleToggle.addEventListener('change', (e) => {
        this.state.onSaleOnly = e.target.checked;
        refresh();
      });
    }

    // Sort Dropdown
    const sortSelect = container.querySelector('#catalog-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.state.sortBy = e.target.value;
        refresh();
      });
    }

    // View Mode Switchers
    const viewModeBtns = container.querySelectorAll('[data-view-mode]');
    viewModeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.viewMode = btn.getAttribute('data-view-mode');
        refresh();
      });
    });

    // Remove active filter chips & Clear All
    container.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-remove-filter]');
      if (removeBtn) {
        const filterType = removeBtn.getAttribute('data-remove-filter');
        if (filterType === 'category') this.state.category = 'all';
        if (filterType === 'search') this.state.searchQuery = '';
        if (filterType === 'price') { this.state.minPrice = 0; this.state.maxPrice = 1000; }
        if (filterType === 'instock') this.state.inStockOnly = false;
        if (filterType === 'sale') this.state.onSaleOnly = false;
        if (filterType === 'rating') this.state.minRating = 0;
        refresh();
        return;
      }

      const removeBrandBtn = e.target.closest('[data-remove-brand]');
      if (removeBrandBtn) {
        const brand = removeBrandBtn.getAttribute('data-remove-brand');
        this.state.selectedBrands = this.state.selectedBrands.filter(b => b !== brand);
        refresh();
        return;
      }

      const clearAllBtn = e.target.closest('#clear-all-filters-btn') || e.target.closest('#clear-all-chips-btn') || e.target.closest('#empty-reset-filters-btn');
      if (clearAllBtn) {
        this.state.category = 'all';
        this.state.searchQuery = '';
        this.state.minPrice = 0;
        this.state.maxPrice = 1000;
        this.state.selectedBrands = [];
        this.state.minRating = 0;
        this.state.inStockOnly = false;
        this.state.onSaleOnly = false;
        this.state.sortBy = 'featured';
        refresh();
        return;
      }
    });
  }
};
