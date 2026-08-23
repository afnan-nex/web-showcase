/**
 * NEXUS STUDIO — THEME ENGINE
 * Light / Dark / System mode persistence and synchronization
 */

const ThemeManager = {
  STORAGE_KEY: "nexus_theme_preference",

  init() {
    this.themeButtons = document.querySelectorAll("[data-theme-btn]");
    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Retrieve saved theme or default to system
    let savedTheme = "system";
    try {
      savedTheme = localStorage.getItem(this.STORAGE_KEY) || "system";
    } catch (e) {}
    this.applyTheme(savedTheme, false);

    // Bind theme button clicks
    this.themeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const theme = btn.getAttribute("data-theme-btn");
        this.setTheme(theme);
      });
    });

    // Listen for OS system theme changes
    this.mediaQuery.addEventListener("change", () => {
      let currentSaved = "system";
      try {
        currentSaved = localStorage.getItem(this.STORAGE_KEY) || "system";
      } catch (e) {}
      if (currentSaved === "system") {
        this.applyTheme("system", false);
      }
    });
  },

  setTheme(theme) {
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch (e) {}
    this.applyTheme(theme, true);
  },

  applyTheme(theme, notify = false) {
    const root = document.documentElement;
    let effectiveTheme = theme;

    if (theme === "system") {
      effectiveTheme = this.mediaQuery.matches ? "dark" : "light";
    }

    root.setAttribute("data-theme", effectiveTheme);

    // Update active button state
    this.themeButtons.forEach(btn => {
      if (btn.getAttribute("data-theme-btn") === theme) {
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      }
    });

    if (notify && typeof ToastManager !== "undefined") {
      ToastManager.showToast({
        title: "Theme Updated",
        message: `Switched to ${theme.charAt(0).toUpperCase() + theme.slice(1)} mode.`,
        type: "info"
      });
    }
  }
};
