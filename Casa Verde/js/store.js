/* ==========================================================================
   Casa Verde — Local Storage State & Persistence Engine
   Handles reservations, availability collision detection, searches & persistence
   Includes in-memory fallback for private browsing / blocked storage environments.
   ========================================================================== */

const STORAGE_KEYS = {
  BOOKINGS: 'casa_verde_bookings',
  ACTIVE_SEARCH: 'casa_verde_active_search',
  TABLE_RESERVATIONS: 'casa_verde_table_reservations',
  SPA_BOOKINGS: 'casa_verde_spa_bookings',
  LATEST_BOOKING: 'casa_verde_latest_booking'
};

class CasaVerdeStore {
  constructor() {
    this.memoryStorage = {};
    this.isStorageAvailable = this.checkStorageAvailability();
    this.init();
  }

  checkStorageAvailability() {
    try {
      const testKey = '__casa_verde_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('LocalStorage unavailable or disabled; falling back to session memory.');
      return false;
    }
  }

  getItem(key) {
    if (this.isStorageAvailable) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return this.memoryStorage[key] || null;
      }
    }
    return this.memoryStorage[key] || null;
  }

  setItem(key, value) {
    if (this.isStorageAvailable) {
      try {
        localStorage.setItem(key, value);
        return;
      } catch (e) {
        // Fallback
      }
    }
    this.memoryStorage[key] = value;
  }

  init() {
    // Seed initial realistic bookings if none exist
    if (!this.getItem(STORAGE_KEYS.BOOKINGS)) {
      this.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(HOTEL_DATA.seedBookings));
    }
  }

  // --- Bookings Operations ---
  getBookings() {
    try {
      const data = this.getItem(STORAGE_KEYS.BOOKINGS);
      return data ? JSON.parse(data) : HOTEL_DATA.seedBookings;
    } catch (e) {
      console.error('Error parsing bookings:', e);
      return HOTEL_DATA.seedBookings;
    }
  }

  getBookingById(reservationId) {
    if (!reservationId) return null;
    const bookings = this.getBookings();
    const cleanId = reservationId.trim().toUpperCase();
    return bookings.find(b => b.reservationId && b.reservationId.toUpperCase() === cleanId) || null;
  }

  saveBooking(booking) {
    const bookings = this.getBookings();
    const newBooking = {
      ...booking,
      reservationId: booking.reservationId || this.generateReservationId(),
      bookedAt: booking.bookedAt || new Date().toISOString(),
      status: booking.status || 'Confirmed'
    };
    bookings.push(newBooking);
    this.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    this.setItem(STORAGE_KEYS.LATEST_BOOKING, JSON.stringify(newBooking));
    return newBooking;
  }

  updateBooking(reservationId, updatedFields) {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.reservationId && b.reservationId.toUpperCase() === reservationId.toUpperCase());
    if (index === -1) return null;

    bookings[index] = { ...bookings[index], ...updatedFields, updatedAt: new Date().toISOString() };
    this.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return bookings[index];
  }

  cancelBooking(reservationId) {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.reservationId && b.reservationId.toUpperCase() === reservationId.toUpperCase());
    if (index === -1) return false;

    bookings[index].status = 'Cancelled';
    bookings[index].cancelledAt = new Date().toISOString();
    this.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return true;
  }

  // --- Availability & Collision Detection ---
  /**
   * Overlap rule: (A_start < B_end) AND (A_end > B_start)
   */
  isRoomAvailable(roomId, checkInDateStr, checkOutDateStr, excludeReservationId = null) {
    if (!checkInDateStr || !checkOutDateStr) return true;

    const requestedStart = new Date(checkInDateStr).getTime();
    const requestedEnd = new Date(checkOutDateStr).getTime();

    if (isNaN(requestedStart) || isNaN(requestedEnd) || requestedStart >= requestedEnd) {
      return false;
    }

    const bookings = this.getBookings();
    
    for (const b of bookings) {
      if (b.status === 'Cancelled') continue;
      if (excludeReservationId && b.reservationId.toUpperCase() === excludeReservationId.toUpperCase()) continue;
      if (b.roomId !== roomId) continue;

      const existingStart = new Date(b.checkIn).getTime();
      const existingEnd = new Date(b.checkOut).getTime();

      if (requestedStart < existingEnd && requestedEnd > existingStart) {
        return false;
      }
    }

    return true;
  }

  getAvailableRooms(checkIn, checkOut, guestCount = 1) {
    return HOTEL_DATA.rooms.filter(room => {
      const isCapacityOk = room.maxGuests >= guestCount;
      const isFree = this.isRoomAvailable(room.id, checkIn, checkOut);
      return isCapacityOk && isFree;
    });
  }

  // --- Active Search Parameters State ---
  saveSearchState(searchParams) {
    this.setItem(STORAGE_KEYS.ACTIVE_SEARCH, JSON.stringify(searchParams));
  }

  getSearchState() {
    try {
      const data = this.getItem(STORAGE_KEYS.ACTIVE_SEARCH);
      if (data) return JSON.parse(data);
    } catch (e) {}

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const checkout = new Date(tomorrow);
    checkout.setDate(checkout.getDate() + 3);

    return {
      checkIn: this.formatDateISO(tomorrow),
      checkOut: this.formatDateISO(checkout),
      guests: 2,
      roomId: "casita-verde"
    };
  }

  // --- Dining Table Reservations ---
  saveTableReservation(reservation) {
    const list = this.getTableReservations();
    const record = {
      ...reservation,
      id: 'TBL-' + Math.floor(10000 + Math.random() * 90000),
      createdAt: new Date().toISOString()
    };
    list.push(record);
    this.setItem(STORAGE_KEYS.TABLE_RESERVATIONS, JSON.stringify(list));
    return record;
  }

  getTableReservations() {
    try {
      const d = this.getItem(STORAGE_KEYS.TABLE_RESERVATIONS);
      return d ? JSON.parse(d) : [];
    } catch (e) {
      return [];
    }
  }

  // --- Spa Appointments ---
  saveSpaBooking(booking) {
    const list = this.getSpaBookings();
    const record = {
      ...booking,
      id: 'SPA-' + Math.floor(10000 + Math.random() * 90000),
      createdAt: new Date().toISOString()
    };
    list.push(record);
    this.setItem(STORAGE_KEYS.SPA_BOOKINGS, JSON.stringify(list));
    return record;
  }

  getSpaBookings() {
    try {
      const d = this.getItem(STORAGE_KEYS.SPA_BOOKINGS);
      return d ? JSON.parse(d) : [];
    } catch (e) {
      return [];
    }
  }

  // --- Helpers ---
  generateReservationId() {
    const num = Math.floor(10000 + Math.random() * 90000);
    return `CV-${num}`;
  }

  formatDateISO(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }

  calculateNights(checkInStr, checkOutStr) {
    if (!checkInStr || !checkOutStr) return 0;
    const start = new Date(checkInStr);
    const end = new Date(checkOutStr);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime <= 0) return 0;
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  }
}

// Global Store Instance
const store = new CasaVerdeStore();
