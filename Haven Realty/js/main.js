/**
 * Haven Realty - Global Application Controller
 * Handles navigation, badges, sticky header, mobile drawer, modals, and shared event listeners.
 */

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileNav();
  initBadges();
  initCardActionDelegation();
  initNewsletter();
  initAppointmentModal();
  initInquiryModal();
});

// --- STICKY HEADER ---
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

// --- MOBILE NAVIGATION DRAWER ---
function initMobileNav() {
  const hamburger = document.querySelector(".hamburger-btn");
  const drawer = document.querySelector(".mobile-drawer");
  const overlay = document.querySelector(".mobile-nav-overlay");
  const closeBtn = document.querySelector(".drawer-close-btn");

  if (!hamburger || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    hamburger.setAttribute("aria-expanded", "true");
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    hamburger.setAttribute("aria-expanded", "false");
  }

  hamburger.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);

  // Close drawer on link clicks
  drawer.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeDrawer);
  });

  // Close drawer on Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) {
      closeDrawer();
    }
  });
}

// --- BADGE COUNTERS (FAVORITES & COMPARE) ---
function initBadges() {
  function updateCounts() {
    const favCountEl = document.getElementById("header-fav-count");
    const compCountEl = document.getElementById("header-compare-count");
    const mobileFavCountEl = document.getElementById("mobile-fav-count");
    const mobileCompCountEl = document.getElementById("mobile-compare-count");

    const favs = HavenStorage.getFavorites();
    const comps = HavenStorage.getCompare();

    if (favCountEl) {
      favCountEl.textContent = favs.length;
      favCountEl.style.display = favs.length > 0 ? "flex" : "none";
    }
    if (compCountEl) {
      compCountEl.textContent = comps.length;
      compCountEl.style.display = comps.length > 0 ? "flex" : "none";
    }
    if (mobileFavCountEl) mobileFavCountEl.textContent = `(${favs.length})`;
    if (mobileCompCountEl) mobileCompCountEl.textContent = `(${comps.length})`;
  }

  updateCounts();
  window.addEventListener("favorites-updated", updateCounts);
  window.addEventListener("compare-updated", updateCounts);
}

// --- CARD ACTION DELEGATION (FAVORITES & COMPARE) ---
function initCardActionDelegation() {
  document.addEventListener("click", (e) => {
    // Favorite Button Click
    const favBtn = e.target.closest(".btn-toggle-favorite");
    if (favBtn) {
      e.preventDefault();
      e.stopPropagation();
      const propId = favBtn.dataset.propId;
      if (!propId) return;

      const isAdded = HavenStorage.toggleFavorite(propId);
      favBtn.classList.toggle("active", isAdded);
      
      const prop = HAVEN_PROPERTIES.find(p => p.id === propId);
      const title = prop ? prop.title : "Property";

      if (isAdded) {
        favBtn.setAttribute("title", "Remove from saved");
        favBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="#E74C3C" stroke="#E74C3C" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        showToast(`Saved "${title}" to your curated portfolio`, "success");
      } else {
        favBtn.setAttribute("title", "Save property");
        favBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        showToast(`Removed "${title}" from saved properties`, "info");
      }
      return;
    }

    // Compare Button Click
    const compBtn = e.target.closest(".btn-toggle-compare");
    if (compBtn) {
      e.preventDefault();
      e.stopPropagation();
      const propId = compBtn.dataset.propId;
      if (!propId) return;

      const prop = HAVEN_PROPERTIES.find(p => p.id === propId);
      const title = prop ? prop.title : "Property";

      if (HavenStorage.isInCompare(propId)) {
        HavenStorage.removeFromCompare(propId);
        compBtn.classList.remove("compare-active");
        showToast(`Removed "${title}" from comparison queue`, "info");
      } else {
        const res = HavenStorage.addToCompare(propId);
        if (res.success) {
          compBtn.classList.add("compare-active");
          showToast(`Added "${title}" to comparison (${res.list.length}/4)`, "success");
        } else if (res.reason === "max_limit_reached") {
          showToast("You can compare up to 4 properties simultaneously.", "warning");
        }
      }
    }
  });
}

