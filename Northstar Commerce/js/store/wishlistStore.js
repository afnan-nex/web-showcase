/**
 * NORTHSTAR COMMERCE - Wishlist State Management
 */

import { Storage } from '../utils/storage.js';
import { Toast } from '../utils/toast.js';

const WISHLIST_STORAGE_KEY = 'wishlist_ids';

class WishlistStore {
  constructor() {
    this.listeners = [];
    this.productIds = this.loadState();
  }

  loadState() {
    const saved = Storage.get(WISHLIST_STORAGE_KEY, []);
    return Array.isArray(saved) ? saved : [];
  }

  saveState() {
    Storage.set(WISHLIST_STORAGE_KEY, this.productIds);
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.productIds));
  }

  getItems() {
    return this.productIds;
  }

  getCount() {
    return this.productIds.length;
  }

  has(productId) {
    return this.productIds.includes(productId);
  }

  toggle(product) {
    if (!product || !product.id) return false;
    const exists = this.has(product.id);

    if (exists) {
      this.productIds = this.productIds.filter(id => id !== product.id);
      Toast.info(`Removed "${product.name}" from your wishlist.`);
    } else {
      this.productIds.push(product.id);
      Toast.success(`Saved "${product.name}" to your wishlist.`);
    }

    this.saveState();
    return !exists;
  }

  add(product) {
    if (!product || !product.id) return;
    if (!this.has(product.id)) {
      this.productIds.push(product.id);
      this.saveState();
      Toast.success(`Saved "${product.name}" to your wishlist.`);
    }
  }

  remove(productId) {
    this.productIds = this.productIds.filter(id => id !== productId);
    this.saveState();
  }

  clear() {
    this.productIds = [];
    this.saveState();
    Toast.info('Wishlist cleared.');
  }
}

export const wishlistStore = new WishlistStore();
