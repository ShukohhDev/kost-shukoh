import { CONFIG } from './config.js';
import { db } from './storage.js';

class ApiClient {
  constructor() {
    this.baseUrl = CONFIG.API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem(CONFIG.AUTH_TOKEN_KEY);
  }

  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(options.headers)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      if (CONFIG.USE_MOCK_FALLBACK) {
        console.warn(`[API Client] Endpoint ${endpoint} dialihkan ke Local Store Fallback:`, err.message);
        return this.handleFallback(endpoint, options);
      }
      throw err;
    }
  }

  // --- Fallback Router when Laravel Server is not running ---
  handleFallback(endpoint, options) {
    const method = (options.method || 'GET').toUpperCase();
    const body = options.body ? JSON.parse(options.body) : {};

    // 1. Settings
    if (endpoint === '/settings') {
      if (method === 'GET') return { success: true, data: db.getSettings() };
      if (method === 'PUT' || method === 'POST') return { success: true, data: db.updateSettings(body), message: 'Pengaturan berhasil diperbarui.' };
    }

    // 2. Rooms
    if (endpoint === '/rooms' || endpoint === '/public/rooms') {
      if (method === 'GET') return { success: true, data: db.getRooms() };
      if (method === 'POST') return { success: true, data: db.saveRoom(body), message: 'Kamar berhasil disimpan.' };
    }
    if (endpoint.startsWith('/rooms/')) {
      const id = endpoint.split('/')[2];
      if (method === 'GET') {
        const room = db.getRoomById(id);
        if (!room) return { success: false, message: 'Kamar tidak ditemukan' };
        return { success: true, data: room };
      }
      if (method === 'PUT') {
        return { success: true, data: db.saveRoom({ ...body, id }), message: 'Kamar berhasil diperbarui.' };
      }
    }

    // 3. Bookings
    if (endpoint === '/bookings' || endpoint === '/public/bookings') {
      if (method === 'GET') return { success: true, data: db.getBookings() };
      if (method === 'POST') {
        const newBooking = db.createBooking(body);
        return { success: true, data: newBooking, message: 'Pengajuan booking berhasil dikirim! Simpan kode booking Anda.' };
      }
    }
    if (endpoint.startsWith('/public/bookings/status/')) {
      const code = endpoint.split('/')[4];
      const b = db.getBookings().find(x => x.booking_code.toUpperCase() === code.toUpperCase());
      if (!b) return { success: false, message: 'Kode booking tidak ditemukan.' };
      return { success: true, data: b };
    }
    if (endpoint.startsWith('/bookings/') && endpoint.endsWith('/status')) {
      const parts = endpoint.split('/');
      const id = parts[2];
      const updated = db.updateBookingStatus(id, body.status, body.admin_note);
      return { success: true, data: updated, message: 'Status booking berhasil diperbarui.' };
    }

    // 4. Bills & Payments
    if (endpoint === '/bills') {
      return { success: true, data: db.getBills() };
    }
    if (endpoint === '/payments') {
      if (method === 'GET') return { success: true, data: db.getPayments() };
      if (method === 'POST') {
        const payment = db.submitPayment(body.bill_id, body);
        return { success: true, data: payment, message: 'Bukti pembayaran berhasil diunggah dan menunggu verifikasi admin.' };
      }
    }
    if (endpoint.startsWith('/payments/') && endpoint.endsWith('/verify')) {
      const parts = endpoint.split('/');
      const id = parts[2];
      const payment = db.verifyPayment(id, body.is_approved, body.rejection_reason);
      return { success: true, data: payment, message: body.is_approved ? 'Pembayaran berhasil diverifikasi!' : 'Pembayaran ditolak.' };
    }

    // 5. Expenses
    if (endpoint === '/expenses') {
      if (method === 'GET') return { success: true, data: db.getExpenses() };
      if (method === 'POST') return { success: true, data: db.addExpense(body), message: 'Pengeluaran operasional berhasil dicatat.' };
    }

    // 6. Complaints
    if (endpoint === '/complaints') {
      if (method === 'GET') return { success: true, data: db.getComplaints() };
      if (method === 'POST') return { success: true, data: db.addComplaint(body), message: 'Keluhan / laporan kerusakan berhasil dikirim.' };
    }
    if (endpoint.startsWith('/complaints/') && endpoint.endsWith('/status')) {
      const parts = endpoint.split('/');
      const id = parts[2];
      const updated = db.updateComplaintStatus(id, body.status, body.admin_note);
      return { success: true, data: updated, message: 'Status keluhan diperbarui.' };
    }

    // 7. Facilities & Announcements
    if (endpoint === '/facilities') return { success: true, data: db.get('facilities') };
    if (endpoint === '/announcements') return { success: true, data: db.get('announcements') };
    if (endpoint === '/rules') return { success: true, data: db.get('rules') };

    // 8. Auth Fallback
    if (endpoint === '/auth/login') {
      const { email, password } = body;
      const normalizedEmail = (email || '').trim().toLowerCase();

      // Check Admin
      if (normalizedEmail === 'shukohh21@gmail.com' || normalizedEmail === 'admin@kostshukoh.com') {
        if (password !== 'FAFA17052007') {
          return {
            success: false,
            message: 'Password salah untuk akun pengelola (Admin).'
          };
        }
        return {
          success: true,
          data: {
            token: 'mock-admin-token-xyz',
            user: { id: 1, name: 'Pengelola Kost Shukoh', email: 'shukohh21@gmail.com', role: 'ADMIN' }
          },
          message: 'Login Admin berhasil.'
        };
      } else {
        // Tenant
        return {
          success: true,
          data: {
            token: 'mock-tenant-token-abc',
            user: { id: 2, name: 'Fajar Nugraha', email: normalizedEmail || 'fajar@gmail.com', role: 'TENANT', room_code: 'A-01' }
          },
          message: 'Login Penghuni berhasil.'
        };
      }
    }

    return { success: false, message: `Endpoint ${endpoint} belum terpetakan.` };
  }

  // Helper Shorthands
  get(endpoint) { return this.request(endpoint, { method: 'GET' }); }
  post(endpoint, data) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) }); }
  put(endpoint, data) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }); }
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
}

export const api = new ApiClient();
