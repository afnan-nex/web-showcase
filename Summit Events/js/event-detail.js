/**
 * SUMMIT EVENTS — EVENT DETAIL PAGE JAVASCRIPT
 * Dynamic rendering based on ?id= query param, countdown timer, sticky booking widget, lineup modals, schedule accordion, FAQs, related events.
 */

document.addEventListener("DOMContentLoaded", () => {
  SummitEventDetail.init();
});

const SummitEventDetail = {
  event: null,

  init() {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id") || "evt-101";

    this.event = SummitStorage.getEventById(eventId);

    if (!this.event) {
      this.renderNotFound();
      return;
    }

    this.renderHero();
    this.renderStickyBookingWidget();
    this.renderOverview();
    this.renderLineup();
    this.renderSchedule();
    this.renderVenueSection();
    this.renderOrganizerSection();
    this.renderFAQs();
    this.renderRelatedEvents();
    this.bindDetailActions();

    // Start live countdown
    SummitUI.startCountdown(this.event.date, "detail-countdown-widget");
  },

  renderNotFound() {
    const container = document.getElementById("event-detail-root");
    if (!container) return;

    container.innerHTML = `
      <div class="container" style="padding: 6rem 1.5rem; text-align: center;">
        <h2>Event Not Found</h2>
        <p style="margin: 1rem 0 2rem; color: var(--text-secondary);">The requested event could not be located or may have ended.</p>
        <a href="events.html" class="btn btn-primary">Browse All Upcoming Events &rarr;</a>
      </div>
    `;
  },

  renderHero() {
    const e = this.event;
    const heroBanner = document.getElementById("detail-hero-banner");
    if (!heroBanner) return;

    heroBanner.style.backgroundImage = `url('${e.heroImage}')`;

    const isFav = SummitStorage.isFavorite(e.id);

    const contentEl = document.getElementById("detail-hero-content");
    if (contentEl) {
      contentEl.innerHTML = `
        <div class="detail-hero-top-row">
          <div class="detail-badge-group" style="display:flex; gap:0.5rem; align-items:center;">
            <span class="badge badge-featured">${e.categoryLabel || e.category}</span>
            ${e.badge ? `<span class="badge">${e.badge}</span>` : ''}
            ${e.isSeated ? `<span class="badge badge-seat">Reserved Seating Available</span>` : ''}
          </div>
          <div class="detail-hero-actions" style="display:flex; gap:0.75rem;">
            <button type="button" class="btn-icon detail-share-btn" id="btn-share-event" aria-label="Share Event">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            </button>
            <button type="button" class="btn-icon detail-favorite-btn ${isFav ? 'favorited' : ''}" id="btn-fav-detail" aria-label="Save Event">
              <svg class="icon" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>
        </div>

        <h1 class="detail-title">${e.title}</h1>
        <p class="detail-tagline">${e.tagline || ''}</p>

        <div class="detail-meta-pill-bar">
          <div class="detail-meta-pill">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>${e.dateDisplay}</span>
          </div>
          <div class="detail-meta-pill">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>${e.timeDisplay}</span>
          </div>
          <div class="detail-meta-pill">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>${e.venueName}, ${e.city}</span>
          </div>
          <div class="detail-meta-pill">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>${e.ageRestriction || 'All Ages'}</span>
          </div>
        </div>
      `;
    }
  },

  renderStickyBookingWidget() {
    const e = this.event;
    const widget = document.getElementById("detail-booking-widget");
    if (!widget) return;

    const tiers = e.ticketTiers || [];
    const minTier = tiers[0] || { price: e.minPrice || 50, name: "General Admission" };

    widget.innerHTML = `
      <div class="booking-widget-price-header">
        <div>
          <span class="widget-starting-at">Official Tickets From</span>
          <div class="widget-price-range">${e.priceRange || `$${e.minPrice}`}</div>
        </div>
        <div class="event-stock-indicator">
          <span class="badge badge-live">Verified Available</span>
        </div>
      </div>

      <div class="booking-countdown-wrap" style="margin-bottom: 1.5rem; background: var(--bg-surface-raised); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color-subtle);">
        <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.5rem;">Event Starts In</div>
        <div id="detail-countdown-widget" style="display:flex; align-items:center; gap:0.5rem;"></div>
      </div>

      <div class="ticket-tier-preview-list" style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem;">
        ${tiers.map(t => `
          <div class="ticket-tier-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem; background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-sm);">
            <div>
              <strong style="font-size:0.9rem; display:block;">${t.name}</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">${t.available} remaining</span>
            </div>
            <span style="font-family:var(--font-display); font-weight:700; color:var(--text-primary);">${SummitUI.formatCurrency(t.price)}</span>
          </div>
        `).join('')}
      </div>

      <button type="button" class="btn btn-primary btn-block btn-lg" id="btn-detail-checkout-trigger">
        Select Tickets & Seats &rarr;
      </button>

      <ul class="booking-perks-list">
        <li>
          <svg class="check-green" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Instant Mobile Pass with Deterministic QR Code
        </li>
        <li>
          <svg class="check-green" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg>
          100% Buyer Guarantee & Easy Self-Service Transfer
        </li>
        <li>
          <svg class="check-green" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg>
          Official Direct Organizer Inventory
        </li>
      </ul>

      <div class="detail-cal-row" style="text-align:center; padding-top:1rem; border-top:1px solid var(--border-color-subtle);">
        <button type="button" class="btn btn-ghost btn-sm" id="btn-add-cal-detail">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          Add to Apple / Google Calendar (.ics)
        </button>
      </div>
    `;

    document.getElementById("btn-detail-checkout-trigger").addEventListener("click", () => {
      SummitCheckout.startCheckout(this.event);
    });

    document.getElementById("btn-add-cal-detail").addEventListener("click", () => {
      SummitUI.downloadCalendarEvent(this.event);
    });
  },

  renderOverview() {
    const e = this.event;
    const overviewEl = document.getElementById("detail-overview-body");
    if (!overviewEl) return;

    overviewEl.innerHTML = `
      <p class="detail-body-text">${e.description}</p>
      ${e.highlights && e.highlights.length > 0 ? `
        <h4 style="font-size:1.15rem; margin-top:2rem; margin-bottom:1rem;">Event Highlights</h4>
        <div class="highlights-bullet-grid">
          ${e.highlights.map(h => `
            <div class="highlight-box">
              <svg class="icon highlight-bullet-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span>${h}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;
  },

  renderLineup() {
    const e = this.event;
    const lineupEl = document.getElementById("detail-lineup-grid");
    if (!lineupEl) return;

    if (!e.lineup || e.lineup.length === 0) {
      lineupEl.parentElement.style.display = "none";
      return;
    }

    lineupEl.innerHTML = e.lineup.map(artist => `
      <div class="lineup-card">
        <img src="${artist.image}" alt="${artist.name}" class="lineup-avatar" />
        <h4 class="lineup-name">${artist.name}</h4>
        <div class="lineup-role">${artist.role}</div>
        <p class="lineup-bio">${artist.bio || ''}</p>
      </div>
    `).join("");
  },

  renderSchedule() {
    const e = this.event;
    const schedEl = document.getElementById("detail-schedule-timeline");
    if (!schedEl) return;

    if (!e.schedule || e.schedule.length === 0) {
      schedEl.parentElement.style.display = "none";
      return;
    }

    schedEl.innerHTML = e.schedule.map(day => `
      <div class="schedule-day-card">
        <div class="schedule-day-header">${day.day}</div>
        <div class="schedule-slots-list">
          ${day.items.map(slot => `
            <div class="schedule-slot">
              <div class="slot-time">${slot.time}</div>
              <div class="slot-info">
                <div class="slot-title">${slot.title}</div>
                <div class="slot-stage">📍 ${slot.stage}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join("");
  },

  renderVenueSection() {
    const e = this.event;
    const venue = SummitStorage.getVenueById(e.venueId) || {
      name: e.venueName,
      address: e.address,
      city: e.city,
      transit: "Public transit available nearby",
      parking: "Parking available on site",
      amenities: ["ADA Accessible", "Full Facilities"]
    };

    const venueEl = document.getElementById("detail-venue-info");
    if (!venueEl) return;

    venueEl.innerHTML = `
      <div class="detail-venue-card" style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-xl); overflow:hidden;">
        ${venue.image ? `<img src="${venue.image}" alt="${venue.name}" style="width:100%; height:260px; object-fit:cover;" />` : ''}
        <div style="padding:2rem;">
          <h3 style="font-size:1.5rem; margin-bottom:0.5rem;">${venue.name}</h3>
          <p style="color:var(--text-secondary); margin-bottom:1.5rem;">📍 ${venue.address || e.address}</p>
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
            <div>
              <strong style="font-size:0.85rem; text-transform:uppercase; color:var(--text-muted); display:block; margin-bottom:0.25rem;">Transit & Arrival</strong>
              <p style="font-size:0.9rem; color:var(--text-secondary);">${venue.transit || 'Conveniently accessible via metro and rail'}</p>
            </div>
            <div>
              <strong style="font-size:0.85rem; text-transform:uppercase; color:var(--text-muted); display:block; margin-bottom:0.25rem;">Parking & Garage</strong>
              <p style="font-size:0.9rem; color:var(--text-secondary);">${venue.parking || 'On-site multi-level parking garage'}</p>
            </div>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
            ${(venue.amenities || []).map(a => `<span class="amenity-pill">${a}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  },

  renderOrganizerSection() {
    const e = this.event;
    const org = SummitStorage.getOrganizerById(e.organizerId) || {
      name: e.organizerName || "Summit Collective",
      handle: "@summitcollective",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      bio: "Official verified event producer on Summit Events.",
      rating: 4.95,
      eventsCount: 48,
      followersCount: "124K"
    };

    const orgEl = document.getElementById("detail-organizer-info");
    if (!orgEl) return;

    orgEl.innerHTML = `
      <div class="organizer-spotlight-box" style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1.5rem; display:flex; align-items:center; gap:1.5rem;">
        <img src="${org.avatar}" alt="${org.name}" style="width:72px; height:72px; border-radius:var(--radius-full); object-fit:cover;" />
        <div style="flex:1;">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <h4 style="font-size:1.2rem; font-weight:700;">${org.name}</h4>
            <span class="badge badge-featured">Verified Host</span>
          </div>
          <p style="font-size:0.85rem; color:var(--text-muted); margin:0.25rem 0 0.5rem;">${org.handle} • ★ ${org.rating} Host Rating (${org.eventsCount} Events)</p>
          <p style="font-size:0.9rem; color:var(--text-secondary);">${org.bio}</p>
        </div>
        <a href="organizers.html" class="btn btn-outline btn-sm">Host Profile &rarr;</a>
      </div>
    `;
  },

  renderFAQs() {
    const e = this.event;
    const faqEl = document.getElementById("detail-faqs-accordion");
    if (!faqEl) return;

    const faqs = e.faqs && e.faqs.length > 0 ? e.faqs : [
      { q: "What is the refund and transfer policy?", a: "Tickets can be transferred free of charge anytime prior to the event start directly from your Summit account. Full refunds are available up to 14 days before the event." },
      { q: "How do I access my tickets on the day of the event?", a: "Your digital ticket pass contains a dynamic QR code that can be scanned directly from your mobile screen or printed on paper." },
      { q: "Is re-entry allowed?", a: "Re-entry is permitted for all full-pass and VIP wristband holders upon scanning at entry gates." }
    ];

    faqEl.innerHTML = faqs.map((f, i) => `
      <div class="faq-item ${i === 0 ? 'active' : ''}">
        <button type="button" class="faq-trigger">
          <span>${f.q}</span>
          <span class="faq-arrow">&darr;</span>
        </button>
        <div class="faq-answer">
          ${f.a}
        </div>
      </div>
    `).join("");

    faqEl.querySelectorAll(".faq-trigger").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = btn.parentElement;
        item.classList.toggle("active");
      });
    });
  },

  renderRelatedEvents() {
    const e = this.event;
    const relEl = document.getElementById("detail-related-grid");
    if (!relEl) return;

    const allEvents = SummitStorage.getEvents();
    const related = allEvents
      .filter(ev => ev.id !== e.id && (ev.category === e.category || ev.city === e.city))
      .slice(0, 3);

    relEl.innerHTML = related.map(r => createEventCardHTML(r)).join("");
    bindEventCardActions(relEl);
  },

  bindDetailActions() {
    // Favorite Button
    const favBtn = document.getElementById("btn-fav-detail");
    if (favBtn) {
      favBtn.addEventListener("click", () => {
        const isNowFav = SummitStorage.toggleFavorite(this.event.id);
        favBtn.classList.toggle("favorited", isNowFav);
        const svg = favBtn.querySelector("svg");
        if (svg) svg.setAttribute("fill", isNowFav ? "currentColor" : "none");
        SummitUI.showToast(isNowFav ? "Saved to your favorites ❤️" : "Removed from favorites", "info");
      });
    }

    // Share Button
    const shareBtn = document.getElementById("btn-share-event");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        SummitUI.shareEvent(this.event);
      });
    }
  }
};
