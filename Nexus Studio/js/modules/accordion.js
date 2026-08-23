/**
 * NEXUS STUDIO — ACCORDIONS & EXPANDABLE DRAWERS
 * Accessible accordion components for Services, Deliverables, and FAQs
 */

const Accordion = {
  init() {
    this.accordions = document.querySelectorAll(".accordion-item");
    if (!this.accordions.length) return;

    this.bindEvents();
  },

  bindEvents() {
    this.accordions.forEach(item => {
      const trigger = item.querySelector(".accordion-trigger");
      const panel = item.querySelector(".accordion-panel");

      if (!trigger || !panel) return;

      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        // Optional: close other accordion items in same parent
        const parent = item.closest(".accordion-list");
        if (parent && parent.getAttribute("data-single-open") === "true") {
          parent.querySelectorAll(".accordion-item.is-open").forEach(other => {
            if (other !== item) {
              this.closeItem(other);
            }
          });
        }

        if (isOpen) {
          this.closeItem(item);
        } else {
          this.openItem(item);
        }
      });
    });
  },

  openItem(item) {
    const trigger = item.querySelector(".accordion-trigger");
    const panel = item.querySelector(".accordion-panel");

    item.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    panel.style.maxHeight = panel.scrollHeight + "px";
  },

  closeItem(item) {
    const trigger = item.querySelector(".accordion-trigger");
    const panel = item.querySelector(".accordion-panel");

    item.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    panel.style.maxHeight = "0px";
  }
};
