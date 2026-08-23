/**
 * SUMMIT EVENTS — STORAGE LAYER
 * Robust localStorage persistence for events, venues, organizers, tickets, orders, favorites & user profile.
 */

const STORAGE_KEYS = {
  EVENTS: "summit_events_v1",
  VENUES: "summit_venues_v1",
  ORGANIZERS: "summit_organizers_v1",
  FAVORITES: "summit_favorites_v1",
  TICKETS: "summit_tickets_v1",
  ORDERS: "summit_orders_v1",
  USER: "summit_user_v1",
  THEME: "summit_theme_v1"
};

const SummitStorage = {
  /**
   * Initialize storage with seed data if not already present
   */
  init() {
    try {
      if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(SEED_EVENTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.VENUES)) {
        localStorage.setItem(STORAGE_KEYS.VENUES, JSON.stringify(SEED_VENUES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.ORGANIZERS)) {
        localStorage.setItem(STORAGE_KEYS.ORGANIZERS, JSON.stringify(SEED_ORGANIZERS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
        // Default seed a couple favorites for instant discovery
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(["evt-101", "evt-102"]));
      }
      if (!localStorage.getItem(STORAGE_KEYS.TICKETS)) {
        // Seed an initial demo ticket so the tickets wallet looks active and stunning right away!
        const initialDemoTicket = {
          id: "TKT-8942-SYNTH",
          orderId: "ORD-948172",
          eventId: "evt-101",
          eventTitle: "SYNTHESIS: Sonic & Audiovisual Biennale 2026",
          eventDate: "2026-09-18",
          eventDateDisplay: "Sep 18 – 20, 2026",
          eventTimeDisplay: "Doors 18:00 • Starts 19:30 PST",
          venueName: "The Apex Arena & Amphitheatre",
          venueCity: "San Francisco, CA",
          tierName: "VIP Golden Circle (Tier 1 Seated)",
          tierId: "tier-vip-seated",
          pricePaid: 340,
          feePaid: 22,
          quantity: 1,
          seats: ["Sec A • Row 1 • Seat 14"],
          attendeeName: "Alexander Vance",
          attendeeEmail: "alexander.vance@summitevents.io",
          barcode: "84920481729481",
          purchaseDate: "2026-08-20T14:32:00Z",
          status: "active",
          accentColor: "#FF3366"
        };
        localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify([initialDemoTicket]));
      }
      if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        const initialDemoOrder = {
          orderId: "ORD-948172",
          date: "2026-08-20T14:32:00Z",
          eventId: "evt-101",
          eventTitle: "SYNTHESIS: Sonic & Audiovisual Biennale 2026",
          ticketsCount: 1,
          total: 362.00,
          subtotal: 340.00,
          fees: 22.00,
          discount: 0,
          paymentMethod: "Visa ending in 4242",
          attendeeName: "Alexander Vance",
          attendeeEmail: "alexander.vance@summitevents.io",
          ticketIds: ["TKT-8942-SYNTH"]
        };
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([initialDemoOrder]));
      }
      if (!localStorage.getItem(STORAGE_KEYS.USER)) {
        const defaultUser = {
          name: "Alexander Vance",
          email: "alexander.vance@summitevents.io",
          phone: "+1 (415) 890-2341",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
          memberTier: "Summit Patron",
          memberSince: "2024",
          currency: "USD",
          notifications: {
            emailTickets: true,
            eventReminders: true,
            curatedWeekly: true
          }
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
      }
    } catch (e) {
      console.warn("SummitStorage init warning:", e);
    }
  },

  // ----------------- EVENTS -----------------
  getEvents() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (!data) return SEED_EVENTS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_EVENTS;
    } catch (e) {
      return SEED_EVENTS;
    }
  },

  getEventById(id) {
    if (!id) return null;
    const events = this.getEvents();
    return events.find(e => e.id === id || e.slug === id) || null;
  },

  saveEvent(eventData) {
    try {
      const events = this.getEvents();
      const existingIndex = events.findIndex(e => e.id === eventData.id);
      if (existingIndex >= 0) {
        events[existingIndex] = { ...events[existingIndex], ...eventData };
      } else {
        events.unshift(eventData);
      }
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
      return eventData;
    } catch (e) {
      console.warn("Could not save event to storage:", e);
      return eventData;
    }
  },

  deleteEvent(id) {
    try {
      let events = this.getEvents();
      events = events.filter(e => e.id !== id);
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.warn("Could not delete event:", e);
    }
  },

  // ----------------- VENUES -----------------
  getVenues() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VENUES);
      if (!data) return SEED_VENUES;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_VENUES;
    } catch (e) {
      return SEED_VENUES;
    }
  },

  getVenueById(id) {
    if (!id) return null;
    const venues = this.getVenues();
    return venues.find(v => v.id === id) || null;
  },

  saveVenue(venueData) {
    try {
      const venues = this.getVenues();
      const existingIndex = venues.findIndex(v => v.id === venueData.id);
      if (existingIndex >= 0) {
        venues[existingIndex] = { ...venues[existingIndex], ...venueData };
      } else {
        venues.push(venueData);
      }
      localStorage.setItem(STORAGE_KEYS.VENUES, JSON.stringify(venues));
      return venueData;
    } catch (e) {
      return venueData;
    }
  },

  // ----------------- ORGANIZERS -----------------
  getOrganizers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORGANIZERS);
      if (!data) return SEED_ORGANIZERS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_ORGANIZERS;
    } catch (e) {
      return SEED_ORGANIZERS;
    }
  },

  getOrganizerById(id) {
    if (!id) return null;
    const organizers = this.getOrganizers();
    return organizers.find(o => o.id === id) || null;
  },

  saveOrganizer(organizerData) {
    try {
      const organizers = this.getOrganizers();
      const idx = organizers.findIndex(o => o.id === organizerData.id);
      if (idx >= 0) {
        organizers[idx] = { ...organizers[idx], ...organizerData };
      } else {
        organizers.push(organizerData);
      }
      localStorage.setItem(STORAGE_KEYS.ORGANIZERS, JSON.stringify(organizers));
      return organizerData;
    } catch (e) {
      return organizerData;
    }
  },

  // ----------------- FAVORITES -----------------
  getFavorites() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  },

  isFavorite(eventId) {
    const favs = this.getFavorites();
    return favs.includes(eventId);
  },

  toggleFavorite(eventId) {
    try {
      let favs = this.getFavorites();
      const isFav = favs.includes(eventId);
      if (isFav) {
        favs = favs.filter(id => id !== eventId);
      } else {
        favs.push(eventId);
      }
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
      
      // Dispatch custom event so all open pages & headers update heart counter
      window.dispatchEvent(new CustomEvent("favoritesUpdated", { detail: { count: favs.length, eventId, isFav: !isFav } }));
      return !isFav;
    } catch (e) {
      return false;
    }
  },

  // ----------------- TICKETS -----------------
  getTickets() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  },

  getTicketById(ticketId) {
    if (!ticketId) return null;
    const tickets = this.getTickets();
    return tickets.find(t => t.id === ticketId) || null;
  },

  saveTicket(ticket) {
    try {
      const tickets = this.getTickets();
      tickets.unshift(ticket);
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
      window.dispatchEvent(new CustomEvent("ticketsUpdated", { detail: { count: tickets.length, ticket } }));
      return ticket;
    } catch (e) {
      return ticket;
    }
  },

  transferTicket(ticketId, newRecipientEmail) {
    try {
      const tickets = this.getTickets();
      const ticket = tickets.find(t => t.id === ticketId);
      if (ticket) {
        ticket.status = "transferred";
        ticket.transferredTo = newRecipientEmail;
        ticket.transferredDate = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
        window.dispatchEvent(new CustomEvent("ticketsUpdated", { detail: { ticketId, status: "transferred" } }));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  // ----------------- ORDERS -----------------
  getOrders() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  },

  saveOrder(order) {
    try {
      const orders = this.getOrders();
      orders.unshift(order);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      return order;
    } catch (e) {
      return order;
    }
  },

  // ----------------- USER -----------------
  getUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (!data) return { name: "Alexander Vance", email: "alexander.vance@summitevents.io" };
      return JSON.parse(data);
    } catch (e) {
      return { name: "Alexander Vance", email: "alexander.vance@summitevents.io" };
    }
  },

  saveUser(userData) {
    try {
      const current = this.getUser();
      const updated = { ...current, ...userData };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("userUpdated", { detail: updated }));
      return updated;
    } catch (e) {
      return userData;
    }
  },

  // ----------------- THEME -----------------
  getTheme() {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME) || "dark";
    } catch (e) {
      return "dark";
    }
  },

  setTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      document.documentElement.setAttribute("data-theme", theme);
      window.dispatchEvent(new CustomEvent("themeChanged", { detail: { theme } }));
    } catch (e) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  },

  // ----------------- RESET -----------------
  resetAll() {
    try {
      localStorage.clear();
      this.init();
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  }
};

// Auto-initialize on script load
SummitStorage.init();
