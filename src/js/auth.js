import { CONFIG } from './config.js';
import { api } from './api.js';

export const auth = {
  getToken() {
    return localStorage.getItem(CONFIG.AUTH_TOKEN_KEY);
  },

  getUser() {
    const raw = localStorage.getItem(CONFIG.AUTH_USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!this.getToken() && !!this.getUser();
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'ADMIN';
  },

  isTenant() {
    const user = this.getUser();
    return user && user.role === 'TENANT';
  },

  async login(email, password, expectedRole = null) {
    const res = await api.post('/auth/login', { email, password, role: expectedRole });
    if (res.success && res.data) {
      localStorage.setItem(CONFIG.AUTH_TOKEN_KEY, res.data.token);
      localStorage.setItem(CONFIG.AUTH_USER_KEY, JSON.stringify(res.data.user));
      return res.data.user;
    }
    throw new Error(res.message || 'Login gagal, periksa email dan password Anda.');
  },

  logout() {
    localStorage.removeItem(CONFIG.AUTH_TOKEN_KEY);
    localStorage.removeItem(CONFIG.AUTH_USER_KEY);
    window.location.href = '/public/login.html';
  },

  // Guard for protected pages
  guard(allowedRoles = ['ADMIN']) {
    const user = this.getUser();
    if (!this.isAuthenticated() || !user) {
      window.location.href = '/public/login.html?redirect=' + encodeURIComponent(window.location.pathname);
      return false;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      alert('Akses Ditolak: Anda tidak memiliki izin untuk membuka halaman ini.');
      window.location.href = user.role === 'ADMIN' ? '/admin/index.html' : '/tenant/index.html';
      return false;
    }
    return true;
  }
};
