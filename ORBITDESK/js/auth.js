/**
 * OrbitDesk Authentication Simulation
 * Provides client-side user sessions, login/signup validation, and demo autofill.
 */

const OrbitAuth = {
  getStoredSession() {
    try {
      const raw = localStorage.getItem('orbitdesk_auth_session_v1');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse auth session:', e);
    }
    // Default demo session for smooth immediate exploration if desired
    return {
      isAuthenticated: true,
      user: {
        id: 'usr-1',
        name: 'Alex Rivera',
        email: 'alex@orbitdesk.io',
        role: 'Product Lead',
        avatar: 'AR',
        color: '#4f46e5'
      }
    };
  },

  saveSession(session) {
    try {
      localStorage.setItem('orbitdesk_auth_session_v1', JSON.stringify(session));
    } catch (e) {
      console.error('Failed to persist session:', e);
    }
  },

  getCurrentUser() {
    const session = this.getStoredSession();
    return session && session.isAuthenticated ? session.user : null;
  },

  isAuthenticated() {
    const session = this.getStoredSession();
    return Boolean(session && session.isAuthenticated);
  },

  login(email, password, rememberMe = true) {
    // Form validation
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // Match with existing users or fallback
    const users = window.OrbitStore ? window.OrbitStore.state.users : [];
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      id: 'usr-1',
      name: email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
      email: email,
      role: 'Team Lead',
      avatar: email.substring(0, 2).toUpperCase(),
      color: '#4f46e5'
    };

    const session = {
      isAuthenticated: true,
      user: matched,
      loginTime: new Date().toISOString(),
      rememberMe
    };

    this.saveSession(session);
    if (window.OrbitStore) {
      window.OrbitStore.logActivity('logged into workspace', matched.email);
    }
    return { success: true, user: matched };
  },

  signup(name, email, password, workspaceName) {
    if (!name || name.trim().length < 2) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid work email.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
    const newUser = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      role: 'Workspace Admin',
      avatar: initials,
      color: '#4f46e5'
    };

    // Add user to state
    if (window.OrbitStore) {
      window.OrbitStore.state.users.unshift(newUser);
      if (workspaceName && workspaceName.trim()) {
        window.OrbitStore.state.settings.workspaceName = workspaceName.trim();
      }
      window.OrbitStore.persist();
    }

    const session = {
      isAuthenticated: true,
      user: newUser,
      loginTime: new Date().toISOString(),
      rememberMe: true
    };

    this.saveSession(session);
    if (window.OrbitStore) {
      window.OrbitStore.logActivity('created workspace account', newUser.email);
    }
    return { success: true, user: newUser };
  },

  logout() {
    const user = this.getCurrentUser();
    if (user && window.OrbitStore) {
      window.OrbitStore.logActivity('signed out from workspace', user.email);
    }
    localStorage.removeItem('orbitdesk_auth_session_v1');
    window.location.hash = '#/login';
  },

  demoFill(roleIndex = 0) {
    const users = window.OrbitStore ? window.OrbitStore.state.users : [];
    const target = users[roleIndex] || users[0] || {
      name: 'Alex Rivera',
      email: 'alex@orbitdesk.io',
      role: 'Product Lead'
    };
    return {
      email: target.email,
      password: 'orbit-password-demo'
    };
  }
};

window.OrbitAuth = OrbitAuth;
