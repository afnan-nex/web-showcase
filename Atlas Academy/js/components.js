/**
 * Atlas Academy - Shared UI Components & Global Helpers (Production Polish)
 * Handles Navigation, Mobile Drawer, Quick Search Palette, Modals, Toasts, Theme, and Icons
 */

// Feather/Lucide SVG icon helper
const ATLAS_ICONS = {
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  bookmark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`,
  bookmarkFilled: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`,
  play: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
  pause: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
  check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  star: `<svg width="14" height="14" viewBox="0 0 24 24" fill="#e2b357" stroke="#e2b357" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  book: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  user: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  award: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`,
  download: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  share: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
  arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
  close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  volume: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
  volumeMute: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`,
  maximize: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`,
  fileText: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  menu: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`
};

/* --- Toast Notification System --- */
class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (typeof document === "undefined") return;
    let existing = document.getElementById("atlas-toast-container");
    if (!existing) {
      existing = document.createElement("div");
      existing.id = "atlas-toast-container";
      existing.className = "toast-container";
      document.body.appendChild(existing);
    }
    this.container = existing;
  }

  show({ title, message, type = "info", duration = 4000 }) {
    if (!this.container) this.init();

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconSvg = ATLAS_ICONS.check;
    if (type === "error") iconSvg = ATLAS_ICONS.close;
    if (type === "gold" || type === "cert") iconSvg = ATLAS_ICONS.award;

    toast.innerHTML = `
      <div class="toast-icon" style="color: ${type === 'gold' ? '#e2b357' : type === 'error' ? '#ef4444' : '#3b82f6'};">
        ${iconSvg}
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-msg">${message}</div>` : ""}
      </div>
      <button class="btn-ghost" style="padding: 2px; color: var(--text-muted);" onclick="this.parentElement.remove()" aria-label="Close notification">
        ${ATLAS_ICONS.close}
      </button>
    `;

    this.container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 260);
    }, duration);
  }
}

window.AtlasToast = new ToastManager();

/* --- Mobile Drawer Navigation --- */
function initMobileDrawer() {
  let drawer = document.getElementById("mobile-nav-drawer-overlay");
  if (!drawer) {
    const drawerHtml = `
      <div id="mobile-nav-drawer-overlay" class="mobile-drawer-overlay">
        <div class="mobile-drawer">
          <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
            <a href="index.html" class="brand-logo" onclick="closeMobileDrawer()">
              <div class="brand-mark">A</div>
              <span style="font-size: 1.1rem;">ATLAS ACADEMY</span>
            </a>
            <button class="modal-close-btn" onclick="closeMobileDrawer()" aria-label="Close menu">
              ${ATLAS_ICONS.close}
            </button>
          </div>

          <ul class="mobile-drawer-links">
            <li><a href="index.html" class="mobile-drawer-link" onclick="closeMobileDrawer()">Home</a></li>
            <li><a href="courses.html" class="mobile-drawer-link" onclick="closeMobileDrawer()">Courses Catalog</a></li>
            <li><a href="instructors.html" class="mobile-drawer-link" onclick="closeMobileDrawer()">Faculty Directory</a></li>
            <li><a href="pricing.html" class="mobile-drawer-link" onclick="closeMobileDrawer()">Pricing & Membership</a></li>
            <li><a href="student-dashboard.html" class="mobile-drawer-link" onclick="closeMobileDrawer()">Student Dashboard</a></li>
            <li><a href="profile.html" class="mobile-drawer-link" onclick="closeMobileDrawer()">Profile & Settings</a></li>
          </ul>

          <div style="margin-top: auto; padding-top: 24px; border-top: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 12px;">
            <button class="btn btn-outline btn-sm w-full" onclick="closeMobileDrawer(); openQuickSearch();">
              ${ATLAS_ICONS.search} Search Catalog (Ctrl K)
            </button>
            <a href="pricing.html" class="btn btn-primary btn-sm w-full" onclick="closeMobileDrawer()">
              Join All-Access Pro
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", drawerHtml);
    drawer = document.getElementById("mobile-nav-drawer-overlay");
  }

  window.openMobileDrawer = () => {
    if (drawer) drawer.classList.add("open");
  };

  window.closeMobileDrawer = () => {
    if (drawer) drawer.classList.remove("open");
  };

  drawer.addEventListener("click", (e) => {
    if (e.target === drawer) closeMobileDrawer();
  });

  // Attach to existing header mobile toggles if present
  document.querySelectorAll(".mobile-menu-toggle").forEach(btn => {
    btn.onclick = openMobileDrawer;
  });
}

