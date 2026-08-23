/**
 * Frame & Form — SPA Client-side Router & Dynamic View Engine
 * Supports deep linking, dynamic project views, smooth transitions, and multi-mode project rendering.
 */

import { PROJECTS, ARCHIVE, CLIENTS, AWARDS_LIST, EXHIBITIONS, CRITICAL_RECEPTION, MANIFESTO_PARAGRAPHS, DISCIPLINES, STUDIO_INFO } from './data.js';
import { sound } from './audio.js';

export class AppRouter {
  constructor(app) {
    this.app = app;
    this.container = document.getElementById('view-container');
    this.curtain = document.querySelector('.page-transition-curtain');
    this.currentRoute = '';
    this.currentParams = {};

    // Work page state
    this.workState = {
      filter: 'all',
      mode: 'grid', // 'grid' | 'index' | 'reel'
      searchQuery: ''
    };

    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('popstate', () => this.handleRoute());
  }

  init() {
    this.handleRoute();
  }

  parseHash() {
    const hash = window.location.hash.slice(1) || 'home';
    const [path, queryString] = hash.split('?');
    const params = {};

    if (queryString) {
      const urlParams = new URLSearchParams(queryString);
      for (const [k, v] of urlParams.entries()) {
        params[k] = v;
      }
    }

    return { path, params };
  }

  async navigate(hashString) {
    window.location.hash = hashString;
  }

  async handleRoute() {
    const { path, params } = this.parseHash();
    this.currentRoute = path;
    this.currentParams = params;

    // Update active nav links
    this.updateNavLinks(path);

    // Play transition sound & trigger curtain
    sound.playTransition();
    await this.animatePageTransition(async () => {
      window.scrollTo(0, 0);
      switch (path) {
        case 'home':
          this.renderHome();
          break;
        case 'work':
          this.renderWork();
          break;
        case 'project':
          this.renderProject(params.id || 'neo-monolith');
          break;
        case 'about':
          this.renderAbout();
          break;
        case 'archive':
          this.renderArchive();
          break;
        case 'contact':
          this.renderContact();
          break;
        default:
          this.renderHome();
      }

      // Rebind dynamic listeners & reinitialize scroll observers
      this.app.afterRender();
    });
  }

  updateNavLinks(activePath) {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      const href = link.getAttribute('href');
      const linkPath = href.replace('#', '').split('?')[0];
      const isActive = linkPath === activePath;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    // Close mobile menu if open
    const navMenu = document.querySelector('.nav-menu');
    const mobileBtn = document.getElementById('mobile-toggle-btn');
    if (navMenu) navMenu.classList.remove('open');
    if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
  }

  async animatePageTransition(renderCallback) {
    if (!this.curtain) {
      renderCallback();
      return;
    }

    this.curtain.classList.remove('animating-out');
    this.curtain.classList.add('animating-in');

    await new Promise(r => setTimeout(r, 400));
    renderCallback();
    await new Promise(r => setTimeout(r, 50));

    this.curtain.classList.remove('animating-in');
    this.curtain.classList.add('animating-out');

    setTimeout(() => {
      this.curtain.classList.remove('animating-out');
    }, 550);
  }

