/**
 * NEXUS STUDIO — MAIN CLIENT APPLICATION
 * Bootstraps all modules, live timezone clocks, scroll animations, and UX enhancements
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Theme
  if (typeof ThemeManager !== "undefined") {
    ThemeManager.init();
  }

  // 2. Initialize Custom Cursor
  if (typeof CustomCursor !== "undefined") {
    CustomCursor.init();
  }

  // 3. Initialize Navigation
  if (typeof Navigation !== "undefined") {
    Navigation.init();
  }

  // 4. Initialize Project Filtering & Search (on Work page)
  if (typeof ProjectFilter !== "undefined") {
    ProjectFilter.init();
  }

  // 5. Initialize Testimonial Slider
  if (typeof TestimonialSlider !== "undefined") {
    TestimonialSlider.init();
  }

  // 6. Initialize Accordions
  if (typeof Accordion !== "undefined") {
    Accordion.init();
  }

  // 7. Initialize Dynamic Case Study (on Case Study page)
  if (typeof CaseStudyRenderer !== "undefined") {
    CaseStudyRenderer.init();
  }

  // 8. Initialize Forms & LocalStorage Vault (on Contact page)
  if (typeof FormManager !== "undefined") {
    FormManager.init();
  }

  // 9. Initialize Live Studio Clocks
  initStudioClocks();

  // 10. Scroll Intersection Reveal Observer
  initScrollAnimations();

  // 11. Homepage Dynamic Services & Selected Work Previews
  initHomepageContent();
});

/**
 * Live Studio Timezones (Zurich, New York, Tokyo, London)
 */
function initStudioClocks() {
  const clocks = [
    { id: "clock-zurich", timeZone: "Europe/Zurich" },
    { id: "clock-ny", timeZone: "America/New_York" },
    { id: "clock-tokyo", timeZone: "Asia/Tokyo" },
    { id: "clock-london", timeZone: "Europe/London" }
  ];

  const updateClocks = () => {
    const now = new Date();
    clocks.forEach(c => {
      const el = document.getElementById(c.id);
      if (el) {
        try {
          const timeStr = now.toLocaleTimeString("en-US", {
            timeZone: c.timeZone,
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          });
          el.textContent = timeStr;
        } catch (e) {
          el.textContent = now.toLocaleTimeString();
        }
      }
    });
  };

  updateClocks();
  setInterval(updateClocks, 1000);
}

/**
 * Smooth Scroll Reveal Animations via IntersectionObserver
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll(".reveal-on-scroll");
  if (!elements.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: "0px 0px -50px 0px",
      threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older environments
    elements.forEach(el => el.classList.add("is-revealed"));
  }
}

/**
 * Render selected projects and services on Homepage if elements exist
 */
function initHomepageContent() {
  const homeWorkContainer = document.querySelector("#home-featured-work");
  if (homeWorkContainer && typeof PROJECTS_DATA !== "undefined") {
    const featured = PROJECTS_DATA.filter(p => p.featured).slice(0, 4);

    homeWorkContainer.innerHTML = featured.map((project, index) => {
      const formattedNum = String(index + 1).padStart(2, "0");
      const tagsHtml = project.tags.slice(0, 2).map(tag => `<span class="project-tag">${tag}</span>`).join("");

      return `
        <article class="project-card reveal-on-scroll" data-cursor-hover data-cursor-text="VIEW">
          <a href="case-study.html?project=${project.slug}" class="project-card-image-wrap" aria-label="View case study for ${project.title}">
            <img src="${project.heroImage}" alt="${project.title} — ${project.subtitle}" class="project-card-image" loading="lazy">
            <div class="project-card-overlay">
              <span class="btn btn-sm btn-primary">Inspect Architecture &rarr;</span>
            </div>
          </a>
          <div class="project-card-meta">
            <span class="project-index">FEATURED / ${formattedNum}</span>
            <span class="project-year">${project.year}</span>
          </div>
          <h3 class="project-title">
            <a href="case-study.html?project=${project.slug}">${project.title}</a>
          </h3>
          <p class="project-industry">${project.industry}</p>
          <div class="project-tags">
            ${tagsHtml}
          </div>
        </article>
      `;
    }).join("");

    initScrollAnimations();
  }

  // Populate services accordion on homepage if present
  const homeServicesContainer = document.querySelector("#home-services-accordion");
  if (homeServicesContainer && typeof SERVICES_DATA !== "undefined") {
    homeServicesContainer.innerHTML = SERVICES_DATA.slice(0, 5).map((service, idx) => `
      <div class="accordion-item ${idx === 0 ? 'is-open' : ''}">
        <button class="accordion-trigger" aria-expanded="${idx === 0 ? 'true' : 'false'}">
          <div class="accordion-trigger-left">
            <span class="accordion-num">${service.number}</span>
            <span class="accordion-title">${service.title}</span>
            <span class="accordion-summary-tag">${service.summary}</span>
          </div>
          <div class="accordion-icon">+</div>
        </button>
        <div class="accordion-panel" style="${idx === 0 ? 'max-height: 500px; opacity: 1;' : ''}">
          <div class="accordion-panel-content">
            <p class="lead" style="margin-bottom: 1.25rem; font-size: 1.05rem;">${service.description}</p>
            <div class="deliverables-grid">
              ${service.deliverables.slice(0, 4).map(d => `<div class="deliverable-item">${d}</div>`).join("")}
            </div>
            <div style="margin-top: 1.5rem;">
              <a href="services.html" class="editorial-link">Explore Full Service Specification <span class="arrow-icon">&rarr;</span></a>
            </div>
          </div>
        </div>
      </div>
    `).join("");

    if (typeof Accordion !== "undefined") {
      Accordion.init();
    }
  }
}
