/**
 * SUMMIT EVENTS — VENUES DIRECTORY JAVASCRIPT
 * Venue showcases, venue type filter, venue details modal with upcoming hosted events.
 */

document.addEventListener("DOMContentLoaded", () => {
  SummitVenues.init();
});

const SummitVenues = {
  venues: [],
  selectedType: "all",

  init() {
    this.venues = SummitStorage.getVenues();
    this.createVenueModalDOM();
    this.bindFilterTabs();
    this.renderVenues();
  },

  bindFilterTabs() {
    const tabs = document.querySelectorAll(".venue-filter-tab");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        this.selectedType = tab.getAttribute("data-type");
        this.renderVenues();
      });
    });
  },

  renderVenues() {
    const container = document.getElementById("venues-list-container");
    if (!container) return;

    let filtered = this.venues;
    if (this.selectedType !== "all") {
      filtered = filtered.filter(v => v.type.toLowerCase().includes(this.selectedType.toLowerCase()));
    }

    const allEvents = SummitStorage.getEvents();

    container.innerHTML = filtered.map(v => {
      const hostedCount = allEvents.filter(e => e.venueId === v.id || e.venueName === v.name).length;

      return `
        <div class="venue-card" data-venue-id="${v.id}">
          <div class="venue-card-media">
            <img src="${v.image}" alt="${v.name}" class="venue-card-img" loading="lazy" />
            <span class="venue-card-type-badge">${v.type}</span>
          </div>
          <div class="venue-card-body">
            <h3 class="venue-card-title">${v.name}</h3>
            <div class="venue-card-location">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${v.address}</span>
            </div>
            <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.5; margin-bottom:1rem;">
              ${v.description}
            </p>
            <div class="venue-amenities-pills">
              ${(v.amenities || []).map(a => `<span class="amenity-pill">${a}</span>`).join('')}
            </div>
            <div class="venue-card-footer">
              <div style="display:flex; flex-direction:column;">
                <span style="font-size:0.7rem; text-transform:uppercase; color:var(--text-muted);">Max Capacity</span>
                <span style="font-family:var(--font-display); font-weight:700;">${v.capacity} Seats</span>
              </div>
              <button type="button" class="btn btn-secondary btn-sm btn-inspect-venue" data-venue-id="${v.id}">
                ${hostedCount} Upcoming Event${hostedCount === 1 ? '' : 's'} &rarr;
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    container.querySelectorAll(".btn-inspect-venue").forEach(btn => {
      btn.addEventListener("click", () => {
        const venueId = btn.getAttribute("data-venue-id");
        this.openVenueModal(venueId);
      });
    });
  },

  createVenueModalDOM() {
    if (document.getElementById("summit-venue-modal")) return;

    const modalHTML = `
      <div id="summit-venue-modal" class="general-modal" role="dialog" aria-modal="true" aria-labelledby="venue-modal-title">
        <div class="modal-backdrop"></div>
        <div class="modal-container animate-scale-up" style="max-width: 800px;">
          <div class="modal-header">
            <div>
              <span class="badge badge-seat" id="venue-modal-type-badge">Arena</span>
              <h3 id="venue-modal-title" class="modal-title" style="margin-top:0.25rem;">Venue Details</h3>
            </div>
            <button type="button" class="modal-close" id="btn-close-venue-modal">&times;</button>
          </div>
          <div class="modal-body" id="venue-modal-body" style="padding: 2rem; overflow-y: auto; max-height: 75vh;">
            <!-- Rendered by JS -->
          </div>
        </div>
      </div>
    `;

    const div = document.createElement("div");
    div.innerHTML = modalHTML;
    document.body.appendChild(div.firstElementChild);

    document.getElementById("btn-close-venue-modal").addEventListener("click", () => {
      SummitUI.closeModal("summit-venue-modal");
    });
  },

  openVenueModal(venueId) {
    const venue = this.venues.find(v => v.id === venueId);
    if (!venue) return;

    const modal = document.getElementById("summit-venue-modal");
    const titleEl = document.getElementById("venue-modal-title");
    const badgeEl = document.getElementById("venue-modal-type-badge");
    const bodyEl = document.getElementById("venue-modal-body");

    if (titleEl) titleEl.textContent = venue.name;
    if (badgeEl) badgeEl.textContent = venue.type;

    const allEvents = SummitStorage.getEvents();
    const hostedEvents = allEvents.filter(e => e.venueId === venue.id || e.venueName === venue.name);

    if (bodyEl) {
      bodyEl.innerHTML = `
        <img src="${venue.image}" alt="${venue.name}" style="width:100%; height:280px; object-fit:cover; border-radius:var(--radius-lg); margin-bottom:1.5rem;" />
        <p style="font-size:1.05rem; color:var(--text-secondary); line-height:1.6; margin-bottom:1.5rem;">${venue.description}</p>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; background:var(--bg-surface-raised); padding:1.25rem; border-radius:var(--radius-md); margin-bottom:2rem;">
          <div>
            <strong style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); display:block; margin-bottom:0.25rem;">Address</strong>
            <p style="font-size:0.95rem;">📍 ${venue.address}</p>
          </div>
          <div>
            <strong style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); display:block; margin-bottom:0.25rem;">Seating Capacity</strong>
            <p style="font-size:0.95rem; font-weight:700;">${venue.capacity} Attendees</p>
          </div>
          <div>
            <strong style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); display:block; margin-bottom:0.25rem;">Transit Access</strong>
            <p style="font-size:0.9rem; color:var(--text-secondary);">${venue.transit || 'Muni / Metro accessible'}</p>
          </div>
          <div>
            <strong style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); display:block; margin-bottom:0.25rem;">Parking Specs</strong>
            <p style="font-size:0.9rem; color:var(--text-secondary);">${venue.parking || 'On-site garages available'}</p>
          </div>
        </div>

        <h4 style="font-size:1.25rem; margin-bottom:1rem;">Upcoming Events at this Venue (${hostedEvents.length})</h4>
        ${hostedEvents.length > 0 ? `
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            ${hostedEvents.map(e => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem; background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md);">
                <div>
                  <strong style="display:block; font-size:1rem;">${e.title}</strong>
                  <span style="font-size:0.8rem; color:var(--brand-primary); font-weight:600;">${e.dateDisplay} • ${e.timeDisplay}</span>
                </div>
                <div style="display:flex; gap:0.5rem;">
                  <a href="event-detail.html?id=${e.id}" class="btn btn-outline btn-sm">Details</a>
                  <button type="button" class="btn btn-primary btn-sm" onclick="SummitCheckout.startCheckout('${e.id}')">Get Tickets</button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <p style="color:var(--text-muted);">No upcoming scheduled public events currently for this venue.</p>
        `}
      `;
    }

    SummitUI.openModal("summit-venue-modal");
  }
};
