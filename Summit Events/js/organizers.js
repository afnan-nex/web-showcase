/**
 * SUMMIT EVENTS — ORGANIZERS & EVENT CREATION WIZARD JAVASCRIPT
 * Showcase organizers directory, profile modal, and multi-step Event Creator Studio for organizers.
 */

document.addEventListener("DOMContentLoaded", () => {
  SummitOrganizers.init();
});

const SummitOrganizers = {
  organizers: [],

  init() {
    this.organizers = SummitStorage.getOrganizers();
    this.renderOrganizers();
    this.initCreateEventWizard();
  },

  renderOrganizers() {
    const container = document.getElementById("organizers-list-container");
    if (!container) return;

    const allEvents = SummitStorage.getEvents();

    container.innerHTML = this.organizers.map(o => {
      const activeEvents = allEvents.filter(e => e.organizerId === o.id || e.organizerName === o.name);

      return `
        <div class="organizer-card" data-org-id="${o.id}">
          <div class="organizer-cover">
            <img src="${o.cover}" alt="${o.name}" loading="lazy" />
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
            <div style="margin-top:1.25rem; display:flex; gap:0.5rem;">
              <button type="button" class="btn btn-primary btn-sm btn-follow-org" data-org-id="${o.id}" style="flex:1;">
                Follow Organizer
              </button>
              <button type="button" class="btn btn-outline btn-sm btn-view-org-events" data-org-id="${o.id}">
                ${activeEvents.length} Live Event${activeEvents.length === 1 ? '' : 's'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Bind follow buttons
    container.querySelectorAll(".btn-follow-org").forEach(btn => {
      btn.addEventListener("click", () => {
        const isFollowing = btn.textContent.includes("Following");
        if (isFollowing) {
          btn.textContent = "Follow Organizer";
          btn.className = "btn btn-primary btn-sm btn-follow-org";
          SummitUI.showToast("Unfollowed organizer", "info");
        } else {
          btn.textContent = "✓ Following";
          btn.className = "btn btn-secondary btn-sm btn-follow-org";
          SummitUI.showToast("Following organizer! You'll receive announcement notifications.", "success");
        }
      });
    });

    // Bind View Live Events
    container.querySelectorAll(".btn-view-org-events").forEach(btn => {
      btn.addEventListener("click", () => {
        const orgId = btn.getAttribute("data-org-id");
        window.location.href = `events.html?q=${encodeURIComponent(this.organizers.find(o => o.id === orgId)?.name || "")}`;
      });
    });
  },

  // ----------------- CREATE EVENT WIZARD -----------------
  initCreateEventWizard() {
    const wizardForm = document.getElementById("create-event-wizard-form");
    if (!wizardForm) return;

    // Cover preset selector clicks
    const presetOptions = document.querySelectorAll(".cover-preset-option");
    const coverUrlInput = document.getElementById("wizard-cover-url");
    presetOptions.forEach(opt => {
      opt.addEventListener("click", () => {
        presetOptions.forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
        const url = opt.getAttribute("data-url");
        if (coverUrlInput) coverUrlInput.value = url;
      });
    });

    wizardForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const title = document.getElementById("wizard-title").value.trim();
      const category = document.getElementById("wizard-category").value;
      const tagline = document.getElementById("wizard-tagline").value.trim();
      const date = document.getElementById("wizard-date").value;
      const time = document.getElementById("wizard-time").value || "19:00 PST";
      const venueName = document.getElementById("wizard-venue-name").value.trim();
      const city = document.getElementById("wizard-city").value.trim();
      const price = parseFloat(document.getElementById("wizard-price").value) || 60;
      const isSeated = document.getElementById("wizard-is-seated").checked;
      const coverUrl = coverUrlInput.value.trim() || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80";
      const description = document.getElementById("wizard-description").value.trim();
      const organizerName = document.getElementById("wizard-organizer-name").value.trim() || "Summit Creator";

      if (!title || !date || !venueName || !city) {
        SummitUI.showToast("Please complete all required fields", "error");
        return;
      }

      const newId = "evt-" + Math.floor(1000 + Math.random() * 9000);
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      const newEvent = {
        id: newId,
        title: title,
        tagline: tagline || "Exclusive Experience on Summit Events",
        slug: slug,
        category: category,
        categoryLabel: category.charAt(0).toUpperCase() + category.slice(1),
        badge: "Newly Created",
        accentColor: "#FF3366",
        secondaryColor: "#1a0814",
        featured: true,
        isSeated: isSeated,
        heroImage: coverUrl,
        posterImage: coverUrl,
        date: date,
        dateDisplay: SummitUI.formatDate(date),
        timeDisplay: `Doors 18:00 • Starts ${time}`,
        venueId: "venue-custom",
        venueName: venueName,
        city: city,
        address: `${venueName}, ${city}`,
        organizerId: "org-custom",
        organizerName: organizerName,
        priceRange: `$${price} – $${price * 2.5}`,
        minPrice: price,
        maxPrice: price * 2.5,
        ageRestriction: "18+ Valid ID Required",
        description: description || `${title} is an extraordinary live event hosted at ${venueName} in ${city}.`,
        highlights: [
          "Curated bespoke event experience",
          "Official verified Summit digital tickets",
          "Dedicated host concierge on-site"
        ],
        lineup: [
          {
            name: organizerName,
            role: "Headline Host",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
            bio: "Organizer and curator of this experience."
          }
        ],
        ticketTiers: [
          {
            id: `tier-${newId}-ga`,
            name: "General Admission Pass",
            price: price,
            fee: Math.round(price * 0.08 * 100) / 100,
            description: "Standard full entry access.",
            available: 150,
            perks: ["Full event access", "Digital QR Pass"]
          },
          {
            id: `tier-${newId}-vip`,
            name: "VIP Patron Experience",
            price: Math.round(price * 2.2),
            fee: Math.round(price * 0.15 * 100) / 100,
            description: "VIP priority lounge entry and reserved seating.",
            available: 25,
            requiresSeatMap: isSeated,
            perks: ["VIP Lounge Access", "Fast-track entrance", "Complimentary drink ticket"]
          }
        ],
        faqs: [
          { q: "What is the cancellation policy?", a: "Tickets can be transferred or refunded up to 7 days before event start." }
        ]
      };

      SummitStorage.saveEvent(newEvent);
      SummitUI.showToast("🎉 Event successfully published to Summit Events directory!", "success", 5000);

      // Redirect to the newly created event detail page
      setTimeout(() => {
        window.location.href = `event-detail.html?id=${newId}`;
      }, 1200);
    });
  }
};
