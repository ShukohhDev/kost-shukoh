import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../src/js/storage.js';

describe('Kost Shukoh - End-to-End Business Logic & Lifecycle Tests', () => {
  beforeEach(() => {
    db.resetAll();
  });

  test('1. Room status and capacity management', () => {
    const rooms = db.getRooms();
    assert.ok(rooms.length >= 5);

    // Update room status to MAINTENANCE
    const targetRoom = rooms[0];
    db.saveRoom({ ...targetRoom, operational_status: 'MAINTENANCE' });
    
    const updated = db.getRoomById(targetRoom.id);
    assert.equal(updated.operational_status, 'MAINTENANCE');
  });

  test('2. Booking lifecycle: Submit, code generation, room locking, and status transition', () => {
    const newBooking = db.createBooking({
      room_id: 2,
      room_code: 'A-02',
      applicant_name: 'Budi Santoso',
      applicant_phone: '081234567890',
      planned_start_date: '2026-12-01',
      duration_months: 3,
      occupant_count: 1
    });

    assert.ok(newBooking.booking_code.startsWith('BSHK-'));
    assert.equal(newBooking.status, 'PENDING');

    // Room should now be marked as booked
    const room = db.getRoomById(2);
    assert.equal(room.booked, true);
    assert.equal(room.booking_code, newBooking.booking_code);

    // Admin approves booking
    const approved = db.updateBookingStatus(newBooking.id, 'CONFIRMED', 'Siap check-in');
    assert.equal(approved.status, 'CONFIRMED');
    assert.equal(approved.admin_note, 'Siap check-in');

    // Admin rejects booking -> room unbooked
    db.updateBookingStatus(newBooking.id, 'REJECTED', 'Dibatalkan');
    const roomAfterReject = db.getRoomById(2);
    assert.equal(roomAfterReject.booked, false);
  });

  test('3. Payment lifecycle: Submit proof, verify, and auto-settle bill', () => {
    const bills = db.getBills();
    const unpaidBill = bills.find(b => b.status === 'UNPAID');
    assert.ok(unpaidBill, 'Must have at least one unpaid bill');

    // Submit payment
    const payment = db.submitPayment(unpaidBill.id, {
      amount: unpaidBill.total_amount,
      payment_method: 'TRANSFER',
      paid_date: '2026-11-15',
      proof_file_path: 'https://images.unsplash.com/photo-test'
    });

    assert.equal(payment.status, 'PENDING');
    assert.equal(payment.amount, unpaidBill.total_amount);

    // Verify payment as Admin
    const verified = db.verifyPayment(payment.id, true);
    assert.equal(verified.status, 'VERIFIED');
    assert.ok(verified.verified_at);

    // Verify bill is now PAID
    const updatedBills = db.getBills();
    const settledBill = updatedBills.find(b => b.id === unpaidBill.id);
    assert.equal(settledBill.status, 'PAID');
    assert.equal(settledBill.paid_amount, settledBill.total_amount);
  });

  test('4. Operational expenses and net cash balance math', () => {
    // Add new expense
    const newExp = db.addExpense({
      category: 'Perbaikan',
      description: 'Servis AC Kamar B-02',
      amount: 250000,
      expense_date: '2026-11-15'
    });

    assert.equal(newExp.amount, 250000);
    const expenses = db.getExpenses();
    const totalExp = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    const payments = db.getPayments();
    const verifiedIncome = payments.filter(p => p.status === 'VERIFIED').reduce((sum, p) => sum + Number(p.amount), 0);

    const netCash = verifiedIncome - totalExp;
    assert.equal(typeof netCash, 'number');
    assert.ok(!isNaN(netCash));
  });

  test('5. Dynamic Settings Engine: Update and retrieval integrity', () => {
    const initialSettings = db.getSettings();
    assert.equal(initialSettings.kost_name, 'Kost Shukoh');

    const updated = db.updateSettings({
      kost_gender_type: 'PUTRI',
      allow_two_occupants: false,
      extra_occupant_fee: 0,
      utility_scheme: 'ALL_IN',
      deposit_enabled: false,
      default_deposit_amount: 0,
      late_fine_enabled: true,
      late_fine_amount: 30000
    });

    assert.equal(updated.kost_gender_type, 'PUTRI');
    assert.equal(updated.allow_two_occupants, false);
    assert.equal(updated.utility_scheme, 'ALL_IN');
    assert.equal(updated.late_fine_enabled, true);
    assert.equal(updated.late_fine_amount, 30000);

    // Check persistence
    const reloaded = db.getSettings();
    assert.equal(reloaded.kost_gender_type, 'PUTRI');
    assert.equal(reloaded.late_fine_amount, 30000);
  });

  test('6. Complaints tracking: Lifecycle and admin notes', () => {
    const complaint = db.addComplaint({
      tenant_id: 1,
      tenant_name: 'Fajar Nugraha',
      room_code: 'A-01',
      category: 'Listrik',
      title: 'Lampu kamar mandi mati',
      description: 'Bohlam lampu putus'
    });

    assert.ok(complaint.ticket_code.startsWith('TKT-'));
    assert.equal(complaint.status, 'NEW');

    // Admin updates status
    const inProgress = db.updateComplaintStatus(complaint.id, 'IN_PROGRESS', 'Bohlam baru sedang dibeli');
    assert.equal(inProgress.status, 'IN_PROGRESS');
    assert.equal(inProgress.admin_note, 'Bohlam baru sedang dibeli');

    const resolved = db.updateComplaintStatus(complaint.id, 'RESOLVED', 'Bohlam sudah diganti');
    assert.equal(resolved.status, 'RESOLVED');
  });
});
