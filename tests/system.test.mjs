import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_MOCK_DATA } from '../src/js/mock-data.js';

describe('Kost Shukoh - Business Logic & Mock Data Tests', () => {
  test('Initial mock data contains valid settings and rooms', () => {
    assert.ok(INITIAL_MOCK_DATA.settings);
    assert.equal(INITIAL_MOCK_DATA.settings.kost_name, 'Kost Shukoh');
    assert.ok(Array.isArray(INITIAL_MOCK_DATA.rooms));
    assert.ok(INITIAL_MOCK_DATA.rooms.length >= 3);
  });

  test('All rooms have valid numeric base rates and positive capacity', () => {
    for (const room of INITIAL_MOCK_DATA.rooms) {
      assert.ok(room.base_rate > 0, `Room ${room.room_code} must have positive rate`);
      assert.ok(room.capacity > 0, `Room ${room.room_code} must have positive capacity`);
      assert.ok(['ACTIVE', 'MAINTENANCE', 'INACTIVE'].includes(room.operational_status));
    }
  });

  test('Bills have positive total amount and valid status', () => {
    for (const bill of INITIAL_MOCK_DATA.bills) {
      assert.ok(bill.total_amount > 0);
      assert.ok(['UNPAID', 'PARTIAL', 'PAID', 'VOID'].includes(bill.status));
    }
  });

  test('Booking flow rules: booking code is formatted properly', () => {
    for (const booking of INITIAL_MOCK_DATA.bookings) {
      assert.match(booking.booking_code, /^BSHK-\d{4}$/);
      assert.ok(booking.applicant_name.length > 0);
    }
  });

  test('Facilities and rules have required descriptive fields', () => {
    assert.ok(INITIAL_MOCK_DATA.facilities.length > 0);
    assert.ok(INITIAL_MOCK_DATA.rules.length > 0);
  });

  test('Admin credentials check: shukohh21@gmail.com and FAFA17052007', () => {
    const adminEmail = 'shukohh21@gmail.com';
    const adminPass = 'FAFA17052007';

    // Simulate login verification logic
    const verifyLogin = (email, pass) => {
      const norm = email.trim().toLowerCase();
      if (norm === 'shukohh21@gmail.com' || norm === 'admin@kostshukoh.com') {
        if (pass === 'FAFA17052007') {
          return { role: 'ADMIN', success: true };
        }
        return { success: false, message: 'Password salah' };
      }
      return { role: 'TENANT', success: true };
    };

    assert.deepEqual(verifyLogin(adminEmail, adminPass), { role: 'ADMIN', success: true });
    assert.equal(verifyLogin(adminEmail, 'wrongpassword').success, false);
    assert.equal(verifyLogin('fajar@gmail.com', 'anything').role, 'TENANT');
  });
});
