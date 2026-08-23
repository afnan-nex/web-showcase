/**
 * NORTHSTAR COMMERCE - Global Fuzzy Search Modal Component
 */

import { productStore } from '../store/productStore.js';
import { debounce, formatPrice, getSvgIcon } from '../utils/helpers.js';

export const SearchModal = {
  modalEl: null,
  inputEl: null,
  resultsEl: null,

  init() {
    this.modalEl = document.getElementById('search-modal');
    if (!this.modalEl) return;

    this.inputEl = this.modalEl.querySelector('.search-main-input');
    this.resultsEl = this.modalEl.querySelector('.search-results-list');

    // Close listeners
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl || e.target.closest('.modal-close-btn')) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e && e.key === 'Escape' && this.modalEl.classList.contains('open')) {
        this.close();
      }
      // Global shortcut: Ctrl+K or '/' to open search
      if (e && (e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        this.open();
      }
    });

    // Debounced search typing listener
    if (this.inputEl) {
      this.inputEl.addEventListener('input', debounce((e) => {
        this.performSearch(e.target.value);
      }, 180));
    }

    // Quick tag chips click
    this.modalEl.addEventListener('click', (e) => {
      const chip = e.target.closest('.search-chip');
      if (chip) {
        const query = chip.getAttribute('data-search-tag');
        if (this.inputEl) {
          this.inputEl.value = query;
          this.performSearch(query);
        }
      }
    });
  },

  open(initialQuery = '') {
    if (!this.modalEl) return;
    this.modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (this.inputEl) {
      this.inputEl.value = initialQuery;
      setTimeout(() => this.inputEl.focus(), 50);
      this.performSearch(initialQuery);
    }
  },

  close() {
    if (!this.modalEl) return;
    this.modalEl.classList.remove('open');
    document.body.style.overflow = '';
  },

  performSearch(query) {
    if (!this.resultsEl) return;

    const trimmed = (query || '').trim();

    if (!trimmed) {
      this.resultsEl.innerHTML = `
        <div style="padding: var(--space-4) 0; color: var(--color-text-muted); font-size: var(--text-sm); text-align: center;">
          Type to search products, brands, or materials...
        </div>
      `;
      return;
    }

    const matches = productStore.filterAndSort({ searchQuery: trimmed });

    if (matches.length === 0) {
      this.resultsEl.innerHTML = `
        <div style="padding: var(--space-8) 0; text-align: center;">
          <p style="font-size: var(--text-sm); font-weight: 600; margin-bottom: 4px;">No matching items found for "${trimmed}"</p>
          <p class="text-xs text-muted">Try checking for spelling errors or searching for broad terms like "wool", "audio", "titanium", or "living".</p>
        </div>
      `;
      return;
    }

    this.resultsEl.innerHTML = `
      <div style="font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 8px; display: flex; justify-content: space-between;">
        <span>Found ${matches.length} matches</span>
        <a href="#/shop?q=${encodeURIComponent(trimmed)}" onclick="document.getElementById('search-modal').classList.remove('open'); document.body.style.overflow='';" style="color: var(--color-accent); text-decoration: underline;">View all in Catalog →</a>
      </div>
      ${matches.slice(0, 8).map(p => `
        <a href="#/product/${p.id}" class="search-result-item" onclick="document.getElementById('search-modal').classList.remove('open'); document.body.style.overflow='';">
          <img src="${p.images[0]}" alt="${p.name}" class="search-result-img" />
          <div style="flex: 1; min-width: 0;">
            <div class="text-xs text-muted text-uppercase" style="letter-spacing: 0.05em;">${p.brand} • ${p.category}</div>
            <div style="font-size: var(--text-sm); font-weight: 600; color: var(--color-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</div>
          </div>
          <div style="font-size: var(--text-sm); font-weight: 700; color: var(--color-text-primary);">
            ${formatPrice(p.price)}
          </div>
        </a>
      `).join('')}
    `;
  }
};
