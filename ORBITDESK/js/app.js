/**
 * OrbitDesk Application Main Orchestrator
 */

const OrbitApp = {
  init() {
    this.initTheme();
    this.initAuthForms();
    this.initModalForms();
    this.initSidebarAndMobile();
    this.initDropdowns();
    this.initNotifications();
    this.updateUserBadge();

    // Subscribe to state changes to auto-update active subview & counts
    window.OrbitStore.subscribe('state:updated', () => {
      this.updateSidebarBadges();
      const hash = window.location.hash || '#/';
      if (hash.startsWith('#/app/')) {
        const subview = hash.replace('#/app/', '');
        window.OrbitRouter.renderAppSubview(subview);
      }
    });

    // Initialize sub-controllers
    if (window.OrbitModal) window.OrbitModal.init();
    if (window.OrbitCommandPalette) window.OrbitCommandPalette.init();
    if (window.OrbitProjectsView) window.OrbitProjectsView.init();
    if (window.OrbitTasksView) window.OrbitTasksView.init();
    if (window.OrbitCalendarView) window.OrbitCalendarView.init();
    if (window.OrbitSettingsView) window.OrbitSettingsView.init();
    if (window.OrbitProfileView) window.OrbitProfileView.init();

    // Start router
    window.OrbitRouter.init();
    this.updateSidebarBadges();
  },

  // --- Theme Controller ---
  initTheme() {
    const savedTheme = localStorage.getItem('orbitdesk_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('orbitdesk_theme', next);
    window.OrbitToast.info(`Switched to ${next} mode`);

    // Re-render active subview (especially charts for theme contrast)
    const hash = window.location.hash || '';
    if (hash.startsWith('#/app/')) {
      const subview = hash.replace('#/app/', '');
      window.OrbitRouter.renderAppSubview(subview);
    }
  },

  // --- Auth Forms ---
  initAuthForms() {
    const loginForm = document.getElementById('form-login');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;
        const remember = document.getElementById('login-remember').checked;

        const res = window.OrbitAuth.login(email, pass, remember);
        if (res.success) {
          window.OrbitToast.success(`Welcome back, ${res.user.name}!`);
          this.updateUserBadge();
          window.location.hash = '#/app/dashboard';
        } else {
          window.OrbitToast.error(res.error);
        }
      });
    }

    const signupForm = document.getElementById('form-signup');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const pass = document.getElementById('signup-password').value;
        const wsName = document.getElementById('signup-workspace').value;

        const res = window.OrbitAuth.signup(name, email, pass, wsName);
        if (res.success) {
          window.OrbitToast.success(`Workspace created! Welcome, ${res.user.name}`);
          this.updateUserBadge();
          window.location.hash = '#/app/dashboard';
        } else {
          window.OrbitToast.error(res.error);
        }
      });
    }

    // Demo Fill Button
    const demoFillBtn = document.getElementById('auth-demo-fill-btn');
    if (demoFillBtn) {
      demoFillBtn.addEventListener('click', () => {
        const credentials = window.OrbitAuth.demoFill(0);
        const emailInput = document.getElementById('login-email');
        const passInput = document.getElementById('login-password');
        if (emailInput && passInput) {
          emailInput.value = credentials.email;
          passInput.value = credentials.password;
          window.OrbitToast.info('Demo credentials filled.');
        }
      });
    }
  },

  showAuthTab(tab = 'login') {
    const loginPane = document.getElementById('auth-pane-login');
    const signupPane = document.getElementById('auth-pane-signup');
    const loginTabBtn = document.getElementById('auth-tab-login-btn');
    const signupTabBtn = document.getElementById('auth-tab-signup-btn');

    if (tab === 'login') {
      if (loginPane) loginPane.classList.remove('hidden');
      if (signupPane) signupPane.classList.add('hidden');
      if (loginTabBtn) loginTabBtn.classList.add('active');
      if (signupTabBtn) signupTabBtn.classList.remove('active');
    } else {
      if (signupPane) signupPane.classList.remove('hidden');
      if (loginPane) loginPane.classList.add('hidden');
      if (signupTabBtn) signupTabBtn.classList.add('active');
      if (loginTabBtn) loginTabBtn.classList.remove('active');
    }
  },

  // --- Modal Forms ---
  initModalForms() {
    // Task Form
    const taskForm = document.getElementById('form-task');
    if (taskForm) {
      taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('task-input-id').value;
        const title = document.getElementById('task-input-title').value;
        const desc = document.getElementById('task-input-desc').value;
        const projectId = document.getElementById('task-input-project').value;
        const assigneeId = document.getElementById('task-input-assignee').value;
        const priority = document.getElementById('task-input-priority').value;
        const status = document.getElementById('task-input-status').value;
        const dueDate = document.getElementById('task-input-duedate').value;
        const tags = document.getElementById('task-input-tags').value;

        if (!title || !title.trim()) {
          window.OrbitToast.error('Task title cannot be empty.');
          return;
        }

        if (id) {
          // Update
          window.OrbitStore.updateTask(id, {
            title, description: desc, projectId, assigneeId, priority, status, dueDate, tags
          });
          window.OrbitToast.success('Task updated successfully.');
        } else {
          // Create
          window.OrbitStore.addTask({
            title, description: desc, projectId, assigneeId, priority, status, dueDate, tags
          });
          window.OrbitToast.success('Task created successfully.');
        }

        window.OrbitModal.close('modal-task');
      });
    }

    // Task Delete in Modal
    const taskDeleteBtn = document.getElementById('task-modal-delete-btn');
    if (taskDeleteBtn) {
      taskDeleteBtn.addEventListener('click', () => {
        const id = document.getElementById('task-input-id').value;
        if (id) {
          window.OrbitModal.confirm('Delete Task', 'Are you sure you want to delete this task?', () => {
            window.OrbitStore.deleteTask(id);
            window.OrbitModal.close('modal-task');
            window.OrbitToast.info('Task deleted.');
          }, true);
        }
      });
    }

    // Project Form
    const projectForm = document.getElementById('form-project');
    if (projectForm) {
      projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('project-input-id').value;
        const name = document.getElementById('project-input-name').value;
        const desc = document.getElementById('project-input-desc').value;
        const category = document.getElementById('project-input-category').value;
        const color = document.getElementById('project-input-color').value;
        const targetDate = document.getElementById('project-input-targetdate').value;
        const leadId = document.getElementById('project-input-lead').value;

        if (!name || !name.trim()) {
          window.OrbitToast.error('Project name cannot be empty.');
          return;
        }

        if (id) {
          window.OrbitStore.updateProject(id, { name, description: desc, category, color, targetDate, leadId });
          window.OrbitToast.success('Project updated successfully.');
        } else {
          window.OrbitStore.addProject({ name, description: desc, category, color, targetDate, leadId });
          window.OrbitToast.success('Project created successfully.');
        }

        window.OrbitModal.close('modal-project');
      });
    }

    // Project Delete in Modal
    const projDeleteBtn = document.getElementById('project-modal-delete-btn');
    if (projDeleteBtn) {
      projDeleteBtn.addEventListener('click', () => {
        const id = document.getElementById('project-input-id').value;
        if (id) {
          window.OrbitModal.confirm('Delete Project', 'Are you sure? All associated tasks will be unlinked.', () => {
            window.OrbitStore.deleteProject(id);
            window.OrbitModal.close('modal-project');
            window.OrbitToast.info('Project deleted.');
          }, true);
        }
      });
    }
  },

  // --- Sidebar & Mobile ---
  initSidebarAndMobile() {
    const toggleBtn = document.getElementById('mobile-menu-toggle-btn');
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');

    if (toggleBtn && sidebar && backdrop) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        backdrop.classList.toggle('active');
      });

      backdrop.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        backdrop.classList.remove('active');
      });
    }
  },

  // --- Dropdowns & Workspace Switcher ---
  initDropdowns() {
    // Workspace Switcher Dropdown Click
    const wsBtn = document.getElementById('workspace-switcher-btn');
    const wsDropdown = document.getElementById('workspace-dropdown-menu');

    if (wsBtn && wsDropdown) {
      wsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        wsDropdown.classList.toggle('hidden');
      });

      document.addEventListener('click', () => {
        wsDropdown.classList.add('hidden');
      });
    }

    // User Profile Dropdown in Topbar
    const userMenuBtn = document.getElementById('topbar-user-btn');
    const userDropdown = document.getElementById('topbar-user-dropdown');

    if (userMenuBtn && userDropdown) {
      userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('hidden');
      });

      document.addEventListener('click', () => {
        userDropdown.classList.add('hidden');
      });
    }
  },

  // --- Notifications Popover ---
  initNotifications() {
    const notifBtn = document.getElementById('topbar-notifications-btn');
    const notifDropdown = document.getElementById('topbar-notifications-dropdown');

    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('hidden');
        this.renderNotificationsList();
      });

      document.addEventListener('click', () => {
        notifDropdown.classList.add('hidden');
      });
    }
  },

  renderNotificationsList() {
    const list = document.getElementById('notifications-dropdown-list');
    if (!list) return;

    const state = window.OrbitStore.state;
    const activities = state.activities.slice(0, 5);

    if (activities.length === 0) {
      list.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.8rem;">No new notifications</div>`;
      return;
    }

    list.innerHTML = activities.map(a => {
      const user = window.OrbitStore.getUser(a.actorId);
      return `
        <div style="padding: 10px 14px; border-bottom: 1px solid var(--border); font-size: 0.82rem;">
          <div style="color: var(--text-primary);">
            <strong>${user.name}</strong> ${a.action} "${a.target}"
          </div>
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">
            ${new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      `;
    }).join('');
  },

  updateUserBadge() {
    const user = window.OrbitAuth.getCurrentUser() || {
      name: 'Alex Rivera',
      email: 'alex@orbitdesk.io',
      role: 'Product Lead',
      avatar: 'AR',
      color: '#4f46e5'
    };

    // Sidebar bottom user capsule
    const nameEl = document.getElementById('sidebar-user-name');
    const roleEl = document.getElementById('sidebar-user-role');
    const avatarEl = document.getElementById('sidebar-user-avatar');

    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = user.role;
    if (avatarEl) {
      avatarEl.textContent = user.avatar;
      avatarEl.style.backgroundColor = user.color || '#4f46e5';
    }

    // Topbar avatar
    const topAvatarEl = document.getElementById('topbar-user-avatar');
    if (topAvatarEl) {
      topAvatarEl.textContent = user.avatar;
      topAvatarEl.style.backgroundColor = user.color || '#4f46e5';
    }
  },

  updateSidebarBadges() {
    const state = window.OrbitStore.state;
    const stats = window.OrbitStore.getStats();

    const tasksBadge = document.getElementById('sidebar-badge-tasks');
    const projectsBadge = document.getElementById('sidebar-badge-projects');

    if (tasksBadge) tasksBadge.textContent = (stats.totalTasks - stats.completedTasks);
    if (projectsBadge) projectsBadge.textContent = stats.activeProjects;

    // Workspace switcher name
    const wsName = document.getElementById('sidebar-workspace-name');
    if (wsName) {
      wsName.textContent = state.settings.workspaceName || 'Acme Software Corp';
    }
  }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.OrbitApp = OrbitApp;
  OrbitApp.init();
});
