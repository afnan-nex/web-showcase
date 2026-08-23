/**
 * SUMMIT EVENTS — UI UTILITIES & SHARED HELPERS
 * Toast notifications, dynamic deterministic QR generator, modals, theme switcher, calendar export, formatters.
 */

const SummitUI = {
  /**
   * Initialize shared UI components (Theme, Header badges, Nav state)
   */
  init() {
    this.initTheme();
    this.updateHeaderBadges();
    this.initMobileNav();
    this.initGlobalShortcuts();

    // Listen for storage events across tabs or local dispatch
    window.addEventListener("favoritesUpdated", () => this.updateHeaderBadges());
    window.addEventListener("ticketsUpdated", () => this.updateHeaderBadges());
  },

  // ----------------- THEME MANAGEMENT -----------------
  initTheme() {
    const savedTheme = SummitStorage.getTheme();
    document.documentElement.setAttribute("data-theme", savedTheme);
    this.updateThemeButtonIcons(savedTheme);

    const themeToggles = document.querySelectorAll(".theme-toggle-btn");
    themeToggles.forEach(btn => {
      btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "dark";
        const next = current === "dark" ? "light" : "dark";
        SummitStorage.setTheme(next);
        this.updateThemeButtonIcons(next);
        this.showToast(`Theme switched to ${next} mode`, "info");
      });
    });
  },

  updateThemeButtonIcons(theme) {
    const themeToggles = document.querySelectorAll(".theme-toggle-btn");
    themeToggles.forEach(btn => {
      btn.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
      btn.innerHTML = theme === "dark" 
        ? `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg><span class="sr-only">Toggle Light Mode</span>`
        : `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg><span class="sr-only">Toggle Dark Mode</span>`;
    });
  },

  // ----------------- HEADER BADGES -----------------
  updateHeaderBadges() {
    const favCount = SummitStorage.getFavorites().length;
    const tktCount = SummitStorage.getTickets().filter(t => t.status === "active").length;

    const favBadges = document.querySelectorAll(".badge-fav-count");
    favBadges.forEach(b => {
      b.textContent = favCount;
      b.style.display = favCount > 0 ? "inline-flex" : "none";
    });

    const tktBadges = document.querySelectorAll(".badge-tkt-count");
    tktBadges.forEach(b => {
      b.textContent = tktCount;
      b.style.display = tktCount > 0 ? "inline-flex" : "none";
    });
  },

  // ----------------- MOBILE NAVIGATION -----------------
  initMobileNav() {
    const menuBtn = document.querySelector(".mobile-menu-btn");
    const mobileDrawer = document.querySelector(".mobile-drawer");
    const drawerBackdrop = document.querySelector(".drawer-backdrop");
    const closeBtn = document.querySelector(".drawer-close-btn");

    if (menuBtn && mobileDrawer) {
      menuBtn.addEventListener("click", () => {
        mobileDrawer.classList.add("active");
        if (drawerBackdrop) drawerBackdrop.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    }

    const closeDrawer = () => {
      if (mobileDrawer) mobileDrawer.classList.remove("active");
      if (drawerBackdrop) drawerBackdrop.classList.remove("active");
      document.body.style.overflow = "";
    };

    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeDrawer);
  },

  // ----------------- GLOBAL KEYBOARD SHORTCUTS -----------------
  initGlobalShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAllModals();
      }
      // Quick search slash '/'
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        const searchInput = document.querySelector("#headerSearchInput, #eventSearchInput, .main-search-input");
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    });
  },

  // ----------------- TOAST NOTIFICATIONS -----------------
  showToast(message, type = "info", duration = 3800) {
    let container = document.getElementById("summit-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "summit-toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type} animate-slide-up`;

    let iconSvg = "";
    if (type === "success") {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === "error") {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <div class="toast-content">${message}</div>
      <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    container.appendChild(toast);

    const removeToast = () => {
      toast.classList.add("toast-fade-out");
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 300);
    };

    toast.querySelector(".toast-close").addEventListener("click", removeToast);
    setTimeout(removeToast, duration);
  },

  // ----------------- MODAL SYSTEM -----------------
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Auto-focus first input or close button
    const focusable = modal.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  },

  closeAllModals() {
    const activeModals = document.querySelectorAll(".modal.active, .mobile-drawer.active, .drawer-backdrop.active");
    activeModals.forEach(m => {
      m.classList.remove("active");
      if (m.classList.contains("modal")) m.setAttribute("aria-hidden", "true");
    });
    document.body.style.overflow = "";
  },

  // ----------------- DETERMINISTIC HIGH-RES QR CODE GENERATOR (Pure SVG) -----------------
  /**
   * Generates a sleek, authentic-looking vector QR code SVG string from string data.
   * Creates standard 25x25 matrix with finder patterns, timing patterns, alignment squares, and deterministic hash payload.
   */
  generateQRCodeSVG(dataString, size = 180, color = "#FFFFFF", bgColor = "transparent") {
    const matrixSize = 25; // 25x25 QR matrix (Standard Version 2)
    const grid = Array(matrixSize).fill(null).map(() => Array(matrixSize).fill(0));

    // Helper: Mark square
    const fillSquare = (r, c, w, h, val = 1) => {
      for (let i = r; i < r + h; i++) {
        for (let j = c; j < c + w; j++) {
          if (i >= 0 && i < matrixSize && j >= 0 && j < matrixSize) grid[i][j] = val;
        }
      }
    };

    // 1. Draw Position Detection Patterns (Top-Left, Top-Right, Bottom-Left)
    const drawFinderPattern = (r, c) => {
      fillSquare(r, c, 7, 7, 1);
      fillSquare(r + 1, c + 1, 5, 5, 0);
      fillSquare(r + 2, c + 2, 3, 3, 1);
    };

    drawFinderPattern(0, 0); // Top-left
    drawFinderPattern(0, matrixSize - 7); // Top-right
    drawFinderPattern(matrixSize - 7, 0); // Bottom-left

    // 2. Separators
    fillSquare(7, 0, 8, 1, 0);
    fillSquare(0, 7, 1, 8, 0);
    fillSquare(7, matrixSize - 8, 8, 1, 0);
    fillSquare(0, matrixSize - 8, 1, 8, 0);
    fillSquare(matrixSize - 8, 0, 8, 1, 0);
    fillSquare(matrixSize - 8, 7, 1, 8, 0);

    // 3. Timing lines
    for (let i = 8; i < matrixSize - 8; i++) {
      grid[6][i] = i % 2 === 0 ? 1 : 0;
      grid[i][6] = i % 2 === 0 ? 1 : 0;
    }

    // 4. Alignment pattern at (16, 16)
    fillSquare(14, 14, 5, 5, 1);
    fillSquare(15, 15, 3, 3, 0);
    grid[16][16] = 1;

    // 5. Deterministic hash filling for data area
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      hash = ((hash << 5) - hash) + dataString.charCodeAt(i);
      hash |= 0;
    }

    let seed = Math.abs(hash);
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        // Skip reserved patterns
        const isTLFinder = r < 8 && c < 8;
        const isTRFinder = r < 8 && c >= matrixSize - 8;
        const isBLFinder = r >= matrixSize - 8 && c < 8;
        const isAlign = r >= 14 && r < 19 && c >= 14 && c < 19;
        const isTiming = r === 6 || c === 6;

        if (!isTLFinder && !isTRFinder && !isBLFinder && !isAlign && !isTiming) {
          grid[r][c] = pseudoRandom() > 0.48 ? 1 : 0;
        }
      }
    }

    // Convert grid to SVG rects
    const cellSize = (size / matrixSize).toFixed(2);
    let rects = "";
    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        if (grid[r][c] === 1) {
          rects += `<rect x="${(c * cellSize).toFixed(2)}" y="${(r * cellSize).toFixed(2)}" width="${cellSize}" height="${cellSize}" rx="1" ry="1" fill="${color}" />`;
        }
      }
    }

    return `
      <svg class="summit-qr-code" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="background:${bgColor}; border-radius: 8px;">
        ${rects}
      </svg>
    `;
  },

  // ----------------- CALENDAR (.ICS) EXPORT -----------------
  downloadCalendarEvent(event) {
    const startDate = event.date.replace(/-/g, "") + "T180000Z";
    const endDate = (event.endDate || event.date).replace(/-/g, "") + "T230000Z";
    const description = `${event.tagline || ""}\\n\\nVenue: ${event.venueName}\\nTickets & Details: https://summitevents.io/event-detail.html?id=${event.id}`;
    
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Summit Events//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${event.venueName}, ${event.address}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `STATUS:CONFIRMED`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${event.slug || "summit-event"}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast("Calendar invite (.ics) downloaded!", "success");
  },

  // ----------------- SHARE MODAL & LINK COPY -----------------
  shareEvent(event) {
    const url = window.location.origin + window.location.pathname.replace(/[^/]*$/, '') + `event-detail.html?id=${event.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out ${event.title} on Summit Events`,
        url: url
      }).catch(() => {
        this.copyToClipboard(url, "Event link copied to clipboard!");
      });
    } else {
      this.copyToClipboard(url, "Event link copied to clipboard!");
    }
  },

  copyToClipboard(text, successMsg = "Copied to clipboard!") {
    navigator.clipboard.writeText(text).then(() => {
      this.showToast(successMsg, "success");
    }).catch(() => {
      // Fallback
      const input = document.createElement("textarea");
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      this.showToast(successMsg, "success");
    });
  },

  // ----------------- FORMATTERS -----------------
  formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      maximumFractionDigits: 2
    }).format(amount);
  },

  formatDate(dateString) {
    const d = new Date(dateString + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  },

  // ----------------- COUNTDOWN TIMER GENERATOR -----------------
  startCountdown(targetDateString, elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const targetDate = new Date(targetDateString + "T19:00:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        el.innerHTML = `<span class="badge badge-live">Happening Now</span>`;
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      el.innerHTML = `
        <div class="countdown-unit"><span class="unit-val">${days}</span><span class="unit-lbl">Days</span></div>
        <div class="countdown-sep">:</div>
        <div class="countdown-unit"><span class="unit-val">${String(hours).padStart(2, '0')}</span><span class="unit-lbl">Hours</span></div>
        <div class="countdown-sep">:</div>
        <div class="countdown-unit"><span class="unit-val">${String(minutes).padStart(2, '0')}</span><span class="unit-lbl">Mins</span></div>
        <div class="countdown-sep">:</div>
        <div class="countdown-unit"><span class="unit-val">${String(seconds).padStart(2, '0')}</span><span class="unit-lbl">Secs</span></div>
      `;
    };

    updateTimer();
    return setInterval(updateTimer, 1000);
  }
};

// Initialize UI on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => SummitUI.init());
