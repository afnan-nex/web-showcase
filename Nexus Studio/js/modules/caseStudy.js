/**
 * NEXUS STUDIO — DYNAMIC CASE STUDY ROUTER & RENDERER
 * Parses URL parameters, renders rich case studies, lightbox modal, and next/prev navigation
 */

const CaseStudyRenderer = {
  container: null,
  lightbox: null,

  init() {
    this.container = document.querySelector("#case-study-content");
    if (!this.container || typeof PROJECTS_DATA === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    let projectSlug = urlParams.get("project");

    // Default to first project if none specified or invalid
    if (!projectSlug || !getProjectBySlug(projectSlug)) {
      projectSlug = "aurora";
      // Update URL without page reload for clean routing
      const newUrl = `${window.location.pathname}?project=${projectSlug}`;
      window.history.replaceState({ path: newUrl }, "", newUrl);
    }

    const project = getProjectBySlug(projectSlug);
    this.render(project);
    this.initLightbox();
  },

  render(project) {
    if (!project) return;

    // Update document title for SEO
    document.title = `${project.title} — Case Study | Nexus Studio`;

    // Calculate next project
    const allProjects = getAllProjects();
    const currentIndex = allProjects.findIndex(p => p.slug === project.slug);
    const nextProject = allProjects[(currentIndex + 1) % allProjects.length];
    const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];

    const metricsHtml = project.metrics.map(m => `
      <div class="stat-item">
        <div class="stat-item-val text-accent">${m.value}</div>
        <div class="stat-item-desc font-mono">${m.label}</div>
      </div>
    `).join("");

    const galleryHtml = project.gallery.map((g, idx) => `
      <div class="gallery-image-card" data-lightbox-src="${g.url}" data-lightbox-caption="${g.caption}" data-cursor-hover data-cursor-text="EXPAND">
        <img src="${g.url}" alt="${g.caption}" loading="lazy">
        <div class="gallery-caption">${g.caption}</div>
      </div>
    `).join("");

    const tagsHtml = project.tags.map(t => `<span class="project-tag">${t}</span>`).join("");

    this.container.innerHTML = `
      <!-- Case Study Hero -->
      <section class="case-study-hero">
        <div class="container">
          <div class="section-eyebrow">CASE STUDY / ${project.year}</div>
          <h1 class="display-title" style="margin-bottom: 1.5rem;">${project.title}</h1>
          <p class="lead" style="max-width: 820px; margin-bottom: 2rem;">${project.subtitle}</p>

          <div class="project-tags" style="margin-bottom: 2.5rem;">
            ${tagsHtml}
          </div>

          <!-- Metadata Bar -->
          <div class="case-study-meta-bar">
            <div class="meta-bar-item">
              <span class="meta-bar-label">Client</span>
              <span class="meta-bar-value">${project.client}</span>
            </div>
            <div class="meta-bar-item">
              <span class="meta-bar-label">Industry</span>
              <span class="meta-bar-value">${project.industry}</span>
            </div>
            <div class="meta-bar-item">
              <span class="meta-bar-label">Timeline</span>
              <span class="meta-bar-value">${project.timeline}</span>
            </div>
            <div class="meta-bar-item">
              <span class="meta-bar-label">Studio Role</span>
              <span class="meta-bar-value">${project.role}</span>
            </div>
          </div>

          <img src="${project.heroImage}" alt="${project.title} Banner" class="case-study-banner-image">
        </div>
      </section>

      <!-- Executive Overview & Challenge -->
      <section class="section">
        <div class="container container-narrow">
          <div class="grid-2" style="align-items: start; margin-bottom: 4rem;">
            <div>
              <span class="badge badge-outline" style="margin-bottom: 1rem;">THE CONTEXT</span>
              <h2 class="h2" style="margin-bottom: 1.25rem;">Executive Overview</h2>
              <p class="text-secondary" style="font-size: 1.1rem; line-height: 1.7;">${project.overview}</p>
            </div>
            <div style="background-color: var(--bg-secondary); padding: 2rem; border-radius: var(--radius-xs); border: 1px solid var(--border-subtle);">
              <span class="badge" style="margin-bottom: 1rem; color: var(--accent-secondary); border-color: rgba(255, 72, 32, 0.3);">THE CHALLENGE</span>
              <h3 class="h3" style="margin-bottom: 1rem;">Friction & Bottlenecks</h3>
              <p class="text-secondary" style="line-height: 1.6;">${project.challenge}</p>
            </div>
          </div>

          <!-- Strategy & Design Approach -->
          <div class="grid-2" style="align-items: start; margin-bottom: 4rem;">
            <div style="background-color: var(--bg-secondary); padding: 2rem; border-radius: var(--radius-xs); border: 1px solid var(--border-subtle);">
              <span class="badge" style="margin-bottom: 1rem;">STRATEGIC BLUEPRINT</span>
              <h3 class="h3" style="margin-bottom: 1rem;">Positioning & UX Strategy</h3>
              <p class="text-secondary" style="line-height: 1.6;">${project.strategy}</p>
            </div>
            <div>
              <span class="badge badge-outline" style="margin-bottom: 1rem;">ART DIRECTION & CODE</span>
              <h2 class="h2" style="margin-bottom: 1.25rem;">Design & Engineering</h2>
              <p class="text-secondary" style="font-size: 1.05rem; line-height: 1.7; margin-bottom: 1rem;">${project.designApproach}</p>
              <p class="text-secondary" style="font-size: 1.05rem; line-height: 1.7;">${project.development}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Visual Artifacts & Interactive Gallery -->
      <section class="section section-flush-top">
        <div class="container">
          <div class="section-header">
            <div class="section-eyebrow">VISUAL ARTIFACTS</div>
            <h2 class="h2">Interface & Design Showcase</h2>
            <p class="text-secondary">Click any image to inspect high-resolution architecture diagrams and UI systems.</p>
          </div>

          <div class="case-study-gallery-grid">
            ${galleryHtml}
          </div>
        </div>
      </section>

      <!-- Measurable Results & Impact -->
      <section class="section section-flush-top">
        <div class="container container-narrow">
          <div class="results-highlight-box">
            <span class="badge" style="margin-bottom: 1rem;">VERIFIED OUTCOMES</span>
            <h2 class="h2" style="margin-bottom: 1rem;">Business & Performance Impact</h2>
            <p class="lead" style="margin-bottom: 2rem;">${project.results}</p>

            <div class="results-metrics-grid">
              ${metricsHtml}
            </div>
          </div>

          <!-- Client Testimonial -->
          <div style="margin-top: 5rem; padding: 2.5rem; background-color: var(--bg-secondary); border-radius: var(--radius-xs); border: 1px solid var(--border-medium);">
            <blockquote class="testimonial-quote" style="margin-bottom: 1.5rem; font-size: 1.4rem;">
              "${project.testimonial.quote}"
            </blockquote>
            <div class="testimonial-author-wrap">
              <img src="${project.testimonial.avatar}" alt="${project.testimonial.author}" class="testimonial-avatar" loading="lazy">
              <div>
                <div class="testimonial-name">${project.testimonial.author}</div>
                <div class="testimonial-role">${project.testimonial.role}, ${project.testimonial.company}</div>
              </div>
            </div>
          </div>

          <!-- Project Pagination Navigation -->
          <div class="project-pagination-strip">
            <a href="case-study.html?project=${prevProject.slug}" class="project-nav-link">
              <span class="project-nav-label">&larr; Previous Case Study</span>
              <span class="project-nav-title">${prevProject.title}</span>
            </a>
            <a href="work.html" class="btn btn-secondary btn-sm">All Projects</a>
            <a href="case-study.html?project=${nextProject.slug}" class="project-nav-link" style="text-align: right;">
              <span class="project-nav-label">Next Case Study &rarr;</span>
              <span class="project-nav-title">${nextProject.title}</span>
            </a>
          </div>
        </div>
      </section>
    `;
  },

  initLightbox() {
    let modal = document.querySelector("#case-study-lightbox");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "case-study-lightbox";
      modal.className = "lightbox-modal";
      modal.innerHTML = `
        <button class="modal-close-btn" style="top: 2rem; right: 2rem; position: fixed; z-index: 100002;" aria-label="Close Lightbox">&times;</button>
        <div style="text-align: center; max-width: 90vw;">
          <img src="" alt="" class="lightbox-img">
          <p class="lightbox-caption font-mono" style="margin-top: 1rem; color: var(--text-secondary);"></p>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const imgEl = modal.querySelector(".lightbox-img");
    const captionEl = modal.querySelector(".lightbox-caption");
    const closeBtn = modal.querySelector(".modal-close-btn");

    const closeModal = () => {
      modal.classList.remove("active");
    };

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
      }
    });

    // Bind cards in container
    document.querySelectorAll("[data-lightbox-src]").forEach(card => {
      card.addEventListener("click", () => {
        const src = card.getAttribute("data-lightbox-src");
        const caption = card.getAttribute("data-lightbox-caption") || "";

        imgEl.src = src;
        imgEl.alt = caption;
        captionEl.textContent = caption;
        modal.classList.add("active");
      });
    });
  }
};
