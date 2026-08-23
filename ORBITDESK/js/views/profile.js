/**
 * OrbitDesk User Profile View Controller
 */

const OrbitProfileView = {
  init() {
    const profileForm = document.getElementById('form-user-profile');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('profile-name').value;
        const role = document.getElementById('profile-role').value;
        const email = document.getElementById('profile-email').value;

        const user = window.OrbitAuth.getCurrentUser();
        if (user) {
          user.name = name.trim();
          user.role = role.trim();
          user.email = email.trim();
          user.avatar = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

          // Update in state.users
          const stateUser = window.OrbitStore.state.users.find(u => u.id === user.id);
          if (stateUser) {
            Object.assign(stateUser, user);
            window.OrbitStore.persist();
          }

          window.OrbitAuth.saveSession({ isAuthenticated: true, user });
          window.OrbitToast.success('Profile updated successfully.');
          window.OrbitApp.updateUserBadge();
        }
      });
    }

    const passForm = document.getElementById('form-user-password');
    if (passForm) {
      passForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.OrbitToast.success('Password updated successfully (Simulation).');
        passForm.reset();
      });
    }
  },

  render() {
    const user = window.OrbitAuth.getCurrentUser() || {
      name: 'Alex Rivera',
      email: 'alex@orbitdesk.io',
      role: 'Product Lead',
      avatar: 'AR',
      color: '#4f46e5'
    };

    const nameInput = document.getElementById('profile-name');
    const roleInput = document.getElementById('profile-role');
    const emailInput = document.getElementById('profile-email');
    const avatarBadge = document.getElementById('profile-avatar-display');

    if (nameInput) nameInput.value = user.name;
    if (roleInput) roleInput.value = user.role;
    if (emailInput) emailInput.value = user.email;
    if (avatarBadge) {
      avatarBadge.textContent = user.avatar;
      avatarBadge.style.backgroundColor = user.color || '#4f46e5';
    }

    // Render User Activity Log
    this.renderUserActivity(user.id);
  },

  renderUserActivity(userId) {
    const container = document.getElementById('profile-activity-list');
    if (!container) return;

    const activities = (window.OrbitStore.state.activities || []).filter(a => a.actorId === userId).slice(0, 8);

    if (activities.length === 0) {
      container.innerHTML = `<div style="padding: 16px; color: var(--text-muted); font-size: 0.85rem;">No recent activities for your account.</div>`;
      return;
    }

    container.innerHTML = activities.map(act => `
      <div style="display:flex; align-items:flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border); font-size:0.85rem;">
        <div style="width: 8px; height: 8px; border-radius: 50%; background-color: var(--primary); margin-top: 6px;"></div>
        <div>
          <div style="color: var(--text-primary);">
            You ${act.action} <strong>"${act.target}"</strong>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">
            ${new Date(act.timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    `).join('');
  }
};

window.OrbitProfileView = OrbitProfileView;
