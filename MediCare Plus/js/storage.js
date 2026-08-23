/**
 * MediCare Plus - LocalStorage Persistence & Clinical Availability Engine (Production Grade)
 * Handles full client-side state, conflict prevention, schedule availability,
 * appointment CRUD, prescriptions, lab results, and notifications with full error resilience.
 */

const STORAGE_KEYS = {
  APPOINTMENTS: "medicare_plus_appointments_v3",
  PATIENT_PROFILE: "medicare_plus_patient_profile_v3",
  PRESCRIPTIONS: "medicare_plus_prescriptions_v3",
  LAB_RESULTS: "medicare_plus_lab_results_v3",
  NOTIFICATIONS: "medicare_plus_notifications_v3",
  INITIALIZED: "medicare_plus_initialized_v3"
};

// Memory fallback store in case localStorage is disabled or restricted
const MemoryStore = {};

const StorageManager = {
  isStorageAvailable() {
    try {
      const test = "__medicare_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Initialize local storage with default clinical datasets if not present
   */
  init() {
    try {
      if (this.isStorageAvailable()) {
        const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
        if (!isInit) {
          localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(MEDICAL_DATA.initialAppointments));
          localStorage.setItem(STORAGE_KEYS.PATIENT_PROFILE, JSON.stringify(MEDICAL_DATA.demoPatient));
          localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(MEDICAL_DATA.demoPrescriptions));
          localStorage.setItem(STORAGE_KEYS.LAB_RESULTS, JSON.stringify(MEDICAL_DATA.demoLabResults));
          localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(MEDICAL_DATA.notifications));
          localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
        }
      } else {
        // Fallback to memory
        MemoryStore[STORAGE_KEYS.APPOINTMENTS] = JSON.parse(JSON.stringify(MEDICAL_DATA.initialAppointments));
        MemoryStore[STORAGE_KEYS.PATIENT_PROFILE] = JSON.parse(JSON.stringify(MEDICAL_DATA.demoPatient));
        MemoryStore[STORAGE_KEYS.PRESCRIPTIONS] = JSON.parse(JSON.stringify(MEDICAL_DATA.demoPrescriptions));
        MemoryStore[STORAGE_KEYS.LAB_RESULTS] = JSON.parse(JSON.stringify(MEDICAL_DATA.demoLabResults));
        MemoryStore[STORAGE_KEYS.NOTIFICATIONS] = JSON.parse(JSON.stringify(MEDICAL_DATA.notifications));
      }
    } catch (err) {
      console.warn("StorageManager initialized in memory mode:", err);
    }
  },

  /**
   * Safe getter from localStorage with graceful fallback
   */
  getItem(key, fallback = []) {
    try {
      if (this.isStorageAvailable()) {
        const data = localStorage.getItem(key);
        if (data) {
          return JSON.parse(data);
        }
      } else if (MemoryStore[key]) {
        return MemoryStore[key];
      }
      return fallback;
    } catch (e) {
      console.warn(`Recovered from corrupted state for ${key}, falling back to defaults.`);
      return fallback;
    }
  },

  /**
   * Safe setter for localStorage
   */
  setItem(key, value) {
    try {
      if (this.isStorageAvailable()) {
        localStorage.setItem(key, JSON.stringify(value));
      }
      MemoryStore[key] = value;
      return true;
    } catch (e) {
      console.error("Storage write error, writing to memory fallback:", e);
      MemoryStore[key] = value;
      return false;
    }
  },

  // -------------------------------------------------------------
  // APPOINTMENTS MANAGEMENT
  // -------------------------------------------------------------
  getAppointments() {
    return this.getItem(STORAGE_KEYS.APPOINTMENTS, MEDICAL_DATA.initialAppointments);
  },

  getAppointmentById(id) {
    const list = this.getAppointments();
    return list.find(a => a.id === id) || null;
  },

  /**
   * Check if booking conflict exists for a doctor
   */
  checkBookingConflict(doctorId, dateStr, timeStr, excludeId = null) {
    const list = this.getAppointments();
    
    // Check doctor slot conflict
    const doctorConflict = list.find(a => {
      if (excludeId && a.id === excludeId) return false;
      if (a.status === "Cancelled") return false;
      return a.doctorId === doctorId && a.date === dateStr && a.time === timeStr;
    });

    if (doctorConflict) {
      return {
        hasConflict: true,
        reason: `${doctorConflict.doctorName} is already booked on ${dateStr} at ${this.formatTime12h(timeStr)}. Please select another session.`
      };
    }

    return { hasConflict: false };
  },

  /**
   * Generate available time slots for a given doctor and date
   * Takes doctor's working schedule into account, past times if today, and existing bookings
   */
  getAvailableSlots(doctorId, dateStr) {
    const doctor = MEDICAL_DATA.doctors.find(d => d.id === doctorId);
    if (!doctor || !dateStr) return [];

    // Parse dateStr (format YYYY-MM-DD)
    const [year, month, day] = dateStr.split("-").map(Number);
    const targetDate = new Date(year, month - 1, day);
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const dayOfWeek = dayNames[targetDate.getDay()];

    const scheduledSlots = doctor.workingHours[dayOfWeek] || [];
    if (scheduledSlots.length === 0) {
      return []; // Doctor does not work on this day
    }

    // Get current bookings for this doctor on this date
    const allAppointments = this.getAppointments();
    const bookedTimes = new Set(
      allAppointments
        .filter(a => a.doctorId === doctorId && a.date === dateStr && a.status !== "Cancelled")
        .map(a => a.time)
    );

    // Check if selected date is today
    const now = new Date();
    const isToday = (
      now.getFullYear() === year &&
      now.getMonth() === month - 1 &&
      now.getDate() === day
    );

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return scheduledSlots.map(timeStr => {
      const [slotHour, slotMin] = timeStr.split(":").map(Number);
      let isPast = false;

      // Check if slot has already passed today
      if (isToday) {
        if (slotHour < currentHour || (slotHour === currentHour && slotMin <= currentMinute)) {
          isPast = true;
        }
      }

      const isBooked = bookedTimes.has(timeStr);
      const isAvailable = !isPast && !isBooked;

      let statusText = "Available";
      if (isPast) statusText = "Past Time";
      else if (isBooked) statusText = "Booked";

      return {
        time: timeStr,
        displayTime: this.formatTime12h(timeStr),
        isAvailable,
        statusText
      };
    });
  },

  formatTime12h(time24) {
    if (!time24 || typeof time24 !== "string") return "";
    const parts = time24.split(":").map(Number);
    if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return time24;
    const [h, m] = parts;
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${m < 10 ? '0' + m : m} ${period}`;
  },

  /**
   * Save a new appointment
   */
  createAppointment(appointmentData) {
    const appointments = this.getAppointments();
    
    // Check conflicts again
    const conflict = this.checkBookingConflict(
      appointmentData.doctorId,
      appointmentData.date,
      appointmentData.time
    );

    if (conflict.hasConflict) {
      return { success: false, error: conflict.reason };
    }

    // Generate unique clinical ID: MCP-YYYY-RANDOM
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const appointmentId = `MCP-${new Date().getFullYear()}-${randomCode}`;

    const newAppointment = {
      id: appointmentId,
      ...appointmentData,
      status: "Confirmed",
      createdAt: new Date().toISOString()
    };

    appointments.unshift(newAppointment);
    this.setItem(STORAGE_KEYS.APPOINTMENTS, appointments);

    // Trigger notification
    this.addNotification({
      type: "reminder",
      title: "Specialist Appointment Confirmed",
      message: `Your appointment with ${newAppointment.doctorName} on ${newAppointment.date} at ${this.formatTime12h(newAppointment.time)} is confirmed. Booking Reference: ${newAppointment.id}`,
      actionUrl: "patient-portal.html#appointments"
    });

    return { success: true, appointment: newAppointment };
  },

  /**
   * Cancel an appointment with optional reason
   */
  cancelAppointment(id, reason = "Patient requested cancellation") {
    const appointments = this.getAppointments();
    const index = appointments.findIndex(a => a.id === id);
    if (index === -1) return { success: false, error: "Appointment not found" };

    appointments[index].status = "Cancelled";
    appointments[index].cancellationReason = reason;
    appointments[index].cancelledAt = new Date().toISOString();

    this.setItem(STORAGE_KEYS.APPOINTMENTS, appointments);

    this.addNotification({
      type: "clinical",
      title: "Appointment Cancelled",
      message: `Appointment ${id} (${appointments[index].doctorName}) has been cancelled and released.`,
      actionUrl: "patient-portal.html#appointments"
    });

    return { success: true, appointment: appointments[index] };
  },

  // -------------------------------------------------------------
  // PATIENT PROFILE MANAGEMENT
  // -------------------------------------------------------------
  getPatientProfile() {
    return this.getItem(STORAGE_KEYS.PATIENT_PROFILE, MEDICAL_DATA.demoPatient);
  },

  updatePatientProfile(updates) {
    const current = this.getPatientProfile();
    const merged = { ...current, ...updates };
    this.setItem(STORAGE_KEYS.PATIENT_PROFILE, merged);
    return merged;
  },

  // -------------------------------------------------------------
  // PRESCRIPTIONS MANAGEMENT
  // -------------------------------------------------------------
  getPrescriptions() {
    return this.getItem(STORAGE_KEYS.PRESCRIPTIONS, MEDICAL_DATA.demoPrescriptions);
  },

  requestRefill(prescriptionId) {
    const list = this.getPrescriptions();
    const index = list.findIndex(p => p.id === prescriptionId);
    if (index === -1) return { success: false, error: "Prescription not found" };

    if (list[index].refillsRemaining <= 0) {
      return { success: false, error: "No refills remaining. Physician clinical re-authorization required." };
    }

    list[index].refillRequested = true;
    list[index].lastRefillRequestDate = new Date().toISOString();
    this.setItem(STORAGE_KEYS.PRESCRIPTIONS, list);

    this.addNotification({
      type: "clinical",
      title: "Electronic Refill Request Transmitted",
      message: `Refill request for ${list[index].medicationName} transmitted to ${list[index].pharmacy}.`,
      actionUrl: "patient-portal.html#prescriptions"
    });

    return { success: true, prescription: list[index] };
  },

  // -------------------------------------------------------------
  // LAB RESULTS MANAGEMENT
  // -------------------------------------------------------------
  getLabResults() {
    return this.getItem(STORAGE_KEYS.LAB_RESULTS, MEDICAL_DATA.demoLabResults);
  },

  getLabResultById(id) {
    const list = this.getLabResults();
    return list.find(r => r.id === id) || null;
  },

  // -------------------------------------------------------------
  // NOTIFICATIONS CENTER
  // -------------------------------------------------------------
  getNotifications() {
    return this.getItem(STORAGE_KEYS.NOTIFICATIONS, MEDICAL_DATA.notifications);
  },

  getUnreadNotificationsCount() {
    const list = this.getNotifications();
    return list.filter(n => !n.read).length;
  },

  markNotificationAsRead(id) {
    const list = this.getNotifications();
    const target = list.find(n => n.id === id);
    if (target) {
      target.read = true;
      this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
    }
  },

  markAllNotificationsAsRead() {
    const list = this.getNotifications();
    list.forEach(n => n.read = true);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  },

  addNotification(notif) {
    const list = this.getNotifications();
    const newNotif = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notif
    };
    list.unshift(newNotif);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
    
    // Dispatch event for UI updates
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("medicare:notification-received", { detail: newNotif }));
    }
    return newNotif;
  },

  /**
   * Reset all mock data to original defaults
   */
  resetToDefaults() {
    try {
      if (this.isStorageAvailable()) {
        localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
        localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
        localStorage.removeItem(STORAGE_KEYS.PATIENT_PROFILE);
        localStorage.removeItem(STORAGE_KEYS.PRESCRIPTIONS);
        localStorage.removeItem(STORAGE_KEYS.LAB_RESULTS);
        localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
      }
      this.init();
    } catch (e) {
      console.error("Error resetting defaults:", e);
    }
  }
};

// Auto-initialize on load
StorageManager.init();
