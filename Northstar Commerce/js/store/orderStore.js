/**
 * NORTHSTAR COMMERCE - Order Management & Customer Account Store
 */

import { Storage } from '../utils/storage.js';
import { generateOrderId } from '../utils/helpers.js';
import { cartStore } from './cartStore.js';
import { Toast } from '../utils/toast.js';

const ORDERS_KEY = 'customer_orders';
const USER_PROFILE_KEY = 'customer_profile';

// Seed demo past order if empty so customer history looks rich immediately
const DEFAULT_DEMO_ORDER = {
  orderId: 'NS-783921',
  date: '2026-08-10T14:32:00Z',
  status: 'Delivered',
  trackingNumber: 'TRK-9823184920',
  carrier: 'DHL Express',
  customer: {
    fullName: 'Alexander Wright',
    email: 'alexander.wright@atelier.io',
    phone: '+1 (555) 234-5678',
    address: '420 Madison Avenue, Suite 1800',
    city: 'New York',
    state: 'NY',
    postalCode: '10017',
    country: 'United States'
  },
  shippingMethod: 'Express Courier',
  payment: {
    method: 'Credit Card',
    last4: '4242',
    cardBrand: 'Visa'
  },
  items: [
    {
      productId: 'prod-8',
      name: 'AURA 01 Planar Magnetic Reference Headphones',
      brand: 'LUMEN Audio',
      price: 790,
      color: 'Brushed Silver & Lambskin',
      size: 'Open-Back Edition',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
    }
  ],
  subtotal: 790,
  discount: 0,
  shippingFee: 0,
  tax: 63.20,
  total: 853.20
};

class OrderStore {
  constructor() {
    this.orders = this.loadOrders();
    this.profile = this.loadProfile();
  }

  loadOrders() {
    const saved = Storage.get(ORDERS_KEY, null);
    if (saved && Array.isArray(saved)) {
      return saved;
    }
    // Seed initial demo order
    const initial = [DEFAULT_DEMO_ORDER];
    Storage.set(ORDERS_KEY, initial);
    return initial;
  }

  loadProfile() {
    return Storage.get(USER_PROFILE_KEY, {
      fullName: 'Alexander Wright',
      email: 'alexander.wright@atelier.io',
      phone: '+1 (555) 234-5678',
      address: '420 Madison Avenue, Suite 1800',
      city: 'New York',
      state: 'NY',
      postalCode: '10017',
      country: 'United States'
    });
  }

  saveOrders() {
    Storage.set(ORDERS_KEY, this.orders);
  }

  saveProfile(profileData) {
    this.profile = { ...this.profile, ...profileData };
    Storage.set(USER_PROFILE_KEY, this.profile);
    Toast.success('Profile preferences updated.');
  }

  getOrders() {
    return this.orders;
  }

  getOrderById(orderId) {
    return this.orders.find(o => o.orderId === orderId) || null;
  }

  getProfile() {
    return this.profile;
  }

  /**
   * Process and place order from checkout
   */
  createOrder(checkoutData) {
    const summary = cartStore.getSummary();
    const cartItems = cartStore.getItems();

    if (!cartItems || cartItems.length === 0) {
      throw new Error('Your cart is empty.');
    }

    const orderId = generateOrderId();
    const newOrder = {
      orderId,
      date: new Date().toISOString(),
      status: 'Processing',
      trackingNumber: `TRK-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      carrier: 'DHL Express Worldwide',
      customer: {
        fullName: `${checkoutData.firstName} ${checkoutData.lastName}`,
        email: checkoutData.email,
        phone: checkoutData.phone,
        address: checkoutData.address,
        apartment: checkoutData.apartment || '',
        city: checkoutData.city,
        state: checkoutData.state,
        postalCode: checkoutData.postalCode,
        country: checkoutData.country || 'United States'
      },
      shippingMethod: checkoutData.shippingMethodName || 'Standard Tracked Delivery',
      payment: {
        method: checkoutData.paymentMethod || 'Credit Card',
        last4: checkoutData.cardNumber ? checkoutData.cardNumber.replace(/\s+/g, '').slice(-4) : '4242',
        cardBrand: 'Visa'
      },
      items: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        brand: item.brand,
        price: item.price,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        image: item.image
      })),
      subtotal: summary.subtotal,
      discount: summary.discount,
      couponCode: summary.couponCode,
      shippingFee: summary.shippingFee,
      tax: summary.estimatedTax,
      total: summary.grandTotal
    };

    // Prepend to orders history
    this.orders.unshift(newOrder);
    this.saveOrders();

    // Optionally update user profile with latest shipping address
    this.profile = {
      ...this.profile,
      fullName: newOrder.customer.fullName,
      email: newOrder.customer.email,
      phone: newOrder.customer.phone,
      address: newOrder.customer.address,
      city: newOrder.customer.city,
      state: newOrder.customer.state,
      postalCode: newOrder.customer.postalCode,
      country: newOrder.customer.country
    };
    Storage.set(USER_PROFILE_KEY, this.profile);

    // Clear cart
    cartStore.clear();

    return newOrder;
  }
}

export const orderStore = new OrderStore();
