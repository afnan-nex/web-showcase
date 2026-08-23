/**
 * NORTHSTAR COMMERCE - Toast Notification System
 */

export const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.getElementById('toast-container');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        document.body.appendChild(this.container);
      }
    }
  },

  show(message, type = 'info', duration = 3200, action = null) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'danger') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
        ${iconSvg}
        <span>${message}</span>
      </div>
      ${action ? `<button class="toast-action-btn" style="color: #ffffff; text-decoration: underline; font-size: 12px; margin-left: 8px; font-weight: 600;">${action.label}</button>` : ''}
    `;

    if (action && action.onClick) {
      const actionBtn = toast.querySelector('.toast-action-btn');
      if (actionBtn) {
        actionBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          action.onClick();
          this.dismiss(toast);
        });
      }
    }

    this.container.appendChild(toast);

    const timer = setTimeout(() => {
      this.dismiss(toast);
    }, duration);

    toast.addEventListener('click', () => {
      clearTimeout(timer);
      this.dismiss(toast);
    });

    return toast;
  },

  success(msg, duration = 3000, action = null) {
    return this.show(msg, 'success', duration, action);
  },

  error(msg, duration = 4000) {
    return this.show(msg, 'danger', duration);
  },

  warning(msg, duration = 3500) {
    return this.show(msg, 'warning', duration);
  },

  info(msg, duration = 3000) {
    return this.show(msg, 'info', duration);
  },

  dismiss(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.add('toast-fadeout');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 280);
  }
};
