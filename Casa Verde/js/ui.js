/* ==========================================================================
   Casa Verde — UI & Interaction Scripts
   Sticky nav, mobile drawer, toasts, modals, keyboard navigation, and form handlers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileDrawer();
  initToastContainer();
  initQuickBookingBars();
  initTestimonialSlider();
  initModals();
  initNewsletterForm();
  initWeatherWidget();
  initGlobalKeyboard();
});

// --- Sticky Nav with Blur Effect ---
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// --- Mobile Drawer ---
function initMobileDrawer() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.querySelector('.drawer-close-btn');

  if (!drawer) return;

  const openDrawer = () => {
    drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
  };

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// --- Toast Notification System ---
function initToastContainer() {
  if (!document.getElementById('toastContainer')) {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }
}

window.showToast = function(message, type = 'success', title = null) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const defaultTitles = {
    success: 'Confirmed',
    error: 'Notice',
    warning: 'Attention',
    info: 'Information'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');

  const iconClass = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info');

  toast.innerHTML = `
    <i class="fa-solid ${iconClass}" style="margin-top: 2px;"></i>
    <div class="toast-content">
      <strong>${title || defaultTitles[type] || 'Notification'}</strong>
      <p>${message}</p>
    </div>
    <button class="toast-close" aria-label="Close alert" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
};

// --- Quick Booking Bar on Hero / Subpages ---
function initQuickBookingBars() {
  const bookingForms = document.querySelectorAll('.js-quick-booking-form');

  bookingForms.forEach(form => {
    const checkInInput = form.querySelector('[name="checkIn"]');
    const checkOutInput = form.querySelector('[name="checkOut"]');
    const guestsSelect = form.querySelector('[name="guests"]');
    const roomSelect = form.querySelector('[name="room"]');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const checkout = new Date(tomorrow);
    checkout.setDate(checkout.getDate() + 3);

    const todayStr = store.formatDateISO(new Date());
    const tomorrowStr = store.formatDateISO(tomorrow);
    const checkoutStr = store.formatDateISO(checkout);

    if (checkInInput) {
      checkInInput.min = todayStr;
      if (!checkInInput.value) checkInInput.value = tomorrowStr;
    }

    if (checkOutInput) {
      checkOutInput.min = checkInInput ? checkInInput.value : todayStr;
      if (!checkOutInput.value) checkOutInput.value = checkoutStr;
    }

    if (checkInInput && checkOutInput) {
      checkInInput.addEventListener('change', () => {
        const nextDay = new Date(checkInInput.value);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayStr = store.formatDateISO(nextDay);
        checkOutInput.min = nextDayStr;
        if (!checkOutInput.value || checkOutInput.value <= checkInInput.value) {
          checkOutInput.value = nextDayStr;
        }
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const checkIn = checkInInput ? checkInInput.value : tomorrowStr;
      const checkOut = checkOutInput ? checkOutInput.value : checkoutStr;
      const guests = guestsSelect ? guestsSelect.value : '2';
      const room = roomSelect ? roomSelect.value : '';

      store.saveSearchState({ checkIn, checkOut, guests: parseInt(guests, 10), roomId: room });

      let targetUrl = `booking.html?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&guests=${encodeURIComponent(guests)}`;
      if (room) {
        targetUrl += `&room=${encodeURIComponent(room)}`;
      }
      window.location.href = targetUrl;
    });
  });
}

// --- Testimonials Slider ---
function initTestimonialSlider() {
  const container = document.getElementById('testimonialsSlider');
  if (!container) return;

  const testimonials = HOTEL_DATA.testimonials;
  let currentIndex = 0;

  const renderSlide = (index) => {
    const item = testimonials[index];
    container.innerHTML = `
      <div class="quote-mark">“</div>
      <div class="testimonial-quote">${item.quote}</div>
      <div class="testimonial-author">
        <img src="${item.avatar}" alt="${item.author}" class="testimonial-author-avatar" loading="lazy">
        <div>
          <div class="testimonial-author-name">${item.author}</div>
          <div class="testimonial-author-title">${item.title}</div>
        </div>
      </div>
    `;

    document.querySelectorAll('.carousel-dot').forEach((dot, dIdx) => {
      dot.classList.toggle('active', dIdx === index);
      dot.setAttribute('aria-selected', dIdx === index ? 'true' : 'false');
    });
  };

  renderSlide(0);

  const timer = setInterval(() => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    renderSlide(currentIndex);
  }, 7500);

  document.querySelectorAll('.carousel-dot').forEach((dot, dIdx) => {
    dot.addEventListener('click', () => {
      currentIndex = dIdx;
      renderSlide(currentIndex);
    });
  });
}

// --- Modal Utilities & Form Bindings ---
function initModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('.modal-close-btn')) {
        modal.classList.remove('is-active');
      }
    });
  });

  const tableForm = document.getElementById('tableReservationModalForm');
  if (tableForm) {
    tableForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(tableForm);
      const res = store.saveTableReservation({
        restaurant: formData.get('restaurant') || 'Terra',
        date: formData.get('date'),
        time: formData.get('time'),
        guests: formData.get('guests'),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        requests: formData.get('requests')
      });

      const modal = document.getElementById('tableReservationModal');
      if (modal) modal.classList.remove('is-active');
      tableForm.reset();
      window.showToast(`Table confirmed at ${res.restaurant} for ${res.guests} guests! Reference: ${res.id}`, 'success');
    });
  }

  const spaForm = document.getElementById('spaBookingModalForm');
  if (spaForm) {
    spaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(spaForm);
      const res = store.saveSpaBooking({
        ritual: formData.get('ritual') || 'Forest Flora Aromatherapy',
        date: formData.get('date'),
        time: formData.get('time'),
        guests: formData.get('guests'),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone')
      });

      const modal = document.getElementById('spaBookingModal');
      if (modal) modal.classList.remove('is-active');
      spaForm.reset();
      window.showToast(`Sanctuary Spa ritual scheduled! Reference: ${res.id}`, 'success');
    });
  }
}

// Global modal triggers
window.openTableModal = function(restaurantName = 'Terra') {
  const modal = document.getElementById('tableReservationModal');
  if (!modal) return;
  const select = modal.querySelector('select[name="restaurant"]');
  if (select && restaurantName) select.value = restaurantName;
  modal.classList.add('is-active');
};

window.openSpaModal = function(ritualName = 'Forest Flora Aromatherapy Massage') {
  const modal = document.getElementById('spaBookingModal');
  if (!modal) return;
  const select = modal.querySelector('select[name="ritual"]');
  if (select && ritualName) select.value = ritualName;
  modal.classList.add('is-active');
};

// Global Policy Modal Trigger
window.openPolicyModal = function(type) {
  let modal = document.getElementById('globalPolicyModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'globalPolicyModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title" id="policyModalTitle">Policy Details</h3>
          <button class="modal-close-btn" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body" id="policyModalBody" style="font-size: 0.88rem; line-height: 1.7; color: var(--text-secondary);">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary btn-sm modal-close-btn">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('.modal-close-btn')) {
        modal.classList.remove('is-active');
      }
    });
  }

  const titleEl = document.getElementById('policyModalTitle');
  const bodyEl = document.getElementById('policyModalBody');

  if (type === 'privacy') {
    titleEl.textContent = 'Privacy & Guest Data Policy';
    bodyEl.innerHTML = `
      <p><strong>Casa Verde Eco-Sanctuary</strong> respects your absolute privacy. All reservation information, passport data, and payment details are encrypted using enterprise-grade tokenization.</p>
      <p>We will never sell, lease, or distribute your private contact details. Guest data is stored securely to personalize your butler service, dietary preferences, and concierge arrangements during your stay.</p>
      <p>For inquiries regarding data erasure or modification, please contact our Data Governance Officer at <code>privacy@casaverde-resort.com</code>.</p>
    `;
  } else if (type === 'terms') {
    titleEl.textContent = 'Terms of Folio & Sanctuary Guidelines';
    bodyEl.innerHTML = `
      <p><strong>Check-In & Check-Out:</strong> Standard check-in is 3:00 PM; check-out is 11:00 AM. Guaranteed early check-in or late 3:00 PM check-out can be requested during booking.</p>
      <p><strong>72-Hour Cancellation:</strong> Modifications or cancellations received 72 hours prior to 3:00 PM local arrival time incur no fee. Late cancellations are subject to a 1-night room charge.</p>
      <p><strong>Serenity & Environmental Code:</strong> To maintain acoustic peace and wildlife harmony, drone flights over residences are prohibited without prior authorization.</p>
    `;
  } else if (type === 'sustainability') {
    titleEl.textContent = '2026 Environmental & Community Report';
    bodyEl.innerHTML = `
      <p><strong>100% Renewable Energy:</strong> Casa Verde generates all electricity through our on-site solar array and micro-hydro generation on the Rio Claro.</p>
      <p><strong>850-Acre Biodiversity Reserve:</strong> 92% of our land remains untouched virgin rainforest providing a protected biological corridor for scarlet macaws, howler monkeys, and jaguars.</p>
      <p><strong>Zero Single-Use Plastic:</strong> Filtered mountain spring water is bottled on-site in reusable glass decanters. 100% of organic kitchen waste is composted for our biodynamic farm.</p>
    `;
  }

  modal.classList.add('is-active');
};

// --- Keyboard Navigation (Escape closes modals) ---
function initGlobalKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.is-active').forEach(m => m.classList.remove('is-active'));
      const drawer = document.getElementById('mobileDrawer');
      if (drawer && drawer.classList.contains('is-open')) {
        drawer.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    }
  });
}

// --- Newsletter Subscription ---
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(f => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = f.querySelector('input[type="email"]');
      if (input && input.value) {
        window.showToast(`Thank you! You have been enrolled in the Casa Verde Private Circle.`, 'success');
        input.value = '';
      }
    });
  });
}

// --- Live Weather & Tides Simulator ---
function initWeatherWidget() {
  const widget = document.getElementById('resortWeatherWidget');
  if (!widget) return;

  widget.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; font-size: 0.85rem;">
      <div style="display: flex; align-items: center; gap: 0.65rem;">
        <i class="fa-solid fa-sun" style="color: var(--color-accent); font-size: 1.5rem;"></i>
        <div>
          <strong style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--color-primary); display: block; line-height: 1;">84°F / 29°C</strong>
          <span style="font-size: 0.72rem; color: var(--text-muted);">Costa Verde Coastal Weather</span>
        </div>
      </div>
      <div style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.5;">
        <div><i class="fa-solid fa-wind" style="color: var(--color-accent);"></i> 6 mph Pacific Breeze</div>
        <div><i class="fa-solid fa-water" style="color: var(--color-accent);"></i> High Tide: 2:45 PM &bull; Water: 81°F</div>
      </div>
    </div>
  `;
}
