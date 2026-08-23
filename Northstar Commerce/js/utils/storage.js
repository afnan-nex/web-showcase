/**
 * NORTHSTAR COMMERCE - LocalStorage Management & State Sync
 */

const PREFIX = 'northstar_';

// In-memory fallback if localStorage is unavailable
const memoryFallback = {};

export const Storage = {
  get(key, defaultValue = null) {
    try {
      if (typeof localStorage !== 'undefined') {
        const item = localStorage.getItem(PREFIX + key);
        return item ? JSON.parse(item) : defaultValue;
      }
      return memoryFallback[PREFIX + key] ? JSON.parse(memoryFallback[PREFIX + key]) : defaultValue;
    } catch (e) {
      console.warn(`Storage get error for key "${key}":`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(PREFIX + key, serialized);
      } else {
        memoryFallback[PREFIX + key] = serialized;
      }
      return true;
    } catch (e) {
      console.warn(`Storage set error for key "${key}":`, e);
      return false;
    }
  },

  remove(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(PREFIX + key);
      } else {
        delete memoryFallback[PREFIX + key];
      }
      return true;
    } catch (e) {
      console.warn(`Storage remove error for key "${key}":`, e);
      return false;
    }
  },

  clearAll() {
    try {
      if (typeof localStorage !== 'undefined') {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(PREFIX)) {
            localStorage.removeItem(key);
          }
        });
      } else {
        Object.keys(memoryFallback).forEach(k => delete memoryFallback[k]);
      }
      return true;
    } catch (e) {
      console.warn('Storage clearAll error:', e);
      return false;
    }
  }
};
