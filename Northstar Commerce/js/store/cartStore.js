/**
 * NORTHSTAR COMMERCE - Cart State Management
 */

import { Storage } from '../utils/storage.js';
import { evaluateCoupon } from '../data/coupons.js';
import { Toast } from '../utils/toast.js';

const CART_STORAGE_KEY = 'cart_state';
const FREE_SHIPPING_THRESHOLD = 150; // $150 for free standard shipping
const STANDARD_SHIPPING_FEE = 15;
const TAX_RATE = 0.08; // 8%

class CartStore {
  constructor() {
    this.listeners = [];
    this.state = this.loadState();
  }

  loadState() {
    const saved = Storage.get(CART_STORAGE_KEY, null);
    if (saved && Array.isArray(saved.items)) {
      return {
        items: saved.items,
        couponCode: saved.couponCode || null,
        shippingMethod: saved.shippingMethod || 'standard',
        orderNotes: saved.orderNotes || ''
      };
    }
    return {
      items: [],
      couponCode: null,
      shippingMethod: 'standard',
      orderNotes: ''
    };
  }

  saveState() {
    Storage.set(CART_STORAGE_KEY, this.state);
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    const summary = this.getSummary();
    this.listeners.forEach(fn => fn(this.state, summary));
  }

  getItems() {
    return this.state.items;
  }

  getCount() {
    return this.state.items.reduce((total, item) => total + item.quantity, 0);
  }

  addItem(product, variant = {}, quantity = 1) {
    if (!product || product.stock <= 0) {
      Toast.error('Sorry, this product is currently sold out.');
      return false;
    }

    const color = variant.color || (product.variants?.colors?.[0]?.name || 'Standard');
    const size = variant.size || (product.variants?.sizes?.[0] || 'Standard');
    const itemKey = `${product.id}_${color}_${size}`;

    const existingIndex = this.state.items.findIndex(item => item.key === itemKey);

    if (existingIndex > -1) {
      const currentQty = this.state.items[existingIndex].quantity;
      const newQty = currentQty + quantity;
      
      if (newQty > product.stock) {
        Toast.warning(`Maximum available stock (${product.stock} units) reached for this selection.`);
        this.state.items[existingIndex].quantity = product.stock;
      } else {
        this.state.items[existingIndex].quantity = newQty;
        Toast.success(`Updated "${product.name}" quantity in bag.`);
      }
    } else {
      const initialQty = Math.min(quantity, product.stock);
      this.state.items.push({
        key: itemKey,
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        color: color,
        size: size,
        quantity: initialQty,
        maxStock: product.stock
      });
      Toast.success(`Added "${product.name}" (${color}) to your bag.`);
    }

    this.saveState();
    return true;
  }

  updateQuantity(itemKey, quantity) {
    const item = this.state.items.find(i => i.key === itemKey);
    if (!item) return;

    if (quantity <= 0) {
      this.removeItem(itemKey);
      return;
    }

    if (quantity > item.maxStock) {
      item.quantity = item.maxStock;
      Toast.warning(`Cannot exceed available inventory (${item.maxStock} units).`);
    } else {
      item.quantity = quantity;
    }

    this.saveState();
  }

  removeItem(itemKey) {
    const item = this.state.items.find(i => i.key === itemKey);
    const itemName = item ? item.name : 'Item';
    this.state.items = this.state.items.filter(i => i.key !== itemKey);
    this.saveState();
    Toast.info(`Removed "${itemName}" from bag.`);
  }

  clear() {
    this.state.items = [];
    this.state.couponCode = null;
    this.state.orderNotes = '';
    this.saveState();
  }

  applyCoupon(code) {
    const subtotal = this.getSubtotal();
    const evaluation = evaluateCoupon(code, subtotal);

    if (!evaluation.valid) {
      Toast.error(evaluation.message);
      return false;
    }

    this.state.couponCode = evaluation.coupon.code;
    this.saveState();
    Toast.success(evaluation.message);
    return true;
  }

  removeCoupon() {
    this.state.couponCode = null;
    this.saveState();
    Toast.info('Promo code removed.');
  }

  setShippingMethod(method) {
    this.state.shippingMethod = method;
    this.saveState();
  }

  getSubtotal() {
    return this.state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getSummary() {
    const subtotal = this.getSubtotal();
    let discount = 0;
    let couponDetails = null;

    if (this.state.couponCode) {
      const evaluation = evaluateCoupon(this.state.couponCode, subtotal);
      if (evaluation.valid) {
        discount = evaluation.discountAmount;
        couponDetails = evaluation.coupon;
      } else {
        this.state.couponCode = null;
      }
    }

    let shippingFee = 0;
    const isFreeShippingByAmount = subtotal >= FREE_SHIPPING_THRESHOLD;
    const isFreeShippingByCoupon = couponDetails?.type === 'shipping';

    if (this.state.items.length === 0) {
      shippingFee = 0;
    } else if (isFreeShippingByCoupon || (isFreeShippingByAmount && this.state.shippingMethod === 'standard')) {
      shippingFee = 0;
    } else if (this.state.shippingMethod === 'express') {
      shippingFee = 25;
    } else if (this.state.shippingMethod === 'overnight') {
      shippingFee = 45;
    } else {
      shippingFee = STANDARD_SHIPPING_FEE;
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const estimatedTax = discountedSubtotal > 0 ? discountedSubtotal * TAX_RATE : 0;
    const grandTotal = discountedSubtotal + shippingFee + estimatedTax;

    const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

    return {
      itemsCount: this.getCount(),
      subtotal,
      discount,
      couponCode: this.state.couponCode,
      couponDetails,
      shippingFee,
      shippingMethod: this.state.shippingMethod,
      estimatedTax,
      grandTotal,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      freeShippingRemaining,
      freeShippingProgress,
      isFreeShipping: isFreeShippingByAmount || isFreeShippingByCoupon
    };
  }
}

export const cartStore = new CartStore();
