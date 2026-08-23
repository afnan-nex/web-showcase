/**
 * SUMMIT EVENTS — USER ACCOUNT & DASHBOARD JAVASCRIPT
 * Tabs: Active Tickets, Saved / Favorites, Order History & Invoices, Organizer Hub (my events/metrics), Settings.
 */

document.addEventListener("DOMContentLoaded", () => {
  SummitAccount.init();
});

const SummitAccount = {
  activeTab: "tickets",

  init() {
    this.bindTabNavigation();
    this.renderUserProfileHeader();
    this.renderActiveTicketsTab();
    this.renderSavedFavoritesTab();
    this.renderOrderHistoryTab();
    this.renderOrganizerPortalTab();
    this.renderSettingsTab();

    window.addEventListener("favoritesUpdated", () => this.renderSavedFavoritesTab());
    window.addEventListener("ticketsUpdated", () => {
      this.renderActiveTicketsTab();
      this.renderOrderHistoryTab();
    });
  },

  bindTabNavigation() {
    const tabs = document.querySelectorAll(".account-tab-btn");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".account-tab-view").forEach(v => v.classList.remove("active"));
        
        tab.classList.add("active");
        this.activeTab = tab.getAttribute("data-tab");
        const targetView = document.getElementById(`tab-view-${this.activeTab}`);
        if (targetView) targetView.classList.add("active");
      });
    });

    // Support URL ?tab=saved or ?tab=orders
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam) {
      const match = document.querySelector(`.account-tab-btn[data-tab="${tabParam}"]`);
      if (match) match.click();
    }
  },

  renderUserProfileHeader() {
    const user = SummitStorage.getUser();
    const tickets = SummitStorage.getTickets();
    const favs = SummitStorage.getFavorites();

    const nameEl = document.getElementById("account-user-name");
    const emailEl = document.getElementById("account-user-email");
    const tierEl = document.getElementById("account-member-tier");
    const avatarEl = document.getElementById("account-user-avatar");

    if (nameEl) nameEl.textContent = user.name || "Alexander Vance";
    if (emailEl) emailEl.textContent = user.email || "alexander.vance@summitevents.io";
    if (tierEl) tierEl.textContent = user.memberTier || "Summit Patron";
    if (avatarEl && user.avatar) avatarEl.src = user.avatar;

    const statTickets = document.getElementById("stat-total-tickets");
    const statFavs = document.getElementById("stat-total-favs");
    if (statTickets) statTickets.textContent = tickets.length;
    if (statFavs) statFavs.textContent = favs.length;
  },

  // ----------------- TAB 1: ACTIVE TICKETS -----------------
  renderActiveTicketsTab() {
    const container = document.getElementById("account-tickets-list");
    if (!container) return;

    const tickets = SummitStorage.getTickets();
    if (tickets.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:3rem; background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg);">
          <p style="color:var(--text-muted); margin-bottom:1rem;">You don't have any active digital tickets yet.</p>
          <a href="events.html" class="btn btn-primary btn-sm">Explore Upcoming Events &rarr;</a>
        </div>
      `;
      return;
    }

    container.innerHTML = tickets.map(t => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:1.25rem; background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); margin-bottom:1rem;">
        <div>
          <span style="font-size:0.75rem; font-weight:700; color:var(--brand-primary);">${t.id}</span>
          <h4 style="font-size:1.1rem; font-weight:700; margin:0.2rem 0;">${t.eventTitle}</h4>
          <span style="font-size:0.85rem; color:var(--text-muted);">${t.eventDateDisplay} • ${t.venueName} • ${(t.seats || []).join(', ')}</span>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <a href="tickets.html" class="btn btn-secondary btn-sm">View in Wallet</a>
        </div>
      </div>
    `).join("");
  },

  // ----------------- TAB 2: SAVED / FAVORITES -----------------
  renderSavedFavoritesTab() {
    const container = document.getElementById("account-favorites-grid");
    if (!container) return;

    const favIds = SummitStorage.getFavorites();
    const allEvents = SummitStorage.getEvents();
    const favoritedEvents = allEvents.filter(e => favIds.includes(e.id));

    if (favoritedEvents.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:3rem; background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg);">
          <p style="color:var(--text-muted); margin-bottom:1rem;">No saved events in your wishlist yet.</p>
          <a href="events.html" class="btn btn-primary btn-sm">Discover Events &rarr;</a>
        </div>
      `;
      return;
    }

    container.className = "events-editorial-grid";
    container.innerHTML = favoritedEvents.map(e => createEventCardHTML(e)).join("");
    bindEventCardActions(container);
  },

  // ----------------- TAB 3: ORDER HISTORY & INVOICES -----------------
  renderOrderHistoryTab() {
    const container = document.getElementById("account-orders-list");
    if (!container) return;

    const orders = SummitStorage.getOrders();
    if (orders.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:3rem; background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg);">
          <p style="color:var(--text-muted);">No past orders found.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = orders.map(o => `
      <div style="padding:1.5rem; background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); margin-bottom:1rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; padding-bottom:0.75rem; border-bottom:1px solid var(--border-color-subtle);">
          <div>
            <span style="font-family:monospace; font-weight:700; color:var(--brand-primary);">${o.orderId}</span>
            <span style="font-size:0.8rem; color:var(--text-muted); margin-left:0.75rem;">Placed on ${new Date(o.date).toLocaleDateString()}</span>
          </div>
          <span style="font-family:var(--font-display); font-size:1.2rem; font-weight:700;">${SummitUI.formatCurrency(o.total)}</span>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong style="font-size:1rem; display:block;">${o.eventTitle}</strong>
            <span style="font-size:0.85rem; color:var(--text-muted);">${o.ticketsCount} Ticket(s) • Paid via ${o.paymentMethod || 'Visa'}</span>
          </div>
          <button type="button" class="btn btn-outline btn-sm" onclick="window.print()">
            Print Receipt
          </button>
        </div>
      </div>
    `).join("");
  },

  // ----------------- TAB 4: ORGANIZER PORTAL -----------------
  renderOrganizerPortalTab() {
    const container = document.getElementById("account-organizer-events-list");
    if (!container) return;

    const allEvents = SummitStorage.getEvents();
    // Custom or created events
    const myEvents = allEvents.filter(e => e.organizerId === "org-custom" || e.badge === "Newly Created");

    const totalCreatedEl = document.getElementById("stat-org-created-count");
    if (totalCreatedEl) totalCreatedEl.textContent = myEvents.length;

    if (myEvents.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:3rem; background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-lg);">
          <p style="color:var(--text-muted); margin-bottom:1rem;">You haven't created any custom draft or live events yet.</p>
          <a href="organizers.html" class="btn btn-primary btn-sm">Open Event Creator Studio &rarr;</a>
        </div>
      `;
      return;
    }

    container.innerHTML = myEvents.map(e => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:1.25rem; background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); margin-bottom:1rem;">
        <div>
          <span class="badge badge-featured">Published Live</span>
          <h4 style="font-size:1.15rem; font-weight:700; margin:0.35rem 0;">${e.title}</h4>
          <span style="font-size:0.85rem; color:var(--text-muted);">${e.dateDisplay} • ${e.venueName}, ${e.city}</span>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <a href="event-detail.html?id=${e.id}" class="btn btn-secondary btn-sm">View Page</a>
          <button type="button" class="btn btn-outline btn-sm" onclick="SummitStorage.deleteEvent('${e.id}'); window.location.reload();">
            Delete
          </button>
        </div>
      </div>
    `).join("");
  },

  // ----------------- TAB 5: SETTINGS & PREFERENCES -----------------
  renderSettingsTab() {
    const user = SummitStorage.getUser();
    const form = document.getElementById("account-settings-form");
    if (!form) return;

    const nameInput = document.getElementById("setting-user-name");
    const emailInput = document.getElementById("setting-user-email");
    const phoneInput = document.getElementById("setting-user-phone");

    if (nameInput) nameInput.value = user.name || "";
    if (emailInput) emailInput.value = user.email || "";
    if (phoneInput) phoneInput.value = user.phone || "";

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const updated = SummitStorage.saveUser({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim()
      });
      SummitAccount.renderUserProfileHeader();
      SummitUI.showToast("Profile settings saved successfully!", "success");
    });

    const btnResetData = document.getElementById("btn-reset-demo-data");
    if (btnResetData) {
      btnResetData.addEventListener("click", () => {
        if (confirm("Reset demo data and restore default seed events and tickets?")) {
          SummitStorage.resetAll();
        }
      });
    }
  }
};
