/**
 * EMBER & GRAIN - RESERVATION ENGINE & MANAGEMENT
 * Handles luxury booking flow, real-time table availability matrix, duplicate checks,
 * iCal (.ics) generation, and "My Reservations" management portal.
 */

const ReservationEngine = {
  state: {
    selectedDate: null,
    selectedTime: null,
    selectedGuests: 2,
    selectedAreaId: "hearth-room",
    selectedTableId: null,
    activeView: "book"
  },
  lastFocusedElement: null,

  timeSlots: [
    { time: "11:30", label: "11:30 AM", period: "lunch" },
    { time: "12:00", label: "12:00 PM", period: "lunch" },
    { time: "12:30", label: "12:30 PM", period: "lunch" },
    { time: "13:00", label: "1:00 PM", period: "lunch" },
    { time: "13:30", label: "1:30 PM", period: "lunch" },
    { time: "14:00", label: "2:00 PM", period: "lunch" },
    { time: "17:00", label: "5:00 PM", period: "dinner" },
    { time: "17:30", label: "5:30 PM", period: "dinner" },
    { time: "18:00", label: "6:00 PM", period: "dinner" },
    { time: "18:30", label: "6:30 PM", period: "dinner" },
    { time: "19:00", label: "7:00 PM", period: "dinner" },
    { time: "19:30", label: "7:30 PM", period: "dinner" },
    { time: "20:00", label: "8:00 PM", period: "dinner" },
    { time: "20:30", label: "8:30 PM", period: "dinner" },
    { time: "21:00", label: "9:00 PM", period: "dinner" },
    { time: "21:30", label: "9:30 PM", period: "dinner" }
  ],

  init() {
    this.initDefaultDate();
    this.renderSeatingAreas();
    this.renderTimeSlots();
    this.renderTableMatrix();
    this.bindEvents();
    this.renderMyReservations();

    if (window.EG_STORE) {
      window.EG_STORE.subscribe("reservations:updated", () => {
        this.renderTableMatrix();
        this.renderMyReservations();
      });
    }
  },

  initDefaultDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateInput = document.getElementById("res-date-input");
    const minDateStr = today.toISOString().split("T")[0];
    
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30);
    const maxDateStr = maxDate.toISOString().split("T")[0];

    const defaultDateStr = tomorrow.toISOString().split("T")[0];
    this.state.selectedDate = defaultDateStr;

    if (dateInput) {
      dateInput.min = minDateStr;
      dateInput.max = maxDateStr;
      dateInput.value = defaultDateStr;
    }

    this.state.selectedTime = "19:00";
  },

  bindEvents() {
    const dateInput = document.getElementById("res-date-input");
    if (dateInput) {
      dateInput.addEventListener("change", (e) => {
        this.state.selectedDate = e.target.value;
        this.renderTableMatrix();
      });
    }

    const guestInput = document.getElementById("res-guests-input");
    if (guestInput) {
      guestInput.addEventListener("change", (e) => {
        this.state.selectedGuests = parseInt(e.target.value, 10) || 2;
        this.validateAreaPartySize();
        this.renderTableMatrix();
      });
    }

    const bookingForm = document.getElementById("eg-reservation-form");
    if (bookingForm) {
      bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleBookingSubmit();
      });
    }

    document.querySelectorAll("[data-tab-target]").forEach(tabBtn => {
      tabBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const targetTab = tabBtn.getAttribute("data-tab-target");
        this.switchTab(targetTab);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeConfirmationModal();
      }
    });
  },

  switchTab(tabId) {
    this.state.activeView = tabId;
    document.querySelectorAll("[data-tab-target]").forEach(btn => {
      const isTarget = btn.getAttribute("data-tab-target") === tabId;
      btn.classList.toggle("active", isTarget);
      btn.setAttribute("aria-selected", isTarget ? "true" : "false");
    });
    document.querySelectorAll(".reservation-tab-panel").forEach(panel => {
      panel.classList.toggle("active", panel.id === `tab-${tabId}`);
    });

    if (tabId === "manage") {
      this.renderMyReservations();
    }
  },

  setGuests(count) {
    const min = 1;
    const max = 12;
    const nextVal = Math.max(min, Math.min(max, parseInt(count, 10) || 2));
    this.state.selectedGuests = nextVal;
    
    const input = document.getElementById("res-guests-input");
    if (input) input.value = nextVal;

    document.querySelectorAll(".party-size-pill").forEach(pill => {
      pill.classList.toggle("active", parseInt(pill.dataset.count, 10) === nextVal);
    });

    this.validateAreaPartySize();
    this.renderTableMatrix();
  },

  selectArea(areaId) {
    this.state.selectedAreaId = areaId;
    this.state.selectedTableId = null;

    document.querySelectorAll(".seating-card").forEach(card => {
      card.classList.toggle("selected", card.dataset.areaId === areaId);
    });

    this.validateAreaPartySize();
    this.renderTableMatrix();
  },

  validateAreaPartySize() {
    const area = (window.EG_DATA?.SEATING_AREAS || []).find(a => a.id === this.state.selectedAreaId);
    if (!area) return;

    const warningEl = document.getElementById("area-capacity-warning");
    if (!warningEl) return;

    if (this.state.selectedGuests < area.minParty || this.state.selectedGuests > area.maxParty) {
      warningEl.textContent = `Note: ${area.name} comfortably accommodates ${area.capacity}. Please select an appropriate seating area for ${this.state.selectedGuests} guests.`;
      warningEl.style.display = "block";
    } else {
      warningEl.style.display = "none";
    }
  },

  renderSeatingAreas() {
    const container = document.getElementById("seating-areas-grid");
    if (!container) return;

    const areas = window.EG_DATA?.SEATING_AREAS || [];
    container.innerHTML = areas.map(area => {
      const isSelected = area.id === this.state.selectedAreaId;
      return `
        <div class="seating-card ${isSelected ? 'selected' : ''}" data-area-id="${area.id}" onclick="ReservationEngine.selectArea('${area.id}')" tabindex="0" role="button" aria-label="Select ${area.name}" onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); ReservationEngine.selectArea('${area.id}'); }">
          <div class="seating-card-img-wrap">
            <img src="${area.image}" alt="${area.name}" loading="lazy" class="seating-card-img" onerror="this.src='https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80'">
            <div class="seating-card-overlay"></div>
            ${area.depositRequired ? `<span class="seating-deposit-badge">$${area.depositAmount} Hold/Guest</span>` : ''}
          </div>
          <div class="seating-card-content">
            <div class="seating-card-header">
              <h4 class="seating-name">${area.name}</h4>
              <span class="seating-capacity">${area.capacity}</span>
            </div>
            <p class="seating-tagline">${area.tagline}</p>
            <p class="seating-desc">${area.description}</p>
            <div class="seating-ambiance">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
              </svg>
              <span>${area.ambiance}</span>
            </div>
          </div>
        </div>
      `;
    }).join("");
  },

  renderTimeSlots() {
    const containerLunch = document.getElementById("slots-lunch-container");
    const containerDinner = document.getElementById("slots-dinner-container");
    if (!containerLunch || !containerDinner) return;

    const lunchSlots = this.timeSlots.filter(s => s.period === "lunch");
    const dinnerSlots = this.timeSlots.filter(s => s.period === "dinner");

    const renderSlot = (slot) => {
      const isSelected = slot.time === this.state.selectedTime;
      return `
        <button type="button" class="time-slot-pill ${isSelected ? 'active' : ''}" data-time="${slot.time}" onclick="ReservationEngine.selectTime('${slot.time}')" aria-label="${slot.label}">
          ${slot.label}
        </button>
      `;
    };

    containerLunch.innerHTML = lunchSlots.map(renderSlot).join("");
    containerDinner.innerHTML = dinnerSlots.map(renderSlot).join("");
  },

  selectTime(time) {
    this.state.selectedTime = time;
    document.querySelectorAll(".time-slot-pill").forEach(pill => {
      pill.classList.toggle("active", pill.dataset.time === time);
    });
    this.renderTableMatrix();
  },

  renderTableMatrix() {
    const container = document.getElementById("table-matrix-grid");
    if (!container) return;

    const area = (window.EG_DATA?.SEATING_AREAS || []).find(a => a.id === this.state.selectedAreaId);
    if (!area) return;

    const reservations = window.EG_STORE ? window.EG_STORE.getReservations() : [];

    const bookedTableIds = reservations
      .filter(r => r.status !== "cancelled" && r.date === this.state.selectedDate && r.time === this.state.selectedTime && r.areaId === this.state.selectedAreaId)
      .map(r => r.tableId);

    container.innerHTML = area.tables.map(table => {
      const isBooked = bookedTableIds.includes(table.id);
      const isTooSmall = table.seats < this.state.selectedGuests;
      const isAvailable = !isBooked && !isTooSmall;
      const isSelected = table.id === this.state.selectedTableId;

      let statusBadge = "";
      if (isBooked) {
        statusBadge = `<span class="table-badge booked">Reserved</span>`;
      } else if (isTooSmall) {
        statusBadge = `<span class="table-badge max-cap">Max ${table.seats} Guests</span>`;
      } else {
        statusBadge = `<span class="table-badge available">Available</span>`;
      }

      return `
        <div 
          class="table-card ${isAvailable ? 'available' : 'unavailable'} ${isSelected ? 'selected' : ''}" 
          data-table-id="${table.id}"
          onclick="${isAvailable ? `ReservationEngine.selectTable('${table.id}')` : ''}"
          tabindex="${isAvailable ? '0' : '-1'}"
          role="button"
          aria-label="${table.name}, accommodates up to ${table.seats} guests. ${isAvailable ? 'Available' : 'Unavailable'}"
          onkeydown="${isAvailable ? `if(event.key==='Enter'||event.key===' '){event.preventDefault(); ReservationEngine.selectTable('${table.id}');}` : ''}"
        >
          <div class="table-card-top">
            <div class="table-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                <line x1="7" y1="19" x2="7" y2="22"></line>
                <line x1="17" y1="19" x2="17" y2="22"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
              </svg>
            </div>
            ${statusBadge}
          </div>
          <h5 class="table-title">${table.name}</h5>
          <div class="table-meta">
            <span>Capacity: Up to ${table.seats} guests</span>
            <span class="table-view">${table.view}</span>
          </div>
          ${isAvailable ? `
            <div class="table-select-action">
              ${isSelected ? '<span>Selected Table ✓</span>' : '<span>Click to Choose</span>'}
            </div>
          ` : ''}
        </div>
      `;
    }).join("");

    if (!this.state.selectedTableId || bookedTableIds.includes(this.state.selectedTableId)) {
      const firstAvail = area.tables.find(t => !bookedTableIds.includes(t.id) && t.seats >= this.state.selectedGuests);
      if (firstAvail) {
        this.state.selectedTableId = firstAvail.id;
        const card = container.querySelector(`[data-table-id='${firstAvail.id}']`);
        if (card) card.classList.add("selected");
      }
    }
  },

  selectTable(tableId) {
    this.state.selectedTableId = tableId;
    document.querySelectorAll(".table-card").forEach(c => {
      c.classList.toggle("selected", c.dataset.tableId === tableId);
    });
  },

  handleBookingSubmit() {
    const area = (window.EG_DATA?.SEATING_AREAS || []).find(a => a.id === this.state.selectedAreaId);
    const table = area ? area.tables.find(t => t.id === this.state.selectedTableId) : null;

    const name = document.getElementById("res-name")?.value?.trim();
    const email = document.getElementById("res-email")?.value?.trim();
    const phone = document.getElementById("res-phone")?.value?.trim();
    const notes = document.getElementById("res-notes")?.value?.trim() || "";
    const occasion = document.getElementById("res-occasion")?.value || "Dining";

    if (!name || !email || !phone) {
      if (window.EG_UI) window.EG_UI.toast("Please enter your name, email, and phone number.", "error");
      return;
    }

    if (!this.state.selectedDate || !this.state.selectedTime) {
      if (window.EG_UI) window.EG_UI.toast("Please select your dining date and time.", "error");
      return;
    }

    try {
      const reservationPayload = {
        date: this.state.selectedDate,
        time: this.state.selectedTime,
        guests: this.state.selectedGuests,
        areaId: this.state.selectedAreaId,
        areaName: area ? area.name : "Main Dining",
        tableId: table ? table.id : "T-AUTO",
        tableName: table ? table.name : "Host Assigned Table",
        occasion: occasion,
        guest: { name, email, phone, notes }
      };

      const saved = window.EG_STORE.saveReservation(reservationPayload);
      this.showConfirmationModal(saved);

      if (window.EG_UI) {
        window.EG_UI.toast(`Reservation ${saved.id} confirmed! Digital pass ready.`, "success");
      }

      document.getElementById("eg-reservation-form")?.reset();
    } catch (err) {
      if (window.EG_UI) {
        window.EG_UI.toast(err.message, "error");
      } else {
        alert(err.message);
      }
    }
  },

  showConfirmationModal(reservation) {
    this.lastFocusedElement = document.activeElement;
    let modal = document.getElementById("eg-reservation-confirm-modal");
    if (!modal) {
      const modalHtml = `
        <div id="eg-reservation-confirm-modal" class="confirm-modal-backdrop" aria-hidden="true">
          <div class="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="voucher-conf-title">
            <button class="confirm-modal-close" onclick="ReservationEngine.closeConfirmationModal()" aria-label="Close digital pass">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div id="confirm-modal-body" class="confirm-modal-body"></div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", modalHtml);
      modal = document.getElementById("eg-reservation-confirm-modal");
    }

    const modalBody = document.getElementById("confirm-modal-body");
    if (!modalBody) return;

    const formattedDate = new Date(reservation.date + "T" + (reservation.time.includes(":") ? reservation.time : reservation.time + ":00")).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    modalBody.innerHTML = `
      <div class="voucher-card">
        <div class="voucher-header">
          <div class="voucher-brand">
            <span class="voucher-eyebrow">Itinerary Confirmed</span>
            <h2 id="voucher-conf-title" class="voucher-title">Ember & Grain</h2>
            <p class="voucher-location">482 Hudson Street, West Village, NY</p>
          </div>
          <div class="voucher-id-pill">
            <span class="voucher-id-label">Passcode</span>
            <span class="voucher-id-val">${reservation.id}</span>
          </div>
        </div>

        <div class="voucher-divider">
          <div class="voucher-notch left"></div>
          <div class="voucher-line"></div>
          <div class="voucher-notch right"></div>
        </div>

        <div class="voucher-details-grid">
          <div class="voucher-detail-item">
            <span class="v-label">Primary Guest</span>
            <span class="v-val">${reservation.guest.name}</span>
          </div>
          <div class="voucher-detail-item">
            <span class="v-label">Party Size</span>
            <span class="v-val">${reservation.guests} Guests</span>
          </div>
          <div class="voucher-detail-item">
            <span class="v-label">Date & Time</span>
            <span class="v-val">${formattedDate} at ${reservation.time}</span>
          </div>
          <div class="voucher-detail-item">
            <span class="v-label">Seating Area</span>
            <span class="v-val">${reservation.areaName} (${reservation.tableName})</span>
          </div>
          <div class="voucher-detail-item">
            <span class="v-label">Occasion</span>
            <span class="v-val">${reservation.occasion || 'Dining'}</span>
          </div>
          <div class="voucher-detail-item">
            <span class="v-label">Concierge Line</span>
            <span class="v-val">+1 (212) 555-8930</span>
          </div>
        </div>

        ${reservation.guest.notes ? `
          <div class="voucher-notes">
            <span class="v-label">Special Requests / Dietary Notes:</span>
            <p class="v-notes-text">"${reservation.guest.notes}"</p>
          </div>
        ` : ''}

        <div class="voucher-barcode-wrap">
          <svg class="voucher-barcode" viewBox="0 0 280 36" preserveAspectRatio="none">
            <line x1="10" y1="4" x2="10" y2="32" stroke="currentColor" stroke-width="2"/>
            <line x1="16" y1="4" x2="16" y2="32" stroke="currentColor" stroke-width="3"/>
            <line x1="24" y1="4" x2="24" y2="32" stroke="currentColor" stroke-width="1"/>
            <line x1="30" y1="4" x2="30" y2="32" stroke="currentColor" stroke-width="4"/>
            <line x1="40" y1="4" x2="40" y2="32" stroke="currentColor" stroke-width="2"/>
            <line x1="46" y1="4" x2="46" y2="32" stroke="currentColor" stroke-width="1"/>
            <line x1="52" y1="4" x2="52" y2="32" stroke="currentColor" stroke-width="3"/>
            <line x1="60" y1="4" x2="60" y2="32" stroke="currentColor" stroke-width="5"/>
            <line x1="72" y1="4" x2="72" y2="32" stroke="currentColor" stroke-width="1"/>
            <line x1="78" y1="4" x2="78" y2="32" stroke="currentColor" stroke-width="3"/>
            <line x1="86" y1="4" x2="86" y2="32" stroke="currentColor" stroke-width="2"/>
            <line x1="94" y1="4" x2="94" y2="32" stroke="currentColor" stroke-width="4"/>
            <line x1="104" y1="4" x2="104" y2="32" stroke="currentColor" stroke-width="1"/>
            <line x1="110" y1="4" x2="110" y2="32" stroke="currentColor" stroke-width="3"/>
            <line x1="120" y1="4" x2="120" y2="32" stroke="currentColor" stroke-width="2"/>
            <line x1="130" y1="4" x2="130" y2="32" stroke="currentColor" stroke-width="4"/>
            <line x1="142" y1="4" x2="142" y2="32" stroke="currentColor" stroke-width="1"/>
            <line x1="150" y1="4" x2="150" y2="32" stroke="currentColor" stroke-width="3"/>
            <line x1="160" y1="4" x2="160" y2="32" stroke="currentColor" stroke-width="5"/>
            <line x1="174" y1="4" x2="174" y2="32" stroke="currentColor" stroke-width="2"/>
            <line x1="182" y1="4" x2="182" y2="32" stroke="currentColor" stroke-width="3"/>
            <line x1="192" y1="4" x2="192" y2="32" stroke="currentColor" stroke-width="1"/>
            <line x1="200" y1="4" x2="200" y2="32" stroke="currentColor" stroke-width="4"/>
            <line x1="212" y1="4" x2="212" y2="32" stroke="currentColor" stroke-width="2"/>
            <line x1="220" y1="4" x2="220" y2="32" stroke="currentColor" stroke-width="3"/>
            <line x1="230" y1="4" x2="230" y2="32" stroke="currentColor" stroke-width="1"/>
            <line x1="240" y1="4" x2="240" y2="32" stroke="currentColor" stroke-width="4"/>
            <line x1="252" y1="4" x2="252" y2="32" stroke="currentColor" stroke-width="2"/>
            <line x1="262" y1="4" x2="262" y2="32" stroke="currentColor" stroke-width="3"/>
            <line x1="270" y1="4" x2="270" y2="32" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span class="voucher-code-sub">${reservation.id} • PRESENT TO HEARTH HOST UPON ARRIVAL</span>
        </div>

        <div class="voucher-actions">
          <button type="button" class="btn btn-secondary btn-sm" onclick="ReservationEngine.downloadICal('${reservation.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Add to Calendar (.ics)</span>
          </button>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.print()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            <span>Print Pass</span>
          </button>
          <button type="button" class="btn btn-primary btn-sm" onclick="ReservationEngine.closeConfirmationModal()">
            <span>Done</span>
          </button>
        </div>
      </div>
    `;

    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";

    const closeBtn = modal.querySelector(".confirm-modal-close");
    if (closeBtn) closeBtn.focus();
  },

  closeConfirmationModal() {
    const modal = document.getElementById("eg-reservation-confirm-modal");
    if (modal) {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
      if (this.lastFocusedElement) {
        this.lastFocusedElement.focus();
        this.lastFocusedElement = null;
      }
    }
  },

  downloadICal(reservationId) {
    const reservation = window.EG_STORE ? window.EG_STORE.getReservationById(reservationId) : null;
    if (!reservation) return;

    const startDateTime = new Date(`${reservation.date}T${reservation.time.includes(":") ? reservation.time : reservation.time + ":00"}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);

    const formatICalDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, "");
    };

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Ember and Grain//Luxury Dining Pass//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${reservation.id}@emberandgrain.com`,
      `DTSTAMP:${formatICalDate(new Date())}`,
      `DTSTART:${formatICalDate(startDateTime)}`,
      `DTEND:${formatICalDate(endDateTime)}`,
      `SUMMARY:Dinner at Ember & Grain (${reservation.id})`,
      `DESCRIPTION:Table for ${reservation.guests} guests in ${reservation.areaName} (${reservation.tableName}). Concierge: +1 (212) 555-8930. 482 Hudson Street, West Village, NY.`,
      `LOCATION:482 Hudson Street, West Village, New York, NY 10014`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `EmberGrain_Reservation_${reservation.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  renderMyReservations() {
    const container = document.getElementById("my-reservations-list");
    if (!container) return;

    const reservations = window.EG_STORE ? window.EG_STORE.getReservations() : [];

    if (reservations.length === 0) {
      container.innerHTML = `
        <div class="res-empty-state">
          <div class="res-empty-icon">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <h4>No Active Reservations</h4>
          <p>You currently have no recorded itineraries on this browser.</p>
          <button type="button" class="btn btn-primary btn-sm" onclick="ReservationEngine.switchTab('book')">Book a Table</button>
        </div>
      `;
      return;
    }

    container.innerHTML = reservations.map(res => {
      const isCancelled = res.status === "cancelled";
      return `
        <div class="my-res-card ${isCancelled ? 'cancelled' : 'active'}">
          <div class="my-res-header">
            <div class="my-res-id-wrap">
              <span class="my-res-id">${res.id}</span>
              <span class="my-res-status-badge ${isCancelled ? 'cancelled' : 'confirmed'}">
                ${isCancelled ? 'Cancelled' : 'Confirmed'}
              </span>
            </div>
            <span class="my-res-created">Booked ${new Date(res.createdAt).toLocaleDateString()}</span>
          </div>

          <div class="my-res-body">
            <div class="my-res-info-grid">
              <div class="my-res-info-item">
                <span class="mr-label">Guest</span>
                <strong class="mr-val">${res.guest.name}</strong>
              </div>
              <div class="my-res-info-item">
                <span class="mr-label">Date & Time</span>
                <strong class="mr-val">${res.date} at ${res.time}</strong>
              </div>
              <div class="my-res-info-item">
                <span class="mr-label">Party</span>
                <strong class="mr-val">${res.guests} Guests</strong>
              </div>
              <div class="my-res-info-item">
                <span class="mr-label">Seating Area</span>
                <strong class="mr-val">${res.areaName}</strong>
              </div>
            </div>
            ${res.guest.notes ? `<div class="my-res-notes"><em>"${res.guest.notes}"</em></div>` : ''}
          </div>

          <div class="my-res-footer">
            ${!isCancelled ? `
              <button type="button" class="btn btn-secondary btn-xs" onclick="ReservationEngine.showConfirmationModal(window.EG_STORE.getReservationById('${res.id}'))">
                View Pass
              </button>
              <button type="button" class="btn btn-secondary btn-xs" onclick="ReservationEngine.openModifyModal('${res.id}')">
                Modify
              </button>
              <button type="button" class="btn-cancel-res" onclick="ReservationEngine.cancelBooking('${res.id}')">
                Cancel Reservation
              </button>
            ` : `
              <span class="text-dim" style="font-size: 0.76rem;">Reservation cancelled</span>
            `}
          </div>
        </div>
      `;
    }).join("");
  },

  cancelBooking(id) {
    if (confirm(`Are you sure you wish to cancel reservation ${id}?`)) {
      try {
        window.EG_STORE.cancelReservation(id);
        if (window.EG_UI) window.EG_UI.toast(`Reservation ${id} has been cancelled.`, "info");
      } catch (err) {
        if (window.EG_UI) window.EG_UI.toast(err.message, "error");
      }
    }
  },

  openModifyModal(id) {
    const res = window.EG_STORE.getReservationById(id);
    if (!res) return;

    const newTime = prompt(`Modify dining time for ${res.id} (Current: ${res.time}):`, res.time);
    if (newTime && newTime.trim()) {
      const newGuestsStr = prompt(`Modify party size (Current: ${res.guests}):`, res.guests);
      const newGuests = parseInt(newGuestsStr, 10) || res.guests;

      try {
        window.EG_STORE.modifyReservation(id, {
          time: newTime.trim(),
          guests: newGuests
        });
        if (window.EG_UI) window.EG_UI.toast(`Reservation ${id} updated to ${newTime} for ${newGuests} guests.`, "success");
      } catch (err) {
        if (window.EG_UI) window.EG_UI.toast(err.message, "error");
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("eg-reservation-form") || document.getElementById("my-reservations-list")) {
    ReservationEngine.init();
  }
});
