/* ==========================================================================
   Casa Verde — Booking Engine & Dynamic Pricing Calculator
   Multi-step booking wizard, availability enforcement, price breakdown,
   management portal, and confirmation voucher generator.
   ========================================================================== */

class CasaVerdeBookingEngine {
  constructor() {
    this.currentStep = 1;
    this.bookingState = {
      checkIn: '',
      checkOut: '',
      nights: 0,
      guests: 2,
      roomId: null,
      selectedRoom: null,
      addOns: [],
      guestInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: '',
        specialRequests: '',
        arrivalTime: '15:00'
      },
      pricing: {
        baseRate: 0,
        roomSubtotal: 0,
        weekendSurge: 0,
        seasonalSurge: 0,
        taxes: 0,
        resortFees: 0,
        addOnsTotal: 0,
        grandTotal: 0
      }
    };
  }

  initBookingWizard() {
    const wizardEl = document.getElementById('bookingWizardContainer');
    if (!wizardEl) return;

    this.loadInitialDates();
    this.bindEvents();
    this.renderStep(1);
  }

  loadInitialDates() {
    const searchState = store.getSearchState();
    
    // Check URL parameters if coming from a room detail or home page
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    const checkInParam = urlParams.get('checkIn');
    const checkOutParam = urlParams.get('checkOut');
    const guestsParam = urlParams.get('guests');

    const checkIn = checkInParam || searchState.checkIn;
    const checkOut = checkOutParam || searchState.checkOut;
    const guests = guestsParam ? parseInt(guestsParam, 10) : (searchState.guests || 2);
    const roomId = roomParam || searchState.roomId || HOTEL_DATA.rooms[0].id;

    this.bookingState.checkIn = checkIn;
    this.bookingState.checkOut = checkOut;
    this.bookingState.guests = guests;
    this.bookingState.roomId = roomId;
    this.bookingState.selectedRoom = HOTEL_DATA.rooms.find(r => r.id === roomId) || HOTEL_DATA.rooms[0];
    this.bookingState.nights = store.calculateNights(checkIn, checkOut);

    // Sync input fields
    const checkInInput = document.getElementById('wizardCheckIn');
    const checkOutInput = document.getElementById('wizardCheckOut');
    const guestsSelect = document.getElementById('wizardGuests');

    const todayStr = store.formatDateISO(new Date());

    if (checkInInput) {
      checkInInput.min = todayStr;
      checkInInput.value = this.bookingState.checkIn;
    }
    if (checkOutInput) {
      checkOutInput.min = this.bookingState.checkIn || todayStr;
      checkOutInput.value = this.bookingState.checkOut;
    }
    if (guestsSelect) {
      guestsSelect.value = this.bookingState.guests;
    }

    this.calculateDynamicPricing();
    this.updateNightsBadge();

    // If user arrived with specific room parameter, jump straight to step 2
    if (roomParam) {
      this.goToStep(2);
    }
  }

  bindEvents() {
    // Step navigation buttons
    document.querySelectorAll('[data-wizard-goto]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetStep = parseInt(btn.getAttribute('data-wizard-goto'), 10);
        if (targetStep > this.currentStep) {
          if (this.validateCurrentStep()) {
            this.goToStep(targetStep);
          }
        } else {
          this.goToStep(targetStep);
        }
      });
    });

    // Date inputs change handlers
    const checkInInput = document.getElementById('wizardCheckIn');
    const checkOutInput = document.getElementById('wizardCheckOut');
    const guestsSelect = document.getElementById('wizardGuests');

    if (checkInInput) {
      checkInInput.addEventListener('change', () => {
        this.bookingState.checkIn = checkInInput.value;
        const checkInDate = new Date(checkInInput.value);
        const minCheckout = new Date(checkInDate);
        minCheckout.setDate(minCheckout.getDate() + 1);
        const minCheckoutStr = store.formatDateISO(minCheckout);

        if (checkOutInput) {
          checkOutInput.min = minCheckoutStr;
          if (!checkOutInput.value || checkOutInput.value <= checkInInput.value) {
            checkOutInput.value = minCheckoutStr;
            this.bookingState.checkOut = minCheckoutStr;
          }
        }

        this.bookingState.nights = store.calculateNights(this.bookingState.checkIn, this.bookingState.checkOut);
        this.updateNightsBadge();
        this.calculateDynamicPricing();
        this.renderRoomSelectionList();
      });
    }

    if (checkOutInput) {
      checkOutInput.addEventListener('change', () => {
        this.bookingState.checkOut = checkOutInput.value;
        this.bookingState.nights = store.calculateNights(this.bookingState.checkIn, this.bookingState.checkOut);
        this.updateNightsBadge();
        this.calculateDynamicPricing();
        this.renderRoomSelectionList();
      });
    }

    if (guestsSelect) {
      guestsSelect.addEventListener('change', () => {
        this.bookingState.guests = parseInt(guestsSelect.value, 10);
        this.calculateDynamicPricing();
        this.renderRoomSelectionList();
      });
    }

    // Step 3 Guest Form input binding
    const guestForm = document.getElementById('wizardGuestForm');
    if (guestForm) {
      guestForm.addEventListener('input', (e) => {
        const { name, value } = e.target;
        if (name && this.bookingState.guestInfo.hasOwnProperty(name)) {
          this.bookingState.guestInfo[name] = value;
        }
      });
    }

    // Step 5 Credit card formatting helper
    const cardInput = document.getElementById('simCardNumber');
    if (cardInput) {
      cardInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').substring(0, 16);
        v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = v;
      });
    }

    const expiryInput = document.getElementById('simExpiry');
    if (expiryInput) {
      expiryInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (v.length >= 2) {
          v = v.substring(0, 2) + '/' + v.substring(2);
        }
        e.target.value = v;
      });
    }

    // Step 5 Payment Form Submission
    const paymentForm = document.getElementById('wizardPaymentForm');
    if (paymentForm) {
      paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.processPaymentAndConfirm();
      });
    }
  }

  updateNightsBadge() {
    const nights = this.bookingState.nights;
    document.querySelectorAll('.js-nights-count').forEach(el => {
      el.textContent = `${nights} ${nights === 1 ? 'Night' : 'Nights'}`;
    });
  }

  // --- Dynamic Pricing Engine ---
  calculateDynamicPricing() {
    const { checkIn, checkOut, nights, guests, selectedRoom, addOns } = this.bookingState;
    if (!selectedRoom || nights <= 0) {
      return this.bookingState.pricing;
    }

    const baseRate = selectedRoom.basePrice;
    let roomSubtotal = 0;
    let weekendSurge = 0;
    let seasonalSurge = 0;

    let currDate = new Date(checkIn);
    for (let i = 0; i < nights; i++) {
      let dayRate = baseRate;
      const dayOfWeek = currDate.getDay();
      const month = currDate.getMonth();

      // Peak season: Dec (11), Jan (0), Feb (1), Mar (2), Apr (3)
      if ([11, 0, 1, 2, 3].includes(month)) {
        const seasonInc = baseRate * (HOTEL_DATA.highSeasonMultiplier - 1);
        seasonalSurge += seasonInc;
        dayRate += seasonInc;
      }

      // Weekend surge: Fri (5) & Sat (6)
      if (dayOfWeek === 5 || dayOfWeek === 6) {
        const weekendInc = baseRate * (HOTEL_DATA.weekendMultiplier - 1);
        weekendSurge += weekendInc;
        dayRate += weekendInc;
      }

      roomSubtotal += dayRate;
      currDate.setDate(currDate.getDate() + 1);
    }

    // Add-ons
    let addOnsTotal = 0;
    addOns.forEach(addonId => {
      const addon = HOTEL_DATA.addOns.find(a => a.id === addonId);
      if (addon) {
        if (addon.priceType === 'per_guest_per_night') {
          addOnsTotal += addon.price * guests * nights;
        } else {
          addOnsTotal += addon.price;
        }
      }
    });

    // Taxes & Fees
    const resortFees = HOTEL_DATA.resortFeePerNight * nights;
    const taxableAmount = roomSubtotal + addOnsTotal;
    const taxes = taxableAmount * HOTEL_DATA.taxRate;
    const grandTotal = roomSubtotal + addOnsTotal + taxes + resortFees;

    this.bookingState.pricing = {
      baseRate,
      roomSubtotal,
      weekendSurge,
      seasonalSurge,
      resortFees,
      taxes,
      addOnsTotal,
      grandTotal
    };

    this.renderPricingSummary();
    return this.bookingState.pricing;
  }

  renderPricingSummary() {
    const { nights, guests, selectedRoom, pricing, addOns } = this.bookingState;
    const containers = document.querySelectorAll('.js-pricing-summary-container');
    if (!containers.length || !selectedRoom) return;

    const html = `
      <div class="pricing-summary-card">
        <h3 class="pricing-summary-title">Folio Summary</h3>
        <div style="margin-bottom: 1.25rem;">
          <h4 style="font-size: 1.15rem; color: var(--color-primary);">${selectedRoom.name}</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted);">${nights} ${nights === 1 ? 'Night' : 'Nights'} &bull; ${guests} ${guests === 1 ? 'Guest' : 'Guests'}</p>
        </div>

        <div class="pricing-row">
          <span>Base Nightly Rate (${nights} &times; ${store.formatCurrency(pricing.baseRate)})</span>
          <span>${store.formatCurrency(pricing.baseRate * nights)}</span>
        </div>

        ${pricing.weekendSurge > 0 ? `
          <div class="pricing-row">
            <span>Weekend Stay Adjustment <span class="pricing-badge">+15%</span></span>
            <span>+${store.formatCurrency(pricing.weekendSurge)}</span>
          </div>
        ` : ''}

        ${pricing.seasonalSurge > 0 ? `
          <div class="pricing-row">
            <span>High Season Rate Adjustment <span class="pricing-badge">Peak</span></span>
            <span>+${store.formatCurrency(pricing.seasonalSurge)}</span>
          </div>
        ` : ''}

        <div class="pricing-row">
          <span>Conservation & Wellness Fee ($50/nt)</span>
          <span>${store.formatCurrency(pricing.resortFees)}</span>
        </div>

        ${addOns.length > 0 ? `
          <div class="pricing-row" style="color: var(--color-primary);">
            <span>Selected Experiences (${addOns.length})</span>
            <span>+${store.formatCurrency(pricing.addOnsTotal)}</span>
          </div>
        ` : ''}

        <div class="pricing-row">
          <span>Luxury Hospitality Tax (12%)</span>
          <span>${store.formatCurrency(pricing.taxes)}</span>
        </div>

        <div class="pricing-row total-row">
          <span>Total Estimated Folio</span>
          <span class="total-amount">${store.formatCurrency(pricing.grandTotal)}</span>
        </div>

        <p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 1rem; text-align: center;">
          Includes daily artisanal breakfast, sommelier welcome bar, and dedicated butler care.
        </p>
      </div>
    `;

    containers.forEach(c => c.innerHTML = html);
  }

  // --- Wizard Step Transitions ---
  validateCurrentStep() {
    const { checkIn, checkOut, nights, selectedRoom } = this.bookingState;

    if (this.currentStep === 1) {
      if (!checkIn || !checkOut || nights < 1) {
        if (window.showToast) showToast('Please select valid check-in and check-out dates (minimum 1 night)', 'error');
        return false;
      }
      return true;
    }

    if (this.currentStep === 2) {
      if (!selectedRoom) {
        if (window.showToast) showToast('Please select a suite to proceed', 'error');
        return false;
      }
      const isFree = store.isRoomAvailable(selectedRoom.id, checkIn, checkOut);
      if (!isFree) {
        if (window.showToast) showToast(`Sorry, ${selectedRoom.name} is reserved for these dates. Please choose another suite.`, 'error');
        return false;
      }
      return true;
    }

    if (this.currentStep === 3) {
      const form = document.getElementById('wizardGuestForm');
      if (form && !form.checkValidity()) {
        form.reportValidity();
        return false;
      }
      return true;
    }

    return true;
  }

  goToStep(stepNum) {
    this.currentStep = stepNum;
    this.renderStep(stepNum);

    const wizardTop = document.getElementById('bookingWizardContainer');
    if (wizardTop) {
      const yOffset = -90;
      const y = wizardTop.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  renderStep(stepNum) {
    document.querySelectorAll('.step-indicator').forEach(indicator => {
      const step = parseInt(indicator.getAttribute('data-step'), 10);
      indicator.classList.remove('active', 'completed');
      if (step === stepNum) {
        indicator.classList.add('active');
      } else if (step < stepNum) {
        indicator.classList.add('completed');
      }
    });

    document.querySelectorAll('.step-pane').forEach(pane => {
      pane.classList.remove('is-active');
    });

    const activePane = document.getElementById(`stepPane${stepNum}`);
    if (activePane) {
      activePane.classList.add('is-active');
    }

    if (stepNum === 2) {
      this.renderRoomSelectionList();
    } else if (stepNum === 4) {
      this.renderAddOnsSelection();
    } else if (stepNum === 5) {
      this.renderPaymentSummary();
    }
  }

  // --- Step 2: Room Selection List with Live Availability ---
  renderRoomSelectionList() {
    const listContainer = document.getElementById('wizardRoomList');
    if (!listContainer) return;

    const { checkIn, checkOut, guests, selectedRoom } = this.bookingState;

    let html = '';
    HOTEL_DATA.rooms.forEach(room => {
      const isAvailable = store.isRoomAvailable(room.id, checkIn, checkOut);
      const isCapacityOk = room.maxGuests >= guests;
      const isSelected = selectedRoom && selectedRoom.id === room.id;
      const canSelect = isAvailable && isCapacityOk;

      html += `
        <div class="room-select-card ${isSelected ? 'is-selected' : ''} ${!canSelect ? 'is-unavailable' : ''}" 
             data-room-id="${room.id}"
             onclick="bookingEngine.selectRoom('${room.id}')"
             role="button"
             tabindex="0"
             onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();bookingEngine.selectRoom('${room.id}');}">
          <img src="${room.images[0]}" alt="${room.name}" class="room-select-img" loading="lazy">
          
          <div class="room-select-info">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
              <span class="eyebrow" style="margin: 0; font-size: 0.62rem;">${room.category}</span>
              ${!isAvailable ? '<span class="pricing-badge" style="background: #FDEDEC; color: #C0392B;">Booked on Selected Dates</span>' : ''}
              ${!isCapacityOk ? `<span class="pricing-badge" style="background: #FEF9E7; color: #B7950B;">Capacity: ${room.maxGuests} Guests</span>` : ''}
            </div>
            <h3 style="font-size: 1.25rem; margin-bottom: 0.35rem;">${room.name}</h3>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.4rem;">${room.tagline}</p>
            <div style="display: flex; gap: 0.85rem; font-size: 0.72rem; color: var(--text-muted); flex-wrap: wrap;">
              <span><i class="fa-solid fa-expand" style="color: var(--color-accent);"></i> ${room.sizeSqFt} sq ft (${room.sizeSqM} m²)</span>
              <span><i class="fa-solid fa-user-group" style="color: var(--color-accent);"></i> Up to ${room.maxGuests} Guests</span>
              <span><i class="fa-solid fa-eye" style="color: var(--color-accent);"></i> ${room.view}</span>
            </div>
          </div>

          <div style="text-align: right; min-width: 130px;">
            <div style="font-family: var(--font-serif); font-size: 1.35rem; font-weight: 600; color: var(--color-primary);">
              ${store.formatCurrency(room.basePrice)}
            </div>
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 0.65rem;">nightly</div>
            <button type="button" class="btn ${isSelected ? 'btn-primary' : 'btn-outline'} btn-sm btn-block" ${!canSelect ? 'disabled' : ''}>
              ${isSelected ? 'Selected' : 'Select'}
            </button>
          </div>
        </div>
      `;
    });

    listContainer.innerHTML = html;
  }

  selectRoom(roomId) {
    const room = HOTEL_DATA.rooms.find(r => r.id === roomId);
    if (!room) return;

    const { checkIn, checkOut, guests } = this.bookingState;
    const isAvailable = store.isRoomAvailable(roomId, checkIn, checkOut);
    const isCapacityOk = room.maxGuests >= guests;

    if (!isAvailable) {
      if (window.showToast) showToast('This suite has existing reservations for these dates. Please choose alternative dates or an available suite.', 'warning');
      return;
    }
    if (!isCapacityOk) {
      if (window.showToast) showToast(`This suite accommodates up to ${room.maxGuests} guests.`, 'warning');
      return;
    }

    this.bookingState.roomId = roomId;
    this.bookingState.selectedRoom = room;
    this.calculateDynamicPricing();
    this.renderRoomSelectionList();
  }

  // --- Step 4: Add-Ons Selection ---
  renderAddOnsSelection() {
    const container = document.getElementById('wizardAddOnsList');
    if (!container) return;

    const { addOns } = this.bookingState;

    let html = '';
    HOTEL_DATA.addOns.forEach(addon => {
      const isSelected = addOns.includes(addon.id);
      const priceFormatted = addon.priceType === 'per_guest_per_night' 
        ? `${store.formatCurrency(addon.price)} / guest / night`
        : `${store.formatCurrency(addon.price)} flat`;

      html += `
        <div class="addon-card ${isSelected ? 'is-selected' : ''}" 
             onclick="bookingEngine.toggleAddon('${addon.id}')"
             role="checkbox"
             aria-checked="${isSelected}"
             tabindex="0"
             onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();bookingEngine.toggleAddon('${addon.id}');}">
          <div class="addon-info">
            <div class="addon-icon">
              <i class="fa-solid ${addon.icon}"></i>
            </div>
            <div class="addon-text">
              <h4>${addon.name}</h4>
              <p>${addon.desc}</p>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div class="addon-price">${priceFormatted}</div>
            <div class="custom-checkbox">
              <input type="checkbox" ${isSelected ? 'checked' : ''} tabindex="-1" aria-hidden="true">
              <span class="checkmark"></span>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  toggleAddon(addonId) {
    const index = this.bookingState.addOns.indexOf(addonId);
    if (index > -1) {
      this.bookingState.addOns.splice(index, 1);
    } else {
      this.bookingState.addOns.push(addonId);
    }
    this.calculateDynamicPricing();
    this.renderAddOnsSelection();
  }

  // --- Step 5: Payment Summary ---
  renderPaymentSummary() {
    const summaryBox = document.getElementById('paymentReviewBox');
    if (!summaryBox) return;

    const { selectedRoom, checkIn, checkOut, nights, guests, guestInfo, addOns } = this.bookingState;

    summaryBox.innerHTML = `
      <div style="background: var(--color-sand-light); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: 1.5rem; margin-bottom: 1.75rem;">
        <h4 style="font-size: 1.1rem; margin-bottom: 0.85rem; color: var(--color-primary);">Stay & Itinerary Verification</h4>
        <div class="grid-2" style="font-size: 0.85rem; gap: 0.75rem;">
          <div>
            <p><strong>Suite:</strong> ${selectedRoom.name}</p>
            <p><strong>Check-in:</strong> ${checkIn} (from 3:00 PM)</p>
            <p><strong>Check-out:</strong> ${checkOut} (until 11:00 AM)</p>
            <p><strong>Duration:</strong> ${nights} Nights &bull; ${guests} Guests</p>
          </div>
          <div>
            <p><strong>Lead Guest:</strong> ${guestInfo.firstName} ${guestInfo.lastName}</p>
            <p><strong>Email:</strong> ${guestInfo.email}</p>
            <p><strong>Phone:</strong> ${guestInfo.phone}</p>
            <p><strong>Curated Add-ons:</strong> ${addOns.length} Selected</p>
          </div>
        </div>
      </div>
    `;
  }

  // --- Process Payment & Generate Official Hotel Confirmation Voucher ---
  processPaymentAndConfirm() {
    const payBtn = document.getElementById('paySubmitBtn');
    if (payBtn) {
      payBtn.disabled = true;
      payBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Securing Reservation...';
    }

    setTimeout(() => {
      const { checkIn, checkOut, nights, guests, selectedRoom, guestInfo, pricing, addOns } = this.bookingState;

      const newReservation = {
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        checkIn,
        checkOut,
        nights,
        guests,
        guestName: `${guestInfo.firstName} ${guestInfo.lastName}`.trim(),
        guestEmail: guestInfo.email,
        guestPhone: guestInfo.phone,
        guestCountry: guestInfo.country,
        specialRequests: guestInfo.specialRequests,
        arrivalTime: guestInfo.arrivalTime,
        addOns: [...addOns],
        subtotal: pricing.roomSubtotal,
        weekendSurge: pricing.weekendSurge,
        seasonalSurge: pricing.seasonalSurge,
        tax: pricing.taxes,
        resortFee: pricing.resortFees,
        addOnsTotal: pricing.addOnsTotal,
        grandTotal: pricing.grandTotal,
        status: 'Confirmed'
      };

      const savedBooking = store.saveBooking(newReservation);

      if (window.showToast) {
        showToast(`Reservation confirmed! Ref: ${savedBooking.reservationId}`, 'success');
      }

      this.renderConfirmationVoucher(savedBooking);
      this.goToStep(6);

      if (payBtn) {
        payBtn.disabled = false;
        payBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Authorize & Confirm Reservation';
      }
    }, 1000);
  }

  // --- Step 6: Hotel-Style Confirmation Screen & Voucher ---
  renderConfirmationVoucher(booking) {
    const voucherContainer = document.getElementById('confirmationVoucherContainer');
    if (!voucherContainer) return;

    let addOnsHtml = '';
    if (booking.addOns && booking.addOns.length > 0) {
      booking.addOns.forEach(addonId => {
        const a = HOTEL_DATA.addOns.find(item => item.id === addonId);
        if (a) {
          addOnsHtml += `<tr><td>&bull; ${a.name}</td><td class="text-right">Included</td></tr>`;
        }
      });
    }

    const html = `
      <div class="voucher-container" id="printableVoucher">
        <div class="voucher-header">
          <div class="voucher-brand">
            <h2>CASA VERDE</h2>
            <p>Eco-Sanctuary & Ocean Villas &bull; Costa Verde</p>
          </div>
          <div class="voucher-ref-badge">
            <span class="ref-label">Official Folio Number</span>
            <span class="ref-number">${booking.reservationId}</span>
            <br>
            <span class="voucher-status-tag"><i class="fa-solid fa-circle-check"></i> ${booking.status}</span>
          </div>
        </div>

        <div class="voucher-grid">
          <div>
            <h4 class="voucher-section-title">Primary Guest</h4>
            <p style="font-size: 0.9rem; margin-bottom: 0.25rem;"><strong>${booking.guestName}</strong></p>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Email: ${booking.guestEmail}</p>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Phone: ${booking.guestPhone}</p>
            ${booking.specialRequests ? `<p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;"><em>Special Notes: "${booking.specialRequests}"</em></p>` : ''}
          </div>
          <div>
            <h4 class="voucher-section-title">Stay Itinerary</h4>
            <p style="font-size: 0.85rem; margin-bottom: 0.25rem;"><strong>Suite:</strong> ${booking.roomName}</p>
            <p style="font-size: 0.85rem; margin-bottom: 0.25rem;"><strong>Check-In:</strong> ${booking.checkIn} (from 3:00 PM)</p>
            <p style="font-size: 0.85rem; margin-bottom: 0.25rem;"><strong>Check-Out:</strong> ${booking.checkOut} (until 11:00 AM)</p>
            <p style="font-size: 0.85rem; color: var(--text-secondary);"><strong>Duration:</strong> ${booking.nights} Nights &bull; ${booking.guests} Guests</p>
          </div>
        </div>

        <h4 class="voucher-section-title">Itemized Folio Breakdown</h4>
        <table class="voucher-data-table">
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-right">Amount (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${booking.roomName} (${booking.nights} nights lodging)</td>
              <td class="text-right">${store.formatCurrency(booking.subtotal)}</td>
            </tr>
            ${booking.addOnsTotal > 0 ? `
              <tr>
                <td>Curated Experiences & Services</td>
                <td class="text-right">${store.formatCurrency(booking.addOnsTotal)}</td>
              </tr>
              ${addOnsHtml}
            ` : ''}
            <tr>
              <td>Resort Conservation & Wellness Fee ($50/night)</td>
              <td class="text-right">${store.formatCurrency(booking.resortFee || 0)}</td>
            </tr>
            <tr>
              <td>Luxury Hospitality Occupancy Tax (12%)</td>
              <td class="text-right">${store.formatCurrency(booking.tax || 0)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="grand-total">
              <td>Total Grand Folio</td>
              <td class="text-right">${store.formatCurrency(booking.grandTotal)}</td>
            </tr>
          </tfoot>
        </table>

        <div class="voucher-footer-policies">
          <p><strong>Check-in Policy:</strong> Dedicated butler reception and welcome champagne upon arrival. Early check-in is subject to availability.</p>
          <p><strong>Cancellation:</strong> Complimentary cancellation or date modification up to 72 hours prior to 3:00 PM local arrival time.</p>
          <p><strong>Concierge Contact:</strong> concierge@casaverde-resort.com &bull; +1 (800) 555-VERDE &bull; WhatsApp: +506 8888-VERDE</p>
        </div>

        <div class="voucher-qr-wrap">
          <div>
            <p style="font-size: 0.8rem; font-weight: 600; color: var(--color-primary); margin-bottom: 2px;">Digital Concierge Fast Check-in</p>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0;">Scan this QR code upon arrival at the private arrivals pavilion.</p>
          </div>
          <div class="qr-code-box">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M0,0 h30 v30 h-30 z M6,6 v18 h18 v-18 z M10,10 h10 v10 h-10 z" />
              <path d="M70,0 h30 v30 h-30 z M76,6 v18 h18 v-18 z M80,10 h10 v10 h-10 z" />
              <path d="M0,70 h30 v30 h-30 z M6,76 v18 h18 v-18 z M10,80 h10 v10 h-10 z" />
              <path d="M40,10 h10 v10 h-10 z M55,10 h10 v20 h-10 z M40,35 h20 v10 h-20 z M70,40 h10 v10 h-10 z M85,40 h15 v15 h-15 z M40,60 h10 v10 h-10 z M55,55 h10 v30 h-10 z M70,70 h15 v10 h-15 z M85,75 h15 v25 h-15 z M40,80 h10 v20 h-10 z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="voucher-action-bar">
        <button type="button" class="btn btn-primary" onclick="window.print()">
          <i class="fa-solid fa-print"></i> Print Confirmation
        </button>
        <button type="button" class="btn btn-accent" onclick="bookingEngine.downloadConfirmationHtml('${booking.reservationId}')">
          <i class="fa-solid fa-download"></i> Download Voucher (HTML)
        </button>
        <a href="index.html" class="btn btn-outline">
          <i class="fa-solid fa-house"></i> Return to Homepage
        </a>
      </div>
    `;

    voucherContainer.innerHTML = html;
  }

  // --- Download Confirmation as HTML ---
  downloadConfirmationHtml(reservationId) {
    const printable = document.getElementById('printableVoucher');
    if (!printable) return;

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Casa Verde — Reservation Confirmation ${reservationId}</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Plus Jakarta Sans', sans-serif; background: #fbf9f5; padding: 40px; color: #1c2321; }
          .voucher-container { max-width: 800px; margin: 0 auto; background: #fff; padding: 40px; border: 1px solid #e3ddd1; }
          h2 { font-family: 'Playfair Display', serif; font-size: 28px; color: #182b24; margin: 0 0 4px; }
          .voucher-header { display: flex; justify-content: space-between; border-bottom: 2px solid #182b24; padding-bottom: 20px; margin-bottom: 30px; }
          .voucher-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
          .voucher-section-title { text-transform: uppercase; font-size: 13px; letter-spacing: 2px; color: #c5a059; border-bottom: 1px solid #efebe3; padding-bottom: 6px; margin-bottom: 10px; }
          .voucher-data-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .voucher-data-table th, .voucher-data-table td { padding: 10px 0; border-bottom: 1px solid #e3ddd1; text-align: left; }
          .voucher-data-table td.text-right, .voucher-data-table th.text-right { text-align: right; }
          .grand-total td { font-size: 20px; font-weight: bold; border-top: 2px solid #182b24; color: #182b24; }
          .voucher-footer-policies { background: #faf8f4; padding: 20px; font-size: 12px; line-height: 1.6; border-radius: 4px; }
        </style>
      </head>
      <body>
        ${printable.outerHTML}
      </body>
      </html>
    `;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CasaVerde-Reservation-${reservationId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (window.showToast) {
      showToast('Confirmation voucher downloaded successfully!', 'success');
    }
  }

  // --- Reservation Management (Lookup, Modify, Cancel) ---
  initManageBookingPortal() {
    const lookupForm = document.getElementById('manageLookupForm');
    if (!lookupForm) return;

    lookupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const refInput = document.getElementById('lookupReservationId');
      const emailInput = document.getElementById('lookupGuestEmail');
      const resultArea = document.getElementById('manageResultArea');

      if (!refInput || !emailInput || !resultArea) return;

      const ref = refInput.value.trim();
      const email = emailInput.value.trim().toLowerCase();

      const booking = store.getBookingById(ref);

      if (!booking || booking.guestEmail.toLowerCase() !== email) {
        resultArea.innerHTML = `
          <div style="background: #FDF1F1; border: 1px solid #F5C6CB; padding: 1.5rem; border-radius: 4px; color: #721C24;">
            <h4 style="margin-bottom: 0.35rem;">Reservation Not Found</h4>
            <p style="font-size: 0.85rem; margin: 0;">We could not locate an active reservation matching reference <strong>${ref}</strong> and email <strong>${email}</strong>. Please check your confirmation details.</p>
          </div>
        `;
        return;
      }

      this.renderManageBookingDetails(booking, resultArea);
    });
  }

  renderManageBookingDetails(booking, container) {
    const isCancelled = booking.status === 'Cancelled';

    container.innerHTML = `
      <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: 2.25rem; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border-light); padding-bottom: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <span class="eyebrow" style="margin-bottom: 2px;">Reservation Folio</span>
            <h3 style="font-size: 1.5rem; color: var(--color-primary);">${booking.reservationId}</h3>
          </div>
          <span class="voucher-status-tag" style="background: ${isCancelled ? '#FDF1F1' : 'var(--color-success-bg)'}; color: ${isCancelled ? '#B83A3A' : 'var(--color-success)'}">
            ${booking.status}
          </span>
        </div>

        <div class="grid-2" style="margin-bottom: 1.75rem; font-size: 0.88rem; gap: 1rem;">
          <div>
            <p><strong>Primary Guest:</strong> ${booking.guestName}</p>
            <p><strong>Email:</strong> ${booking.guestEmail}</p>
            <p><strong>Phone:</strong> ${booking.guestPhone}</p>
            <p><strong>Suite:</strong> ${booking.roomName}</p>
          </div>
          <div>
            <p><strong>Check-In:</strong> ${booking.checkIn}</p>
            <p><strong>Check-Out:</strong> ${booking.checkOut}</p>
            <p><strong>Nights / Guests:</strong> ${booking.nights} Nights &bull; ${booking.guests} Guests</p>
            <p><strong>Total Folio:</strong> <strong>${store.formatCurrency(booking.grandTotal)}</strong></p>
          </div>
        </div>

        ${!isCancelled ? `
          <div style="display: flex; gap: 0.85rem; flex-wrap: wrap; border-top: 1px solid var(--color-border-light); padding-top: 1.25rem;">
            <button type="button" class="btn btn-primary btn-sm" onclick="bookingEngine.openModifyModal('${booking.reservationId}')">
              <i class="fa-solid fa-pen-to-square"></i> Modify Dates / Guests
            </button>
            <button type="button" class="btn btn-outline btn-sm" style="color: var(--color-error); border-color: var(--color-error);" onclick="bookingEngine.handleCancelReservation('${booking.reservationId}')">
              <i class="fa-solid fa-ban"></i> Cancel Reservation
            </button>
            <button type="button" class="btn btn-accent btn-sm" onclick="bookingEngine.downloadConfirmationHtml('${booking.reservationId}')">
              <i class="fa-solid fa-download"></i> Download Folio
            </button>
          </div>
        ` : `
          <div style="background: #FDF1F1; padding: 1rem; border-radius: 4px; font-size: 0.85rem; color: #721C24;">
            This reservation was cancelled. Dates have been released back to our inventory.
          </div>
        `}
      </div>
    `;
  }

  handleCancelReservation(reservationId) {
    if (confirm(`Are you sure you want to cancel reservation ${reservationId}? This action cannot be undone.`)) {
      const success = store.cancelBooking(reservationId);
      if (success) {
        if (window.showToast) showToast(`Reservation ${reservationId} has been successfully cancelled.`, 'success');
        const booking = store.getBookingById(reservationId);
        const resultArea = document.getElementById('manageResultArea');
        if (booking && resultArea) {
          this.renderManageBookingDetails(booking, resultArea);
        }
      }
    }
  }

  openModifyModal(reservationId) {
    const booking = store.getBookingById(reservationId);
    if (!booking) return;

    const modalOverlay = document.getElementById('modifyModalOverlay');
    if (!modalOverlay) return;

    document.getElementById('modifyResIdDisplay').textContent = booking.reservationId;
    document.getElementById('modifyCheckIn').value = booking.checkIn;
    document.getElementById('modifyCheckOut').value = booking.checkOut;
    document.getElementById('modifyGuests').value = booking.guests;
    document.getElementById('modifyHiddenResId').value = booking.reservationId;

    modalOverlay.classList.add('is-active');
  }
}

// Global Booking Engine instance
const bookingEngine = new CasaVerdeBookingEngine();
