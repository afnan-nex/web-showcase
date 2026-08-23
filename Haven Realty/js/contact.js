/**
 * Haven Realty - Contact & Global Offices Controller
 * Handles global office clocks, contact form submissions, and FAQ accordions.
 */

document.addEventListener("DOMContentLoaded", () => {
  initContactPage();
});

function initContactPage() {
  initGlobalOfficeClocks();
  initContactForm();
  initFaqAccordion();
}

// 1. Live Office Clocks for Global Flagships
function initGlobalOfficeClocks() {
  const officeClocks = document.querySelectorAll(".office-live-time");

  function updateClocks() {
    officeClocks.forEach(clock => {
      const tz = clock.dataset.timezone;
      if (!tz) return;

      try {
        const timeStr = new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        }).format(new Date());

        clock.textContent = `${timeStr} (Local)`;
      } catch (e) {
        clock.textContent = "Open Business Hours";
      }
    });
  }

  updateClocks();
  setInterval(updateClocks, 1000);
}

// 2. Contact Form Processing
function initContactForm() {
  const form = document.getElementById("general-contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contact-name")?.value;
    const email = document.getElementById("contact-email")?.value;
    const phone = document.getElementById("contact-phone")?.value;
    const topic = document.getElementById("contact-topic")?.value || "General Advisory";
    const message = document.getElementById("contact-message")?.value;

    const record = HavenStorage.saveInquiry({
      name,
      email,
      phone,
      topic,
      message,
      type: "Global Flagship Contact"
    });

    // Show Confirmation Modal
    const modal = document.getElementById("contact-success-modal");
    const refEl = document.getElementById("contact-ref-id");
    if (refEl) refEl.textContent = `#${record.id}`;
    if (modal) modal.classList.add("open");

    showToast(`Inquiry #${record.id} routed to our Managing Partner.`, "success", 5000);
    form.reset();
  });
}

// 3. FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const questionBtn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove("open");
        const otherAns = other.querySelector(".faq-answer");
        if (otherAns) otherAns.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}
