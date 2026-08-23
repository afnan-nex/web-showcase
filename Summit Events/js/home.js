/**
 * SUMMIT EVENTS — HOMEPAGE JAVASCRIPT
 * Hero countdown, quick search dispatcher, categories, featured spotlights, venues, organizers, newsletter.
 */

document.addEventListener("DOMContentLoaded", () => {
  initHeroSpotlight();
  initQuickSearchBar();
  renderCategoriesGrid();
  renderFeaturedEvents();
  renderUpcomingEvents();
  renderVenuesSpotlight();
  renderTopOrganizers();
  initNewsletterForm();
});

// ----------------- HERO SPOTLIGHT -----------------
function initHeroSpotlight() {
  const events = SummitStorage.getEvents();
  const headlineEvent = events.find(e => e.id === "evt-101") || events[0];
  if (!headlineEvent) return;

  // Start live countdown timer
  SummitUI.startCountdown(headlineEvent.date, "hero-countdown-box");

  // Hero Quick Book button
  const heroBookBtn = document.getElementById("hero-book-btn");
  if (heroBookBtn) {
    heroBookBtn.addEventListener("click", () => {
      SummitCheckout.startCheckout(headlineEvent);
    });
  }

  // Hero Detail Link
  const heroDetailLink = document.getElementById("hero-detail-link");
  if (heroDetailLink) {
    heroDetailLink.href = `event-detail.html?id=${headlineEvent.id}`;
  }
}

// ----------------- QUICK SEARCH BAR -----------------
function initQuickSearchBar() {
  const form = document.getElementById("home-quick-search-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = (document.getElementById("quick-search-keyword").value || "").trim();
    const category = document.getElementById("quick-search-category").value;
    const location = document.getElementById("quick-search-location").value;
    const datePreset = document.getElementById("quick-search-date").value;

    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (category && category !== "all") params.set("category", category);
    if (location && location !== "all") params.set("location", location);
    if (datePreset && datePreset !== "all") params.set("date", datePreset);

    window.location.href = `events.html?${params.toString()}`;
  });
}

