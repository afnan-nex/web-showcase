/**
 * NORTHSTAR COMMERCE - Product Query & Store Engine
 */

import { PRODUCTS, CATEGORIES, BRANDS } from '../data/products.js';
import { Storage } from '../utils/storage.js';
import { fuzzySearch } from '../utils/helpers.js';
import { Toast } from '../utils/toast.js';

const RECENTLY_VIEWED_KEY = 'recently_viewed';
const CUSTOM_REVIEWS_KEY = 'custom_reviews';

class ProductStore {
  constructor() {
    this.rawProducts = PRODUCTS;
    this.categories = CATEGORIES;
    this.brands = BRANDS;
    this.customReviews = Storage.get(CUSTOM_REVIEWS_KEY, {});
  }

  /**
   * Get all products with dynamic customer reviews attached
   */
  getAllProducts() {
    return this.rawProducts.map(product => {
      const addedReviews = this.customReviews[product.id] || [];
      const allReviews = [...(product.reviews || []), ...addedReviews];
      
      let calculatedRating = product.rating;
      let calculatedCount = product.reviewsCount;

      if (addedReviews.length > 0) {
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        calculatedRating = Number((totalRating / allReviews.length).toFixed(1));
        calculatedCount = allReviews.length;
      }

      return {
        ...product,
        reviews: allReviews,
        rating: calculatedRating,
        reviewsCount: calculatedCount
      };
    });
  }

  getProductById(id) {
    const products = this.getAllProducts();
    return products.find(p => p.id === id) || null;
  }

  getCategories() {
    return this.categories;
  }

  getBrands() {
    return this.brands;
  }

  /**
   * Advanced Multi-Facet Filter and Sort
   */
  filterAndSort(options = {}) {
    let list = this.getAllProducts();

    const {
      category = 'all',
      searchQuery = '',
      minPrice = 0,
      maxPrice = Infinity,
      brands = [],
      minRating = 0,
      inStockOnly = false,
      onSaleOnly = false,
      sortBy = 'featured'
    } = options;

    // Category filter
    if (category && category !== 'all') {
      list = list.filter(p => p.category === category);
    }

    // Search query
    if (searchQuery && searchQuery.trim()) {
      list = fuzzySearch(searchQuery, list);
    }

    // Price range
    list = list.filter(p => p.price >= minPrice && (maxPrice === Infinity || p.price <= maxPrice));

    // Brands
    if (brands.length > 0) {
      list = list.filter(p => brands.includes(p.brand));
    }

    // Rating
    if (minRating > 0) {
      list = list.filter(p => p.rating >= minRating);
    }

    // In stock
    if (inStockOnly) {
      list = list.filter(p => p.stock > 0);
    }

    // On sale
    if (onSaleOnly) {
      list = list.filter(p => p.originalPrice && p.originalPrice > p.price);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
        break;
      case 'newest':
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return list;
  }

  // ----------------------------------------------------
  // Recently Viewed Products System
  // ----------------------------------------------------
  trackRecentlyViewed(productId) {
    if (!productId) return;
    let recent = Storage.get(RECENTLY_VIEWED_KEY, []);
    recent = recent.filter(id => id !== productId);
    recent.unshift(productId);
    if (recent.length > 8) {
      recent = recent.slice(0, 8);
    }
    Storage.set(RECENTLY_VIEWED_KEY, recent);
  }

  getRecentlyViewedProducts(currentProductId = null) {
    const recentIds = Storage.get(RECENTLY_VIEWED_KEY, []);
    const filteredIds = currentProductId ? recentIds.filter(id => id !== currentProductId) : recentIds;
    return filteredIds
      .map(id => this.getProductById(id))
      .filter(Boolean);
  }

  // ----------------------------------------------------
  // Review Submission & Persistence System
  // ----------------------------------------------------
  addReview(productId, reviewData) {
    const { author, rating, title, content } = reviewData;
    if (!author || !rating || !content) {
      Toast.error('Please complete all required review fields.');
      return false;
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      avatar: author.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'CU',
      rating: Number(rating),
      title: title ? title.trim() : '',
      content: content.trim(),
      date: 'Just now',
      verified: true,
      helpful: 0
    };

    if (!this.customReviews[productId]) {
      this.customReviews[productId] = [];
    }

    this.customReviews[productId].unshift(newReview);
    Storage.set(CUSTOM_REVIEWS_KEY, this.customReviews);
    Toast.success('Thank you! Your review has been published.');
    return newReview;
  }
}

export const productStore = new ProductStore();
