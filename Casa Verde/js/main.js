/* ==========================================================================
   Casa Verde — Main Page Renderer & Router
   Dynamic population of rooms, room details, dining, spa, experiences
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.includes('rooms.html')) {
    initRoomsPage();
  } else if (path.includes('room-detail.html')) {
    initRoomDetailPage();
  } else if (path.includes('dining.html')) {
    initDiningPage();
  } else if (path.includes('spa.html')) {
    initSpaPage();
  } else if (path.includes('experiences.html')) {
    initExperiencesPage();
  } else if (path.includes('booking.html')) {
    bookingEngine.initBookingWizard();
    bookingEngine.initManageBookingPortal();
  } else if (path.includes('contact.html')) {
    initContactPage();
  } else {
    initHomePage();
  }
});

// --- Homepage Logic ---
function initHomePage() {
  const roomContainer = document.getElementById('homeRoomPreviews');
  if (roomContainer) {
    const featured = HOTEL_DATA.rooms.slice(0, 3);
    let html = '';
    featured.forEach(room => {
      html += `
        <div class="room-card">
          <div class="room-card-image-wrap">
            <img src="${room.images[0]}" alt="${room.name}" class="room-card-image" loading="lazy">
            <span class="room-badge ${room.badge.includes('Classic') ? 'room-badge-accent' : ''}">${room.badge}</span>
          </div>
          <div class="room-card-body">
            <div class="room-card-header">
              <h3 class="room-card-title">${room.name}</h3>
              <div class="room-card-price">
                <span class="amount">${store.formatCurrency(room.basePrice)}</span>
                <span class="unit">nightly</span>
              </div>
            </div>
            <p class="room-card-desc">${room.tagline}</p>
            <div class="room-specs-list">
              <span class="room-spec-item"><i class="fa-solid fa-expand"></i> ${room.sizeSqFt} sq ft (${room.sizeSqM} m²)</span>
              <span class="room-spec-item"><i class="fa-solid fa-user-group"></i> Up to ${room.maxGuests} Guests</span>
              <span class="room-spec-item"><i class="fa-solid fa-bed"></i> ${room.beds}</span>
            </div>
            <div class="room-card-footer">
              <a href="room-detail.html?id=${room.id}" class="link-editorial">Explore Suite <i class="fa-solid fa-arrow-right"></i></a>
              <a href="booking.html?room=${room.id}" class="btn btn-primary btn-sm">Reserve</a>
            </div>
          </div>
        </div>
      `;
    });
    roomContainer.innerHTML = html;
  }
}

// --- Rooms Catalog Page ---
function initRoomsPage() {
  const container = document.getElementById('roomsListContainer');
  const viewFilter = document.getElementById('filterView');
  const guestsFilter = document.getElementById('filterGuests');
  const sortFilter = document.getElementById('filterSort');
  const countDisplay = document.getElementById('roomsCountDisplay');

  if (!container) return;

  const renderRooms = () => {
    let filtered = [...HOTEL_DATA.rooms];

    if (viewFilter && viewFilter.value !== 'all') {
      filtered = filtered.filter(r => r.view.toLowerCase().includes(viewFilter.value.toLowerCase()));
    }

    if (guestsFilter && guestsFilter.value !== 'all') {
      const minGuests = parseInt(guestsFilter.value, 10);
      filtered = filtered.filter(r => r.maxGuests >= minGuests);
    }

    if (sortFilter) {
      if (sortFilter.value === 'price-asc') {
        filtered.sort((a, b) => a.basePrice - b.basePrice);
      } else if (sortFilter.value === 'price-desc') {
        filtered.sort((a, b) => b.basePrice - a.basePrice);
      } else if (sortFilter.value === 'size') {
        filtered.sort((a, b) => b.sizeSqFt - a.sizeSqFt);
      }
    }

    if (countDisplay) {
      countDisplay.textContent = `Showing ${filtered.length} of ${HOTEL_DATA.rooms.length} Suites & Villas`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; background: #FFFFFF; border-radius: var(--radius-xs); border: 1px solid var(--color-border);">
          <h3 style="margin-bottom: 0.5rem;">No Suites Match Your Filters</h3>
          <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Try adjusting your view or guest count criteria.</p>
          <button class="btn btn-outline btn-sm" onclick="document.getElementById('filterView').value='all'; document.getElementById('filterGuests').value='all'; document.getElementById('filterView').dispatchEvent(new Event('change'));">Reset Filters</button>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(room => {
      html += `
        <div class="room-card-horizontal">
          <div class="room-card-image-wrap">
            <img src="${room.images[0]}" alt="${room.name}" class="room-card-image" loading="lazy">
            <span class="room-badge">${room.badge}</span>
          </div>
          <div class="room-card-body">
            <div style="margin-bottom: 0.4rem;">
              <span class="eyebrow" style="margin-bottom: 2px;">${room.category} &bull; ${room.view}</span>
              <h2 style="font-size: 1.85rem; margin-bottom: 0.4rem;">${room.name}</h2>
            </div>
            <p class="room-card-desc">${room.description}</p>
            
            <div class="room-specs-list">
              <span class="room-spec-item"><i class="fa-solid fa-expand"></i> ${room.sizeSqFt} sq ft (${room.sizeSqM} m²)</span>
              <span class="room-spec-item"><i class="fa-solid fa-user-group"></i> Up to ${room.maxGuests} Guests</span>
              <span class="room-spec-item"><i class="fa-solid fa-bed"></i> ${room.beds}</span>
              <span class="room-spec-item"><i class="fa-solid fa-water-ladder"></i> ${room.features[0]}</span>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 1.25rem; flex-wrap: wrap; gap: 1rem;">
              <div class="room-card-price" style="text-align: left;">
                <span class="amount">${store.formatCurrency(room.basePrice)}</span>
                <span class="unit">nightly rates from</span>
              </div>
              <div style="display: flex; gap: 0.75rem;">
                <a href="room-detail.html?id=${room.id}" class="btn btn-outline btn-sm">Explore Details</a>
                <a href="booking.html?room=${room.id}" class="btn btn-primary btn-sm">Reserve</a>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  };

  if (viewFilter) viewFilter.addEventListener('change', renderRooms);
  if (guestsFilter) guestsFilter.addEventListener('change', renderRooms);
  if (sortFilter) sortFilter.addEventListener('change', renderRooms);

  renderRooms();
}

// --- Room Detail Page ---
function initRoomDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('id') || 'casita-verde';
  const room = HOTEL_DATA.rooms.find(r => r.id === roomId) || HOTEL_DATA.rooms[0];

  document.title = `${room.name} — Casa Verde Luxury Resort`;

  document.querySelectorAll('.js-room-name').forEach(el => el.textContent = room.name);
  document.querySelectorAll('.js-room-category').forEach(el => el.textContent = room.category);

  const taglineEl = document.querySelector('.js-room-tagline');
  if (taglineEl) taglineEl.textContent = room.tagline;

  const descEl = document.querySelector('.js-room-desc');
  if (descEl) descEl.textContent = room.description;

  document.querySelectorAll('.js-room-price').forEach(el => el.textContent = store.formatCurrency(room.basePrice));

  const sqftEl = document.querySelector('.js-room-sqft');
  if (sqftEl) sqftEl.textContent = `${room.sizeSqFt} sq ft (${room.sizeSqM} m²)`;

  const guestsEl = document.querySelector('.js-room-guests');
  if (guestsEl) guestsEl.textContent = `Up to ${room.maxGuests} Guests`;

  const bedsEl = document.querySelector('.js-room-beds');
  if (bedsEl) bedsEl.textContent = room.beds;

  const viewEl = document.querySelector('.js-room-view');
  if (viewEl) viewEl.textContent = room.view;

  // Gallery
  const galleryGrid = document.getElementById('roomGalleryGrid');
  if (galleryGrid && room.images) {
    galleryGrid.innerHTML = `
      <div class="gallery-main" onclick="openLightbox(0)" role="button" tabindex="0" aria-label="Open photo 1 in lightbox" onkeydown="if(event.key==='Enter'||event.key===' ')openLightbox(0)">
        <img src="${room.images[0]}" alt="${room.name}">
      </div>
      <div class="gallery-thumb" onclick="openLightbox(1)" role="button" tabindex="0" aria-label="Open photo 2 in lightbox" onkeydown="if(event.key==='Enter'||event.key===' ')openLightbox(1)">
        <img src="${room.images[1] || room.images[0]}" alt="${room.name}">
      </div>
      <div class="gallery-thumb" onclick="openLightbox(2)" role="button" tabindex="0" aria-label="View full gallery" onkeydown="if(event.key==='Enter'||event.key===' ')openLightbox(2)">
        <img src="${room.images[2] || room.images[0]}" alt="${room.name}">
        <div class="gallery-more-overlay">
          <span><i class="fa-solid fa-camera"></i> View Gallery (${room.images.length})</span>
        </div>
      </div>
    `;
  }

  // Amenities
  const amenitiesList = document.getElementById('roomAmenitiesList');
  if (amenitiesList) {
    let aHtml = '';
    room.amenities.forEach(amenity => {
      aHtml += `
        <div class="amenity-pill">
          <i class="fa-solid fa-leaf"></i>
          <span>${amenity}</span>
        </div>
      `;
    });
    amenitiesList.innerHTML = aHtml;
  }

  // Features
  const featuresList = document.getElementById('roomFeaturesList');
  if (featuresList) {
    let fHtml = '';
    room.features.forEach(f => {
      fHtml += `
        <div class="amenity-pill" style="background: #FFFFFF;">
          <i class="fa-solid fa-gem" style="color: var(--color-accent);"></i>
          <span><strong>${f}</strong></span>
        </div>
      `;
    });
    featuresList.innerHTML = fHtml;
  }

  // Dynamic booking side widget sync
  const bookingSideForm = document.getElementById('roomDetailBookingForm');
  if (bookingSideForm) {
    const checkInInput = bookingSideForm.querySelector('[name="checkIn"]');
    const checkOutInput = bookingSideForm.querySelector('[name="checkOut"]');
    const guestsInput = bookingSideForm.querySelector('[name="guests"]');
    const sidePriceTotal = document.getElementById('sidePriceTotal');
    const sideNightsDisplay = document.getElementById('sideNightsDisplay');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const checkout = new Date(tomorrow);
    checkout.setDate(checkout.getDate() + 3);

    const todayStr = store.formatDateISO(new Date());
    if (checkInInput) {
      checkInInput.min = todayStr;
      checkInInput.value = store.formatDateISO(tomorrow);
    }
    if (checkOutInput) {
      checkOutInput.min = store.formatDateISO(tomorrow);
      checkOutInput.value = store.formatDateISO(checkout);
    }

    const updateSidePrice = () => {
      const start = checkInInput.value;
      const end = checkOutInput.value;
      const nights = store.calculateNights(start, end);

      if (sideNightsDisplay) {
        sideNightsDisplay.textContent = `${nights} ${nights === 1 ? 'Night' : 'Nights'}`;
      }

      if (sidePriceTotal && nights > 0) {
        let subtotal = 0;
        let curr = new Date(start);
        for (let i = 0; i < nights; i++) {
          let r = room.basePrice;
          const day = curr.getDay();
          if (day === 5 || day === 6) r *= HOTEL_DATA.weekendMultiplier;
          subtotal += r;
          curr.setDate(curr.getDate() + 1);
        }
        const total = subtotal + (HOTEL_DATA.resortFeePerNight * nights) + (subtotal * HOTEL_DATA.taxRate);
        sidePriceTotal.textContent = store.formatCurrency(total);
      }
    };

    if (checkInInput) {
      checkInInput.addEventListener('change', () => {
        const nextDay = new Date(checkInInput.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkOutInput.min = store.formatDateISO(nextDay);
        if (checkOutInput.value <= checkInInput.value) {
          checkOutInput.value = store.formatDateISO(nextDay);
        }
        updateSidePrice();
      });
    }

    if (checkOutInput) checkOutInput.addEventListener('change', updateSidePrice);
    if (guestsInput) guestsInput.addEventListener('change', updateSidePrice);

    updateSidePrice();

    bookingSideForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = `booking.html?room=${room.id}&checkIn=${checkInInput.value}&checkOut=${checkOutInput.value}&guests=${guestsInput.value}`;
      window.location.href = url;
    });
  }

  // Lightbox functionality with keyboard controls
  let activeImageIdx = 0;
  window.openLightbox = function(index = 0) {
    activeImageIdx = index;
    const lb = document.getElementById('galleryLightboxModal');
    const lbImg = document.getElementById('lightboxActiveImage');
    if (!lb || !lbImg) return;

    lbImg.src = room.images[activeImageIdx] || room.images[0];
    lb.classList.add('is-active');
  };

  window.navigateLightbox = function(direction) {
    if (!room.images || room.images.length === 0) return;
    activeImageIdx = (activeImageIdx + direction + room.images.length) % room.images.length;
    const lbImg = document.getElementById('lightboxActiveImage');
    if (lbImg) {
      lbImg.src = room.images[activeImageIdx];
    }
  };

  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('galleryLightboxModal');
    if (lb && lb.classList.contains('is-active')) {
      if (e.key === 'ArrowRight') window.navigateLightbox(1);
      if (e.key === 'ArrowLeft') window.navigateLightbox(-1);
    }
  });
}

// --- Dining Page ---
function initDiningPage() {
  const tabBtns = document.querySelectorAll('.menu-tab-btn');
  const menuCategories = document.querySelectorAll('.menu-category-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      menuCategories.forEach(c => c.style.display = 'none');

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const targetCategory = btn.getAttribute('data-target-category');
      const targetPanel = document.getElementById(`category-${targetCategory}`);
      if (targetPanel) {
        targetPanel.style.display = 'grid';
      }
    });
  });
}

// --- Spa Page ---
function initSpaPage() {}

// --- Experiences Page ---
function initExperiencesPage() {}

// --- Contact Page ---
function initContactPage() {
  const contactForm = document.getElementById('conciergeContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.showToast('Thank you. Our Head Concierge will be in touch within 2 hours.', 'success');
      contactForm.reset();
    });
  }

  // FAQ Accordion with keyboard handling
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const isOpen = item.classList.contains('is-open');

      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('is-open');
        const trig = i.querySelector('.accordion-trigger');
        if (trig) trig.setAttribute('aria-expanded', 'false');
        i.querySelector('.accordion-content').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}
