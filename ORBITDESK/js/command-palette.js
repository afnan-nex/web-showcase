/**
 * OrbitDesk Global Command Palette (Ctrl+K / / shortcut)
 * Fast keyboard-first search & execution launcher across the SaaS workspace.
 */

const OrbitCommandPalette = {
  isOpen: false,
  selectedIndex: 0,
  items: [],

  init() {
    // Keyboard shortcuts listener
    document.addEventListener('keydown', (e) => {
      // Check for Ctrl+K, Cmd+K, or pressing '/' when not in an input
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        this.open();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    const input = document.getElementById('cmd-search-input');
    if (input) {
      input.addEventListener('input', (e) => this.handleSearch(e.target.value));
      input.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }
  },

  open() {
    const modal = document.getElementById('modal-command-palette');
    if (!modal) return;
    modal.classList.add('active');
    this.isOpen = true;
    const input = document.getElementById('cmd-search-input');
    if (input) {
      input.value = '';
      input.focus();
    }
    this.handleSearch('');
  },

  close() {
    const modal = document.getElementById('modal-command-palette');
    if (!modal) return;
    modal.classList.remove('active');
    this.isOpen = false;
  },

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  },

  handleSearch(query) {
    const q = (query || '').toLowerCase().trim();
    const state = window.OrbitStore.state;
    this.items = [];

    // 1. Navigation & System Actions
    const staticActions = [
      { type: 'action', title: 'Create New Task', icon: 'plus-circle', action: () => window.OrbitModal.openTaskModal() },
      { type: 'action', title: 'Create New Project', icon: 'folder-plus', action: () => window.OrbitModal.openProjectModal() },
      { type: 'nav', title: 'Navigate: Dashboard', icon: 'layout-dashboard', action: () => window.location.hash = '#/app/dashboard' },
      { type: 'nav', title: 'Navigate: Tasks & Board', icon: 'check-square', action: () => window.location.hash = '#/app/tasks' },
      { type: 'nav', title: 'Navigate: Projects', icon: 'folder', action: () => window.location.hash = '#/app/projects' },
      { type: 'nav', title: 'Navigate: Calendar', icon: 'calendar', action: () => window.location.hash = '#/app/calendar' },
      { type: 'nav', title: 'Navigate: Analytics', icon: 'bar-chart-2', action: () => window.location.hash = '#/app/analytics' },
      { type: 'nav', title: 'Navigate: Workspace Settings', icon: 'settings', action: () => window.location.hash = '#/app/settings' },
      { type: 'action', title: 'Export Workspace JSON Backup', icon: 'download', action: () => window.OrbitData.exportJSON() },
      { type: 'action', title: 'Toggle Theme (Light / Dark)', icon: 'moon', action: () => window.OrbitApp.toggleTheme() }
    ];

    staticActions.forEach(act => {
      if (!q || act.title.toLowerCase().includes(q)) {
        this.items.push(act);
      }
    });

    // 2. Tasks Search
    if (state.tasks) {
      state.tasks.forEach(t => {
        if (!q || t.title.toLowerCase().includes(q) || (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))) {
          const proj = window.OrbitStore.getProject(t.projectId);
          this.items.push({
            type: 'task',
            title: t.title,
            sub: `${proj.name} • ${t.priority.toUpperCase()} • ${t.status}`,
            icon: 'check-circle',
            action: () => {
              window.location.hash = '#/app/tasks';
              setTimeout(() => window.OrbitModal.openTaskModal(t), 100);
            }
          });
        }
      });
    }

    // 3. Projects Search
    if (state.projects) {
      state.projects.forEach(p => {
        if (!q || p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))) {
          this.items.push({
            type: 'project',
            title: p.name,
            sub: `${p.category} • Target: ${p.targetDate || 'None'}`,
            icon: 'folder',
            action: () => {
              window.location.hash = '#/app/projects';
              setTimeout(() => window.OrbitModal.openProjectModal(p), 100);
            }
          });
        }
      });
    }

    // 4. Team Members Search
    if (state.users) {
      state.users.forEach(u => {
        if (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)) {
          this.items.push({
            type: 'user',
            title: u.name,
            sub: `${u.role} (${u.email})`,
            icon: 'user',
            action: () => {
              window.location.hash = '#/app/tasks';
              const select = document.getElementById('task-filter-assignee');
              if (select) {
                select.value = u.id;
                select.dispatchEvent(new Event('change'));
              }
            }
          });
        }
      });
    }

    this.selectedIndex = 0;
    this.render();
  },

  handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex = (this.selectedIndex + 1) % Math.max(1, this.items.length);
      this.render();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex = (this.selectedIndex - 1 + this.items.length) % Math.max(1, this.items.length);
      this.render();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.items[this.selectedIndex]) {
        const targetAction = this.items[this.selectedIndex].action;
        this.close();
        targetAction();
      }
    }
  },

  render() {
    const listEl = document.getElementById('cmd-results-list');
    if (!listEl) return;

    if (this.items.length === 0) {
      listEl.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          No matching commands, tasks, or projects found.
        </div>
      `;
      return;
    }

    listEl.innerHTML = this.items.slice(0, 18).map((item, idx) => {
      const isSelected = idx === this.selectedIndex;
      const typeBadge = `<span class="tag" style="font-size:0.65rem;">${item.type}</span>`;
      return `
        <div class="cmd-item ${isSelected ? 'selected' : ''}" data-index="${idx}">
          <div class="cmd-item-left">
            <svg class="cmd-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              ${this.getSvgIcon(item.icon)}
            </svg>
            <div>
              <div style="font-weight: 500; color: var(--text-primary); font-size: 0.85rem;">${item.title}</div>
              ${item.sub ? `<div style="font-size: 0.72rem; color: var(--text-muted);">${item.sub}</div>` : ''}
            </div>
          </div>
          ${typeBadge}
        </div>
      `;
    }).join('');

    // Attach click events
    listEl.querySelectorAll('.cmd-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        if (this.items[idx]) {
          const action = this.items[idx].action;
          this.close();
          action();
        }
      });
    });
  },

  getSvgIcon(name) {
    switch (name) {
      case 'plus-circle':
        return '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>';
      case 'folder-plus':
        return '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>';
      case 'check-square':
      case 'check-circle':
        return '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>';
      case 'folder':
        return '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>';
      case 'calendar':
        return '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>';
      case 'bar-chart-2':
        return '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>';
      case 'settings':
        return '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>';
      case 'download':
        return '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>';
      case 'moon':
        return '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
      case 'user':
        return '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>';
      default:
        return '<circle cx="12" cy="12" r="10"/>';
    }
  }
};

window.OrbitCommandPalette = OrbitCommandPalette;