  /* -------------------------------------------------------------
     VIEW 1: HOME
     ------------------------------------------------------------- */
  renderHome() {
    const featuredProjects = PROJECTS.filter(p => p.featured);
    const recentProjects = PROJECTS.slice(0, 6);

    this.container.innerHTML = `
      <div class="view-home">
        <!-- Hero Editorial Section -->
        <section class="site-container hero-editorial">
          <div class="hero-meta-bar reveal-init delay-100">
            <div>
              <span>STUDIO FRAME & FORM</span>
              <span style="margin: 0 0.5rem; opacity: 0.3;">/</span>
              <span>2026 ARCHIVE</span>
            </div>
            <div class="hero-clocks">
              <div class="clock-item"><span class="clock-code">TYO</span> <span id="tyo-time">--:--:--</span></div>
              <div class="clock-item"><span class="clock-code">ZRH</span> <span id="zrh-time">--:--:--</span></div>
              <div class="clock-item"><span class="clock-code">CDG</span> <span id="cdg-time">--:--:--</span></div>
              <div class="clock-item"><span class="clock-code">NYC</span> <span id="nyc-time">--:--:--</span></div>
            </div>
          </div>

          <div class="hero-title-wrap">
            <span class="hero-super-title reveal-init delay-200">Creative Direction · Spatial Photography · Brand Architecture</span>
            <h1 class="hero-headline reveal-init delay-300">
              FRAME <span class="italic-serif">&amp;</span> FORM
            </h1>
          </div>

          <div class="hero-footer-bar reveal-init delay-400">
            <p class="hero-statement">
              An international design practice operating at the threshold between rigid structural containment and organic visual expression.
            </p>
            <div>
              <span class="font-mono text-muted uppercase" style="font-size:0.7rem; display:block; margin-bottom:0.25rem;">AVAILABILITY STATUS</span>
              <span style="color:var(--text-primary);">Accepting Select Commissions Q3/Q4 2026</span>
            </div>
            <div style="display:flex; justify-content:flex-end;">
              <a href="#work" class="hud-btn clickable" data-cursor="explore">
                <span>Explore Works (12)</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </section>

        <!-- Kinetic Marquee Ticker -->
        <div class="marquee-wrapper">
          <div class="marquee-track">
            <div class="marquee-item"><span>ART DIRECTION</span><span class="marquee-bullet">◆</span></div>
            <div class="marquee-item"><span>MEDIUM FORMAT PHOTOGRAPHY</span><span class="marquee-bullet">◆</span></div>
            <div class="marquee-item"><span>SPATIAL BRANDING</span><span class="marquee-bullet">◆</span></div>
            <div class="marquee-item"><span>EDITORIAL MONOGRAPHS</span><span class="marquee-bullet">◆</span></div>
            <div class="marquee-item"><span>35MM CINEMATOGRAPHY</span><span class="marquee-bullet">◆</span></div>
            <div class="marquee-item"><span>GENERATIVE DIGITAL SYSTEMS</span><span class="marquee-bullet">◆</span></div>
            <div class="marquee-item"><span>TOKYO</span><span class="marquee-bullet">◆</span></div>
            <div class="marquee-item"><span>ZURICH</span><span class="marquee-bullet">◆</span></div>
            <div class="marquee-item"><span>PARIS</span><span class="marquee-bullet">◆</span></div>
            <div class="marquee-item"><span>NEW YORK</span><span class="marquee-bullet">◆</span></div>
            <div class="marquee-item"><span>ART DIRECTION</span><span class="marquee-bullet">◆</span></div>
            <div class="marquee-item"><span>MEDIUM FORMAT PHOTOGRAPHY</span><span class="marquee-bullet">◆</span></div>
            <div class="marquee-item"><span>SPATIAL BRANDING</span><span class="marquee-bullet">◆</span></div>
          </div>
        </div>

        <!-- Featured Projects Horizontal Reel -->
        <section class="reel-section">
          <div class="reel-header">
            <div>
              <div class="section-label reveal-init">FLAGSHIP SELECTION</div>
              <h2 class="section-heading reveal-init delay-100">Featured Curations</h2>
            </div>
            <div class="font-mono text-muted reveal-init" style="font-size:0.75rem;">
              <span>← SCROLL OR DRAG →</span>
            </div>
          </div>

          <div class="reel-container clickable" data-cursor="drag" data-cursor-label="DRAG">
            ${featuredProjects.map(p => `
              <a href="#project?id=${p.slug}" class="reel-card clickable" data-cursor="view" data-cursor-label="VIEW">
                <div class="reel-media-wrap">
                  <img src="${p.coverImage}" alt="${p.title}" loading="lazy" />
                  <div class="reel-meta-overlay">
                    <span class="meta-pill">${p.discipline}</span>
                    <span class="meta-pill">${p.year}</span>
                  </div>
                </div>
                <div class="reel-info">
                  <div>
                    <h3 class="reel-title">${p.title}</h3>
                    <p class="reel-client">${p.client} — ${p.location}</p>
                  </div>
                  <span class="reel-year">0${PROJECTS.indexOf(p) + 1}</span>
                </div>
              </a>
            `).join('')}
          </div>
        </section>

        <!-- Asymmetric Discipline Showcase -->
        <section class="site-container section-padding" style="border-top: 1px solid var(--border-hairline);">
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom: 3.5rem;">
            <div>
              <div class="section-label reveal-init">DISCIPLINE MATRIX</div>
              <h2 class="section-heading reveal-init delay-100">Core Practices</h2>
            </div>
            <a href="#about" class="font-mono text-muted uppercase clickable hover-underline" style="font-size:0.75rem;">
              Studio Philosophy →
            </a>
          </div>

          <div class="editorial-grid" style="padding:0;">
            <div class="project-card-asym col-span-7 reveal-init">
              <a href="#project?id=neo-monolith" class="card-media-box aspect-landscape clickable" data-cursor="view">
                <img src="${PROJECTS[0].coverImage}" alt="${PROJECTS[0].title}" />
              </a>
              <div class="card-info-block">
                <div class="card-meta-line">
                  <span>01 / ART DIRECTION</span>
                  <span>VITRA INSTITUTE</span>
                </div>
                <h3 class="card-project-title"><a href="#project?id=neo-monolith">NEO-MONOLITH</a></h3>
                <p class="card-description-snippet">${PROJECTS[0].summary}</p>
              </div>
            </div>

            <div class="project-card-asym col-span-5 reveal-init delay-200" style="margin-top: clamp(0rem, 6vw, 5rem);">
              <a href="#project?id=chroma-vestige" class="card-media-box aspect-portrait clickable" data-cursor="view">
                <img src="${PROJECTS[1].coverImage}" alt="${PROJECTS[1].title}" />
              </a>
              <div class="card-info-block">
                <div class="card-meta-line">
                  <span>02 / PHOTOGRAPHY</span>
                  <span>BOTTEGA VENETA</span>
                </div>
                <h3 class="card-project-title"><a href="#project?id=chroma-vestige">CHROMA VESTIGE</a></h3>
                <p class="card-description-snippet">${PROJECTS[1].summary}</p>
              </div>
            </div>

            <div class="project-card-asym col-span-5 offset-left-1 reveal-init">
              <a href="#project?id=silent-frequencies" class="card-media-box aspect-square clickable" data-cursor="view">
                <img src="${PROJECTS[2].coverImage}" alt="${PROJECTS[2].title}" />
              </a>
              <div class="card-info-block">
                <div class="card-meta-line">
                  <span>03 / BRANDING</span>
                  <span>BANG &amp; OLUFSEN</span>
                </div>
                <h3 class="card-project-title"><a href="#project?id=silent-frequencies">SILENT FREQUENCIES</a></h3>
                <p class="card-description-snippet">${PROJECTS[2].summary}</p>
              </div>
            </div>

            <div class="project-card-asym col-span-7 offset-right-1 reveal-init delay-200" style="margin-top: clamp(0rem, 4vw, 3rem);">
              <a href="#project?id=metric-dissolve" class="card-media-box aspect-landscape clickable" data-cursor="view">
                <img src="${PROJECTS[6].coverImage}" alt="${PROJECTS[6].title}" />
              </a>
              <div class="card-info-block">
                <div class="card-meta-line">
                  <span>04 / DIGITAL</span>
                  <span>POLESTAR</span>
                </div>
                <h3 class="card-project-title"><a href="#project?id=metric-dissolve">METRIC DISSOLVE</a></h3>
                <p class="card-description-snippet">${PROJECTS[6].summary}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Manifesto Teaser & Commission Banner -->
        <section class="site-container section-padding" style="border-top: 1px solid var(--border-hairline); background: var(--bg-secondary);">
          <div style="max-width: 900px; margin: 0 auto; text-align: center;">
            <span class="font-mono text-muted uppercase tracking-widest reveal-init" style="font-size:0.75rem; display:block; margin-bottom:1.5rem;">
              MANIFESTO / STATEMENT 01
            </span>
            <blockquote class="font-serif italic reveal-init delay-100" style="font-size: clamp(1.8rem, 3.5vw, 3.2rem); line-height: 1.25; color: var(--text-primary); margin-bottom: 2.5rem;">
              “A frame is not a decorative container; it is an architectural incision into chaotic space.”
            </blockquote>
            <div class="reveal-init delay-200" style="display:flex; justify-content:center; gap:1.5rem;">
              <a href="#contact" class="submit-btn-cta clickable" style="padding: 1rem 2.5rem;" data-cursor="contact">
                Initiate Project Commission →
              </a>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  /* -------------------------------------------------------------
     VIEW 2: WORK / INDEX
     ------------------------------------------------------------- */
  renderWork() {
    const filter = this.workState.filter;
    const mode = this.workState.mode;
    const search = this.workState.searchQuery.toLowerCase().trim();

    // Filter projects
    let filtered = PROJECTS.filter(p => {
      // Discipline filter
      const matchesDiscipline = filter === 'all' 
        || (filter === 'saved' && this.app.isBookmarked(p.id))
        || p.disciplines.some(d => d.toLowerCase().replace(/\s+/g, '-') === filter)
        || p.discipline.toLowerCase().replace(/\s+/g, '-') === filter;

      // Search filter
      const matchesSearch = !search
        || p.title.toLowerCase().includes(search)
        || p.client.toLowerCase().includes(search)
        || p.discipline.toLowerCase().includes(search)
        || p.location.toLowerCase().includes(search)
        || p.year.toString().includes(search);

      return matchesDiscipline && matchesSearch;
    });

    const savedCount = this.app.getBookmarks().length;

    this.container.innerHTML = `
      <div class="view-work">
        <!-- Sticky Controls Bar -->
        <div class="work-controls-bar">
          <!-- Filter Pills -->
          <div class="filter-pills">
            ${DISCIPLINES.map(d => `
              <button class="filter-btn clickable ${filter === d.id ? 'active' : ''}" data-filter="${d.id}">
                ${d.label}
                <span class="filter-count">(${d.id === 'all' ? PROJECTS.length : d.count})</span>
              </button>
            `).join('')}
            <button class="filter-btn clickable ${filter === 'saved' ? 'active' : ''}" data-filter="saved">
              Saved <span class="filter-count">(${savedCount})</span>
            </button>
          </div>

          <!-- Actions: Search & View Mode Switcher -->
          <div class="view-actions">
            <div class="search-input-wrap">
              <span class="search-icon">⚲</span>
              <input type="text" class="search-input" id="work-search" placeholder="Search archive..." value="${this.workState.searchQuery}" />
            </div>

            <div class="view-mode-toggle">
              <button class="view-mode-btn clickable ${mode === 'grid' ? 'active' : ''}" data-mode="grid" title="Editorial Grid">GRID</button>
              <button class="view-mode-btn clickable ${mode === 'index' ? 'active' : ''}" data-mode="index" title="List Index">INDEX</button>
              <button class="view-mode-btn clickable ${mode === 'reel' ? 'active' : ''}" data-mode="reel" title="Horizontal Reel">REEL</button>
            </div>
          </div>
        </div>

        <!-- Render Content based on View Mode -->
        ${filtered.length === 0 ? `
          <div class="site-container" style="text-align:center; padding: 10rem 0;">
            <p class="font-mono text-muted uppercase">No projects match the current filter criteria.</p>
            <button class="hud-btn clickable" style="margin-top: 1.5rem;" id="reset-filter-btn">Reset All Filters</button>
          </div>
        ` : mode === 'grid' ? `
          <!-- 1. Editorial Asymmetric Grid -->
          <div class="editorial-grid">
            ${filtered.map((p, idx) => {
              // Asymmetrical span rhythm
              const colSpans = ['col-span-7', 'col-span-5', 'col-span-12', 'col-span-6', 'col-span-6', 'col-span-4', 'col-span-8'];
              const aspectRatios = ['aspect-landscape', 'aspect-portrait', 'aspect-wide', 'aspect-square', 'aspect-landscape', 'aspect-portrait'];
              const spanClass = colSpans[idx % colSpans.length];
              const aspectClass = aspectRatios[idx % aspectRatios.length];
              const isSaved = this.app.isBookmarked(p.id);

              return `
                <article class="project-card-asym ${spanClass} reveal-init">
                  <div class="card-top-actions">
                    <button class="bookmark-icon-btn clickable ${isSaved ? 'saved' : ''}" data-bookmark-id="${p.id}" title="${isSaved ? 'Saved to Moodboard' : 'Save to Moodboard'}">
                      ${isSaved ? '★' : '☆'}
                    </button>
                  </div>
                  <a href="#project?id=${p.slug}" class="card-media-box ${aspectClass} clickable" data-cursor="view" data-cursor-label="VIEW">
                    <img src="${p.coverImage}" alt="${p.title}" loading="lazy" />
                  </a>
                  <div class="card-info-block">
                    <div class="card-meta-line">
                      <span>${String(idx + 1).padStart(2, '0')} / ${p.discipline}</span>
                      <span>${p.client} · ${p.year}</span>
                    </div>
                    <h2 class="card-project-title">
                      <a href="#project?id=${p.slug}" class="clickable">${p.title}</a>
                    </h2>
                    <p class="card-description-snippet">${p.summary}</p>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        ` : mode === 'index' ? `
          <!-- 2. List / Index Mode with Floating Thumbnail Preview -->
          <div class="index-list-view">
            <table class="index-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Project Title</th>
                  <th>Client</th>
                  <th>Discipline</th>
                  <th>Location</th>
                  <th>Year</th>
                  <th style="text-align:right;">Save</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map((p, idx) => {
                  const isSaved = this.app.isBookmarked(p.id);
                  return `
                    <tr class="index-row clickable" data-preview-img="${p.coverImage}" data-cursor="view" data-href="#project?id=${p.slug}">
                      <td>0${idx + 1}</td>
                      <td>
                        <a href="#project?id=${p.slug}" class="index-row-title">${p.title}</a>
                      </td>
                      <td>${p.client}</td>
                      <td><span class="meta-pill" style="display:inline-block;">${p.discipline}</span></td>
                      <td>${p.location}</td>
                      <td>${p.year}</td>
                      <td style="text-align:right;" onclick="event.stopPropagation();">
                        <button class="bookmark-icon-btn clickable ${isSaved ? 'saved' : ''}" data-bookmark-id="${p.id}">
                          ${isSaved ? '★' : '☆'}
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <!-- 3. Horizontal Reel Mode -->
          <div class="site-container-full" style="padding-top: 3rem; padding-bottom: 6rem;">
            <div class="reel-container clickable" data-cursor="drag" data-cursor-label="DRAG" style="padding-left:0; padding-right:0;">
              ${filtered.map((p, idx) => `
                <div class="reel-card clickable" style="flex: 0 0 clamp(360px, 45vw, 750px);" data-cursor="view">
                  <a href="#project?id=${p.slug}">
                    <div class="reel-media-wrap" style="aspect-ratio: 16/10;">
                      <img src="${p.coverImage}" alt="${p.title}" loading="lazy" />
                      <div class="reel-meta-overlay">
                        <span class="meta-pill">${p.discipline}</span>
                        <span class="meta-pill">${p.year}</span>
                      </div>
                    </div>
                  </a>
                  <div class="reel-info">
                    <div>
                      <h3 class="reel-title"><a href="#project?id=${p.slug}">${p.title}</a></h3>
                      <p class="reel-client">${p.client} — ${p.location}</p>
                    </div>
                    <span class="reel-year">0${idx + 1}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `}
      </div>
    `;

    // Attach Work page specific listeners
    this.bindWorkControls();
  }

  bindWorkControls() {
    // Filter buttons
    const filterBtns = this.container.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.workState.filter = btn.getAttribute('data-filter');
        sound.playClick();
        this.renderWork();
        this.app.afterRender();
      });
    });

