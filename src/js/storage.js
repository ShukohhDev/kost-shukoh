import { INITIAL_MOCK_DATA } from './mock-data.js';

const STORAGE_PREFIX = 'kost_shukoh_';

const getStorage = () => {
  if (typeof localStorage !== 'undefined') return localStorage;
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) return globalThis.localStorage;
  if (!globalThis.__memStorage) {
    globalThis.__memStorage = {
      _data: {},
      getItem(k) { return Object.prototype.hasOwnProperty.call(this._data, k) ? this._data[k] : null; },
      setItem(k, v) { this._data[k] = String(v); },
      removeItem(k) { delete this._data[k]; },
      clear() { this._data = {}; }
    };
  }
  return globalThis.__memStorage;
};

export class LocalDataStore {
  constructor() {
    this.init();
  }

  init() {
    const storage = getStorage();
    for (const [key, defaultVal] of Object.entries(INITIAL_MOCK_DATA)) {
      const storageKey = STORAGE_PREFIX + key;
      if (!storage.getItem(storageKey)) {
        storage.setItem(storageKey, JSON.stringify(defaultVal));
      }
    }
  }

  get(collection) {
    const storage = getStorage();
    const raw = storage.getItem(STORAGE_PREFIX + collection);
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  set(collection, data) {
    const storage = getStorage();
    storage.setItem(STORAGE_PREFIX + collection, JSON.stringify(data));
  }

  resetAll() {
    const storage = getStorage();
    for (const key of Object.keys(INITIAL_MOCK_DATA)) {
      storage.removeItem(STORAGE_PREFIX + key);
    }
    this.init();
  }

  // --- Specialized Handlers ---

  getSettings() {
    return this.get('settings');
  }

  updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    this.set('settings', updated);
    return updated;
  }

  getRooms() {
    return this.get('rooms');
  }

  getRoomById(id) {
    const rooms = this.getRooms();
    return rooms.find(r => r.id === Number(id) || r.id === id);
  }

  saveRoom(roomData) {
    const rooms = this.getRooms();
    if (roomData.id) {
      const idx = rooms.findIndex(r => r.id === Number(roomData.id));
      if (idx !== -1) {
        rooms[idx] = { ...rooms[idx], ...roomData };
      }
    } else {
      const newId = rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1;
      rooms.push({ ...roomData, id: newId, occupied: false, booked: false });
    }
    this.set('rooms', rooms);
    return roomData;
  }

  getBookings() {
    return this.get('bookings');
  }

