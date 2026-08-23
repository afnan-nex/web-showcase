/**
 * NORTHSTAR COMMERCE - Client-Side Router
 */

import { HomeView } from './views/homeView.js';
import { ShopView } from './views/shopView.js';
import { ProductView } from './views/productView.js';
import { CartView } from './views/cartView.js';
import { WishlistView } from './views/wishlistView.js';
import { CheckoutView } from './views/checkoutView.js';
import { AccountView } from './views/accountView.js';
import { OrdersView } from './views/ordersView.js';

class Router {
  constructor() {
    this.routes = [
      { pattern: /^\/?$/, view: HomeView },
      { pattern: /^\/?#\/?$/, view: HomeView },
      { pattern: /^#\/home\/?$/, view: HomeView },
      { pattern: /^#\/shop\/?$/, view: ShopView },
      { pattern: /^#\/category\/([^\/?#]+)\/?$/, view: ShopView, paramNames: ['category'] },
      { pattern: /^#\/product\/([^\/?#]+)\/?$/, view: ProductView, paramNames: ['id'] },
      { pattern: /^#\/cart\/?$/, view: CartView },
      { pattern: /^#\/wishlist\/?$/, view: WishlistView },
      { pattern: /^#\/checkout\/?$/, view: CheckoutView },
      { pattern: /^#\/account\/?$/, view: AccountView },
      { pattern: /^#\/orders\/([^\/?#]+)\/?$/, view: OrdersView, paramNames: ['id'] },
      { pattern: /^#\/orders\/?$/, view: AccountView }
    ];

    this.container = null;
  }

  init(containerId = 'app-main') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }

  handleRoute() {
    const rawHash = window.location.hash || '#/home';
    const [pathPart, queryPart] = rawHash.split('?');

    // Parse query params
    const queryParams = {};
    if (queryPart) {
      const searchParams = new URLSearchParams(queryPart);
      for (const [key, value] of searchParams.entries()) {
        queryParams[key] = value;
      }
    }

    let matchedView = null;
    let routeParams = {};

    for (const route of this.routes) {
      const match = pathPart.match(route.pattern);
      if (match) {
        matchedView = route.view;
        if (route.paramNames) {
          route.paramNames.forEach((name, i) => {
            routeParams[name] = match[i + 1];
          });
        }
        break;
      }
    }

    if (!matchedView) {
      matchedView = HomeView;
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update active nav links
    this.updateActiveNav(pathPart);

    // Render view
    this.container.innerHTML = matchedView.render(routeParams, queryParams);
    if (typeof matchedView.attachEvents === 'function') {
      matchedView.attachEvents(this.container);
    }
  }

  updateActiveNav(pathPart) {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === pathPart || (pathPart.startsWith('#/category/') && href === '#/shop') || (pathPart === '#/home' && href === '#/home'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

export const router = new Router();
