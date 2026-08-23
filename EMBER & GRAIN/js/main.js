/**
 * EMBER & GRAIN - MASTER SITE SCRIPT
 * Shared UI components, header transitions, mobile navigation, toast system,
 * FAQ accordions, contact/events form handlers, and scroll reveal animations.
 */

const EG_UI = {
  toast(message, type = "info", duration = 4200) {
    let container = document.getElementById("eg-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "eg-toast-container";
      container.className = "toast-container";
      container.setAttribute("role", "status");
      container.setAttribute("aria-live", "polite");
      document.body.appendChild(container);
    }

    const toastEl = document.createElement("div");
    toastEl.className = `toast-item toast-${type}`;

    const icons = {
      success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
      error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
      info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="8"></line></svg>`
    };

    toastEl.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content">${message}</div>
      <button type="button" class="toast-close" aria-label="Dismiss notification">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    container.appendChild(toastEl);

    requestAnimationFrame(() => {
      toastEl.classList.add("show");
    });

    const closeBtn = toastEl.querySelector(".toast-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.dismissToast(toastEl));
    }

    if (duration > 0) {
      setTimeout(() => this.dismissToast(toastEl), duration);
    }
  },

  dismissToast(toastEl) {
    if (!toastEl) return;
    toastEl.classList.remove("show");
    toastEl.classList.add("hide");
    setTimeout(() => {
      if (toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
    }, 280);
  }
};

window.EG_UI = EG_UI;

document.addEventListener("DOMContentLoaded", () => {
  initStickyHeader();
  initMobileNav();
  initFaqAccordions();
  initNewsletterForm();
  initContactForms();
  initScrollReveals();
  initSmoothScroll();
});

function initStickyHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

function initMobileNav() {
  const toggleBtn = document.querySelector(".mobile-nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav-drawer");
  const backdrop = document.querySelector(".mobile-nav-backdrop");
  const closeBtn = document.querySelector(".mobile-nav-close");

  if (!toggleBtn || !mobileNav) return;

  let lastFocus = null;

  const openMobileNav = () => {
    lastFocus = document.activeElement;
    mobileNav.classList.add("is-open");
    if (backdrop) backdrop.classList.add("is-open");
    toggleBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  };

  const closeMobileNav = () => {
    mobileNav.classList.remove("is-open");
    if (backdrop) backdrop.classList.remove("is-open");
    toggleBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };

  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (mobileNav.classList.contains("is-open")) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", closeMobileNav);
  if (backdrop) backdrop.addEventListener("click", closeMobileNav);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
      closeMobileNav();
    }
  });

  mobileNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      closeMobileNav();
    });
  });
}

function initFaqAccordions() {
  document.querySelectorAll(".faq-item").forEach(item => {
    const trigger = item.querySelector(".faq-question");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-active");

      const parent = item.closest(".faq-accordion");
      if (parent) {
        parent.querySelectorAll(".faq-item").forEach(other => {
          if (other !== item) {
            other.classList.remove("is-active");
            const btn = other.querySelector(".faq-question");
            if (btn) btn.setAttribute("aria-expanded", "false");
          }
        });
      }

      item.classList.toggle("is-active", !isOpen);
      trigger.setAttribute("aria-expanded", !isOpen ? "true" : "false");
    });
  });
}

function initNewsletterForm() {
  document.querySelectorAll(".newsletter-form").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = form.querySelector("input[type='email']");
      const email = emailInput ? emailInput.value.trim() : "";

      if (!email || !email.includes("@") || !email.includes(".")) {
        EG_UI.toast("Please enter a valid email address.", "error");
        return;
      }

      EG_UI.toast("Welcome to the Ember & Grain Salon. You will receive private tasting notices and harvest release previews.", "success", 5000);
      form.reset();
    });
  });
}

function initContactForms() {
  const contactForm = document.getElementById("eg-contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = contactForm.querySelector("[name='name']")?.value;
      EG_UI.toast(`Thank you, ${name || 'Guest'}. Our concierge team has received your message and will reply within 24 hours.`, "success", 6000);
      contactForm.reset();
    });
  }

  const privateDiningForm = document.getElementById("eg-private-events-form");
  if (privateDiningForm) {
    privateDiningForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = privateDiningForm.querySelector("[name='name']")?.value;
      const guests = privateDiningForm.querySelector("[name='guests']")?.value;
      EG_UI.toast(`Thank you, ${name || 'Guest'}. Your private dining inquiry for ${guests || 'your'} guests has been routed to our Event Director.`, "success", 6000);
      privateDiningForm.reset();
    });
  }
}

function initScrollReveals() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  if (revealElements.length === 0) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add("is-revealed"));
  }
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}
