/**
 * NEXUS STUDIO — NAVIGATION & HEADER
 * Header scroll state, mobile menu toggle, active link tracking
 */

const Navigation = {
  init() {
    this.header = document.querySelector(".site-header");
    this.menuToggle = document.querySelector(".menu-toggle-btn");
    this.mobileMenu = document.querySelector(".mobile-menu-overlay");
    this.navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

    this.bindScroll();
    this.bindMobileMenu();
    this.highlightActivePage();
  },

  bindScroll() {
    if (!this.header) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        this.header.classList.add("is-scrolled");
      } else {
        this.header.classList.remove("is-scrolled");
      }
    }, { passive: true });
  },

  bindMobileMenu() {
    if (!this.menuToggle || !this.mobileMenu) return;

    this.menuToggle.addEventListener("click", () => {
      const isOpen = this.mobileMenu.classList.contains("is-active");
      if (isOpen) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    });

    // Close on link click
    this.mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        this.closeMobileMenu();
      });
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.mobileMenu.classList.contains("is-active")) {
        this.closeMobileMenu();
      }
    });
  },

  openMobileMenu() {
    this.menuToggle.classList.add("is-active");
    this.menuToggle.setAttribute("aria-expanded", "true");
    this.mobileMenu.classList.add("is-active");
    document.body.style.overflow = "hidden";
  },

  closeMobileMenu() {
    this.menuToggle.classList.remove("is-active");
    this.menuToggle.setAttribute("aria-expanded", "false");
    this.mobileMenu.classList.remove("is-active");
    document.body.style.overflow = "";
  },

  highlightActivePage() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    this.navLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (!href) return;

      const linkFile = href.split("/").pop().split("?")[0];

      if (
        linkFile === currentPath || 
        (currentPath === "" && linkFile === "index.html") ||
        (currentPath === "index.html" && linkFile === "index.html")
      ) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }
};
