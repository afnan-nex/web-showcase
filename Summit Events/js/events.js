/**
 * SUMMIT EVENTS — EVENTS CATALOG & DISCOVERY JAVASCRIPT
 * Multi-facet filtering (keyword, location, category, date presets, custom date, price slider), sorting, view modes, active chips.
 */

document.addEventListener("DOMContentLoaded", () => {
  SummitEventsCatalog.init();
});

const SummitEventsCatalog = {
  events: [],
  filters: {
    keyword: "",
    category: "all",
    location: "all",
    datePreset: "all",
    customDateStart: "",
    customDateEnd: "",
    maxPrice: 1000,
    seatedOnly: false
  },
  sortBy: "date-asc", // date-asc, price-asc, price-desc, popular
  viewMode: "grid", // grid or list

  init() {
    this.events = SummitStorage.getEvents();
    this.readURLParams();
    this.bindFilterControls();
    this.renderCategoryPills();
    this.applyFiltersAndRender();
  },

  readURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("q")) this.filters.keyword = params.get("q");
    if (params.has("category")) this.filters.category = params.get("category");
    if (params.has("location")) this.filters.location = params.get("location");
    if (params.has("date")) this.filters.datePreset = params.get("date");
    if (params.has("sort")) this.sortBy = params.get("sort");

    // Sync input fields with URL
    const searchInput = document.getElementById("events-search-input");
    if (searchInput && this.filters.keyword) searchInput.value = this.filters.keyword;

    const locationSelect = document.getElementById("filter-location-select");
    if (locationSelect && this.filters.location) locationSelect.value = this.filters.location;

    const sortSelect = document.getElementById("catalog-sort-select");
    if (sortSelect && this.sortBy) sortSelect.value = this.sortBy;
  },

  bindFilterControls() {
    // Search input
    const searchInput = document.getElementById("events-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.filters.keyword = e.target.value.trim();
        this.applyFiltersAndRender();
      });
    }

    // Location dropdown
    const locSelect = document.getElementById("filter-location-select");
    if (locSelect) {
      locSelect.addEventListener("change", (e) => {
        this.filters.location = e.target.value;
        this.applyFiltersAndRender();
      });
    }

    // Date Preset buttons
    const dateBtns = document.querySelectorAll(".date-preset-btn");
    dateBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        dateBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.filters.datePreset = btn.getAttribute("data-preset");
        this.filters.customDateStart = "";
        this.filters.customDateEnd = "";
        
        // Hide/show custom date range input
        const customDateWrap = document.getElementById("custom-date-inputs");
        if (customDateWrap) {
          customDateWrap.style.display = this.filters.datePreset === "custom" ? "flex" : "none";
        }

        this.applyFiltersAndRender();
      });
    });

    // Custom Date Range inputs
    const customStart = document.getElementById("custom-date-start");
    const customEnd = document.getElementById("custom-date-end");
    if (customStart && customEnd) {
      const onCustomDateChange = () => {
        this.filters.customDateStart = customStart.value;
        this.filters.customDateEnd = customEnd.value;
        this.applyFiltersAndRender();
      };
      customStart.addEventListener("change", onCustomDateChange);
      customEnd.addEventListener("change", onCustomDateChange);
    }

    // Price Slider
    const priceSlider = document.getElementById("price-range-slider");
    const priceDisplay = document.getElementById("max-price-display");
    if (priceSlider && priceDisplay) {
      priceSlider.addEventListener("input", (e) => {
        this.filters.maxPrice = parseInt(e.target.value);
        priceDisplay.textContent = `$${this.filters.maxPrice}${this.filters.maxPrice >= 500 ? '+' : ''}`;
        this.applyFiltersAndRender();
      });
    }

    // Seated Only Checkbox
    const seatedChk = document.getElementById("chk-filter-seated");
    if (seatedChk) {
      seatedChk.addEventListener("change", (e) => {
        this.filters.seatedOnly = e.target.checked;
        this.applyFiltersAndRender();
      });
    }

    // Sort Dropdown
    const sortSelect = document.getElementById("catalog-sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        this.applyFiltersAndRender();
      });
    }

    // View Mode Toggle
    const btnGrid = document.getElementById("btn-view-grid");
    const btnList = document.getElementById("btn-view-list");
    if (btnGrid && btnList) {
      btnGrid.addEventListener("click", () => {
        this.viewMode = "grid";
        btnGrid.classList.add("active");
        btnList.classList.remove("active");
        this.applyFiltersAndRender();
      });
      btnList.addEventListener("click", () => {
        this.viewMode = "list";
        btnList.classList.add("active");
        btnGrid.classList.remove("active");
        this.applyFiltersAndRender();
      });
    }

    // Clear All Filters
    const clearBtn = document.getElementById("btn-clear-all-filters");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.resetFilters();
      });
    }
  },

  resetFilters() {
    this.filters = {
      keyword: "",
      category: "all",
      location: "all",
      datePreset: "all",
      customDateStart: "",
      customDateEnd: "",
      maxPrice: 1000,
      seatedOnly: false
    };

    const searchInput = document.getElementById("events-search-input");
    if (searchInput) searchInput.value = "";

    const locSelect = document.getElementById("filter-location-select");
    if (locSelect) locSelect.value = "all";

    const dateBtns = document.querySelectorAll(".date-preset-btn");
    dateBtns.forEach(b => b.classList.remove("active"));
    const allDateBtn = document.querySelector('.date-preset-btn[data-preset="all"]');
    if (allDateBtn) allDateBtn.classList.add("active");

    const customDateWrap = document.getElementById("custom-date-inputs");
    if (customDateWrap) customDateWrap.style.display = "none";

    const priceSlider = document.getElementById("price-range-slider");
    if (priceSlider) priceSlider.value = 500;
    const priceDisplay = document.getElementById("max-price-display");
    if (priceDisplay) priceDisplay.textContent = "$500+";

    const seatedChk = document.getElementById("chk-filter-seated");
    if (seatedChk) seatedChk.checked = false;

    this.renderCategoryPills();
    this.applyFiltersAndRender();
  },

  renderCategoryPills() {
    const container = document.getElementById("filter-categories-list");
    if (!container) return;

    const allEvents = SummitStorage.getEvents();
    const categories = SEED_CATEGORIES;

    container.innerHTML = categories.map(cat => {
      const count = cat.id === "all" 
        ? allEvents.length 
        : allEvents.filter(e => e.category === cat.id).length;
      
      const isActive = this.filters.category === cat.id;

      return `
        <div class="filter-pill-item ${isActive ? 'active' : ''}" data-category-id="${cat.id}">
          <span>${cat.name}</span>
          <span class="filter-count-badge">${count}</span>
        </div>
      `;
    }).join("");

    container.querySelectorAll(".filter-pill-item").forEach(item => {
      item.addEventListener("click", () => {
        this.filters.category = item.getAttribute("data-category-id");
        this.renderCategoryPills();
        this.applyFiltersAndRender();
      });
    });
  },

  applyFiltersAndRender() {
    this.events = SummitStorage.getEvents();
    let filtered = [...this.events];

    // 1. Keyword search (Title, tagline, description, venue, lineup)
    if (this.filters.keyword) {
      const q = this.filters.keyword.toLowerCase();
      filtered = filtered.filter(e => {
        const inTitle = e.title.toLowerCase().includes(q);
        const inTagline = (e.tagline || "").toLowerCase().includes(q);
        const inDesc = (e.description || "").toLowerCase().includes(q);
        const inVenue = (e.venueName || "").toLowerCase().includes(q);
        const inCity = (e.city || "").toLowerCase().includes(q);
        const inLineup = (e.lineup || []).some(l => l.name.toLowerCase().includes(q));
        return inTitle || inTagline || inDesc || inVenue || inCity || inLineup;
      });
    }

    // 2. Category
    if (this.filters.category && this.filters.category !== "all") {
      filtered = filtered.filter(e => e.category === this.filters.category);
    }

    // 3. Location
    if (this.filters.location && this.filters.location !== "all") {
      filtered = filtered.filter(e => e.city.toLowerCase() === this.filters.location.toLowerCase());
    }

    // 4. Seated only
    if (this.filters.seatedOnly) {
      filtered = filtered.filter(e => e.isSeated);
    }

    // 5. Price range
    if (this.filters.maxPrice < 500) {
      filtered = filtered.filter(e => (e.minPrice || 0) <= this.filters.maxPrice);
    }

    // 6. Date Filtering
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    if (this.filters.datePreset === "today") {
      filtered = filtered.filter(e => e.date === todayStr);
    } else if (this.filters.datePreset === "this-week") {
      const endOfWeek = new Date();
      endOfWeek.setDate(now.getDate() + 7);
      const endOfWeekStr = endOfWeek.toISOString().split("T")[0];
      filtered = filtered.filter(e => e.date >= todayStr && e.date <= endOfWeekStr);
    } else if (this.filters.datePreset === "this-month") {
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const endOfMonthStr = endOfMonth.toISOString().split("T")[0];
      filtered = filtered.filter(e => e.date >= todayStr && e.date <= endOfMonthStr);
    } else if (this.filters.datePreset === "custom") {
      if (this.filters.customDateStart) {
        filtered = filtered.filter(e => e.date >= this.filters.customDateStart);
      }
      if (this.filters.customDateEnd) {
        filtered = filtered.filter(e => e.date <= this.filters.customDateEnd);
      }
    }

    // 7. Sorting
    if (this.sortBy === "date-asc") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (this.sortBy === "price-asc") {
      filtered.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
    } else if (this.sortBy === "price-desc") {
      filtered.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0));
    } else if (this.sortBy === "alphabetical") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    this.renderResults(filtered);
    this.renderActiveFilterChips();
  },

  renderResults(results) {
    const container = document.getElementById("events-catalog-container");
    const countEl = document.getElementById("catalog-results-count");
    if (!container) return;

    if (countEl) {
      countEl.textContent = `${results.length} Event${results.length === 1 ? '' : 's'} Found`;
    }

    if (results.length === 0) {
      container.className = "events-empty-state";
      container.innerHTML = `
        <div class="empty-box" style="text-align:center; padding: 4rem 1rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-xl);">
          <svg class="icon" viewBox="0 0 24 24" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 1rem;" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          <h3>No matching events found</h3>
          <p style="margin-top: 0.5rem; margin-bottom: 1.5rem; color: var(--text-muted);">Try adjusting your search query, changing categories, or clearing active filters.</p>
          <button type="button" class="btn btn-secondary" onclick="SummitEventsCatalog.resetFilters()">
            Reset All Filters
          </button>
        </div>
      `;
      return;
    }

    container.className = this.viewMode === "grid" ? "events-editorial-grid" : "events-list-view";
    container.innerHTML = results.map(e => createEventCardHTML(e)).join("");
    bindEventCardActions(container);
  },

  renderActiveFilterChips() {
    const container = document.getElementById("active-filters-chips-bar");
    if (!container) return;

    const chips = [];

    if (this.filters.keyword) {
      chips.push({ label: `Query: "${this.filters.keyword}"`, onRemove: () => {
        this.filters.keyword = "";
        const input = document.getElementById("events-search-input");
        if (input) input.value = "";
        this.applyFiltersAndRender();
      }});
    }

    if (this.filters.category !== "all") {
      const cat = SEED_CATEGORIES.find(c => c.id === this.filters.category);
      chips.push({ label: `Category: ${cat ? cat.name : this.filters.category}`, onRemove: () => {
        this.filters.category = "all";
        this.renderCategoryPills();
        this.applyFiltersAndRender();
      }});
    }

    if (this.filters.location !== "all") {
      chips.push({ label: `City: ${this.filters.location}`, onRemove: () => {
        this.filters.location = "all";
        const loc = document.getElementById("filter-location-select");
        if (loc) loc.value = "all";
        this.applyFiltersAndRender();
      }});
    }

    if (this.filters.datePreset !== "all") {
      chips.push({ label: `Date: ${this.filters.datePreset}`, onRemove: () => {
        this.filters.datePreset = "all";
        const allBtn = document.querySelector('.date-preset-btn[data-preset="all"]');
        if (allBtn) allBtn.click();
      }});
    }

    if (this.filters.seatedOnly) {
      chips.push({ label: "Seated Events Only", onRemove: () => {
        this.filters.seatedOnly = false;
        const chk = document.getElementById("chk-filter-seated");
        if (chk) chk.checked = false;
        this.applyFiltersAndRender();
      }});
    }

    if (this.filters.maxPrice < 500) {
      chips.push({ label: `Under $${this.filters.maxPrice}`, onRemove: () => {
        this.filters.maxPrice = 1000;
        const slider = document.getElementById("price-range-slider");
        if (slider) slider.value = 500;
        const display = document.getElementById("max-price-display");
        if (display) display.textContent = "$500+";
        this.applyFiltersAndRender();
      }});
    }

    if (chips.length === 0) {
      container.innerHTML = "";
      container.style.display = "none";
      return;
    }

    container.style.display = "flex";
    container.innerHTML = chips.map((c, i) => `
      <div class="filter-chip" data-chip-idx="${i}">
        <span>${c.label}</span>
        <button type="button" class="filter-chip-remove">&times;</button>
      </div>
    `).join("") + `<button type="button" class="btn-clear-filters" onclick="SummitEventsCatalog.resetFilters()">Clear All</button>`;

    container.querySelectorAll(".filter-chip").forEach((chipEl, idx) => {
      chipEl.querySelector(".filter-chip-remove").addEventListener("click", () => {
        chips[idx].onRemove();
      });
    });
  }
};
