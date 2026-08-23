/**
 * NORTHSTAR COMMERCE - Central Application Initializer
 */

import { router } from './router.js';
import { cartStore } from './store/cartStore.js';
import { wishlistStore } from './store/wishlistStore.js';
import { productStore } from './store/productStore.js';
import { DrawerCart } from './components/drawerCart.js';
import { QuickViewModal } from './components/quickViewModal.js';
import { SearchModal } from './components/searchModal.js';
import { InfoModal } from './components/infoModal.js';
import { Toast } from './utils/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Toasts & Modals
  Toast.init();
  DrawerCart.init();
  QuickViewModal.init();
  SearchModal.init();
  InfoModal.init();

  // 2. Setup Badge Counters (Cart & Wishlist)
  const cartBadge = document.getElementById('header-cart-badge');
  const wishlistBadge = document.getElementById('header-wishlist-badge');

  const updateCartBadge = () => {
    const count = cartStore.getCount();
    if (cartBadge) {
      cartBadge.textContent = count;
      cartBadge.style.display = count > 0 ? 'flex' : 'none';
      cartBadge.classList.add('pop');
      setTimeout(() => cartBadge.classList.remove('pop'), 200);
    }
  };

  const updateWishlistBadge = () => {
    const count = wishlistStore.getCount();
    if (wishlistBadge) {
      wishlistBadge.textContent = count;
      wishlistBadge.style.display = count > 0 ? 'flex' : 'none';
      wishlistBadge.classList.add('pop');
      setTimeout(() => wishlistBadge.classList.remove('pop'), 200);
    }
  };

  cartStore.subscribe(updateCartBadge);
  wishlistStore.subscribe(updateWishlistBadge);
  updateCartBadge();
  updateWishlistBadge();

  // 3. Header Action Triggers
  const openCartBtn = document.getElementById('open-cart-btn');
  if (openCartBtn) {
    openCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      DrawerCart.open();
    });
  }

  const openSearchBtn = document.getElementById('open-search-btn');
  if (openSearchBtn) {
    openSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      SearchModal.open();
    });
  }

  // Announcement promo code auto-copy/apply
  const announcementPromoBtn = document.getElementById('announcement-promo-btn');
  if (announcementPromoBtn) {
    announcementPromoBtn.addEventListener('click', () => {
      const code = 'NORTHSTAR15';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).catch(() => {});
      }
      cartStore.applyCoupon(code);
      Toast.success('Promo code NORTHSTAR15 copied & applied to your bag!');
    });
  }

  // 4. Mobile Navigation Drawer Toggle
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');

  const openMobileNav = () => {
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.add('open');
      mobileNavDrawer.setAttribute('aria-hidden', 'false');
    }
    if (mobileNavToggle) mobileNavToggle.setAttribute('aria-expanded', 'true');
    if (mobileNavOverlay) mobileNavOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileNav = () => {
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.remove('open');
      mobileNavDrawer.setAttribute('aria-hidden', 'true');
    }
    if (mobileNavToggle) mobileNavToggle.setAttribute('aria-expanded', 'false');
    if (mobileNavOverlay) mobileNavOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (mobileNavToggle) mobileNavToggle.addEventListener('click', openMobileNav);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
  if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileNav);

  // Close mobile nav when clicking any mobile nav link
  if (mobileNavDrawer) {
    mobileNavDrawer.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        closeMobileNav();
      }
    });
  }

  // 5. Global Product Card Action Delegation (Quick-View, Quick-Add, Wishlist)
  document.addEventListener('click', (e) => {
    const qvBtn = e.target.closest('[data-action="quick-view"]');
    if (qvBtn) {
      e.preventDefault();
      e.stopPropagation();
      const id = qvBtn.getAttribute('data-product-id');
      QuickViewModal.open(id);
      return;
    }

    const qaBtn = e.target.closest('[data-action="quick-add"]');
    if (qaBtn) {
      e.preventDefault();
      e.stopPropagation();
      const id = qaBtn.getAttribute('data-product-id');
      const p = productStore.getProductById(id);
      if (p) {
        cartStore.addItem(p);
      }
      return;
    }

    const wlBtn = e.target.closest('[data-action="toggle-wishlist"]');
    if (wlBtn) {
      e.preventDefault();
      e.stopPropagation();
      const id = wlBtn.getAttribute('data-product-id');
      const p = productStore.getProductById(id);
      if (p) {
        const added = wishlistStore.toggle(p);
        wlBtn.classList.toggle('active', added);
      }
      return;
    }
  });

  // 6. Footer Newsletter Form
  const newsletterForm = document.getElementById('footer-newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value) {
        Toast.success('Thank you for subscribing to the Northstar Monograph.');
        input.value = '';
      }
    });
  }

  // 7. Initialize Client-Side Router
  router.init('app-main');
});
