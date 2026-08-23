/**
 * OrbitDesk Settings View Controller
 * General, Team, Preferences, and JSON Data Management.
 */

const OrbitSettingsView = {
  activeTab: 'general',

  init() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.settings-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        this.switchTab(target);
      });
    });

    // Setup JSON File Import Dropzone & Input
    const fileInput = document.getElementById('settings-json-file-input');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const res = window.OrbitData.importJSON(event.target.result);
            if (res.success) {
              window.OrbitStore.reloadFromDisk();
              window.OrbitToast.success('Workspace data imported successfully!');
              this.render();
            } else {
              window.OrbitToast.error('Import failed: ' + res.error);
            }
          };
          reader.readAsText(file);
        }
      });
    }

    // General settings form submission
    const genForm = document.getElementById('form-settings-general');
    if (genForm) {
      genForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const wsName = document.getElementById('settings-ws-name').value;
        const timezone = document.getElementById('settings-timezone').value;
        const dateFormat = document.getElementById('settings-dateformat').value;

        window.OrbitStore.state.settings.workspaceName = wsName;
        window.OrbitStore.state.settings.timezone = timezone;
        window.OrbitStore.state.settings.dateFormat = dateFormat;
        window.OrbitStore.persist();
        window.OrbitToast.success('Workspace settings saved.');
      });
    }

    // Invite Member Form submission
    const inviteForm = document.getElementById('form-invite-member');
    if (inviteForm) {
      inviteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('invite-member-name');
        const emailInput = document.getElementById('invite-member-email');
        const roleInput = document.getElementById('invite-member-role');

        const name = (nameInput.value || '').trim();
        const email = (emailInput.value || '').trim();
        const role = roleInput.value || 'Member';

        if (!name || !email) {
          window.OrbitToast.error('Please enter name and work email.');
          return;
        }

        const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'TM';
        const colors = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const newUser = {
          id: 'usr-' + Date.now(),
          name,
          email,
          role,
          avatar: initials,
          color
        };

        window.OrbitStore.state.users.push(newUser);
        window.OrbitStore.persist();
        window.OrbitStore.logActivity('invited team member', newUser.name);
        window.OrbitToast.success(`Invited ${newUser.name} to workspace.`);
        inviteForm.reset();
        window.OrbitModal.close('modal-invite-member');
        this.render();
      });
    }
  },

  switchTab(tabName) {
    this.activeTab = tabName;
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    document.querySelectorAll('.settings-tab-pane').forEach(pane => {
      if (pane.id === `settings-pane-${tabName}`) pane.classList.remove('hidden');
      else pane.classList.add('hidden');
    });

    this.render();
  },

  render() {
    const state = window.OrbitStore.state;

    // Populate General Form
    const wsNameInput = document.getElementById('settings-ws-name');
    const timezoneInput = document.getElementById('settings-timezone');
    const dateFormatInput = document.getElementById('settings-dateformat');

    if (wsNameInput) wsNameInput.value = state.settings.workspaceName || 'Acme Software Corp';
    if (timezoneInput) timezoneInput.value = state.settings.timezone || 'UTC-05:00 (Eastern Time)';
    if (dateFormatInput) dateFormatInput.value = state.settings.dateFormat || 'YYYY-MM-DD';

    // Render Members Table
    this.renderMembersTable();
  },

  renderMembersTable() {
    const container = document.getElementById('settings-members-list');
    if (!container) return;

    const users = window.OrbitStore.state.users || [];

    container.innerHTML = users.map(u => `
      <div style="display:flex; align-items:center; justify-content:space-between; padding: 12px 16px; border-bottom: 1px solid var(--border);">
        <div style="display:flex; align-items:center; gap: 10px;">
          <div class="avatar avatar-sm" style="background-color:${u.color}; color:white;">${u.avatar}</div>
          <div>
            <div style="font-weight:600; font-size:0.875rem; color:var(--text-primary);">${u.name}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${u.email}</div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap: 12px;">
          <select class="form-select" style="width: 140px; padding: 4px 8px; font-size:0.8rem;" onchange="OrbitSettingsView.updateUserRole('${u.id}', this.value)">
            <option value="Admin" ${u.role.includes('Lead') || u.role.includes('Admin') || u.role.includes('VP') ? 'selected' : ''}>Admin</option>
            <option value="Member" ${!u.role.includes('Lead') && !u.role.includes('Admin') && !u.role.includes('VP') ? 'selected' : ''}>Member</option>
            <option value="Viewer">Viewer</option>
          </select>
          ${users.length > 1 ? `
            <button class="btn btn-sm btn-danger-ghost" title="Remove member" onclick="OrbitSettingsView.removeMember('${u.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');
  },

  updateUserRole(userId, newRole) {
    const user = window.OrbitStore.state.users.find(u => u.id === userId);
    if (user) {
      user.role = newRole;
      window.OrbitStore.persist();
      window.OrbitToast.success(`Updated role for ${user.name} to ${newRole}`);
    }
  },

  openInviteModal() {
    window.OrbitModal.open('modal-invite-member');
  },

  removeMember(userId) {
    const user = window.OrbitStore.getUser(userId);
    window.OrbitModal.confirm('Remove Team Member', `Are you sure you want to remove ${user.name} from this workspace?`, () => {
      window.OrbitStore.state.users = window.OrbitStore.state.users.filter(u => u.id !== userId);
      window.OrbitStore.persist();
      window.OrbitToast.info(`${user.name} was removed.`);
      this.render();
    }, true);
  },

  resetWorkspace() {
    window.OrbitModal.confirm(
      'Reset Workspace',
      'This will erase all custom modifications and revert to default demo seed data. Are you sure?',
      () => {
        window.OrbitData.resetWorkspace();
        window.OrbitStore.reloadFromDisk();
        window.OrbitToast.warning('Workspace reset to factory defaults.');
        window.location.hash = '#/app/dashboard';
      },
      true
    );
  },

  generateFreshDemoData() {
    window.OrbitData.generateDemoData();
    window.OrbitStore.reloadFromDisk();
    window.OrbitToast.success('Fresh demo tasks, projects, and activities loaded!');
    window.location.hash = '#/app/dashboard';
  }
};

window.OrbitSettingsView = OrbitSettingsView;
