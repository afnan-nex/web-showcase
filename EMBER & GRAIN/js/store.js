/**
 * EMBER & GRAIN - RESILIENT STATE & LOCALSTORAGE STORE
 * Manages cart, favorites, reservations, and orders state across all pages.
 * Handles corrupted localStorage, private mode restrictions, and event subscriptions.
 */

const STORAGE_KEYS = {
  CART: "ember_grain_cart",
  FAVORITES: "ember_grain_favorites",
  RESERVATIONS: "ember_grain_reservations",
  ORDERS: "ember_grain_orders"
};

class Store {
  constructor() {
    this._listeners = new Map();
    this._memoryFallback = {};
    this._initSeedData();
  }

  // Safe localStorage getter
  _getItem(key) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return localStorage.getItem(key);
      }
    } catch (e) {
      console.warn("localStorage read restricted, using memory fallback", e);
    }
    return this._memoryFallback[key] || null;
  }

  // Safe localStorage setter
  _setItem(key, value) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn("localStorage write restricted, using memory fallback", e);
    }
    this._memoryFallback[key] = value;
  }

  // --- EVENT EMITTER ---
  subscribe(event, callback) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    this._listeners.get(event).push(callback);
    return () => {
      const list = this._listeners.get(event) || [];
      this._listeners.set(event, list.filter(cb => cb !== callback));
    };
  }

  notify(event, data) {
    const list = this._listeners.get(event) || [];
    list.forEach(cb => {
      try {
        cb(data);
      } catch (err) {
        console.error(`Store listener error for ${event}:`, err);
      }
    });
  }

  // --- INITIALIZE SEED DATA ---
  _initSeedData() {
    const existing = this._getItem(STORAGE_KEYS.RESERVATIONS);
    if (!existing) {
      const today = new Date();
      const dateStr = today.toISOString().split("T")[0];
      
      const sampleReservations = [
        {
          id: "EG-88412",
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          date: dateStr,
          time: "19:00",
          guests: 2,
          areaId: "hearth-room",
          areaName: "Main Hearth Room",
          tableId: "T-01",
          tableName: "Hearth Banquette 01",
          occasion: "Anniversary Celebration",
          guest: {
            name: "Lord Alexander Wright",
            email: "alexander.wright@luxurymail.com",
            phone: "+1 (212) 555-0192",
            notes: "Anniversary dinner, prefers quiet corner table."
          },
          status: "confirmed"
        },
        {
          id: "EG-91044",
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
          date: dateStr,
          time: "20:00",
          guests: 4,
          areaId: "veranda-garden",
          areaName: "The Glass Veranda",
          tableId: "VG-03",
          tableName: "Solarium Center 03",
          occasion: "Chef Tasting Experience",
          guest: {
            name: "Sophia Chen",
            email: "sophia.chen@studioarch.com",
            phone: "+1 (212) 555-0481",
            notes: "One guest has severe shellfish allergy. Sommelier reserve pairing requested."
          },
          status: "confirmed"
        }
      ];
      this._setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(sampleReservations));
    }
  }

  // --- CART MANAGEMENT ---
  getCart() {
    try {
      const data = this._getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn("Error reading cart from store, resetting to empty", e);
      return [];
    }
  }

  saveCart(cart) {
    this._setItem(STORAGE_KEYS.CART, JSON.stringify(cart || []));
    this.notify("cart:updated", cart);
  }

  addToCart(item, quantity = 1, selectedModifiers = [], specialInstructions = "") {
    const cart = this.getCart();
    
    // Create consistent signature for item + exact modifier list
    const modSignature = JSON.stringify(
      (selectedModifiers || []).sort((a, b) => (a.name || "").localeCompare(b.name || ""))
    );
    
    const existingIndex = cart.findIndex(ci => 
      ci.id === item.id && 
      JSON.stringify((ci.selectedModifiers || []).sort((a, b) => (a.name || "").localeCompare(b.name || ""))) === modSignature &&
      (ci.specialInstructions || "") === specialInstructions
    );

    const modCost = (selectedModifiers || []).reduce((sum, mod) => sum + (parseFloat(mod.price) || 0), 0);
    const unitPrice = (parseFloat(item.price) || 0) + modCost;

    if (existingIndex > -1) {
      cart[existingIndex].quantity += Math.max(1, parseInt(quantity, 10) || 1);
    } else {
      cart.push({
        uid: "citem_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        id: item.id,
        name: item.name,
        category: item.category,
        basePrice: item.price,
        unitPrice: unitPrice,
        image: item.image,
        dietary: item.dietary || [],
        quantity: Math.max(1, parseInt(quantity, 10) || 1),
        selectedModifiers: selectedModifiers || [],
        specialInstructions: specialInstructions || ""
      });
    }

    this.saveCart(cart);
    return cart;
  }

  updateCartQuantity(uid, quantity) {
    let cart = this.getCart();
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      cart = cart.filter(ci => ci.uid !== uid);
    } else {
      const item = cart.find(ci => ci.uid === uid);
      if (item) item.quantity = Math.min(50, qty);
    }
    this.saveCart(cart);
    return cart;
  }

  removeFromCart(uid) {
    let cart = this.getCart();
    cart = cart.filter(ci => ci.uid !== uid);
    this.saveCart(cart);
    return cart;
  }

  clearCart() {
    this.saveCart([]);
  }

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((sum, i) => sum + (parseInt(i.quantity, 10) || 0), 0);
  }

  getCartTotals(tipRate = 0.20, orderType = "pickup") {
    const cart = this.getCart();
    const subtotal = cart.reduce((sum, i) => sum + (parseFloat(i.unitPrice || 0) * parseInt(i.quantity || 1, 10)), 0);
    const taxRate = 0.08875; // NYC Sales Tax 8.875%
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const gratuity = Math.round(subtotal * tipRate * 100) / 100;
    const deliveryFee = orderType === "delivery" ? (subtotal >= 100 ? 0 : 7.50) : 0;
    const serviceFee = subtotal > 0 ? 2.50 : 0;
    const total = Math.round((subtotal + tax + gratuity + deliveryFee + serviceFee) * 100) / 100;

    return {
      subtotal,
      tax,
      taxRate,
      gratuity,
      tipRate,
      deliveryFee,
      serviceFee,
      total,
      itemCount: this.getCartCount()
    };
  }

  // --- FAVORITES MANAGEMENT ---
  getFavorites() {
    try {
      const data = this._getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  isFavorite(itemId) {
    const favs = this.getFavorites();
    return favs.includes(itemId);
  }

  toggleFavorite(itemId) {
    let favs = this.getFavorites();
    let isNowFav = false;
    if (favs.includes(itemId)) {
      favs = favs.filter(id => id !== itemId);
      isNowFav = false;
    } else {
      favs.push(itemId);
      isNowFav = true;
    }
    this._setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    this.notify("favorites:updated", { itemId, isFavorite: isNowFav, allFavorites: favs });
    return isNowFav;
  }

  // --- RESERVATIONS MANAGEMENT ---
  getReservations() {
    try {
      const data = this._getItem(STORAGE_KEYS.RESERVATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  getReservationById(id) {
    if (!id) return null;
    const list = this.getReservations();
    return list.find(r => r.id.toUpperCase() === id.trim().toUpperCase()) || null;
  }

  saveReservation(reservationData) {
    const list = this.getReservations();
    
    // Check for duplicate reservation
    const duplicate = list.find(r => 
      r.status !== "cancelled" &&
      r.date === reservationData.date &&
      r.time === reservationData.time &&
      (r.guest.email.toLowerCase() === reservationData.guest.email.toLowerCase() ||
       r.guest.phone.replace(/\D/g, '') === reservationData.guest.phone.replace(/\D/g, ''))
    );

    if (duplicate) {
      throw new Error(`A reservation already exists for ${reservationData.guest.name} on ${reservationData.date} at ${reservationData.time} (Booking ID: ${duplicate.id}).`);
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newReservation = {
      id: `EG-${randomNum}`,
      createdAt: new Date().toISOString(),
      status: "confirmed",
      ...reservationData
    };

    list.unshift(newReservation);
    this._setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(list));
    this.notify("reservations:updated", list);
    return newReservation;
  }

  modifyReservation(id, updatedFields) {
    let list = this.getReservations();
    const index = list.findIndex(r => r.id.toUpperCase() === id.trim().toUpperCase());
    if (index === -1) throw new Error("Reservation itinerary not found.");

    list[index] = {
      ...list[index],
      ...updatedFields,
      modifiedAt: new Date().toISOString()
    };

    this._setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(list));
    this.notify("reservations:updated", list);
    return list[index];
  }

  cancelReservation(id) {
    let list = this.getReservations();
    const index = list.findIndex(r => r.id.toUpperCase() === id.trim().toUpperCase());
    if (index === -1) throw new Error("Reservation itinerary not found.");

    list[index].status = "cancelled";
    list[index].cancelledAt = new Date().toISOString();

    this._setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(list));
    this.notify("reservations:updated", list);
    return list[index];
  }

  // --- ORDERS MANAGEMENT ---
  getOrders() {
    try {
      const data = this._getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  getOrderById(id) {
    if (!id) return null;
    const list = this.getOrders();
    return list.find(o => o.id.toUpperCase() === id.trim().toUpperCase()) || null;
  }

  createOrder(orderData) {
    const list = this.getOrders();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: `EG-ORD-${randomNum}`,
      createdAt: new Date().toISOString(),
      status: "placed",
      timeline: [
        { status: "placed", label: "Order Received by Host Stand", timestamp: new Date().toISOString(), completed: true }
      ],
      estimatedTime: orderData.orderType === "delivery" ? "45-55 mins" : "25-35 mins",
      ...orderData
    };

    list.unshift(newOrder);
    this._setItem(STORAGE_KEYS.ORDERS, JSON.stringify(list));
    this.notify("orders:updated", list);
    return newOrder;
  }

  updateOrderStatus(orderId, newStatus) {
    const list = this.getOrders();
    const order = list.find(o => o.id.toUpperCase() === orderId.trim().toUpperCase());
    if (!order) return null;

    order.status = newStatus;
    if (!order.timeline.some(t => t.status === newStatus)) {
      const labels = {
        preparing: "White Oak Hearth Preparation in Kitchen",
        ready: order.orderType === "delivery" ? "Courier En Route for Manhattan Delivery" : "Ready at 482 Hudson St Host Stand",
        completed: order.orderType === "delivery" ? "Order Delivered to Patron" : "Order Collected by Patron"
      };
      order.timeline.push({
        status: newStatus,
        label: labels[newStatus] || newStatus,
        timestamp: new Date().toISOString(),
        completed: true
      });
    }

    this._setItem(STORAGE_KEYS.ORDERS, JSON.stringify(list));
    this.notify("orders:updated", list);
    return order;
  }
}

// Global Store Instance
window.EG_STORE = new Store();
