/**
 * NORTHSTAR COMMERCE - Product Detail Page (PDP) View
 * Split Editorial Layout with Sticky Gallery & Comprehensive Specs
 */

import { productStore } from '../store/productStore.js';
import { cartStore } from '../store/cartStore.js';
import { wishlistStore } from '../store/wishlistStore.js';
import { renderProductCard } from '../components/productCard.js';
import { formatPrice, renderStars, getSvgIcon } from '../utils/helpers.js';
import { Toast } from '../utils/toast.js';

export const ProductView = {
  state: {
    product: null,
    selectedImage: '',
    selectedColor: '',
    selectedSize: '',
    quantity: 1,
    reviewModalOpen: false
  },

  render(routeParams = {}) {
    const productId = routeParams.id;
    const product = productStore.getProductById(productId);

    if (!product) {
      return `
        <div class="container" style="padding: var(--space-20) 0; text-align: center;">
          <h2>Product Not Found</h2>
          <p class="text-muted" style="margin: var(--space-4) 0 var(--space-8);">The requested product piece does not exist or has been archived.</p>
          <a href="#/shop" class="btn btn-primary">Return to Catalog</a>
        </div>
      `;
    }

    // Track recently viewed
    productStore.trackRecentlyViewed(product.id);

    this.state.product = product;
    if (!this.state.selectedImage || !product.images.includes(this.state.selectedImage)) {
      this.state.selectedImage = product.images[0];
    }
    if (!this.state.selectedColor) {
      this.state.selectedColor = product.variants?.colors?.[0]?.name || 'Standard';
    }
    if (!this.state.selectedSize) {
      this.state.selectedSize = product.variants?.sizes?.[0] || 'Standard';
    }

    const isWishlisted = wishlistStore.has(product.id);
    const isSale = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = isSale ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    const isSoldOut = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 3;

    // Calculate rating histogram
    const totalReviews = product.reviews.length;
    const histogramCounts = [5, 4, 3, 2, 1].map(stars => {
      const count = product.reviews.filter(r => Math.floor(r.rating) === stars).length;
      const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
      return { stars, count, pct };
    });

    // Related products (same category, excluding current)
    const related = productStore.getAllProducts()
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);

    // Recently viewed products
    const recentlyViewed = productStore.getRecentlyViewedProducts(product.id).slice(0, 4);

    return `
      <div class="pdp-page container">
        <!-- Breadcrumbs -->
        <nav class="shop-breadcrumbs" aria-label="Breadcrumbs" style="margin-bottom: var(--space-6);">
          <a href="#/home">Home</a>
          <span>/</span>
          <a href="#/shop">Catalog</a>
          <span>/</span>
          <a href="#/category/${product.category}">${product.category.toUpperCase()}</a>
          <span>/</span>
          <span style="color: var(--color-text-primary); font-weight: 600;">${product.name}</span>
        </nav>

        <div class="pdp-grid">
          <!-- Left Column: Gallery -->
          <div class="pdp-gallery-wrap">
            <!-- Thumbnails Strip -->
            <div class="pdp-thumbs-list">
              ${product.images.map((img, idx) => `
                <div class="pdp-thumb-item ${img === this.state.selectedImage ? 'active' : ''}" data-pdp-thumb="${img}">
                  <img src="${img}" alt="${product.name} angle ${idx + 1}" />
                </div>
              `).join('')}
            </div>

            <!-- Main High-Res Viewer -->
            <div class="pdp-main-image-wrap" id="pdp-main-img-box">
              <img src="${this.state.selectedImage}" alt="${product.name}" class="pdp-main-image" id="pdp-main-image-el" />
              ${isSoldOut ? `
                <div style="position: absolute; top: 12px; left: 12px; z-index: 5;">
                  <span class="badge badge-soldout">Sold Out</span>
                </div>
              ` : isSale ? `
                <div style="position: absolute; top: 12px; left: 12px; z-index: 5;">
                  <span class="badge badge-sale">Save ${discountPercent}%</span>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Right Column: Product Details & Purchase Block -->
          <div class="pdp-info-column">
            <div class="pdp-meta-strip">
              <span class="pdp-brand-tag">${product.brand}</span>
              <span class="text-xs font-mono text-muted">SKU: ${product.sku}</span>
            </div>

            <h1 class="pdp-title font-serif">${product.name}</h1>

            <div class="pdp-reviews-row">
              ${renderStars(product.rating, 15)}
              <a href="#reviews-section" style="text-decoration: underline; font-size: var(--text-xs); color: var(--color-text-secondary);">
                ${product.rating} rating (${product.reviewsCount} customer reviews)
              </a>
            </div>

            <div class="pdp-price-box">
              <span class="pdp-current-price">${formatPrice(product.price)}</span>
              ${isSale ? `
                <span class="pdp-original-price">${formatPrice(product.originalPrice)}</span>
                <span class="badge badge-sale">-${discountPercent}%</span>
              ` : ''}
              <span class="text-xs text-muted" style="margin-left: auto;">Tax included. Shipping calculated at checkout.</span>
            </div>

            <!-- Short Editorial Intro -->
            <p style="font-size: var(--text-base); color: var(--color-text-secondary); line-height: 1.6; margin-bottom: var(--space-6);">
              ${product.shortDescription}
            </p>

            <!-- Color Variant Selector -->
            ${product.variants?.colors ? `
              <div class="pdp-block">
                <div class="pdp-block-header">
                  <span>Colorway: <strong style="color: var(--color-text-primary); text-transform: none;">${this.state.selectedColor}</strong></span>
                </div>
                <div class="pdp-color-swatches">
                  ${product.variants.colors.map(c => `
                    <button type="button" class="pdp-color-swatch-btn ${this.state.selectedColor === c.name ? 'active' : ''}" data-pdp-color="${c.name}" ${!c.inStock ? 'style="opacity: 0.5;"' : ''}>
                      <span style="width: 14px; height: 14px; border-radius: 50%; background-color: ${c.hex}; display: inline-block; border: 1px solid rgba(0,0,0,0.1);"></span>
                      <span>${c.name}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Size / Model Variant Selector -->
            ${product.variants?.sizes ? `
              <div class="pdp-block">
                <div class="pdp-block-header">
                  <span>Select Size / Model: <strong style="color: var(--color-text-primary); text-transform: none;">${this.state.selectedSize}</strong></span>
                </div>
                <div class="pdp-size-options">
                  ${product.variants.sizes.map(s => `
                    <button type="button" class="pdp-size-btn ${this.state.selectedSize === s ? 'active' : ''}" data-pdp-size="${s}">
                      ${s}
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Live Stock Status Pill -->
            <div class="pdp-stock-status">
              <span class="stock-indicator-dot ${isSoldOut ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}"></span>
              <span>
                ${isSoldOut
                  ? 'Currently Sold Out — Join the waitlist for the next release.'
                  : isLowStock
                    ? `Low Inventory: Only ${product.stock} units left in the studio.`
                    : `In Stock — Ready to ship from our fulfillment atelier.`}
              </span>
            </div>

            <!-- Add to Bag / Buy Now / Wishlist Row -->
            ${!isSoldOut ? `
              <div class="pdp-cta-row">
                <div class="qty-control" style="height: 48px;">
                  <button type="button" class="qty-btn" id="pdp-qty-dec" style="width: 40px; font-size: 1.1rem;">−</button>
                  <input type="text" class="qty-input" id="pdp-qty-input" value="${this.state.quantity}" readonly style="width: 40px; font-size: 15px;" />
                  <button type="button" class="qty-btn" id="pdp-qty-inc" style="width: 40px; font-size: 1.1rem;">+</button>
                </div>
                <button type="button" class="btn btn-primary" id="pdp-add-to-cart-btn" style="flex: 1; height: 48px; font-size: var(--text-base);">
                  Add to Bag • ${formatPrice(product.price * this.state.quantity)}
                </button>
                <button type="button" class="btn-icon" id="pdp-wishlist-toggle-btn" style="width: 48px; height: 48px; color: ${isWishlisted ? 'var(--color-danger)' : 'inherit'};" title="Save to wishlist">
                  ${isWishlisted ? getSvgIcon('heartFilled') : getSvgIcon('heart')}
                </button>
              </div>

              <button type="button" class="btn btn-secondary btn-full pdp-buy-now-btn" id="pdp-buy-now-btn">
                Instant Buy with 1-Click Checkout
              </button>
            ` : `
              <div style="margin-bottom: var(--space-8);">
                <button type="button" class="btn btn-secondary btn-full" disabled style="height: 48px;">Sold Out</button>
              </div>
            `}

            <!-- Compact Value Prop Badges -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); padding: var(--space-4) 0; border-top: 1px solid var(--color-border-subtle); border-bottom: 1px solid var(--color-border-subtle); margin-bottom: var(--space-6); font-size: var(--text-xs); color: var(--color-text-secondary);">
              <div style="display: flex; align-items: center; gap: 8px;">
                ${getSvgIcon('truck')}
                <span>Complimentary Delivery over $150</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                ${getSvgIcon('refresh')}
                <span>30-Day Hassle-Free Returns</span>
              </div>
            </div>

            <!-- Accordion Details -->
            <div class="pdp-accordions">
              <!-- Description -->
              <div class="pdp-accordion-item open">
                <button type="button" class="pdp-accordion-trigger">
                  <span>Product Story & Design Rationale</span>
                  <span class="pdp-accordion-icon">${getSvgIcon('chevronDown')}</span>
                </button>
                <div class="pdp-accordion-content">
                  <p>${product.description}</p>
                </div>
              </div>

              <!-- Materials & Specifications -->
              <div class="pdp-accordion-item">
                <button type="button" class="pdp-accordion-trigger">
                  <span>Materials & Specifications</span>
                  <span class="pdp-accordion-icon">${getSvgIcon('chevronDown')}</span>
                </button>
                <div class="pdp-accordion-content">
                  <table style="width: 100%; border-collapse: collapse; font-size: var(--text-xs);">
                    ${Object.entries(product.specs || {}).map(([key, val]) => `
                      <tr style="border-bottom: 1px solid var(--color-border-subtle);">
                        <td style="padding: 8px 0; font-weight: 600; color: var(--color-text-primary); width: 35%;">${key}</td>
                        <td style="padding: 8px 0; color: var(--color-text-secondary);">${val}</td>
                      </tr>
                    `).join('')}
                  </table>
                  ${product.features ? `
                    <div style="margin-top: var(--space-4);">
                      <strong style="display: block; margin-bottom: 6px; font-size: var(--text-xs);">Highlights:</strong>
                      <ul style="list-style: disc; padding-left: 18px; display: flex; flex-direction: column; gap: 4px; font-size: var(--text-xs);">
                        ${product.features.map(f => `<li>${f}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}
                </div>
              </div>

              <!-- Shipping & Returns -->
              <div class="pdp-accordion-item">
                <button type="button" class="pdp-accordion-trigger">
                  <span>Shipping & Complimentary Returns</span>
                  <span class="pdp-accordion-icon">${getSvgIcon('chevronDown')}</span>
                </button>
                <div class="pdp-accordion-content">
                  <p>All items are carefully packaged in archival unbleached organic cotton dust bags and recycled corrugated boxes.</p>
                  <p style="margin-top: 8px;"><strong>Standard Delivery:</strong> 3–5 business days (Free over $150).</p>
                  <p><strong>Express Courier:</strong> 1–2 business days ($25).</p>
                  <p style="margin-top: 8px;">We offer full refunds within 30 days of receipt provided items are unwashed, in original condition with intact seals.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Reviews Section -->
        <section class="pdp-reviews-section" id="reviews-section">
          <div class="section-header">
            <div class="section-header-title">
              <h2>Customer Appraisals & Reviews</h2>
              <p>Verified feedback from owners worldwide.</p>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" id="open-write-review-btn">
              Write a Review
            </button>
          </div>

          <!-- Reviews Summary Histogram -->
          <div class="reviews-summary-grid">
            <div style="text-align: center;">
              <div class="reviews-score-huge">${product.rating}</div>
              <div style="margin: 8px 0;">${renderStars(product.rating, 18)}</div>
              <div class="text-xs text-muted">Based on ${product.reviewsCount} reviews</div>
            </div>

            <!-- Histogram Bars -->
            <div>
              ${histogramCounts.map(item => `
                <div class="histogram-row">
                  <span style="width: 48px;">${item.stars} Stars</span>
                  <div class="histogram-bar-track">
                    <div class="histogram-bar-fill" style="width: ${item.pct}%;"></div>
                  </div>
                  <span style="width: 24px; text-align: right;" class="text-muted">${item.count}</span>
                </div>
              `).join('')}
            </div>

            <!-- Write Review Promo Box -->
            <div style="border-left: 1px solid var(--color-border); padding-left: var(--space-8);">
              <h4 style="font-size: var(--text-sm); margin-bottom: 4px;">Own this piece?</h4>
              <p class="text-xs text-muted" style="margin-bottom: var(--space-4); max-width: 200px;">Share your experience with fit, acoustics, or tactile materials.</p>
              <button type="button" class="btn btn-outline btn-sm" id="open-write-review-btn-2">Leave Review</button>
            </div>
          </div>

          <!-- Inline Write Review Form (Collapsible) -->
          <div id="inline-review-form-box" style="display: none; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); padding: var(--space-6); margin-bottom: var(--space-8);">
            <h3 style="font-size: var(--text-lg); margin-bottom: var(--space-4);">Write an Appraisal for ${product.name}</h3>
            <form id="pdp-review-form">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-bottom: var(--space-4);">
                <div class="form-group">
                  <label class="form-label">Your Name / Identifier *</label>
                  <input type="text" class="form-input" id="review-author" required placeholder="e.g. Julian V." />
                </div>
                <div class="form-group">
                  <label class="form-label">Rating *</label>
                  <select class="form-select" id="review-rating" required>
                    <option value="5">★★★★★ (5 Stars - Exceptional)</option>
                    <option value="4">★★★★☆ (4 Stars - Great)</option>
                    <option value="3">★★★☆☆ (3 Stars - Average)</option>
                    <option value="2">★★☆☆☆ (2 Stars - Disappointing)</option>
                    <option value="1">★☆☆☆☆ (1 Star - Poor)</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Review Headline</label>
                <input type="text" class="form-input" id="review-title" placeholder="e.g. Unrivaled tailoring and drape" />
              </div>
              <div class="form-group">
                <label class="form-label">Your Detailed Feedback *</label>
                <textarea class="form-textarea" id="review-content" rows="4" required placeholder="Share your experience regarding material quality, sizing, sound signature, or durability..."></textarea>
              </div>
              <div style="display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-4);">
                <button type="button" class="btn btn-outline btn-sm" id="cancel-review-form-btn">Cancel</button>
                <button type="submit" class="btn btn-primary btn-sm">Publish Review</button>
              </div>
            </form>
          </div>

          <!-- Reviews List -->
          <div class="reviews-list">
            ${product.reviews && product.reviews.length > 0 ? product.reviews.map(r => `
              <div class="review-card">
                <div class="review-header">
                  <div class="review-author-info">
                    <div class="review-avatar">${r.avatar || 'CU'}</div>
                    <div>
                      <div style="font-size: var(--text-sm); font-weight: 600;">${r.author}</div>
                      <div style="display: flex; align-items: center; gap: 8px; font-size: var(--text-xs); color: var(--color-text-muted);">
                        ${renderStars(r.rating, 12)}
                        <span>•</span>
                        <span>${r.date}</span>
                        ${r.verified ? `
                          <span>•</span>
                          <span style="color: var(--color-success); font-weight: 600;">✓ Verified Purchaser</span>
                        ` : ''}
                      </div>
                    </div>
                  </div>
                </div>
                ${r.title ? `<h4 style="font-size: var(--text-sm); margin-bottom: 6px;">${r.title}</h4>` : ''}
                <div class="review-content">${r.content}</div>
              </div>
            `).join('') : `
              <div style="text-align: center; padding: var(--space-8) 0; color: var(--color-text-muted);">
                No customer reviews yet. Be the first to appraise this piece!
              </div>
            `}
          </div>
        </section>

        <!-- Related Products Section -->
        ${related.length > 0 ? `
          <section style="margin-top: var(--space-20); padding-top: var(--space-12); border-top: 1px solid var(--color-border);">
            <div class="section-header">
              <div class="section-header-title">
                <h2>Complementary Objects</h2>
                <p>Designed to exist in dialogue with this piece.</p>
              </div>
              <a href="#/category/${product.category}" class="btn btn-link">Explore ${product.category} →</a>
            </div>
            <div class="grid grid-cols-4">
              ${related.map(p => renderProductCard(p)).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Recently Viewed Section -->
        ${recentlyViewed.length > 0 ? `
          <section style="margin-top: var(--space-16); padding-top: var(--space-12); border-top: 1px solid var(--color-border);">
            <div class="section-header">
              <div class="section-header-title">
                <h2>Recently Viewed</h2>
              </div>
            </div>
            <div class="grid grid-cols-4">
              ${recentlyViewed.map(p => renderProductCard(p)).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Mobile Sticky PDP Buy Bar -->
        ${!isSoldOut ? `
          <div class="mobile-sticky-buy-bar">
            <div>
              <div style="font-size: var(--text-xs); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px;">${product.name}</div>
              <div style="font-size: var(--text-sm); font-weight: 700;">${formatPrice(product.price)}</div>
            </div>
            <button type="button" class="btn btn-primary btn-sm" id="mobile-sticky-buy-btn" style="flex: 1;">
              Add to Bag
            </button>
          </div>
        ` : ''}
      </div>
    `;
  },

  attachEvents(container) {
    if (!container) return;
    const p = this.state.product;
    if (!p) return;

    const refresh = () => {
      container.innerHTML = this.render({ id: p.id });
      this.attachEvents(container);
    };

    // Thumbnails click
    const thumbs = container.querySelectorAll('[data-pdp-thumb]');
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const src = thumb.getAttribute('data-pdp-thumb');
        this.state.selectedImage = src;
        const mainImg = container.querySelector('#pdp-main-image-el');
        if (mainImg) mainImg.src = src;
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });

    // Color Swatch buttons
    const colorBtns = container.querySelectorAll('[data-pdp-color]');
    colorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.selectedColor = btn.getAttribute('data-pdp-color');
        refresh();
      });
    });

    // Size buttons
    const sizeBtns = container.querySelectorAll('[data-pdp-size]');
    sizeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.selectedSize = btn.getAttribute('data-pdp-size');
        refresh();
      });
    });

    // Quantity buttons
    const qtyInc = container.querySelector('#pdp-qty-inc');
    const qtyDec = container.querySelector('#pdp-qty-dec');
    const qtyInput = container.querySelector('#pdp-qty-input');

    if (qtyInc) {
      qtyInc.addEventListener('click', () => {
        if (this.state.quantity < p.stock) {
          this.state.quantity++;
          if (qtyInput) qtyInput.value = this.state.quantity;
          const addBtn = container.querySelector('#pdp-add-to-cart-btn');
          if (addBtn) addBtn.textContent = `Add to Bag • ${formatPrice(p.price * this.state.quantity)}`;
        }
      });
    }

    if (qtyDec) {
      qtyDec.addEventListener('click', () => {
        if (this.state.quantity > 1) {
          this.state.quantity--;
          if (qtyInput) qtyInput.value = this.state.quantity;
          const addBtn = container.querySelector('#pdp-add-to-cart-btn');
          if (addBtn) addBtn.textContent = `Add to Bag • ${formatPrice(p.price * this.state.quantity)}`;
        }
      });
    }

    // Add to Bag
    const addBtn = container.querySelector('#pdp-add-to-cart-btn');
    const mobileBuyBtn = container.querySelector('#mobile-sticky-buy-btn');
    const handleAddToCart = () => {
      cartStore.addItem(p, { color: this.state.selectedColor, size: this.state.selectedSize }, this.state.quantity);
    };

    if (addBtn) addBtn.addEventListener('click', handleAddToCart);
    if (mobileBuyBtn) mobileBuyBtn.addEventListener('click', handleAddToCart);

    // Buy Now (Instant Checkout)
    const buyNowBtn = container.querySelector('#pdp-buy-now-btn');
    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', () => {
        cartStore.addItem(p, { color: this.state.selectedColor, size: this.state.selectedSize }, this.state.quantity);
        window.location.hash = '#/checkout';
      });
    }

    // Wishlist Toggle
    const wishlistBtn = container.querySelector('#pdp-wishlist-toggle-btn');
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        wishlistStore.toggle(p);
        refresh();
      });
    }

    // Accordions
    const accordionTriggers = container.querySelectorAll('.pdp-accordion-trigger');
    accordionTriggers.forEach(trig => {
      trig.addEventListener('click', () => {
        const item = trig.closest('.pdp-accordion-item');
        if (item) {
          item.classList.toggle('open');
        }
      });
    });

    // Write Review Box toggle
    const openReviewBtns = container.querySelectorAll('#open-write-review-btn, #open-write-review-btn-2');
    const formBox = container.querySelector('#inline-review-form-box');
    const cancelReviewBtn = container.querySelector('#cancel-review-form-btn');
    const reviewForm = container.querySelector('#pdp-review-form');

    openReviewBtns.forEach(b => {
      b.addEventListener('click', () => {
        if (formBox) {
          formBox.style.display = 'block';
          formBox.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    if (cancelReviewBtn && formBox) {
      cancelReviewBtn.addEventListener('click', () => {
        formBox.style.display = 'none';
      });
    }

    if (reviewForm) {
      reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const author = container.querySelector('#review-author').value;
        const rating = container.querySelector('#review-rating').value;
        const title = container.querySelector('#review-title').value;
        const content = container.querySelector('#review-content').value;

        const success = productStore.addReview(p.id, { author, rating, title, content });
        if (success) {
          refresh();
        }
      });
    }
  }
};
