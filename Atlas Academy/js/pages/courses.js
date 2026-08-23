/**
 * Atlas Academy - Courses Catalog Controller
 */

let activeFilters = {
  search: "",
  category: "all",
  level: "all",
  sort: "popular"
};

document.addEventListener("DOMContentLoaded", () => {
  parseUrlParams();
  initFilterInputs();
  renderCategoryPills();
  applyFiltersAndRender();

  if (window.atlasState) {
    window.atlasState.subscribe(() => {
      applyFiltersAndRender();
    });
  }
});

function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("cat")) activeFilters.category = params.get("cat");
  if (params.has("q")) activeFilters.search = params.get("q");
  if (params.has("level")) activeFilters.level = params.get("level");
  if (params.has("sort")) activeFilters.sort = params.get("sort");
}

function initFilterInputs() {
  const searchInput = document.getElementById("course-search-input");
  const catSelect = document.getElementById("filter-category");
  const levelSelect = document.getElementById("filter-level");
  const sortSelect = document.getElementById("filter-sort");

  if (searchInput) {
    searchInput.value = activeFilters.search;
    searchInput.addEventListener("input", (e) => {
      activeFilters.search = e.target.value.trim();
      updateUrlAndRender();
    });
  }

  if (catSelect) {
    catSelect.value = activeFilters.category;
    catSelect.addEventListener("change", (e) => {
      activeFilters.category = e.target.value;
      updateUrlAndRender();
      renderCategoryPills();
    });
  }

  if (levelSelect) {
    levelSelect.value = activeFilters.level;
    levelSelect.addEventListener("change", (e) => {
      activeFilters.level = e.target.value;
      updateUrlAndRender();
    });
  }

  if (sortSelect) {
    sortSelect.value = activeFilters.sort;
    sortSelect.addEventListener("change", (e) => {
      activeFilters.sort = e.target.value;
      updateUrlAndRender();
    });
  }
}

function renderCategoryPills() {
  const container = document.getElementById("category-pills-bar");
  if (!container || !window.ATLAS_DATA) return;

  const allCategories = [{ id: "all", name: "All Disciplines" }, ...ATLAS_DATA.categories];

  container.innerHTML = allCategories.map(cat => {
    const isActive = activeFilters.category === cat.id;
    return `
      <button class="badge ${isActive ? 'badge-accent' : 'badge-outline'}" style="cursor: pointer; padding: 6px 12px; font-size: 0.78rem;" onclick="selectCategoryFilter('${cat.id}')">
        ${cat.name}
      </button>
    `;
  }).join("");
}

function selectCategoryFilter(catId) {
  activeFilters.category = catId;
  const catSelect = document.getElementById("filter-category");
  if (catSelect) catSelect.value = catId;
  renderCategoryPills();
  updateUrlAndRender();
}

function updateUrlAndRender() {
  const params = new URLSearchParams();
  if (activeFilters.category !== "all") params.set("cat", activeFilters.category);
  if (activeFilters.search) params.set("q", activeFilters.search);
  if (activeFilters.level !== "all") params.set("level", activeFilters.level);
  if (activeFilters.sort !== "popular") params.set("sort", activeFilters.sort);

  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.replaceState({}, "", newUrl);

  applyFiltersAndRender();
}

function applyFiltersAndRender() {
  if (!window.ATLAS_DATA) return;

  let list = [...ATLAS_DATA.courses];

  // 1. Keyword search
  if (activeFilters.search) {
    const q = activeFilters.search.toLowerCase();
    list = list.filter(c => 
      c.title.toLowerCase().includes(q) ||
      c.tagline.toLowerCase().includes(q) ||
      c.categoryName.toLowerCase().includes(q) ||
      c.overview.toLowerCase().includes(q) ||
      c.learningOutcomes.some(o => o.toLowerCase().includes(q))
    );
  }

  // 2. Category filter
  if (activeFilters.category !== "all") {
    list = list.filter(c => c.category === activeFilters.category);
  }

  // 3. Level filter
  if (activeFilters.level !== "all") {
    list = list.filter(c => c.level.toLowerCase() === activeFilters.level.toLowerCase());
  }

  // 4. Sorting
  if (activeFilters.sort === "rating") {
    list.sort((a, b) => b.rating - a.rating);
  } else if (activeFilters.sort === "duration") {
    list.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
  } else if (activeFilters.sort === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (activeFilters.sort === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  } else {
    // Most Popular
    list.sort((a, b) => b.studentsCount - a.studentsCount);
  }

  // Render to DOM
  const grid = document.getElementById("courses-catalog-grid");
  const emptyState = document.getElementById("courses-empty-state");
  const countBadge = document.getElementById("results-count-badge");
  const clearBtn = document.getElementById("clear-filters-btn");

  if (countBadge) {
    countBadge.textContent = `Showing ${list.length} ${list.length === 1 ? 'Course' : 'Courses'}`;
  }

  const isFiltered = activeFilters.search || activeFilters.category !== "all" || activeFilters.level !== "all";
  if (clearBtn) {
    clearBtn.style.display = isFiltered ? "inline-flex" : "none";
  }

  if (list.length === 0) {
    if (grid) grid.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
  } else {
    if (emptyState) emptyState.style.display = "none";
    if (grid) {
      grid.innerHTML = list.map(c => renderCourseCard(c)).join("");
    }
  }
}

function clearAllFilters() {
  activeFilters = {
    search: "",
    category: "all",
    level: "all",
    sort: "popular"
  };

  const searchInput = document.getElementById("course-search-input");
  const catSelect = document.getElementById("filter-category");
  const levelSelect = document.getElementById("filter-level");
  const sortSelect = document.getElementById("filter-sort");

  if (searchInput) searchInput.value = "";
  if (catSelect) catSelect.value = "all";
  if (levelSelect) levelSelect.value = "all";
  if (sortSelect) sortSelect.value = "popular";

  renderCategoryPills();
  updateUrlAndRender();
}
