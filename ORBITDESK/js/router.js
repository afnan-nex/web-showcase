/**
 * OrbitDesk Client-Side Hash Router
 */

const OrbitRouter = {
  routes: {
    '#/': { view: 'landing', title: 'OrbitDesk — Unified Execution Engine' },
    '#/login': { view: 'login', title: 'Sign In — OrbitDesk' },
    '#/signup': { view: 'signup', title: 'Create Workspace — OrbitDesk' },
    '#/app/dashboard': { view: 'app', subview: 'dashboard', title: 'Dashboard — OrbitDesk' },
    '#/app/projects': { view: 'app', subview: 'projects', title: 'Projects — OrbitDesk' },
    '#/app/tasks': { view: 'app', subview: 'tasks', title: 'Tasks & Board — OrbitDesk' },
    '#/app/calendar': { view: 'app', subview: 'calendar', title: 'Calendar — OrbitDesk' },
    '#/app/analytics': { view: 'app', subview: 'analytics', title: 'Analytics — OrbitDesk' },
    '#/app/settings': { view: 'app', subview: 'settings', title: 'Settings — OrbitDesk' },
    '#/app/profile': { view: 'app', subview: 'profile', title: 'User Profile — OrbitDesk' }
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    // Initial route
    if (!window.location.hash) {
      window.location.hash = '#/';
    } else {
      this.handleRoute();
    }
  },

  handleRoute() {
    const hash = window.location.hash || '#/';
    const route = this.routes[hash] || this.routes['#/app/dashboard'] || this.routes['#/'];

    // Auth guard for #/app/*
    if (hash.startsWith('#/app/')) {
      if (!window.OrbitAuth.isAuthenticated()) {
        window.location.hash = '#/login';
        return;
      }
    }

    document.title = route.title;

    // View containers
    const landingView = document.getElementById('view-landing');
    const authView = document.getElementById('view-auth');
    const appView = document.getElementById('view-app');

    // Hide all primary views first
    if (landingView) landingView.classList.add('hidden');
    if (authView) authView.classList.add('hidden');
    if (appView) appView.classList.add('hidden');

    // Close any open mobile drawer
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');

    if (route.view === 'landing') {
      if (landingView) landingView.classList.remove('hidden');
      if (window.OrbitLandingView) window.OrbitLandingView.init();
    } else if (route.view === 'login' || route.view === 'signup') {
      if (authView) {
        authView.classList.remove('hidden');
        window.OrbitApp.showAuthTab(route.view === 'signup' ? 'signup' : 'login');
      }
    } else if (route.view === 'app') {
      if (appView) appView.classList.remove('hidden');
      this.renderAppSubview(route.subview);
    }
  },

  renderAppSubview(subview = 'dashboard') {
    // Hide all subview containers inside app
    const subviews = ['dashboard', 'projects', 'tasks', 'calendar', 'analytics', 'settings', 'profile'];
    subviews.forEach(sv => {
      const el = document.getElementById(`subview-${sv}`);
      if (el) {
        if (sv === subview) el.classList.remove('hidden');
        else el.classList.add('hidden');
      }
    });

    // Update active sidebar nav items
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      const link = item.querySelector('a');
      if (link && link.getAttribute('href') === `#/app/${subview}`) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Topbar Breadcrumb
    const breadcrumbCurrent = document.getElementById('breadcrumb-current-text');
    if (breadcrumbCurrent) {
      breadcrumbCurrent.textContent = subview.charAt(0).toUpperCase() + subview.slice(1);
    }

    // Call subview renderer
    switch (subview) {
      case 'dashboard':
        if (window.OrbitDashboardView) window.OrbitDashboardView.render();
        break;
      case 'projects':
        if (window.OrbitProjectsView) window.OrbitProjectsView.render();
        break;
      case 'tasks':
        if (window.OrbitTasksView) window.OrbitTasksView.render();
        break;
      case 'calendar':
        if (window.OrbitCalendarView) window.OrbitCalendarView.render();
        break;
      case 'analytics':
        if (window.OrbitAnalyticsView) window.OrbitAnalyticsView.render();
        break;
      case 'settings':
        if (window.OrbitSettingsView) window.OrbitSettingsView.render();
        break;
      case 'profile':
        if (window.OrbitProfileView) window.OrbitProfileView.render();
        break;
    }
  }
};

window.OrbitRouter = OrbitRouter;