// ----------------- CATEGORIES GRID -----------------
function renderCategoriesGrid() {
  const container = document.getElementById("home-categories-grid");
  if (!container) return;

  const categories = SEED_CATEGORIES.filter(c => c.id !== "all");

  container.innerHTML = categories.map(cat => {
    let iconSvg = "";
    if (cat.id === "concerts") {
      iconSvg = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`;
    } else if (cat.id === "conferences") {
      iconSvg = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`;
    } else if (cat.id === "workshops") {
      iconSvg = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`;
    } else if (cat.id === "sports") {
      iconSvg = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`;
    } else {
      iconSvg = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`;
    }

    return `
      <a href="events.html?category=${cat.id}" class="category-card">
        <div class="category-icon-box">${iconSvg}</div>
        <h3 class="category-card-name">${cat.name}</h3>
        <p class="category-card-desc">${cat.desc}</p>
        <span class="category-card-count">Explore Events &rarr;</span>
      </a>
    `;
  }).join("");
}

// ----------------- FEATURED EVENTS -----------------
function renderFeaturedEvents() {
  const container = document.getElementById("home-featured-grid");
  if (!container) return;

  const events = SummitStorage.getEvents();
  const featured = events.filter(e => e.featured).slice(0, 3);

  container.innerHTML = featured.map(e => createEventCardHTML(e)).join("");
  bindEventCardActions(container);
}

// ----------------- UPCOMING EVENTS FEED -----------------
function renderUpcomingEvents() {
  const container = document.getElementById("home-upcoming-grid");
  if (!container) return;

  const events = SummitStorage.getEvents();
  // Sort by date upcoming
  const upcoming = [...events].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 6);

  container.innerHTML = upcoming.map(e => createEventCardHTML(e)).join("");
  bindEventCardActions(container);
}

// ----------------- VENUES SPOTLIGHT -----------------
function renderVenuesSpotlight() {
  const container = document.getElementById("home-venues-grid");
  if (!container) return;

  const venues = SummitStorage.getVenues().slice(0, 3);

  container.innerHTML = venues.map(v => `
    <div class="venue-card">
      <div class="venue-card-media">
        <img src="${v.image}" alt="${v.name}" class="venue-card-img" />
        <span class="venue-card-type-badge">${v.type}</span>
      </div>
      <div class="venue-card-body">
        <h3 class="venue-card-title">${v.name}</h3>
        <div class="venue-card-location">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          ${v.city}, ${v.country}
        </div>
        <div class="venue-amenities-pills">
          ${v.amenities.slice(0, 3).map(a => `<span class="amenity-pill">${a}</span>`).join('')}
        </div>
        <div class="venue-card-footer">
          <span class="text-sm text-muted">Capacity: <strong>${v.capacity}</strong></span>
          <a href="venues.html" class="btn btn-outline btn-sm">View Venue &rarr;</a>
        </div>
      </div>
    </div>
  `).join("");
}

// ----------------- ORGANIZERS SPOTLIGHT -----------------
function renderTopOrganizers() {
  const container = document.getElementById("home-organizers-grid");
  if (!container) return;

  const organizers = SummitStorage.getOrganizers().slice(0, 3);

  container.innerHTML = organizers.map(o => `
    <div class="organizer-card">
      <div class="organizer-cover">
        <img src="${o.cover}" alt="${o.name}" />
      </div>
      <div class="organizer-profile-wrap">
        <img src="${o.avatar}" alt="${o.name}" class="organizer-avatar-img" />
        <div class="organizer-name-row">
          <h3 class="organizer-name">${o.name}</h3>
          ${o.verified ? '<svg class="verified-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>' : ''}
        </div>
        <div class="organizer-handle">${o.handle} • ${o.category}</div>
        <p class="organizer-bio">${o.bio}</p>
        <div class="organizer-stats-row">
          <div class="org-stat">
            <span class="org-stat-val">${o.eventsCount}</span>
            <span class="org-stat-lbl">Events</span>
          </div>
          <div class="org-stat">
            <span class="org-stat-val">${o.followersCount}</span>
            <span class="org-stat-lbl">Followers</span>
          </div>
          <div class="org-stat">
            <span class="org-stat-val">★ ${o.rating}</span>
            <span class="org-stat-lbl">Rating</span>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

// ----------------- HELPER: EVENT CARD HTML GENERATOR -----------------
function createEventCardHTML(event) {
  const isFav = SummitStorage.isFavorite(event.id);
  const eventDate = new Date(event.date + "T00:00:00");
  const monthStr = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
  const dayStr = eventDate.getDate();

  return `
    <article class="event-card" data-event-id="${event.id}">
      <div class="event-card-media">
        <img src="${event.posterImage || event.heroImage}" alt="${event.title}" class="event-card-img" loading="lazy" />
        <div class="event-card-badges">
          ${event.badge ? `<span class="badge badge-featured">${event.badge}</span>` : ''}
          ${event.isSeated ? `<span class="badge badge-seat">Seated</span>` : ''}
        </div>
        <button type="button" class="event-favorite-btn ${isFav ? 'favorited' : ''}" data-fav-id="${event.id}" aria-label="Save to favorites">
          <svg class="icon" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        <div class="event-date-flag">
          <span class="date-flag-month">${monthStr}</span>
          <span class="date-flag-day">${dayStr}</span>
        </div>
      </div>

      <div class="event-card-body">
        <span class="event-card-category">${event.categoryLabel || event.category}</span>
        <h3 class="event-card-title">
          <a href="event-detail.html?id=${event.id}">${event.title}</a>
        </h3>
        <div class="event-card-venue">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>${event.venueName}, ${event.city}</span>
        </div>
        <div class="event-card-footer">
          <div class="event-price-wrap">
            <span class="price-lbl">From</span>
            <span class="price-val">${SummitUI.formatCurrency(event.minPrice || 50)}</span>
          </div>
          <div class="btn-group-row">
            <button type="button" class="btn btn-primary btn-sm btn-quick-book" data-book-id="${event.id}">
              Get Tickets
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

// ----------------- BIND CARD ACTIONS (Favorites & Quick Book) -----------------
function bindEventCardActions(container) {
  // Favorite buttons
  container.querySelectorAll(".event-favorite-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const eventId = btn.getAttribute("data-fav-id");
      const isNowFav = SummitStorage.toggleFavorite(eventId);
      
      btn.classList.toggle("favorited", isNowFav);
      const svg = btn.querySelector("svg");
      if (svg) svg.setAttribute("fill", isNowFav ? "currentColor" : "none");

      SummitUI.showToast(isNowFav ? "Saved to your favorites ❤️" : "Removed from favorites", "info");
    });
  });

  // Quick Book buttons
  container.querySelectorAll(".btn-quick-book").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      const eventId = btn.getAttribute("data-book-id");
      const event = SummitStorage.getEventById(eventId);
      if (event) {
        SummitCheckout.startCheckout(event);
      }
    });
  });
}

// ----------------- NEWSLETTER SUBSCRIPTION -----------------
function initNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("newsletter-email");
    const email = (input.value || "").trim();
    if (!email) return;

    SummitUI.showToast("Subscribed! Use code SUMMIT2026 for 20% off your first ticket 🎉", "success", 6000);
    input.value = "";
  });
}
