/**
 * NORTHSTAR COMMERCE - Home Page View
 */

import { productStore } from '../store/productStore.js';
import { renderProductCard } from '../components/productCard.js';
import { getSvgIcon } from '../utils/helpers.js';
import { Toast } from '../utils/toast.js';

export const HomeView = {
  render() {
    const featuredProducts = productStore.filterAndSort({ sortBy: 'featured' }).slice(0, 4);
    const newArrivals = productStore.filterAndSort({ sortBy: 'newest' }).slice(0, 4);

    return `
      <div class="home-view">
        <!-- 1. Hero Section -->
        <section class="hero-section">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85" alt="Northstar Commerce Campaign" class="hero-bg-media" />
          <div class="hero-overlay"></div>
          <div class="container">
            <div class="hero-content">
              <div class="hero-badge">
                <span>Autumn / Winter Monograph</span>
                <span>•</span>
                <span>Edition 2026</span>
              </div>
              <h1 class="hero-title font-serif">
                Considered design for tactile living.
              </h1>
              <p class="hero-subtitle">
                An uncompromising collection of architectural tailoring, planar acoustic engineering, and hand-thrown Japanese homewares.
              </p>
              <div class="hero-actions">
                <a href="#/shop" class="btn btn-primary btn-lg">
                  Explore Catalog
                  ${getSvgIcon('arrowRight')}
                </a>
                <a href="#/category/fashion" class="btn btn-outline btn-lg">
                  View Lookbook
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Value Pillars -->
        <section class="values-section">
          <div class="container">
            <div class="values-grid">
              <div class="value-item">
                <div class="value-icon">${getSvgIcon('truck')}</div>
                <div>
                  <h4>Complimentary Express</h4>
                  <p>Global expedited shipping on all orders over $150.</p>
                </div>
              </div>
              <div class="value-item">
                <div class="value-icon">${getSvgIcon('shield')}</div>
                <div>
                  <h4>Archival Longevity</h4>
                  <p>Virgin wools, grade 5 titanium, and hand-honed travertine.</p>
                </div>
              </div>
              <div class="value-item">
                <div class="value-icon">${getSvgIcon('refresh')}</div>
                <div>
                  <h4>30-Day Effortless Trial</h4>
                  <p>Hassle-free doorstep returns and full refund guarantee.</p>
                </div>
              </div>
              <div class="value-item">
                <div class="value-icon">${getSvgIcon('star')}</div>
                <div>
                  <h4>Master Craftsmanship</h4>
                  <p>Direct partnerships with independent ateliers in Italy and Kyoto.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 3. Category Portals -->
        <section class="category-portals">
          <div class="container">
            <div class="section-header">
              <div class="section-header-title">
                <h2>Curated Disciplines</h2>
                <p>Browse by design category</p>
              </div>
              <a href="#/shop" class="btn btn-link">View All Categories →</a>
            </div>

            <div class="portal-grid">
              <!-- Fashion -->
              <a href="#/category/fashion" class="portal-card">
                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80" alt="Fashion Apparel" class="portal-card-img" />
                <div class="portal-card-overlay"></div>
                <div class="portal-card-content">
                  <div class="portal-card-tag">Collection 01</div>
                  <h3 class="portal-card-title">Apparel & Tailoring</h3>
                  <span class="portal-card-cta">Discover Fashion ${getSvgIcon('arrowRight')}</span>
                </div>
              </a>

              <!-- Electronics -->
              <a href="#/category/electronics" class="portal-card">
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" alt="Electronics & Audio" class="portal-card-img" />
                <div class="portal-card-overlay"></div>
                <div class="portal-card-content">
                  <div class="portal-card-tag">Collection 02</div>
                  <h3 class="portal-card-title">Acoustics & Tech</h3>
                  <span class="portal-card-cta">Explore Audio ${getSvgIcon('arrowRight')}</span>
                </div>
              </a>

              <!-- Lifestyle -->
              <a href="#/category/lifestyle" class="portal-card">
                <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80" alt="Objects & Living" class="portal-card-img" />
                <div class="portal-card-overlay"></div>
                <div class="portal-card-content">
                  <div class="portal-card-tag">Collection 03</div>
                  <h3 class="portal-card-title">Living & Objects</h3>
                  <span class="portal-card-cta">Explore Objects ${getSvgIcon('arrowRight')}</span>
                </div>
              </a>
            </div>
          </div>
        </section>

        <!-- 4. Featured Products Grid -->
        <section style="padding: var(--space-16) 0; background-color: var(--color-surface); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
          <div class="container">
            <div class="section-header">
              <div class="section-header-title">
                <h2>Featured Archive</h2>
                <p>Selected icons defined by uncompromising material integrity.</p>
              </div>
              <a href="#/shop" class="btn btn-secondary btn-sm">Shop All Featured</a>
            </div>

            <div class="grid grid-cols-4">
              ${featuredProducts.map(p => renderProductCard(p)).join('')}
            </div>
          </div>
        </section>

        <!-- 5. Editorial Lookbook Split Section -->
        <section class="lookbook-section">
          <div class="container">
            <div class="lookbook-card">
              <div class="lookbook-media">
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=85" alt="Aero Double-Breasted Wool Overcoat" />
              </div>
              <div class="lookbook-content">
                <span class="text-uppercase" style="color: #b38b4d; margin-bottom: 8px; display: block; font-weight: 600;">The Sartorial Monolith</span>
                <h3 class="font-serif">The Aero Wool Overcoat</h3>
                <p>
                  Cut from 680gsm Biella virgin wool with dropped shoulders and unyielding drape. Designed in collaboration with third-generation master weavers in Northern Italy.
                </p>
                <div style="display: flex; gap: var(--space-4); align-items: center;">
                  <a href="#/product/prod-1" class="btn btn-primary">
                    View Overcoat • $540
                  </a>
                  <a href="#/category/fashion" class="btn btn-outline" style="border-color: rgba(255,255,255,0.3); color: #fff;">
                    Browse Outerwear
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 6. New Season Arrivals -->
        <section style="padding: var(--space-16) 0;">
          <div class="container">
            <div class="section-header">
              <div class="section-header-title">
                <h2>New Season Releases</h2>
                <p>The newest arrivals to the Northstar catalog.</p>
              </div>
              <a href="#/shop?sort=newest" class="btn btn-link">View All New →</a>
            </div>

            <div class="grid grid-cols-4">
              ${newArrivals.map(p => renderProductCard(p)).join('')}
            </div>
          </div>
        </section>

        <!-- 7. Press Quotes / Accolades -->
        <section style="padding: var(--space-16) 0; background-color: var(--color-surface); border-top: 1px solid var(--color-border);">
          <div class="container-narrow" style="text-align: center;">
            <div class="text-uppercase text-muted" style="margin-bottom: var(--space-4);">Critical Acclaim</div>
            <blockquote class="font-serif" style="font-size: var(--text-2xl); font-style: italic; line-height: 1.4; color: var(--color-text-primary); margin-bottom: var(--space-6);">
              "Northstar Commerce has set a standard for digital commerce — where physical object materiality meets ruthless digital restraint."
            </blockquote>
            <cite style="font-size: var(--text-xs); font-style: normal; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-muted);">
              — The Design Review Quarterly
            </cite>
          </div>
        </section>
      </div>
    `;
  },

  attachEvents(container) {
    // Events are handled by global card delegation or specific page hooks
  }
};
