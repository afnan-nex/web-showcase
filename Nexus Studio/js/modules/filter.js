/**
 * NEXUS STUDIO — CLIENT-SIDE PROJECT FILTERING
 * Instant category filtering, real-time search, counter tags, and layout rendering
 */

const ProjectFilter = {
  container: null,
  filterButtons: null,
  searchInput: null,
  emptyState: null,
  currentCategory: "all",
  searchQuery: "",

  init() {
    this.container = document.querySelector("#portfolio-grid");
    this.filterButtons = document.querySelectorAll("[data-filter]");
    this.searchInput = document.querySelector("#portfolio-search");
    this.emptyState = document.querySelector("#portfolio-empty-state");

    if (!this.container || typeof PROJECTS_DATA === "undefined") return;

    // Check URL param for initial filter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get("category");
    if (categoryParam) {
      this.currentCategory = categoryParam.toLowerCase();
    }

    this.updateFilterCounts();
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    this.filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const filterVal = btn.getAttribute("data-filter").toLowerCase();
        this.currentCategory = filterVal;

        // Update active class
        this.filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        this.render();
      });
    });

    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.render();
      });
    }
  },

  updateFilterCounts() {
    const counts = {
      all: PROJECTS_DATA.length,
      branding: PROJECTS_DATA.filter(p => p.categories.includes("branding")).length,
      web: PROJECTS_DATA.filter(p => p.categories.includes("web")).length,
      "e-commerce": PROJECTS_DATA.filter(p => p.categories.includes("e-commerce")).length,
      product: PROJECTS_DATA.filter(p => p.categories.includes("product")).length,
      strategy: PROJECTS_DATA.filter(p => p.categories.includes("strategy")).length
    };

    this.filterButtons.forEach(btn => {
      const category = btn.getAttribute("data-filter").toLowerCase();
      const countEl = btn.querySelector(".filter-count");
      if (countEl && counts[category] !== undefined) {
        countEl.textContent = `(${counts[category]})`;
      }
    });
  },

  getFilteredProjects() {
    return PROJECTS_DATA.filter(project => {
      const matchesCategory = this.currentCategory === "all" || project.categories.includes(this.currentCategory);
      
      if (!this.searchQuery) return matchesCategory;

      const searchableText = `${project.title} ${project.subtitle} ${project.industry} ${project.tags.join(" ")} ${project.excerpt}`.toLowerCase();
      const matchesSearch = searchableText.includes(this.searchQuery);

      return matchesCategory && matchesSearch;
    });
  },

  render() {
    const filtered = this.getFilteredProjects();

    if (filtered.length === 0) {
      this.container.innerHTML = "";
      if (this.emptyState) this.emptyState.classList.add("is-visible");
      return;
    }

    if (this.emptyState) this.emptyState.classList.remove("is-visible");

    this.container.innerHTML = filtered.map((project, index) => {
      const formattedNum = String(index + 1).padStart(2, "0");
      const tagsHtml = project.tags.slice(0, 3).map(tag => `<span class="project-tag">${tag}</span>`).join("");

      return `
        <article class="project-card reveal-on-scroll is-revealed" data-cursor-hover data-cursor-text="EXPLORE">
          <a href="case-study.html?project=${project.slug}" class="project-card-image-wrap" aria-label="View case study for ${project.title}">
            <img src="${project.heroImage}" alt="${project.title} — ${project.subtitle}" class="project-card-image" loading="lazy">
            <div class="project-card-overlay">
              <span class="btn btn-sm btn-primary">Explore Case Study &rarr;</span>
            </div>
          </a>
          <div class="project-card-meta">
            <span class="project-index">PROJ / ${formattedNum}</span>
            <span class="project-year">${project.year}</span>
          </div>
          <h3 class="project-title">
            <a href="case-study.html?project=${project.slug}">${project.title}</a>
          </h3>
          <p class="project-industry">${project.industry}</p>
          <p class="text-secondary" style="font-size: 0.9375rem; margin-bottom: 1rem; line-height: 1.5;">${project.excerpt}</p>
          <div class="project-tags">
            ${tagsHtml}
          </div>
        </article>
      `;
    }).join("");
  }
};
