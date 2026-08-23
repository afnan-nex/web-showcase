/**
 * Haven Realty - LocalStorage & Application State Manager
 * Handles Favorites, Compare Queue, Recently Viewed, Inquiries, and Appointments.
 */

const STORAGE_KEYS = {
  FAVORITES: "haven_favorites",
  COMPARE: "haven_compare",
  RECENTLY_VIEWED: "haven_recently_viewed",
  INQUIRIES: "haven_inquiries",
  APPOINTMENTS: "haven_appointments",
  SELLER_VALUATIONS: "haven_seller_valuations"
};

const HavenStorage = {
  // --- FAVORITES ---
  getFavorites() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading favorites:", e);
      return [];
    }
  },

  isFavorite(propId) {
    const favs = this.getFavorites();
    return favs.includes(propId);
  },

  toggleFavorite(propId) {
    let favs = this.getFavorites();
    let isAdded = false;
    if (favs.includes(propId)) {
      favs = favs.filter(id => id !== propId);
      isAdded = false;
    } else {
      favs.push(propId);
      isAdded = true;
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    this.emitStateChange("favorites-updated", { favorites: favs, propId, isAdded });
    return isAdded;
  },

  removeFavorite(propId) {
    let favs = this.getFavorites().filter(id => id !== propId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    this.emitStateChange("favorites-updated", { favorites: favs, propId, isAdded: false });
  },

  // --- COMPARE (Max 4 properties) ---
  getCompare() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPARE);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading compare:", e);
      return [];
    }
  },

  isInCompare(propId) {
    const comp = this.getCompare();
    return comp.includes(propId);
  },

  addToCompare(propId) {
    let comp = this.getCompare();
    if (comp.includes(propId)) {
      return { success: false, reason: "already_exists", list: comp };
    }
    if (comp.length >= 4) {
      return { success: false, reason: "max_limit_reached", list: comp };
    }
    comp.push(propId);
    localStorage.setItem(STORAGE_KEYS.COMPARE, JSON.stringify(comp));
    this.emitStateChange("compare-updated", { compare: comp, propId, isAdded: true });
    return { success: true, list: comp };
  },

  removeFromCompare(propId) {
    let comp = this.getCompare().filter(id => id !== propId);
    localStorage.setItem(STORAGE_KEYS.COMPARE, JSON.stringify(comp));
    this.emitStateChange("compare-updated", { compare: comp, propId, isAdded: false });
    return comp;
  },

  clearCompare() {
    localStorage.setItem(STORAGE_KEYS.COMPARE, JSON.stringify([]));
    this.emitStateChange("compare-updated", { compare: [], isAdded: false });
  },

  // --- RECENTLY VIEWED ---
  getRecentlyViewed() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading recently viewed:", e);
      return [];
    }
  },

  addRecentlyViewed(propId) {
    if (!propId) return;
    let recent = this.getRecentlyViewed().filter(id => id !== propId);
    recent.unshift(propId); // add to top
    if (recent.length > 8) {
      recent = recent.slice(0, 8);
    }
    localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(recent));
  },

  // --- INQUIRIES ---
  getInquiries() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading inquiries:", e);
      return [];
    }
  },

  saveInquiry(inquiryData) {
    const list = this.getInquiries();
    const id = "HAV-INQ-" + Math.floor(100000 + Math.random() * 900000);
    const newInquiry = {
      id,
      timestamp: new Date().toISOString(),
      status: "Confirmed",
      ...inquiryData
    };
    list.unshift(newInquiry);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(list));
    return newInquiry;
  },

  // --- APPOINTMENTS ---
  getAppointments() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading appointments:", e);
      return [];
    }
  },

  saveAppointment(apptData) {
    const list = this.getAppointments();
    const id = "HAV-APT-" + Math.floor(100000 + Math.random() * 900000);
    const newAppt = {
      id,
      timestamp: new Date().toISOString(),
      status: "Confirmed",
      ...apptData
    };
    list.unshift(newAppt);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
    return newAppt;
  },

  // --- SELLER VALUATION REQUESTS ---
  saveSellerValuation(valuationData) {
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.SELLER_VALUATIONS) || "[]");
      const id = "HAV-VAL-" + Math.floor(100000 + Math.random() * 900000);
      const newEntry = {
        id,
        timestamp: new Date().toISOString(),
        status: "Review Pending",
        ...valuationData
      };
      list.unshift(newEntry);
      localStorage.setItem(STORAGE_KEYS.SELLER_VALUATIONS, JSON.stringify(list));
      return newEntry;
    } catch (e) {
      console.error("Error saving seller valuation:", e);
      return null;
    }
  },

  // Helper Event Emitter
  emitStateChange(eventName, detail) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
};

// Utility to show toast notifications across all pages
function showToast(message, type = "info", duration = 3500) {
  let toastContainer = document.getElementById("haven-toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "haven-toast-container";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type} animate-slide-up`;
  
  let iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  if (type === "success") {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else if (type === "warning") {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-message">${message}</div>
    <button class="toast-close" aria-label="Close notification" onclick="this.parentElement.remove()">&times;</button>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast-fade-out");
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 400);
  }, duration);
}

// Helpers for formatted currency and numbers
function formatPrice(val, isRental = false) {
  if (typeof val !== "number") return val;
  const formatted = "$" + val.toLocaleString("en-US");
  return isRental ? `${formatted} / mo` : formatted;
}

function formatNumber(num) {
  return typeof num === "number" ? num.toLocaleString("en-US") : num;
}
