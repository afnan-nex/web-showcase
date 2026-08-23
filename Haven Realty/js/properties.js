/**
 * Haven Realty - Property Catalog & Advanced Filtering Engine
 * Supports instant search, multi-filter criteria, URL state synchronization, sorting, and view toggles.
 */

document.addEventListener("DOMContentLoaded", () => {
  initPropertiesCatalog();
});

function initPropertiesCatalog() {
  const gridContainer = document.getElementById("properties-catalog-grid");
  const countEl = document.getElementById("catalog-results-count");
  const activeChipsContainer = document.getElementById("active-filter-chips");
  const emptyStateEl = document.getElementById("catalog-empty-state");

  // Form Filter Controls
  const keywordInput = document.getElementById("filter-keyword");
  const statusChips = document.querySelectorAll(".status-filter-chip");
  const typeChips = document.querySelectorAll(".type-filter-chip");
  const locationSelect = document.getElementById("filter-location");
  const bedsChips = document.querySelectorAll(".beds-filter-chip");
  const bathsChips = document.querySelectorAll(".baths-filter-chip");
  const maxPriceSlider = document.getElementById("filter-max-price-slider");
  const maxPriceDisplay = document.getElementById("filter-max-price-val");
  const minPriceSlider = document.getElementById("filter-min-price-slider");
  const minPriceDisplay = document.getElementById("filter-min-price-val");
  const amenityCheckboxes = document.querySelectorAll(".amenity-checkbox");
  const sortSelect = document.getElementById("catalog-sort-select");
  const clearAllBtn = document.getElementById("filter-clear-all-btn");
  const resetFiltersBtn = document.getElementById("catalog-reset-filters-btn");

  // View Mode Toggles
  const viewGridBtn = document.getElementById("view-toggle-grid");
  const viewListBtn = document.getElementById("view-toggle-list");
  const viewMapBtn = document.getElementById("view-toggle-map");
  const mapContainer = document.getElementById("catalog-map-container");

  let currentFilters = {
    keyword: "",
    status: "all",
    type: "",
    location: "",
    minPrice: 0,
    maxPrice: 50000000,
    beds: "",
    baths: "",
    amenities: [],
    sort: "newest",
    view: "grid"
  };

  // 1. Parse URL Query Parameters on Load
  function loadFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);

    if (params.has("keyword")) currentFilters.keyword = params.get("keyword").trim();
    if (params.has("status")) currentFilters.status = params.get("status");
    if (params.has("type")) currentFilters.type = params.get("type");
    if (params.has("location")) currentFilters.location = params.get("location");
    if (params.has("minPrice")) currentFilters.minPrice = parseInt(params.get("minPrice"), 10) || 0;
    if (params.has("maxPrice")) currentFilters.maxPrice = parseInt(params.get("maxPrice"), 10) || 50000000;
    if (params.has("beds")) currentFilters.beds = params.get("beds");
    if (params.has("baths")) currentFilters.baths = params.get("baths");
    if (params.has("amenities")) {
      currentFilters.amenities = params.get("amenities").split(",").map(a => a.trim()).filter(Boolean);
    }
    if (params.has("sort")) currentFilters.sort = params.get("sort");
    if (params.has("view")) currentFilters.view = params.get("view");

    // Sync UI elements to match URL state
    if (keywordInput) keywordInput.value = currentFilters.keyword;

    statusChips.forEach(chip => {
      chip.classList.toggle("active", chip.dataset.status === currentFilters.status);
    });

    typeChips.forEach(chip => {
      chip.classList.toggle("active", chip.dataset.type === currentFilters.type);
    });

    if (locationSelect) locationSelect.value = currentFilters.location;

    bedsChips.forEach(chip => {
      chip.classList.toggle("active", chip.dataset.beds === currentFilters.beds);
    });

    bathsChips.forEach(chip => {
      chip.classList.toggle("active", chip.dataset.baths === currentFilters.baths);
    });

    if (minPriceSlider) {
      minPriceSlider.value = currentFilters.minPrice;
      if (minPriceDisplay) minPriceDisplay.textContent = formatPrice(currentFilters.minPrice);
    }

    if (maxPriceSlider) {
      maxPriceSlider.value = currentFilters.maxPrice;
      if (maxPriceDisplay) maxPriceDisplay.textContent = currentFilters.maxPrice >= 50000000 ? "Any ($50M+)" : formatPrice(currentFilters.maxPrice);
    }

    amenityCheckboxes.forEach(cb => {
      cb.checked = currentFilters.amenities.includes(cb.value);
    });

    if (sortSelect) sortSelect.value = currentFilters.sort;

    setViewMode(currentFilters.view, false);
  }

  // 2. Sync Current State to URL Query String
  function syncFiltersToURL() {
    const params = new URLSearchParams();

    if (currentFilters.keyword) params.set("keyword", currentFilters.keyword);
    if (currentFilters.status && currentFilters.status !== "all") params.set("status", currentFilters.status);
    if (currentFilters.type) params.set("type", currentFilters.type);
    if (currentFilters.location) params.set("location", currentFilters.location);
    if (currentFilters.minPrice > 0) params.set("minPrice", currentFilters.minPrice);
    if (currentFilters.maxPrice < 50000000) params.set("maxPrice", currentFilters.maxPrice);
    if (currentFilters.beds) params.set("beds", currentFilters.beds);
    if (currentFilters.baths) params.set("baths", currentFilters.baths);
    if (currentFilters.amenities.length > 0) params.set("amenities", currentFilters.amenities.join(","));
    if (currentFilters.sort && currentFilters.sort !== "newest") params.set("sort", currentFilters.sort);
    if (currentFilters.view && currentFilters.view !== "grid") params.set("view", currentFilters.view);

    const newQuery = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, "", newQuery);
  }

  // 3. Filter and Sort Engine
  function getFilteredProperties() {
    return HAVEN_PROPERTIES.filter(prop => {
      // Keyword match (title, description, neighborhood, city, address, amenities)
      if (currentFilters.keyword) {
        const kw = currentFilters.keyword.toLowerCase();
        const fullString = [
          prop.title,
          prop.tagline,
          prop.description,
          prop.location.neighborhood,
          prop.location.city,
          prop.location.state,
          prop.location.address,
          ...prop.amenities,
          ...prop.keyFeatures
        ].join(" ").toLowerCase();

        if (!fullString.includes(kw)) return false;
      }

      // Status filter
      if (currentFilters.status && currentFilters.status !== "all") {
        if (currentFilters.status === "sale" && prop.status !== "for-sale") return false;
        if (currentFilters.status === "rent" && prop.status !== "for-rent") return false;
      }

      // Type filter
      if (currentFilters.type && prop.type !== currentFilters.type) {
        return false;
      }

      // Location filter (Neighborhood or City)
      if (currentFilters.location) {
        const loc = currentFilters.location.toLowerCase();
        const matchesNeighborhood = prop.location.neighborhood.toLowerCase().includes(loc);
        const matchesCity = prop.location.city.toLowerCase().includes(loc);
        if (!matchesNeighborhood && !matchesCity) return false;
      }

      // Price range
      if (prop.price < currentFilters.minPrice) return false;
      if (prop.price > currentFilters.maxPrice) return false;

      // Bedrooms
      if (currentFilters.beds) {
        const minBeds = parseInt(currentFilters.beds, 10);
        if (prop.bedrooms < minBeds) return false;
      }

      // Bathrooms
      if (currentFilters.baths) {
        const minBaths = parseFloat(currentFilters.baths);
        if (prop.bathrooms < minBaths) return false;
      }

      // Amenities (must have all selected amenities)
      if (currentFilters.amenities.length > 0) {
        const hasAll = currentFilters.amenities.every(amenity => 
          prop.amenities.some(a => a.toLowerCase() === amenity.toLowerCase())
        );
        if (!hasAll) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (currentFilters.sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "area-desc":
          return b.area - a.area;
        case "views-desc":
          return b.viewsCount - a.viewsCount;
        case "newest":
        default:
          return new Date(b.dateAdded) - new Date(a.dateAdded);
      }
    });
  }

  // 4. Render Active Filter Chips
  function renderActiveChips() {
    if (!activeChipsContainer) return;
    const chips = [];

    if (currentFilters.keyword) {
      chips.push({ label: `"${currentFilters.keyword}"`, clearKey: "keyword" });
    }
    if (currentFilters.status && currentFilters.status !== "all") {
      chips.push({ label: currentFilters.status === "sale" ? "For Sale" : "For Lease", clearKey: "status" });
    }
    if (currentFilters.type) {
      chips.push({ label: currentFilters.type.toUpperCase(), clearKey: "type" });
    }
    if (currentFilters.location) {
      chips.push({ label: `Location: ${currentFilters.location}`, clearKey: "location" });
    }
    if (currentFilters.minPrice > 0) {
      chips.push({ label: `Min: ${formatPrice(currentFilters.minPrice)}`, clearKey: "minPrice" });
    }
    if (currentFilters.maxPrice < 50000000) {
      chips.push({ label: `Max: ${formatPrice(currentFilters.maxPrice)}`, clearKey: "maxPrice" });
    }
    if (currentFilters.beds) {
      chips.push({ label: `${currentFilters.beds}+ Beds`, clearKey: "beds" });
    }
    if (currentFilters.baths) {
      chips.push({ label: `${currentFilters.baths}+ Baths`, clearKey: "baths" });
    }
    currentFilters.amenities.forEach(amenity => {
      chips.push({ label: amenity, clearKey: "amenity", value: amenity });
    });

    if (chips.length === 0) {
      activeChipsContainer.innerHTML = "";
      activeChipsContainer.style.display = "none";
      return;
    }

    activeChipsContainer.style.display = "flex";
    activeChipsContainer.innerHTML = chips.map(c => `
      <span class="active-chip">
        ${c.label}
        <button type="button" class="chip-remove" data-clearkey="${c.clearKey}" data-value="${c.value || ''}" aria-label="Remove filter">&times;</button>
      </span>
    `).join("");

    // Chip remove event listeners
    activeChipsContainer.querySelectorAll(".chip-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.clearkey;
        const val = btn.dataset.value;

        if (key === "keyword") {
          currentFilters.keyword = "";
          if (keywordInput) keywordInput.value = "";
        } else if (key === "status") {
          currentFilters.status = "all";
          statusChips.forEach(c => c.classList.toggle("active", c.dataset.status === "all"));
        } else if (key === "type") {
          currentFilters.type = "";
          typeChips.forEach(c => c.classList.remove("active"));
        } else if (key === "location") {
          currentFilters.location = "";
          if (locationSelect) locationSelect.value = "";
        } else if (key === "minPrice") {
          currentFilters.minPrice = 0;
          if (minPriceSlider) minPriceSlider.value = 0;
          if (minPriceDisplay) minPriceDisplay.textContent = "$0";
        } else if (key === "maxPrice") {
          currentFilters.maxPrice = 50000000;
          if (maxPriceSlider) maxPriceSlider.value = 50000000;
          if (maxPriceDisplay) maxPriceDisplay.textContent = "Any ($50M+)";
        } else if (key === "beds") {
          currentFilters.beds = "";
          bedsChips.forEach(c => c.classList.remove("active"));
        } else if (key === "baths") {
          currentFilters.baths = "";
          bathsChips.forEach(c => c.classList.remove("active"));
        } else if (key === "amenity") {
          currentFilters.amenities = currentFilters.amenities.filter(a => a !== val);
          amenityCheckboxes.forEach(cb => {
            if (cb.value === val) cb.checked = false;
          });
        }

        applyAndRender();
      });
    });
  }

  // 5. Render Catalog Grid & Map
  function renderCatalog(results) {
    if (!gridContainer) return;

    if (countEl) {
      countEl.innerHTML = `Showing <strong>${results.length}</strong> of ${HAVEN_PROPERTIES.length} residences`;
    }

    if (results.length === 0) {
      gridContainer.innerHTML = "";
      if (emptyStateEl) emptyStateEl.style.display = "block";
      if (mapContainer) mapContainer.style.display = "none";
      return;
    }

    if (emptyStateEl) emptyStateEl.style.display = "none";
    gridContainer.innerHTML = results.map(prop => renderPropertyCardHTML(prop)).join("");

    // If map view is active, render interactive SVG map
    if (currentFilters.view === "map" && mapContainer) {
      renderInteractiveMap(results);
    }
  }

  // 6. Interactive Simulated SVG Map View
  function renderInteractiveMap(results) {
    if (!mapContainer) return;
    mapContainer.style.display = "block";
    mapContainer.innerHTML = `
      <div class="interactive-map-wrapper" style="position:relative; height:450px; background-color:#1E2226; border-radius:var(--radius-xs); overflow:hidden; border:1px solid var(--color-border-dark); margin-bottom:2.5rem;">
        <svg width="100%" height="100%" viewBox="0 0 1000 450" preserveAspectRatio="none" style="position:absolute; inset:0; opacity:0.18;">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" stroke-width="0.75"/>
            </pattern>
          </defs>
          <rect width="1000" height="450" fill="url(#grid)" />
          <!-- Abstract Architectural Coastline Vector -->
          <path d="M 0 150 Q 250 80 450 200 T 800 120 T 1000 280" fill="none" stroke="#C2A277" stroke-width="2" />
          <path d="M 0 220 Q 300 180 600 320 T 1000 360" fill="none" stroke="#C2A277" stroke-width="1.5" stroke-dasharray="4,4" />
        </svg>
        <div class="map-controls-overlay" style="position:absolute; top:1rem; left:1rem; z-index:10; background:rgba(18,20,23,0.9); padding:0.6rem 1rem; border-radius:var(--radius-xs); color:#FFFFFF; font-size:0.8rem; border:1px solid var(--color-border-dark);">
          <span>Interactive Global Satellite Grid &bull; Click pin to preview</span>
        </div>
        <div class="map-pins-layer" style="position:relative; width:100%; height:100%; z-index:5;">
          ${results.map((p, i) => {
            const left = 12 + ((i * 23 + (p.price % 67)) % 76);
            const top = 18 + ((i * 31 + (p.area % 43)) % 62);
            return `
              <div class="map-pin" style="position:absolute; left:${left}%; top:${top}%; transform:translate(-50%, -50%); cursor:pointer;" onclick="location.href='property-detail.html?id=${p.id}'" title="${p.title} (${p.priceDisplay})">
                <div class="map-pin-pill" style="background:#121417; border:1px solid #C2A277; color:#FFFFFF; padding:4px 9px; border-radius:4px; font-size:0.75rem; font-weight:700; white-space:nowrap; box-shadow:0 4px 12px rgba(0,0,0,0.5); transition:all 0.2s ease;">
                  ${p.priceDisplay}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  // 7. View Mode Handler
  function setViewMode(mode, triggerRender = true) {
    currentFilters.view = mode;

    if (viewGridBtn) viewGridBtn.classList.toggle("active", mode === "grid");
    if (viewListBtn) viewListBtn.classList.toggle("active", mode === "list");
    if (viewMapBtn) viewMapBtn.classList.toggle("active", mode === "map");

    if (gridContainer) {
      if (mode === "list") {
        gridContainer.className = "property-list-layout";
        if (mapContainer) mapContainer.style.display = "none";
      } else if (mode === "map") {
        gridContainer.className = "grid-2";
        if (mapContainer) mapContainer.style.display = "block";
      } else {
        gridContainer.className = "grid-3";
        if (mapContainer) mapContainer.style.display = "none";
      }
    }

    if (triggerRender) {
      syncFiltersToURL();
      applyAndRender();
    }
  }

  // Master update pipeline
  function applyAndRender() {
    syncFiltersToURL();
    renderActiveChips();
    const results = getFilteredProperties();
    renderCatalog(results);
  }

  // 8. Event Listeners Setup
  // Keyword live search with debounce
  let debounceTimeout;
  if (keywordInput) {
    keywordInput.addEventListener("input", () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        currentFilters.keyword = keywordInput.value.trim();
        applyAndRender();
      }, 250);
    });
  }

  // Status Filter Chips
  statusChips.forEach(chip => {
    chip.addEventListener("click", () => {
      statusChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentFilters.status = chip.dataset.status;
      applyAndRender();
    });
  });

  // Type Filter Chips
  typeChips.forEach(chip => {
    chip.addEventListener("click", () => {
      if (chip.classList.contains("active")) {
        chip.classList.remove("active");
        currentFilters.type = "";
      } else {
        typeChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        currentFilters.type = chip.dataset.type;
      }
      applyAndRender();
    });
  });

  // Location Dropdown
  if (locationSelect) {
    locationSelect.addEventListener("change", () => {
      currentFilters.location = locationSelect.value;
      applyAndRender();
    });
  }

  // Min Price Slider
  if (minPriceSlider) {
    minPriceSlider.addEventListener("input", () => {
      currentFilters.minPrice = parseInt(minPriceSlider.value, 10);
      if (minPriceDisplay) minPriceDisplay.textContent = formatPrice(currentFilters.minPrice);
      applyAndRender();
    });
  }

  // Max Price Slider
  if (maxPriceSlider) {
    maxPriceSlider.addEventListener("input", () => {
      currentFilters.maxPrice = parseInt(maxPriceSlider.value, 10);
      if (maxPriceDisplay) {
        maxPriceDisplay.textContent = currentFilters.maxPrice >= 50000000 ? "Any ($50M+)" : formatPrice(currentFilters.maxPrice);
      }
      applyAndRender();
    });
  }

  // Bedrooms Chips
  bedsChips.forEach(chip => {
    chip.addEventListener("click", () => {
      if (chip.classList.contains("active")) {
        chip.classList.remove("active");
        currentFilters.beds = "";
      } else {
        bedsChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        currentFilters.beds = chip.dataset.beds;
      }
      applyAndRender();
    });
  });

  // Bathrooms Chips
  bathsChips.forEach(chip => {
    chip.addEventListener("click", () => {
      if (chip.classList.contains("active")) {
        chip.classList.remove("active");
        currentFilters.baths = "";
      } else {
        bathsChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        currentFilters.baths = chip.dataset.baths;
      }
      applyAndRender();
    });
  });

  // Amenities Checkboxes
  amenityCheckboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      const selected = Array.from(amenityCheckboxes).filter(c => c.checked).map(c => c.value);
      currentFilters.amenities = selected;
      applyAndRender();
    });
  });

  // Sort Select
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      currentFilters.sort = sortSelect.value;
      applyAndRender();
    });
  }

  // View Mode Buttons
  if (viewGridBtn) viewGridBtn.addEventListener("click", () => setViewMode("grid"));
  if (viewListBtn) viewListBtn.addEventListener("click", () => setViewMode("list"));
  if (viewMapBtn) viewMapBtn.addEventListener("click", () => setViewMode("map"));

  // Clear All
  function resetAllFilters() {
    currentFilters = {
      keyword: "",
      status: "all",
      type: "",
      location: "",
      minPrice: 0,
      maxPrice: 50000000,
      beds: "",
      baths: "",
      amenities: [],
      sort: "newest",
      view: currentFilters.view
    };

    if (keywordInput) keywordInput.value = "";
    statusChips.forEach(c => c.classList.toggle("active", c.dataset.status === "all"));
    typeChips.forEach(c => c.classList.remove("active"));
    if (locationSelect) locationSelect.value = "";
    bedsChips.forEach(c => c.classList.remove("active"));
    bathsChips.forEach(c => c.classList.remove("active"));
    if (minPriceSlider) {
      minPriceSlider.value = 0;
      if (minPriceDisplay) minPriceDisplay.textContent = "$0";
    }
    if (maxPriceSlider) {
      maxPriceSlider.value = 50000000;
      if (maxPriceDisplay) maxPriceDisplay.textContent = "Any ($50M+)";
    }
    amenityCheckboxes.forEach(cb => cb.checked = false);
    if (sortSelect) sortSelect.value = "newest";

    applyAndRender();
    showToast("Filters reset to default portfolio view", "info");
  }

  if (clearAllBtn) clearAllBtn.addEventListener("click", resetAllFilters);
  if (resetFiltersBtn) resetFiltersBtn.addEventListener("click", resetAllFilters);

  // Initial Load Pipeline
  loadFiltersFromURL();
  renderActiveChips();
  const initialResults = getFilteredProperties();
  renderCatalog(initialResults);
}
