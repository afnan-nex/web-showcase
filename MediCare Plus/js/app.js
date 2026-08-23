/**
 * MediCare Plus - Global Application Logic (Production Grade)
 * Manages omnibar search modal (Ctrl+K), notification drawer, article reader modal,
 * toast notification system, and mobile drawer.
 */

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

const App = {
  init() {
    this.highlightActiveNavLink();
    this.initGlobalSearch();
    this.initNotificationCenter();
    this.initArticleReader();
    this.initMobileNav();
    this.initToasts();
    this.updateNotificationBadge();

    // Listen for global storage notifications
    window.addEventListener("medicare:notification-received", (e) => {
      this.updateNotificationBadge();
      if (e.detail) {
        this.showToast(e.detail.title + ": " + e.detail.message, "info");
      }
    });
  },

  /**
   * Highlights the current page in navigation
   */
  highlightActiveNavLink() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

    navLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (href) {
        const linkPage = href.split("/").pop();
        if (linkPage === currentPath || (currentPath === "" && linkPage === "index.html")) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        } else {
          link.classList.remove("active");
          link.removeAttribute("aria-current");
        }
      }
    });
  },

  /**
   * Omnibar / Global Search modal (Ctrl+K)
   */
  initGlobalSearch() {
    const searchModal = document.getElementById("searchModal");
    const searchInput = document.getElementById("globalSearchInput");
    const searchResults = document.getElementById("globalSearchResults");
    const triggerBtns = document.querySelectorAll(".search-trigger-btn, [data-action='open-search']");
    const closeBtns = document.querySelectorAll("[data-action='close-search']");

    if (!searchModal) return;

    const openSearch = () => {
      searchModal.classList.add("open");
      searchModal.setAttribute("aria-hidden", "false");
      if (searchInput) {
        searchInput.value = "";
        searchInput.focus();
        this.performGlobalSearch("", searchResults);
      }
    };

    const closeSearch = () => {
      searchModal.classList.remove("open");
      searchModal.setAttribute("aria-hidden", "true");
    };

    triggerBtns.forEach(btn => btn.addEventListener("click", (e) => {
      e.preventDefault();
      openSearch();
    }));

    closeBtns.forEach(btn => btn.addEventListener("click", closeSearch));

    // Backdrop click
    searchModal.addEventListener("click", (e) => {
      if (e.target === searchModal) closeSearch();
    });

    // Keyboard shortcut (Ctrl+K or Cmd+K or '/')
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (searchModal.classList.contains("open")) {
          closeSearch();
        } else {
          openSearch();
        }
      } else if (e.key === "Escape") {
        if (searchModal.classList.contains("open")) closeSearch();
        this.closeArticleModal();
      }
    });

    // Live search typing
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim();
        this.performGlobalSearch(query, searchResults);
      });
    }
  },

  /**
   * Search through Doctors, Departments, Services, and Health Articles
   */
  performGlobalSearch(query, container) {
    if (!container || !MEDICAL_DATA) return;
    const q = query.toLowerCase();

    if (!q) {
      container.innerHTML = `
        <div class="search-result-group-title">Quick Hospital Navigation</div>
        <a href="doctors.html" class="search-result-item">
          <div class="search-result-main">
            <span class="search-result-name">Find a Physician or Specialist</span>
            <span class="search-result-sub">Search our board-certified clinical faculty</span>
          </div>
          <span class="badge badge-neutral">Directory</span>
        </a>
        <a href="services.html" class="search-result-item">
          <div class="search-result-main">
            <span class="search-result-name">Medical Specialties & Clinical Services</span>
            <span class="search-result-sub">Cardiology, Oncology, Neurology, Orthopedics & more</span>
          </div>
          <span class="badge badge-neutral">Services</span>
        </a>
        <a href="appointment.html" class="search-result-item">
          <div class="search-result-main">
            <span class="search-result-name">Book Patient Appointment</span>
            <span class="search-result-sub">Multi-step scheduling & real-time doctor availability</span>
          </div>
          <span class="badge badge-primary">Scheduling</span>
        </a>
        <a href="patient-portal.html" class="search-result-item">
          <div class="search-result-main">
            <span class="search-result-name">Patient Health Portal</span>
            <span class="search-result-sub">View upcoming appointments, lab results & prescriptions</span>
          </div>
          <span class="badge badge-neutral">Portal</span>
        </a>
      `;
      return;
    }

    // Filter Doctors
    const matchedDoctors = MEDICAL_DATA.doctors.filter(doc =>
      doc.name.toLowerCase().includes(q) ||
      doc.specialty.toLowerCase().includes(q) ||
      doc.departmentName.toLowerCase().includes(q) ||
      doc.subSpecialties.some(s => s.toLowerCase().includes(q))
    );

    // Filter Services
    const matchedServices = MEDICAL_DATA.services.filter(srv =>
      srv.name.toLowerCase().includes(q) ||
      srv.departmentName.toLowerCase().includes(q) ||
      srv.description.toLowerCase().includes(q)
    );

    // Filter Departments
    const matchedDepts = MEDICAL_DATA.departments.filter(dept =>
      dept.name.toLowerCase().includes(q) ||
      dept.description.toLowerCase().includes(q)
    );

    // Filter Articles
    const matchedArticles = MEDICAL_DATA.healthArticles.filter(art =>
      art.title.toLowerCase().includes(q) ||
      art.category.toLowerCase().includes(q) ||
      art.snippet.toLowerCase().includes(q)
    );

    const totalMatches = matchedDoctors.length + matchedServices.length + matchedDepts.length + matchedArticles.length;

    if (totalMatches === 0) {
      container.innerHTML = `
        <div class="search-empty-state">
          <p><strong>No clinical results found for "${escapeHtml(query)}"</strong></p>
          <p class="text-sm text-muted">Try searching by condition, doctor name, specialty, or department.</p>
        </div>
      `;
      return;
    }

    let html = "";

    if (matchedDoctors.length > 0) {
      html += `<div class="search-result-group-title">Doctors & Specialists (${matchedDoctors.length})</div>`;
      matchedDoctors.forEach(doc => {
        html += `
          <a href="doctor-profile.html?id=${doc.id}" class="search-result-item">
            <div class="search-result-main">
              <span class="search-result-name">${escapeHtml(doc.name)}, ${escapeHtml(doc.title)}</span>
              <span class="search-result-sub">${escapeHtml(doc.specialty)} • ${escapeHtml(doc.departmentName)}</span>
            </div>
            <span class="badge badge-primary">Physician</span>
          </a>
        `;
      });
    }

    if (matchedServices.length > 0) {
      html += `<div class="search-result-group-title">Services & Clinical Programs (${matchedServices.length})</div>`;
      matchedServices.forEach(srv => {
        html += `
          <a href="services.html#${srv.id}" class="search-result-item">
            <div class="search-result-main">
              <span class="search-result-name">${escapeHtml(srv.name)}</span>
              <span class="search-result-sub">${escapeHtml(srv.departmentName)} • ${escapeHtml(srv.estimatedFee)}</span>
            </div>
            <span class="badge badge-neutral">Service</span>
          </a>
        `;
      });
    }

    if (matchedDepts.length > 0) {
      html += `<div class="search-result-group-title">Departments (${matchedDepts.length})</div>`;
      matchedDepts.forEach(dept => {
        html += `
          <a href="services.html?dept=${dept.id}" class="search-result-item">
            <div class="search-result-main">
              <span class="search-result-name">${escapeHtml(dept.name)}</span>
              <span class="search-result-sub">Head: ${escapeHtml(dept.headOfDept)}</span>
            </div>
            <span class="badge badge-neutral">Department</span>
          </a>
        `;
      });
    }

    if (matchedArticles.length > 0) {
      html += `<div class="search-result-group-title">Health Resources (${matchedArticles.length})</div>`;
      matchedArticles.forEach(art => {
        html += `
          <a href="javascript:void(0)" class="search-result-item" onclick="App.openArticleModal('${art.id}')">
            <div class="search-result-main">
              <span class="search-result-name">${escapeHtml(art.title)}</span>
              <span class="search-result-sub">${escapeHtml(art.category)} • By ${escapeHtml(art.author)}</span>
            </div>
            <span class="badge badge-neutral">Article</span>
          </a>
        `;
      });
    }

    container.innerHTML = html;
  },

  /**
   * Health Article Reader Modal
   */
  initArticleReader() {
    let modal = document.getElementById("articleReaderModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "articleReaderModal";
      modal.className = "article-modal-backdrop";
      modal.setAttribute("aria-hidden", "true");
      modal.setAttribute("role", "dialog");
      modal.innerHTML = `
        <div class="article-modal-window">
          <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem 1.5rem; border-bottom:1px solid var(--color-neutral-200); background:var(--color-neutral-50);">
            <strong style="font-size:0.9375rem; color:var(--color-neutral-900);">Clinical Health Resource</strong>
            <button class="btn btn-sm" onclick="App.closeArticleModal()" style="font-size:1.25rem;">&times;</button>
          </div>
          <div id="articleModalContent" style="padding:1.5rem;"></div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.closeArticleModal();
      });
    }
  },

  openArticleModal(articleId) {
    const art = MEDICAL_DATA.healthArticles.find(a => a.id === articleId);
    const modal = document.getElementById("articleReaderModal");
    const content = document.getElementById("articleModalContent");
    if (!art || !modal || !content) return;

    content.innerHTML = `
      <span class="badge badge-primary" style="margin-bottom:0.5rem;">${escapeHtml(art.category)}</span>
      <h2 style="font-size:1.5rem; color:var(--color-primary-950); margin-bottom:0.5rem;">${escapeHtml(art.title)}</h2>
      <div class="text-xs text-muted" style="margin-bottom:1.25rem; border-bottom:1px solid var(--color-neutral-200); padding-bottom:0.75rem;">
        Published: <strong>${art.date}</strong> • Authored by: <strong>${escapeHtml(art.author)}</strong> • ${art.readTime}
      </div>

      <div style="font-size:0.9375rem; color:var(--color-neutral-800); line-height:1.7; white-space:pre-line; margin-bottom:1.5rem;">
        ${escapeHtml(art.fullContent || art.snippet)}
      </div>

      <div style="background:var(--color-primary-50); border:1px solid var(--color-primary-100); border-radius:var(--radius-md); padding:1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
        <div>
          <strong style="font-size:0.875rem; color:var(--color-primary-950); display:block;">Have specific medical questions?</strong>
          <span class="text-xs text-muted">Consult with our board-certified clinical faculty.</span>
        </div>
        <a href="appointment.html" class="btn btn-primary btn-sm">Schedule Clinical Visit</a>
      </div>
    `;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  },

  closeArticleModal() {
    const modal = document.getElementById("articleReaderModal");
    if (modal) {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
    }
  },

  /**
   * Notification Center Drawer
   */
  initNotificationCenter() {
    const bellBtn = document.getElementById("notifBellBtn");
    const backdrop = document.getElementById("notifDrawerBackdrop");
    const drawer = document.getElementById("notifDrawer");
    const closeBtn = document.getElementById("closeNotifDrawerBtn");
    const markAllBtn = document.getElementById("markAllReadBtn");
    const container = document.getElementById("notifDrawerList");

    if (!bellBtn || !drawer) return;

    const openDrawer = () => {
      this.renderNotificationList(container);
      if (backdrop) backdrop.classList.add("open");
      drawer.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
    };

    const closeDrawer = () => {
      if (backdrop) backdrop.classList.remove("open");
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
      this.updateNotificationBadge();
    };

    bellBtn.addEventListener("click", openDrawer);
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    if (backdrop) backdrop.addEventListener("click", closeDrawer);

    if (markAllBtn) {
      markAllBtn.addEventListener("click", () => {
        StorageManager.markAllNotificationsAsRead();
        this.renderNotificationList(container);
        this.updateNotificationBadge();
        this.showToast("All notifications marked as read", "info");
      });
    }
  },

  renderNotificationList(container) {
    if (!container) return;
    const list = StorageManager.getNotifications();

    if (list.length === 0) {
      container.innerHTML = `
        <div class="search-empty-state">
          <p class="text-muted">No notifications at this time.</p>
        </div>
      `;
      return;
    }

    let html = "";
    list.forEach(notif => {
      const timeStr = this.formatRelativeTime(notif.timestamp);
      html += `
        <div class="notif-item ${notif.read ? '' : 'unread'}" data-notif-id="${notif.id}">
          <div class="notif-item-header">
            <span class="notif-item-title">${escapeHtml(notif.title)}</span>
            <span class="notif-item-time">${timeStr}</span>
          </div>
          <p class="notif-item-msg">${escapeHtml(notif.message)}</p>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            ${notif.actionUrl ? `<a href="${notif.actionUrl}" class="btn btn-sm btn-outline" style="font-size:0.75rem; padding:0.2rem 0.5rem;">View Details</a>` : '<span></span>'}
            ${!notif.read ? `<button class="btn btn-sm text-sm" style="color:var(--color-primary-700); padding:0;" onclick="App.markSingleNotificationRead('${notif.id}')">Mark as read</button>` : ''}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  markSingleNotificationRead(id) {
    StorageManager.markNotificationAsRead(id);
    const container = document.getElementById("notifDrawerList");
    this.renderNotificationList(container);
    this.updateNotificationBadge();
  },

  updateNotificationBadge() {
    const badge = document.getElementById("notifBadge");
    if (!badge) return;
    const count = StorageManager.getUnreadNotificationsCount();
    if (count > 0) {
      badge.textContent = count > 9 ? "9+" : count;
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  },

  /**
   * Mobile Navigation Toggle
   */
  initMobileNav() {
    const toggleBtn = document.getElementById("mobileNavToggle");
    const drawer = document.getElementById("mobileNavDrawer");
    const closeBtn = document.getElementById("closeMobileNavBtn");

    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener("click", () => {
      drawer.classList.add("open");
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        drawer.classList.remove("open");
      });
    }

    drawer.addEventListener("click", (e) => {
      if (e.target === drawer) {
        drawer.classList.remove("open");
      }
    });
  },

  /**
   * Toast Notification System
   */
  initToasts() {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      container.setAttribute("aria-live", "polite");
      container.setAttribute("aria-atomic", "true");
      document.body.appendChild(container);
    }
  },

  showToast(message, type = "info", duration = 4500) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${escapeHtml(message)}</span>
      <button class="toast-close-btn" aria-label="Dismiss">&times;</button>
    `;

    const closeBtn = toast.querySelector(".toast-close-btn");
    const removeToast = () => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      setTimeout(() => toast.remove(), 200);
    };

    closeBtn.addEventListener("click", removeToast);
    container.appendChild(toast);

    if (duration > 0) {
      setTimeout(removeToast, duration);
    }
  },

  /**
   * Utility: Format relative time
   */
  formatRelativeTime(isoString) {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch (e) {
      return "Recent";
    }
  }
};

/**
 * Global helper to safely escape strings for HTML insertion
 */
function escapeHtml(str) {
  if (typeof str !== "string") return str || "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