    // View mode buttons
    const modeBtns = this.container.querySelectorAll('.view-mode-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.workState.mode = btn.getAttribute('data-mode');
        sound.playClick();
        this.renderWork();
        this.app.afterRender();
      });
    });

    // Search input
    const searchInput = document.getElementById('work-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.workState.searchQuery = e.target.value;
        this.renderWork();
        this.app.afterRender();
        // keep focus
        const newSearch = document.getElementById('work-search');
        if (newSearch) {
          newSearch.focus();
          newSearch.selectionStart = newSearch.selectionEnd = newSearch.value.length;
        }
      });
    }

    // Reset button if present
    const resetBtn = document.getElementById('reset-filter-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.workState.filter = 'all';
        this.workState.searchQuery = '';
        this.renderWork();
        this.app.afterRender();
      });
    }

    // Table rows navigation
    const rows = this.container.querySelectorAll('.index-row');
    rows.forEach(row => {
      row.addEventListener('click', (e) => {
        if (!e.target.closest('.bookmark-icon-btn')) {
          const href = row.getAttribute('data-href');
          if (href) this.navigate(href);
        }
      });
    });
  }

  /* -------------------------------------------------------------
     VIEW 3: PROJECT DEEP DIVE
     ------------------------------------------------------------- */
  renderProject(projectId) {
    const project = PROJECTS.find(p => p.slug === projectId || p.id === projectId) || PROJECTS[0];
    const currentIndex = PROJECTS.indexOf(project);
    const prevProject = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
    const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];
    const isSaved = this.app.isBookmarked(project.id);

    this.container.innerHTML = `
      <div class="project-deep-dive">
        <!-- Project Hero Header -->
        <header class="project-hero-header">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <a href="#work" class="project-back-link clickable" data-cursor="explore">
              <span>←</span>
              <span>Back to Works Catalog</span>
            </a>
            <button class="hud-btn clickable ${isSaved ? 'active' : ''}" data-bookmark-id="${project.id}">
              <span>${isSaved ? '★ Saved to Moodboard' : '☆ Save Project'}</span>
            </button>
          </div>

          <h1 class="project-main-title reveal-init delay-100">${project.title}</h1>

          <!-- Meta Grid -->
          <div class="project-meta-grid reveal-init delay-200">
            <div>
              <div class="meta-field-label">CLIENT</div>
              <div class="meta-field-val">${project.client}</div>
            </div>
            <div>
              <div class="meta-field-label">DISCIPLINE</div>
              <div class="meta-field-val">${project.discipline}</div>
            </div>
            <div>
              <div class="meta-field-label">YEAR</div>
              <div class="meta-field-val">${project.year}</div>
            </div>
            <div>
              <div class="meta-field-label">LOCATION</div>
              <div class="meta-field-val">${project.location}</div>
            </div>
          </div>
        </header>

        <!-- Hero Panoramic Image -->
        <div class="project-full-cover reveal-init delay-300">
          <img src="${project.heroImage || project.coverImage}" alt="${project.title} Hero View" class="clickable" data-cursor="zoom" data-cursor-label="EXPAND" data-gallery-open="0" />
        </div>

        <!-- Editorial Statement & Narrative -->
        <section class="project-editorial-body">
          <div class="sticky-brief reveal-init">
            <div class="meta-field-label">PROJECT STATEMENT</div>
            <h2 class="editorial-headline">${project.subtitle || project.summary}</h2>
            <div style="margin-top: 1rem;">
              <span class="meta-pill">${project.disciplines.join(' / ')}</span>
            </div>
          </div>

          <div class="editorial-narrative reveal-init delay-200">
            <p>${project.description}</p>
            <p>${project.concept}</p>
          </div>
        </section>

        <!-- Curated High-Res Multi-Image Gallery -->
        <section class="project-gallery-array">
          <div style="padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-hairline); display:flex; justify-content:space-between; align-items:baseline;">
            <span class="font-mono text-muted uppercase" style="font-size:0.75rem;">VISUAL ARCHIVE &amp; SPECIMENS (${project.gallery.length})</span>
            <span class="font-mono text-muted" style="font-size:0.72rem;">Click any plate for fullscreen metadata inspection</span>
          </div>

          ${project.gallery.map((item, idx) => `
            <div class="gallery-row ${idx % 3 === 0 ? 'layout-single' : 'layout-dual'} reveal-init">
              <div class="gallery-item clickable" data-cursor="zoom" data-cursor-label="EXPAND" data-gallery-open="${idx}">
                <img src="${item.url}" alt="${item.caption}" loading="lazy" />
                <div class="gallery-caption-bar">
                  <span>${item.caption}</span>
                  <span>${item.camera || 'Medium Format Plate'}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </section>

        <!-- Technical Credits & Recognition Block -->
        <section class="site-container section-padding" style="border-top: 1px solid var(--border-hairline);">
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 4rem;">
            <div>
              <div class="meta-field-label" style="margin-bottom: 1.5rem;">COLLABORATORS &amp; CREDITS</div>
              <ul style="display:flex; flex-direction:column; gap:1rem; font-family:var(--font-mono); font-size:0.85rem;">
                ${project.credits.map(c => `
                  <li style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-hairline); padding-bottom:0.6rem;">
                    <span class="text-muted">${c.role}</span>
                    <span style="color:var(--text-primary); font-weight:500;">${c.name}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div>
              <div class="meta-field-label" style="margin-bottom: 1.5rem;">HONORS &amp; RECOGNITION</div>
              <ul style="display:flex; flex-direction:column; gap:1rem; font-family:var(--font-mono); font-size:0.85rem;">
                ${project.awards.map(a => `
                  <li style="display:flex; align-items:center; gap:0.75rem; border-bottom:1px solid var(--border-hairline); padding-bottom:0.6rem;">
                    <span style="color:var(--accent-gold);">★</span>
                    <span>${a}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </section>

        <!-- Previous / Next Project Sticky Navigation -->
        <nav class="project-nav-footer">
          <a href="#project?id=${prevProject.slug}" class="nav-proj-item prev clickable" data-cursor="prev">
            <span class="nav-proj-direction">← Previous Project</span>
            <span class="nav-proj-title">${prevProject.title}</span>
            <span class="font-mono text-muted" style="font-size:0.75rem;">${prevProject.discipline} · ${prevProject.year}</span>
          </a>

          <a href="#project?id=${nextProject.slug}" class="nav-proj-item next clickable" data-cursor="next">
            <span class="nav-proj-direction">Next Project →</span>
            <span class="nav-proj-title">${nextProject.title}</span>
            <span class="font-mono text-muted" style="font-size:0.75rem;">${nextProject.discipline} · ${nextProject.year}</span>
          </a>
        </nav>
      </div>
    `;

    // Bind Gallery click triggers for this project
    const galleryItems = this.container.querySelectorAll('[data-gallery-open]');
    galleryItems.forEach(el => {
      el.addEventListener('click', () => {
        const index = parseInt(el.getAttribute('data-gallery-open'), 10) || 0;
        this.app.gallery.open(project.gallery, index);
      });
    });
  }

  /* -------------------------------------------------------------
     VIEW 4: ABOUT
     ------------------------------------------------------------- */
  renderAbout() {
    this.container.innerHTML = `
      <div class="about-view">
        <section class="site-container section-padding">
          <div class="about-intro-grid">
            <div class="about-portrait-frame reveal-init">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop" alt="Creative Director Kaelen Vane" />
              <div class="gallery-caption-bar" style="padding: 1rem 0;">
                <span>Kaelen Vane — Founder &amp; Creative Director</span>
                <span>Tokyo / Zurich / Paris</span>
              </div>
            </div>

            <div style="display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span class="font-mono text-muted uppercase tracking-widest reveal-init" style="font-size:0.75rem; display:block; margin-bottom:1rem;">
                  PRACTICE OVERVIEW
                </span>
                <h1 class="hero-headline reveal-init delay-100" style="font-size: clamp(2.4rem, 5vw, 5rem); margin-bottom: 2rem;">
                  MATERIALITY <span class="italic-serif">&amp;</span> REDUCTION
                </h1>
                <div class="editorial-narrative reveal-init delay-200" style="font-size:1.15rem;">
                  <p>
                    Frame &amp; Form is an award-winning multidisciplinary studio founded by creative director and photographer Kaelen Vane. We collaborate globally with architectural institutes, luxury fashion houses, cultural foundations, and technology pioneers.
                  </p>
                  <p>
                    Our methodology rejects ornamental surplus in favor of raw structural clarity, spatial typography, and large-format photographic documentation. We design visual ecosystems that balance mathematical discipline with visceral emotional resonance.
                  </p>
                </div>
              </div>

              <!-- Stats Grid -->
              <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:1.5rem; border-top:1px solid var(--border-hairline); padding-top:2rem; margin-top:3rem;" class="reveal-init delay-300">
                <div>
                  <div class="font-display" style="font-size:2rem; font-weight:700; color:var(--text-primary);">2018</div>
                  <div class="font-mono text-muted" style="font-size:0.7rem;">ESTABLISHED</div>
                </div>
                <div>
                  <div class="font-display" style="font-size:2rem; font-weight:700; color:var(--accent-gold);">42</div>
                  <div class="font-mono text-muted" style="font-size:0.7rem;">GLOBAL AWARDS</div>
                </div>
                <div>
                  <div class="font-display" style="font-size:2rem; font-weight:700; color:var(--text-primary);">07</div>
                  <div class="font-mono text-muted" style="font-size:0.7rem;">MONOGRAPHS</div>
                </div>
                <div>
                  <div class="font-display" style="font-size:2rem; font-weight:700; color:var(--text-primary);">19</div>
                  <div class="font-mono text-muted" style="font-size:0.7rem;">EXHIBITIONS</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Studio Manifesto (4 Pillars) -->
          <div style="margin-top: 6rem;">
            <div class="section-label reveal-init">CORE PILLARS</div>
            <h2 class="section-heading reveal-init delay-100">Studio Manifesto</h2>

            <div class="manifesto-columns">
              ${MANIFESTO_PARAGRAPHS.map(p => `
                <div class="manifesto-item reveal-init">
                  <span class="manifesto-num">${p.num}</span>
                  <h3 class="manifesto-heading">${p.heading}</h3>
                  <p class="manifesto-text">${p.body}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Selected Client Roster -->
          <div style="margin-top: 8rem;">
            <div style="display:flex; justify-content:space-between; align-items:flex-end;">
              <div>
                <div class="section-label reveal-init">COMMISSION ROSTER</div>
                <h2 class="section-heading reveal-init delay-100">Selected Clients</h2>
              </div>
              <span class="font-mono text-muted" style="font-size:0.75rem;">2018 — 2026</span>
            </div>

            <div class="roster-grid reveal-init delay-200">
              ${CLIENTS.map(c => `
                <div class="roster-cell">
                  <div class="roster-name">${c.name}</div>
                  <div>
                    <div class="roster-category">${c.category}</div>
                    <div class="font-mono text-muted" style="font-size:0.65rem; margin-top:0.2rem;">${c.location}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Honors & Exhibitions Timeline -->
          <div style="margin-top: 8rem;">
            <div class="section-label reveal-init">RETROSPECTIVE</div>
            <h2 class="section-heading reveal-init delay-100">Exhibitions &amp; Honors</h2>

            <div style="margin-top:3rem; border-top:1px solid var(--border-hairline);">
              ${EXHIBITIONS.map(e => `
                <div style="display:grid; grid-template-columns: 100px 1fr 1fr; padding:1.5rem 0; border-bottom:1px solid var(--border-hairline); font-family:var(--font-mono); font-size:0.85rem;" class="reveal-init">
                  <span style="color:var(--accent-gold);">${e.year}</span>
                  <span style="color:var(--text-primary); font-weight:500;">${e.title}</span>
                  <span class="text-muted" style="text-align:right;">${e.venue} — ${e.location}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Curatorial Reception & Critical Dialogue -->
          <div style="margin-top: 8rem;">
            <div class="section-label reveal-init">CRITICAL DISCOURSE</div>
            <h2 class="section-heading reveal-init delay-100">Curatorial Reception</h2>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; margin-top: 3.5rem;">
              ${CRITICAL_RECEPTION.map(c => `
                <div style="border: 1px solid var(--border-hairline); padding: 2.5rem; background: var(--bg-secondary); display:flex; flex-direction:column; justify-content:space-between; min-height: 240px;" class="reveal-init">
                  <blockquote class="font-serif italic" style="font-size: 1.25rem; line-height: 1.45; color: var(--text-primary); margin-bottom: 2rem;">
                    “${c.quote}”
                  </blockquote>
                  <div>
                    <div class="font-display" style="font-size: 1rem; font-weight: 600; color: var(--text-primary);">${c.author}</div>
                    <div class="font-mono text-muted" style="font-size: 0.72rem; margin-top: 0.25rem;">${c.title}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      </div>
    `;
  }

  /* -------------------------------------------------------------
     VIEW 5: ARCHIVE
     ------------------------------------------------------------- */
  renderArchive() {
    this.container.innerHTML = `
      <div class="archive-view">
        <header class="archive-header">
          <div>
            <div class="section-label reveal-init">CHRONOLOGICAL INDEX</div>
            <h1 class="section-heading reveal-init delay-100">Complete Archive</h1>
          </div>
          <div class="font-mono text-muted reveal-init" style="font-size:0.75rem;">
            <span>TOTAL RECORDS: ${ARCHIVE.length}</span>
          </div>
        </header>

        <div style="overflow-x: auto;">
          <table class="archive-table">
            <thead>
              <tr>
                <th>Index ID</th>
                <th>Year</th>
                <th>Project Title</th>
                <th>Client</th>
                <th>Discipline</th>
                <th>Location</th>
                <th>Medium / Format</th>
                <th style="text-align:right;">Access</th>
              </tr>
            </thead>
            <tbody>
              ${ARCHIVE.map(item => `
                <tr class="archive-row clickable" data-preview-img="${PROJECTS.find(p => p.slug === item.slug)?.coverImage || PROJECTS[0].coverImage}" data-cursor="view" data-href="#project?id=${item.slug}">
                  <td class="archive-id">${item.id}</td>
                  <td>${item.year}</td>
                  <td class="archive-title">${item.title}</td>
                  <td>${item.client}</td>
                  <td><span class="meta-pill">${item.discipline}</span></td>
                  <td>${item.location}</td>
                  <td class="text-muted">${item.medium}</td>
                  <td style="text-align:right;">
                    <a href="#project?id=${item.slug}" class="hud-btn clickable" style="padding:0.25rem 0.6rem; font-size:0.65rem;">View →</a>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Bind archive row clicks
    const rows = this.container.querySelectorAll('.archive-row');
    rows.forEach(row => {
      row.addEventListener('click', () => {
        const href = row.getAttribute('data-href');
        if (href) this.navigate(href);
      });
    });
  }

  /* -------------------------------------------------------------
     VIEW 6: CONTACT & INQUIRY BUILDER
     ------------------------------------------------------------- */
  renderContact() {
    const savedInquiries = this.app.getInquiries();

    this.container.innerHTML = `
      <div class="contact-view">
        <header style="border-bottom: 1px solid var(--border-hairline); padding-bottom: 2rem;">
          <div class="section-label reveal-init">INITIATE COLLABORATION</div>
          <h1 class="section-heading reveal-init delay-100">Project Commission Builder</h1>
        </header>

        <div class="contact-grid">
          <!-- Left: Studio Details & Clocks -->
          <div class="contact-info-col">
            <div class="reveal-init">
              <span class="font-mono text-muted uppercase tracking-widest" style="font-size:0.75rem; display:block; margin-bottom:1rem;">
                STUDIO LOCATIONS &amp; BUREAUS
              </span>
              <div style="display:flex; flex-direction:column; gap:1rem;">
                ${STUDIO_INFO.locations.map(loc => `
                  <div class="contact-location-card">
                    <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:0.4rem;">
                      <span class="font-display" style="font-size:1.15rem; font-weight:600;">${loc.city}, ${loc.country}</span>
                      <span class="font-mono" style="color:var(--accent-gold); font-size:0.75rem;">${loc.code}</span>
                    </div>
                    <p class="font-mono text-muted" style="font-size:0.75rem;">${loc.address}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="reveal-init delay-100" style="border-top:1px solid var(--border-hairline); padding-top:2rem;">
              <span class="font-mono text-muted uppercase tracking-widest" style="font-size:0.75rem; display:block; margin-bottom:1rem;">
                DIRECT CHANNELS
              </span>
              <ul style="display:flex; flex-direction:column; gap:0.75rem; font-family:var(--font-mono); font-size:0.85rem;">
                <li style="display:flex; justify-content:space-between;">
                  <span class="text-muted">General Commissions:</span>
                  <a href="mailto:commissions@frameandform.studio" class="hover-underline">commissions@frameandform.studio</a>
                </li>
                <li style="display:flex; justify-content:space-between;">
                  <span class="text-muted">Press &amp; Publications:</span>
                  <a href="mailto:press@frameandform.studio" class="hover-underline">press@frameandform.studio</a>
                </li>
                <li style="display:flex; justify-content:space-between;">
                  <span class="text-muted">Gallery Representations:</span>
                  <span>Zurich / Tokyo / Paris</span>
                </li>
              </ul>
            </div>

            ${savedInquiries.length > 0 ? `
              <!-- Recent Logged Submissions -->
              <div class="reveal-init delay-200" style="border-top:1px solid var(--border-hairline); padding-top:2rem;">
                <span class="font-mono text-muted uppercase tracking-widest" style="font-size:0.75rem; display:block; margin-bottom:1rem;">
                  YOUR RECORDED SUBMISSIONS (${savedInquiries.length})
                </span>
                <div style="display:flex; flex-direction:column; gap:0.75rem;">
                  ${savedInquiries.map(inq => `
                    <div style="background:var(--bg-secondary); border:1px solid var(--border-hairline); padding:1rem; font-family:var(--font-mono); font-size:0.75rem;">
                      <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                        <span style="color:var(--accent-gold); font-weight:600;">${inq.id}</span>
                        <span class="meta-pill" style="font-size:0.6rem;">${inq.status || 'CONFIRMED'}</span>
                      </div>
                      <div style="color:var(--text-primary); font-weight:500;">${inq.org || inq.name} — ${inq.type}</div>
                      <div class="text-muted" style="font-size:0.68rem; margin-top:0.2rem;">Submitted: ${inq.timestamp}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Right: Dynamic Commission Inquiry Builder -->
          <div class="reveal-init delay-100">
            <form id="inquiry-form" class="inquiry-builder-form">
              <div>
                <h2 class="font-display" style="font-size:1.6rem; font-weight:700; margin-bottom:0.5rem;">Interactive Brief Builder</h2>
                <p class="font-body text-secondary" style="font-size:0.9rem;">Configure project specifications to generate an official commission reference dossier.</p>
              </div>

              <!-- 1. Commission Scope -->
              <div class="form-group">
                <label class="form-label">01 / Commission Scope (Select All That Apply)</label>
                <div class="chip-selector-group" id="scope-chips">
                  <button type="button" class="chip-choice selected" data-val="Art Direction">Art Direction</button>
                  <button type="button" class="chip-choice" data-val="Spatial Photography">Spatial Photography</button>
                  <button type="button" class="chip-choice" data-val="Brand Architecture">Brand Architecture</button>
                  <button type="button" class="chip-choice" data-val="Editorial Monograph">Editorial Monograph</button>
                  <button type="button" class="chip-choice" data-val="35mm Film">35mm Film</button>
                  <button type="button" class="chip-choice" data-val="Digital System">Digital System</button>
                </div>
              </div>

              <!-- 2. Estimated Timeline -->
              <div class="form-group">
                <label class="form-label">02 / Target Timeline</label>
                <div class="chip-selector-group" id="timeline-chips">
                  <button type="button" class="chip-choice" data-val="Immediate (< 1 Month)">Immediate (&lt; 1 Mo)</button>
                  <button type="button" class="chip-choice selected" data-val="Q3 / Q4 2026">Q3 / Q4 2026</button>
                  <button type="button" class="chip-choice" data-val="2027 Strategic">2027 Strategic</button>
                  <button type="button" class="chip-choice" data-val="Flexible / Exploratory">Flexible</button>
                </div>
              </div>

              <!-- 3. Budget Bracket Slider -->
              <div class="form-group">
                <div style="display:flex; justify-content:space-between; align-items:baseline;">
                  <label class="form-label">03 / Estimated Project Allocation (USD)</label>
                  <span class="budget-val-display" id="budget-display">$75,000</span>
                </div>
                <input type="range" min="25000" max="300000" step="5000" value="75000" class="budget-slider clickable" id="budget-slider" />
                <div style="display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:0.65rem; color:var(--text-muted);">
                  <span>$25K (Small Feature)</span>
                  <span>$150K (Comprehensive)</span>
                  <span>$300K+ (Global Monolith)</span>
                </div>
              </div>

              <!-- 4. Client Information -->
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label class="form-label">Client Name *</label>
                  <input type="text" class="form-input-box" id="client-name" required placeholder="Elena Rostova" />
                </div>
                <div class="form-group">
                  <label class="form-label">Organization / Brand *</label>
                  <input type="text" class="form-input-box" id="client-org" required placeholder="Vitra / Bottega Veneta / Self" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input type="email" class="form-input-box" id="client-email" required placeholder="elena@institution.ch" />
              </div>

              <div class="form-group">
                <label class="form-label">Project Synopsis &amp; Objectives</label>
                <textarea class="form-input-box" id="client-synopsis" rows="4" placeholder="Describe the physical/digital dimensions, core objectives, materials, and creative vision..."></textarea>
              </div>

              <button type="submit" class="submit-btn-cta clickable" data-cursor="send">
                <span>Transmit Commission Brief</span>
                <span>→</span>
              </button>

              <!-- Submission Receipt Modal -->
              <div class="submission-receipt" id="submission-receipt-box">
                <div style="display:flex; justify-content:space-between; margin-bottom:1rem; border-bottom:1px solid var(--border-hairline); padding-bottom:0.5rem;">
                  <span style="color:var(--accent-gold); font-weight:700;">COMMISSION REFERENCE GENERATED</span>
                  <span id="receipt-id">FF-2026-XXXX</span>
                </div>
                <p style="margin-bottom:0.5rem; color:var(--text-primary);">
                  Your project inquiry has been securely compiled into the studio intake registry.
                </p>
                <div id="receipt-summary" style="color:var(--text-muted); font-size:0.75rem; line-height:1.5;"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    // Bind Contact Form Handlers
    this.bindContactForm();
  }

  bindContactForm() {
    const scopeChips = this.container.querySelectorAll('#scope-chips .chip-choice');
    scopeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('selected');
        sound.playClick();
      });
    });

    const timelineChips = this.container.querySelectorAll('#timeline-chips .chip-choice');
    timelineChips.forEach(chip => {
      chip.addEventListener('click', () => {
        timelineChips.forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        sound.playClick();
      });
    });

    const budgetSlider = document.getElementById('budget-slider');
    const budgetDisplay = document.getElementById('budget-display');
    if (budgetSlider && budgetDisplay) {
      budgetSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        budgetDisplay.textContent = `$${val.toLocaleString()}${val >= 300000 ? '+' : ''}`;
      });
    }

    const form = document.getElementById('inquiry-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.app.submitInquiry();
      });
    }
  }
}