/* --- Global Command Palette / Search --- */
function initQuickSearch() {
  let modal = document.getElementById("quick-search-modal");
  if (!modal) {
    const modalHtml = `
      <div id="quick-search-modal" class="modal-overlay">
        <div class="modal-card" style="max-width: 680px; padding: 0;">
          <div style="padding: 16px 20px; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; gap: 12px;">
            <span style="color: var(--text-muted);">${ATLAS_ICONS.search}</span>
            <input type="text" id="quick-search-input" placeholder="Search courses, instructors, syllabus, concepts..." style="width: 100%; font-size: 1.05rem; color: var(--text-primary);" autofocus />
            <kbd style="font-family: var(--font-mono); font-size: 0.75rem; background: var(--bg-surface-elevated); padding: 4px 8px; border-radius: 4px; color: var(--text-muted); border: 1px solid var(--border-subtle);">ESC</kbd>
          </div>
          <div id="quick-search-results" style="max-height: 420px; overflow-y: auto; padding: 12px;">
            <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
              Type at least 2 characters to search across our full curriculum catalog.
            </div>
          </div>
          <div style="padding: 12px 20px; background: var(--bg-surface-subtle); border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">
            <span>Navigation: <strong style="color: var(--text-secondary);">↑ ↓</strong> to select</span>
            <span>Open: <strong style="color: var(--text-secondary);">ENTER</strong></span>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);
    modal = document.getElementById("quick-search-modal");
  }

  const input = document.getElementById("quick-search-input");
  const results = document.getElementById("quick-search-results");

  window.openQuickSearch = () => {
    modal.classList.add("open");
    input.value = "";
    input.focus();
    renderSearchResults("");
  };

  window.closeQuickSearch = () => {
    modal.classList.remove("open");
  };

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeQuickSearch();
  });

  input.addEventListener("input", (e) => {
    renderSearchResults(e.target.value.trim());
  });

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (modal.classList.contains("open")) {
        closeQuickSearch();
      } else {
        openQuickSearch();
      }
    }
    if (e.key === "Escape") {
      if (modal.classList.contains("open")) closeQuickSearch();
      if (window.closeMobileDrawer) window.closeMobileDrawer();
    }
  });

  function renderSearchResults(query) {
    if (!query) {
      results.innerHTML = `
        <div style="padding: 8px 12px; font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase;">
          Academic Disciplines
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; padding: 4px 12px 16px;">
          ${ATLAS_DATA.categories.map(c => `
            <a href="courses.html?cat=${c.id}" class="badge badge-outline" style="cursor: pointer; padding: 6px 12px;" onclick="closeQuickSearch()">
              ${c.name}
            </a>
          `).join("")}
        </div>
        <div style="padding: 8px 12px; font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase;">
          Featured Programs
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          ${ATLAS_DATA.courses.slice(0, 3).map(c => `
            <a href="course-detail.html?id=${c.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: var(--radius-md); transition: background 0.15s;" onmouseover="this.style.background='var(--bg-surface-elevated)'" onmouseout="this.style.background='transparent'">
              <div style="display: flex; align-items: center; gap: 12px;">
                <img src="${c.thumbnail}" alt="${c.title}" style="width: 48px; height: 32px; object-fit: cover; border-radius: 4px;" />
                <div>
                  <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary);">${c.title}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">${c.categoryName} • ${c.duration}</div>
                </div>
              </div>
              <span class="badge badge-accent">${c.level}</span>
            </a>
          `).join("")}
        </div>
      `;
      return;
    }

    const q = query.toLowerCase();
    const matchedCourses = ATLAS_DATA.courses.filter(c => 
      c.title.toLowerCase().includes(q) ||
      c.tagline.toLowerCase().includes(q) ||
      c.categoryName.toLowerCase().includes(q) ||
      c.curriculum.some(m => m.moduleTitle.toLowerCase().includes(q) || m.lessons.some(l => l.title.toLowerCase().includes(q)))
    );

    const matchedInstructors = ATLAS_DATA.instructors.filter(i => 
      i.name.toLowerCase().includes(q) ||
      i.role.toLowerCase().includes(q) ||
      i.bio.toLowerCase().includes(q)
    );

    if (matchedCourses.length === 0 && matchedInstructors.length === 0) {
      results.innerHTML = `
        <div style="padding: 32px 20px; text-align: center;">
          <div style="color: var(--text-muted); margin-bottom: 8px;">No matching results for "${query}"</div>
          <div style="font-size: 0.8rem; color: var(--text-secondary);">Try searching for "TypeScript", "Design Systems", "Python", or "Venture"</div>
        </div>
      `;
      return;
    }

    let out = "";
    if (matchedCourses.length > 0) {
      out += `
        <div style="padding: 8px 12px; font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase;">
          Matching Masterclasses (${matchedCourses.length})
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px;">
          ${matchedCourses.map(c => `
            <a href="course-detail.html?id=${c.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: var(--radius-md); transition: background 0.15s;" onmouseover="this.style.background='var(--bg-surface-elevated)'" onmouseout="this.style.background='transparent'">
              <div style="display: flex; align-items: center; gap: 12px;">
                <img src="${c.thumbnail}" alt="${c.title}" style="width: 48px; height: 32px; object-fit: cover; border-radius: 4px;" />
                <div>
                  <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary);">${c.title}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">${c.categoryName} • ${c.duration} • ★ ${c.rating}</div>
                </div>
              </div>
              <span class="badge badge-outline">$${c.price}</span>
            </a>
          `).join("")}
        </div>
      `;
    }

    if (matchedInstructors.length > 0) {
      out += `
        <div style="padding: 8px 12px; font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); text-transform: uppercase;">
          Faculty (${matchedInstructors.length})
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          ${matchedInstructors.map(i => `
            <a href="instructors.html" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: var(--radius-md); transition: background 0.15s;" onmouseover="this.style.background='var(--bg-surface-elevated)'" onmouseout="this.style.background='transparent'">
              <div style="display: flex; align-items: center; gap: 12px;">
                <img src="${i.avatar}" alt="${i.name}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;" />
                <div>
                  <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary);">${i.name}</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">${i.title}</div>
                </div>
              </div>
              <span class="badge badge-outline">${i.rating} ★</span>
            </a>
          `).join("")}
        </div>
      `;
    }

    results.innerHTML = out;
  }
}

/* --- Institutional Global Modals (Employer Reimbursement, Enterprise, Academic Council) --- */
function initInstitutionalModals() {
  const modalHtml = `
    <!-- Employer Reimbursement Receipt Modal -->
    <div id="reimbursement-modal" class="modal-overlay">
      <div class="modal-card" style="max-width: 600px;">
        <div class="modal-header">
          <div>
            <div class="eyebrow" style="margin-bottom: 2px;">Corporate Tuition Reimbursement</div>
            <h3 style="font-size: 1.2rem;">Official Itemized Tax Receipt</h3>
          </div>
          <button class="modal-close-btn" onclick="closeReimbursementModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="padding: 16px; background: var(--bg-surface-elevated); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px; font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.6;">
            <div><strong>ISSUER:</strong> Atlas Academy Institute Inc.</div>
            <div><strong>VAT / TAX ID:</strong> US-84-9120482</div>
            <div><strong>STUDENT FELLOW:</strong> <span id="reimburse-fellow-name">Julian Hayes</span></div>
            <div><strong>DATE:</strong> August 22, 2026</div>
            <div><strong>TUITION PLAN:</strong> All-Access Annual Technical Fellowship</div>
            <div><strong>AMOUNT PAID:</strong> $468.00 USD (Includes VAT)</div>
            <div><strong>STATUS:</strong> PAID IN FULL • COMPLIANT WITH IRS SEC. 127 EDUCATIONAL ASSISTANCE</div>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 16px;">
            This formal documentation includes Atlas Academy’s accredited corporate employer tax identification number and curriculum accreditation breakdown for submission to your organization’s L&D / HR department.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline btn-sm" onclick="closeReimbursementModal()">Close</button>
          <button class="btn btn-primary btn-sm" onclick="window.print();">Print Official Receipt</button>
        </div>
      </div>
    </div>

    <!-- Academic Council & Accreditation Modal -->
    <div id="academic-council-modal" class="modal-overlay">
      <div class="modal-card" style="max-width: 620px;">
        <div class="modal-header">
          <div>
            <div class="eyebrow" style="margin-bottom: 2px;">Governance & Standards</div>
            <h3 style="font-size: 1.2rem;">Academic Advisory Council</h3>
          </div>
          <button class="modal-close-btn" onclick="closeAcademicCouncilModal()">✕</button>
        </div>
        <div class="modal-body">
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.65; margin-bottom: 16px;">
            The Atlas Academy Curriculum Standards Board reviews every syllabus on a bi-annual cycle to ensure technical accuracy, architectural relevance, and alignment with modern industry engineering practices.
          </p>
          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            <div style="padding: 12px 16px; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <strong style="color: var(--text-primary); font-size: 0.9rem;">Distributed Computing & Systems</strong>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Chaired by Dr. Alistair Vance (ETH Zürich / Cloudflare)</div>
            </div>
            <div style="padding: 12px 16px; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <strong style="color: var(--text-primary); font-size: 0.9rem;">Interaction Architecture & Design Systems</strong>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Chaired by Elena Rostova (Stripe / Linear Alumni)</div>
            </div>
            <div style="padding: 12px 16px; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <strong style="color: var(--text-primary); font-size: 0.9rem;">Applied Machine Learning Systems</strong>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Chaired by Dr. Priya Nair (Stanford AI Lab Fellow)</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary btn-sm" onclick="closeAcademicCouncilModal()">Acknowledge</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  window.openReimbursementModal = () => {
    const user = window.atlasState ? window.atlasState.getUser() : { name: "Julian Hayes" };
    const nameEl = document.getElementById("reimburse-fellow-name");
    if (nameEl) nameEl.textContent = user.name;
    const modal = document.getElementById("reimbursement-modal");
    if (modal) modal.classList.add("open");
  };

  window.closeReimbursementModal = () => {
    const modal = document.getElementById("reimbursement-modal");
    if (modal) modal.classList.remove("open");
  };

  window.openAcademicCouncilModal = () => {
    const modal = document.getElementById("academic-council-modal");
    if (modal) modal.classList.add("open");
  };

  window.closeAcademicCouncilModal = () => {
    const modal = document.getElementById("academic-council-modal");
    if (modal) modal.classList.remove("open");
  };
}

/* --- Course Card Renderer --- */
function renderCourseCard(course) {
  const isBookmarked = window.atlasState ? window.atlasState.isCourseBookmarked(course.id) : false;
  const isEnrolled = window.atlasState ? window.atlasState.isEnrolled(course.id) : false;
  const progress = window.atlasState ? window.atlasState.getCourseProgress(course.id) : { percentage: 0 };
  const instructor = ATLAS_DATA.instructors.find(i => i.id === course.instructorId);

  return `
    <div class="card" data-course-id="${course.id}">
      <div class="card-image-wrap">
        <img src="${course.thumbnail}" alt="${course.title}" loading="lazy" />
        <div class="card-badge-overlay">
          ${course.badge ? `<span class="badge badge-accent">${course.badge}</span>` : `<span class="badge badge-outline">${course.categoryName}</span>`}
        </div>
        <button class="card-bookmark-btn ${isBookmarked ? 'active' : ''}" title="Bookmark Course" onclick="handleCardBookmarkClick(event, '${course.id}')" aria-label="Bookmark course">
          ${isBookmarked ? ATLAS_ICONS.bookmarkFilled : ATLAS_ICONS.bookmark}
        </button>
      </div>

      <div class="card-body">
        <div class="card-meta">
          <span>${course.level}</span>
          <span style="display: flex; align-items: center; gap: 4px;">
            ${ATLAS_ICONS.clock} ${course.duration}
          </span>
          <span style="display: flex; align-items: center; gap: 4px; color: var(--accent-gold);">
            ${ATLAS_ICONS.star} ${course.rating}
          </span>
        </div>

        <h3 class="card-title">
          <a href="course-detail.html?id=${course.id}">${course.title}</a>
        </h3>

        <p class="card-desc">${course.tagline}</p>

        ${isEnrolled ? `
          <div style="margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-family: var(--font-mono); margin-bottom: 6px;">
              <span style="color: var(--text-muted);">Progress</span>
              <span style="color: ${progress.percentage === 100 ? 'var(--accent-success)' : 'var(--accent-primary)'}; font-weight: 600;">${progress.percentage}%</span>
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill ${progress.percentage === 100 ? 'success' : ''}" style="width: ${progress.percentage}%;"></div>
            </div>
          </div>
        ` : ''}

        <div class="card-footer">
          <div class="card-instructor">
            <img src="${instructor?.avatar || ''}" alt="${instructor?.name || ''}" />
            <div class="card-instructor-info">
              <span class="card-instructor-name">${instructor?.name || 'Lead Faculty'}</span>
              <span class="card-instructor-role">${course.categoryName}</span>
            </div>
          </div>

          <div class="card-price">
            ${isEnrolled ? `
              <a href="lesson.html?course=${course.id}" class="btn btn-sm btn-accent">
                Resume
              </a>
            ` : `
              <span>$${course.price}</span>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}

function handleCardBookmarkClick(event, courseId) {
  event.preventDefault();
  event.stopPropagation();
  if (window.atlasState) {
    const isBookmarked = window.atlasState.toggleCourseBookmark(courseId);
    const btn = event.currentTarget;
    if (isBookmarked) {
      btn.classList.add("active");
      btn.innerHTML = ATLAS_ICONS.bookmarkFilled;
      window.AtlasToast.show({ title: "Bookmark Saved", message: "Course pinned to your student workspace." });
    } else {
      btn.classList.remove("active");
      btn.innerHTML = ATLAS_ICONS.bookmark;
      window.AtlasToast.show({ title: "Bookmark Removed", message: "Course removed from bookmarks." });
    }
  }
}

/* --- Global Navbar Active State & User State --- */
function updateHeaderState() {
  const currentPath = window.location.pathname;
  document.querySelectorAll(".nav-link, .mobile-drawer-link").forEach(link => {
    const href = link.getAttribute("href");
    if (currentPath.endsWith(href) || (href === "index.html" && (currentPath.endsWith("/") || currentPath.endsWith("/index.html")))) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  if (window.atlasState) {
    const user = window.atlasState.getUser();
    const userAvatarImg = document.getElementById("header-user-avatar");
    const userNameSpan = document.getElementById("header-user-name");
    if (userAvatarImg && user.avatar) userAvatarImg.src = user.avatar;
    if (userNameSpan && user.name) userNameSpan.textContent = user.name.split(" ")[0];
  }
}

// Global initialization
document.addEventListener("DOMContentLoaded", () => {
  initMobileDrawer();
  initQuickSearch();
  initInstitutionalModals();
  updateHeaderState();

  if (window.atlasState) {
    window.atlasState.subscribe(() => {
      updateHeaderState();
    });
  }
});