// --- RENDER PROPERTY CARD HELPER (Shared across pages) ---
function renderPropertyCardHTML(prop) {
  const isFav = HavenStorage.isFavorite(prop.id);
  const isComp = HavenStorage.isInCompare(prop.id);
  const statusBadge = prop.status === "for-rent" ? `<span class="badge badge-rent">For Lease</span>` : `<span class="badge badge-gold">For Sale</span>`;

  return `
    <article class="property-card" data-prop-id="${prop.id}">
      <div class="property-card-media">
        <a href="property-detail.html?id=${prop.id}">
          <img src="${prop.images[0]}" alt="${prop.title}" class="property-card-img" loading="lazy" />
        </a>
        <div class="property-card-badges">
          ${statusBadge}
          ${prop.featured ? `<span class="badge badge-dark">Curated</span>` : ""}
        </div>
        <div class="property-card-actions">
          <button class="btn-card-action btn-toggle-favorite ${isFav ? 'active' : ''}" data-prop-id="${prop.id}" title="${isFav ? 'Remove from saved' : 'Save property'}" aria-label="Save property">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFav ? '#E74C3C' : 'none'}" stroke="${isFav ? '#E74C3C' : 'currentColor'}" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <button class="btn-card-action btn-toggle-compare ${isComp ? 'compare-active' : ''}" data-prop-id="${prop.id}" title="Compare property" aria-label="Compare property">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </button>
        </div>
      </div>
      <div class="property-card-content">
        <div class="property-price-row">
          <div class="property-price">${prop.priceDisplay}</div>
          ${prop.status === "for-sale" ? `<div class="property-sqft-price">$${formatNumber(prop.pricePerSqFt)} / sq ft</div>` : ""}
        </div>
        <h3 class="property-card-title">
          <a href="property-detail.html?id=${prop.id}">${prop.title}</a>
        </h3>
        <div class="property-card-location">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>${prop.location.address}, ${prop.location.neighborhood}, ${prop.location.city}</span>
        </div>
        <div class="property-card-meta">
          ${prop.bedrooms > 0 ? `
            <div class="meta-item">
              <span>${prop.bedrooms} Beds</span>
            </div>
            <div class="meta-divider"></div>
          ` : ""}
          <div class="meta-item">
            <span>${prop.bathrooms} Baths</span>
          </div>
          <div class="meta-divider"></div>
          <div class="meta-item">
            <span>${formatNumber(prop.area)} Sq Ft</span>
          </div>
        </div>
      </div>
    </article>
  `;
}

// --- NEWSLETTER SIGNUP ---
function initNewsletter() {
  const forms = document.querySelectorAll(".newsletter-form");
  forms.forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type='email']");
      if (input && input.value) {
        showToast(`Thank you for subscribing to Haven Private Acquisitions: ${input.value}`, "success");
        input.value = "";
      }
    });
  });
}

// --- APPOINTMENT MODAL SCHEDULER (Shared) ---
let selectedAppointmentTime = "10:00 AM";

function initAppointmentModal() {
  const modal = document.getElementById("appointment-modal");
  if (!modal) return;

  const closeBtns = modal.querySelectorAll(".modal-close-trigger");
  closeBtns.forEach(btn => btn.addEventListener("click", () => {
    modal.classList.remove("open");
  }));

  const form = document.getElementById("appointment-form");
  const dateInput = document.getElementById("appt-date");
  const timeSlotsContainer = document.getElementById("appt-time-slots");

  if (dateInput) {
    // Default to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split("T")[0];
    dateInput.value = tomorrow.toISOString().split("T")[0];

    // Generate Dynamic Time Slots on Date Change
    function renderTimeSlots() {
      if (!timeSlotsContainer) return;
      const baseSlots = ["09:30 AM", "11:00 AM", "01:30 PM", "03:00 PM", "04:30 PM", "06:00 PM"];
      // Randomly mark 1 or 2 as booked for realism
      timeSlotsContainer.innerHTML = baseSlots.map((slot, idx) => {
        const isBooked = (idx === 1 && Math.random() > 0.5);
        if (isBooked) {
          return `<button type="button" class="time-slot-btn" disabled style="opacity:0.35; text-decoration:line-through; cursor:not-allowed;" title="Slot Unavailable">${slot}</button>`;
        }
        const isActive = slot === selectedAppointmentTime ? "active" : "";
        return `<button type="button" class="time-slot-btn ${isActive}" data-time="${slot}">${slot}</button>`;
      }).join("");

      // Add click listeners to slot buttons
      timeSlotsContainer.querySelectorAll(".time-slot-btn:not([disabled])").forEach(btn => {
        btn.addEventListener("click", () => {
          timeSlotsContainer.querySelectorAll(".time-slot-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          selectedAppointmentTime = btn.dataset.time;
        });
      });
    }

    dateInput.addEventListener("change", renderTimeSlots);
    renderTimeSlots();
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const clientName = document.getElementById("appt-name")?.value;
      const clientEmail = document.getElementById("appt-email")?.value;
      const clientPhone = document.getElementById("appt-phone")?.value;
      const apptDate = document.getElementById("appt-date")?.value;
      const propId = form.dataset.propId || "general";
      const agentId = form.dataset.agentId || "agent-1";

      const agent = HAVEN_AGENTS.find(a => a.id === agentId) || HAVEN_AGENTS[0];
      const property = HAVEN_PROPERTIES.find(p => p.id === propId);

      const record = HavenStorage.saveAppointment({
        clientName,
        clientEmail,
        clientPhone,
        date: apptDate,
        time: selectedAppointmentTime,
        propId,
        propertyTitle: property ? property.title : "Private Advisory Consultation",
        agentId,
        agentName: agent.name
      });

      modal.classList.remove("open");
      showToast(`Private Showing confirmed with ${agent.name} for ${apptDate} at ${selectedAppointmentTime}! Reference: #${record.id}`, "success", 6000);
      form.reset();
    });
  }
}