  createBooking(bookingInput) {
    const bookings = this.getBookings();
    const newId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
    const randomCode = 'BSHK-' + Math.floor(1000 + Math.random() * 9000);
    
    const newBooking = {
      id: newId,
      booking_code: randomCode,
      room_id: Number(bookingInput.room_id),
      room_code: bookingInput.room_code || 'Kamar',
      applicant_name: bookingInput.applicant_name,
      applicant_phone: bookingInput.applicant_phone,
      applicant_email: bookingInput.applicant_email || '',
      planned_start_date: bookingInput.planned_start_date,
      duration_months: Number(bookingInput.duration_months || 1),
      occupant_count: Number(bookingInput.occupant_count || 1),
      status: 'PENDING',
      admin_note: null,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    bookings.unshift(newBooking);
    this.set('bookings', bookings);

    // Tandai kamar sedang dipesan
    const rooms = this.getRooms();
    const room = rooms.find(r => r.id === newBooking.room_id);
    if (room) {
      room.booked = true;
      room.booking_code = randomCode;
      this.set('rooms', rooms);
    }

    return newBooking;
  }

  updateBookingStatus(id, newStatus, adminNote = '') {
    const bookings = this.getBookings();
    const idx = bookings.findIndex(b => b.id === Number(id));
    if (idx !== -1) {
      bookings[idx].status = newStatus;
      if (adminNote) bookings[idx].admin_note = adminNote;
      this.set('bookings', bookings);

      // Sinkronisasi status kamar jika ditolak atau dibatalkan
      if (newStatus === 'REJECTED' || newStatus === 'CANCELLED') {
        const rooms = this.getRooms();
        const room = rooms.find(r => r.id === bookings[idx].room_id);
        if (room && room.booking_code === bookings[idx].booking_code) {
          room.booked = false;
          room.booking_code = null;
          this.set('rooms', rooms);
        }
      }
      return bookings[idx];
    }
    return null;
  }

  getBills() {
    return this.get('bills');
  }

  getPayments() {
    return this.get('payments');
  }

  submitPayment(billId, paymentData) {
    const payments = this.getPayments();
    const bills = this.getBills();
    const bill = bills.find(b => b.id === Number(billId));
    if (!bill) throw new Error('Tagihan tidak ditemukan');

    const newId = payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1;
    const payment = {
      id: newId,
      bill_id: bill.id,
      bill_number: bill.bill_number,
      tenant_id: bill.tenant_id,
      tenant_name: bill.tenant_name,
      amount: Number(paymentData.amount || bill.total_amount),
      payment_method: paymentData.payment_method || 'TRANSFER',
      paid_date: paymentData.paid_date || new Date().toISOString().substring(0, 10),
      proof_file_path: paymentData.proof_file_path || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      status: 'PENDING',
      verified_by: null,
      verified_at: null,
      rejection_reason: null
    };

    payments.unshift(payment);
    this.set('payments', payments);
    return payment;
  }

  verifyPayment(paymentId, isApproved, rejectionReason = '') {
    const payments = this.getPayments();
    const pIdx = payments.findIndex(p => p.id === Number(paymentId));
    if (pIdx === -1) throw new Error('Data pembayaran tidak ditemukan');

    const payment = payments[pIdx];
    if (isApproved) {
      payment.status = 'VERIFIED';
      payment.verified_by = 'Admin';
      payment.verified_at = new Date().toISOString().replace('T', ' ').substring(0, 19);

      // Update status bill
      const bills = this.getBills();
      const bIdx = bills.findIndex(b => b.id === payment.bill_id);
      if (bIdx !== -1) {
        bills[bIdx].paid_amount = Number(bills[bIdx].paid_amount) + Number(payment.amount);
        if (bills[bIdx].paid_amount >= bills[bIdx].total_amount) {
          bills[bIdx].status = 'PAID';
        } else {
          bills[bIdx].status = 'PARTIAL';
        }
        bills[bIdx].paid_at = payment.verified_at;
        this.set('bills', bills);
      }
    } else {
      payment.status = 'REJECTED';
      payment.rejection_reason = rejectionReason || 'Bukti transfer tidak terbaca / tidak valid.';
    }

    this.set('payments', payments);
    return payment;
  }

  getExpenses() {
    return this.get('expenses');
  }

  addExpense(expenseData) {
    const expenses = this.getExpenses();
    const newId = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
    const newExp = {
      id: newId,
      category: expenseData.category,
      description: expenseData.description,
      amount: Number(expenseData.amount),
      expense_date: expenseData.expense_date || new Date().toISOString().substring(0, 10),
      created_by: 'Admin'
    };
    expenses.unshift(newExp);
    this.set('expenses', expenses);
    return newExp;
  }

  getComplaints() {
    return this.get('complaints');
  }

  addComplaint(complaintData) {
    const complaints = this.getComplaints();
    const newId = complaints.length > 0 ? Math.max(...complaints.map(c => c.id)) + 1 : 1;
    const ticketCode = 'TKT-' + new Date().getFullYear() + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(newId).padStart(2, '0');
    
    const newComplaint = {
      id: newId,
      ticket_code: ticketCode,
      tenant_id: complaintData.tenant_id || 1,
      tenant_name: complaintData.tenant_name || 'Penghuni',
      room_code: complaintData.room_code || 'A-01',
      category: complaintData.category || 'Fasilitas',
      title: complaintData.title,
      description: complaintData.description,
      priority: complaintData.priority || 'NORMAL',
      status: 'NEW',
      admin_note: null,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    complaints.unshift(newComplaint);
    this.set('complaints', complaints);
    return newComplaint;
  }

  updateComplaintStatus(id, newStatus, adminNote = '') {
    const complaints = this.getComplaints();
    const idx = complaints.findIndex(c => c.id === Number(id));
    if (idx !== -1) {
      complaints[idx].status = newStatus;
      if (adminNote) complaints[idx].admin_note = adminNote;
      this.set('complaints', complaints);
      return complaints[idx];
    }
    return null;
  }
}

export const db = new LocalDataStore();