// Global helper to open appointment modal for a property or agent
function openAppointmentModal(propId = null, agentId = null) {
  const modal = document.getElementById("appointment-modal");
  if (!modal) return;

  const form = document.getElementById("appointment-form");
  if (form) {
    form.dataset.propId = propId || "";
    form.dataset.agentId = agentId || "";
  }

  const propTitleEl = document.getElementById("appt-modal-property-title");
  if (propTitleEl) {
    if (propId) {
      const p = HAVEN_PROPERTIES.find(item => item.id === propId);
      propTitleEl.textContent = p ? `Viewing: ${p.title}` : "Private Residence Showing";
    } else {
      propTitleEl.textContent = "Private Broker Consultation";
    }
  }

  modal.classList.add("open");
}

// --- INQUIRY MODAL (Shared) ---
function initInquiryModal() {
  const modal = document.getElementById("inquiry-modal");
  if (!modal) return;

  const closeBtns = modal.querySelectorAll(".modal-close-trigger");
  closeBtns.forEach(btn => btn.addEventListener("click", () => {
    modal.classList.remove("open");
  }));

  const form = document.getElementById("inquiry-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("inq-name")?.value;
      const email = document.getElementById("inq-email")?.value;
      const phone = document.getElementById("inq-phone")?.value;
      const message = document.getElementById("inq-message")?.value;
      const inqType = document.getElementById("inq-type")?.value || "Private Showing";
      const propId = form.dataset.propId || "general";

      const prop = HAVEN_PROPERTIES.find(p => p.id === propId);

      const record = HavenStorage.saveInquiry({
        name,
        email,
        phone,
        message,
        type: inqType,
        propId,
        propertyTitle: prop ? prop.title : "Bespoke Portfolio Inquiry"
      });

      modal.classList.remove("open");
      showToast(`Inquiry #${record.id} submitted. Our private partner will contact you shortly.`, "success", 5000);
      form.reset();
    });
  }
  // Outside overlay click closing
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("open");
    }
  });

  // Escape key closing
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      modal.classList.remove("open");
    }
  });
}

function openInquiryModal(propId = null, defaultType = "Private Showing") {
  const modal = document.getElementById("inquiry-modal");
  if (!modal) return;

  const form = document.getElementById("inquiry-form");
  if (form) {
    form.dataset.propId = propId || "";
  }

  const typeSelect = document.getElementById("inq-type");
  if (typeSelect) typeSelect.value = defaultType;

  const propTitleEl = document.getElementById("inq-modal-property-title");
  if (propTitleEl) {
    if (propId) {
      const p = HAVEN_PROPERTIES.find(item => item.id === propId);
      propTitleEl.textContent = p ? `Inquiry regarding: ${p.title}` : "Private Property Inquiry";
    } else {
      propTitleEl.textContent = "Private Client Advisory Inquiry";
    }
  }

  modal.classList.add("open");
}

// Global modal overlay outside-click and escape handling for all modals
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("open");
      }
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.open").forEach(overlay => {
        overlay.classList.remove("open");
      });
    }
  });
});
