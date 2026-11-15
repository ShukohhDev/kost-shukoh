/**
 * Kost Shukoh Initial Mock Data Store (Synchronized with MySQL Schema)
 */
export const INITIAL_MOCK_DATA = {
  settings: {
    kost_name: 'Kost Shukoh',
    address: 'Jl. Pemuda No. 45, Area Kampus & Perkantoran',
    contact_phone: '0812-3456-7890',
    contact_email: 'pengelola@kostshukoh.com',
    kost_gender_type: 'CAMPUR', // Bisa diubah di admin: PUTRA, PUTRI, CAMPUR, PASUTRI_ALLOWED
    max_occupants_per_room: 1,
    allow_two_occupants: true,
    extra_occupant_fee: 300000,
    rental_durations_enabled: ['monthly', '3_months', '6_months', 'yearly'],
    utility_scheme: 'TOKEN_PLN_MANDIRI', // ALL_IN, TOKEN_PLN_MANDIRI, METERAN_PASCABAYAR
    billing_due_date_rule: 'FOLLOW_START_DATE', // FOLLOW_START_DATE, FIXED_DAY_OF_MONTH
    fixed_billing_day: 1,
    deposit_enabled: true,
    default_deposit_amount: 500000,
    late_fine_enabled: false,
    late_fine_amount: 25000,
    booking_requires_dp: false,
    default_dp_amount: 200000,
  },

  facilities: [
    { id: 1, name: 'Wi-Fi Kecepatan Tinggi (Up to 100 Mbps)', icon: 'wifi', description: 'Koneksi stabil di seluruh lantai dan kamar.' },
    { id: 2, name: 'Dapur Bersama & Kulkas', icon: 'utensils', description: 'Dilengkapi kompor gas, wastafel cuci piring, dan microwave.' },
    { id: 3, name: 'Parkir Motor Luas & Beratap', icon: 'shield-check', description: 'Aman dengan pagar tertutup dan pencahayaan terang.' },
    { id: 4, name: 'CCTV 24 Jam', icon: 'video', description: 'Pengawasan keamanan di lorong, tangga, dan area parkir.' },
    { id: 5, name: 'Mesin Cuci & Area Jemuran', icon: 'shirt', description: 'Fasilitas cuci mandiri gratis untuk semua penghuni.' },
    { id: 6, name: 'Akses 24 Jam dengan Kunci Gerbang', icon: 'key', description: 'Kebebasan beraktivitas dengan tetap menjaga ketertiban.' }
  ],

  room_types: [
    { id: 1, name: 'Standard Room', base_rate: 950000, description: 'Kamar nyaman ukuran 3x3 m, kamar mandi luar bersih terawat.' },
    { id: 2, name: 'Deluxe AC Room', base_rate: 1350000, description: 'Kamar ukuran 3.5x3.5 m ber-AC dingin, kamar mandi dalam shower.' },
    { id: 3, name: 'Executive Suite', base_rate: 1750000, description: 'Kamar luas 4x4 m ber-AC, kamar mandi dalam, water heater & meja kerja lapang.' }
  ],

  rooms: [
    {
      id: 1,
      room_code: 'A-01',
      room_type_id: 1,
      type_name: 'Standard Room',
      floor: 1,
      capacity: 1,
      base_rate: 950000,
      operational_status: 'ACTIVE', // ACTIVE, MAINTENANCE, INACTIVE
      is_published: true,
      description: 'Kamar lantai 1 dekat dengan ruang santai dan dapur bersama.',
      amenities: ['Kasur Springbed 100x200', 'Lemari Pakaian 2 Pintu', 'Meja & Kursi Belajar', 'Kipas Angin Dinding'],
      photo_url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      // Okupansi status derived dari sewa
      occupied: true,
      current_tenant: 'Fajar Nugraha',
      lease_id: 101,
      lease_end: '2026-12-15'
    },
    {
      id: 2,
      room_code: 'A-02',
      room_type_id: 2,
      type_name: 'Deluxe AC Room',
      floor: 1,
      capacity: 2,
      base_rate: 1350000,
      operational_status: 'ACTIVE',
      is_published: true,
      description: 'Kamar sejuk lantai 1 dengan jendela menghadap taman kecil.',
      amenities: ['AC 0.5 PK hemat listrik', 'Kamar Mandi Dalam', 'Kasur 120x200', 'Lemari Pakaian', 'Meja Kerja'],
      photo_url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      occupied: false,
      booked: false
    },
    {
      id: 3,
      room_code: 'A-03',
      room_type_id: 2,
      type_name: 'Deluxe AC Room',
      floor: 1,
      capacity: 2,
      base_rate: 1350000,
      operational_status: 'ACTIVE',
      is_published: true,
      description: 'Kamar nyaman lantai 1 dengan pencahayaan alami optimal.',
      amenities: ['AC 0.5 PK', 'Kamar Mandi Dalam', 'Kasur Springbed', 'Lemari', 'Cermin'],
      photo_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      occupied: true,
      current_tenant: 'Dimas Wicaksono',
      lease_id: 102,
      lease_end: '2026-11-28'
    },
    {
      id: 4,
      room_code: 'B-01',
      room_type_id: 3,
      type_name: 'Executive Suite',
      floor: 2,
      capacity: 2,
      base_rate: 1750000,
      operational_status: 'ACTIVE',
      is_published: true,
      description: 'Kamar eksekutif lantai 2 dengan balkon pribadi dan water heater.',
      amenities: ['AC 1 PK Daikin', 'Kamar Mandi Dalam + Water Heater', 'Kasur Queen 160x200', 'Balkon Pribadi', 'Smart TV 32 Inch'],
      photo_url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=800&q=80',
      occupied: false,
      booked: true, // Sedang dipesan
      booking_code: 'BSHK-8921'
    },
    {
      id: 5,
      room_code: 'B-02',
      room_type_id: 2,
      type_name: 'Deluxe AC Room',
      floor: 2,
      capacity: 1,
      base_rate: 1350000,
      operational_status: 'MAINTENANCE',
      is_published: true,
      description: 'Sedang dalam pengecatan ulang dan peremajaan furnitur.',
      amenities: ['AC 0.5 PK', 'Kamar Mandi Dalam', 'Springbed'],
      photo_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      occupied: false,
      booked: false
    }
  ],

  bookings: [
    {
      id: 1,
      booking_code: 'BSHK-8921',
      room_id: 4,
      room_code: 'B-01',
      applicant_name: 'Reza Pratama',
      applicant_phone: '0813-8899-7711',
      applicant_email: 'reza.pratama@gmail.com',
      planned_start_date: '2026-11-20',
      duration_months: 6,
      occupant_count: 1,
      status: 'CONFIRMED', // PENDING, APPROVED, AWAITING_DP, CONFIRMED, REJECTED, CONVERTED
      created_at: '2026-11-13 14:20:00',
      admin_note: 'Sudah dihubungi via WA. Siap check in tgl 20 Nov.'
    },
    {
      id: 2,
      booking_code: 'BSHK-1044',
      room_id: 2,
      room_code: 'A-02',
      applicant_name: 'Anisa Larasati',
      applicant_phone: '0812-7744-1122',
      applicant_email: 'anisa.larasati@yahoo.com',
      planned_start_date: '2026-12-01',
      duration_months: 1,
      occupant_count: 1,
      status: 'PENDING',
      created_at: '2026-11-14 10:15:00',
      admin_note: null
    }
  ],

  tenants: [
    {
      id: 1,
      user_id: 2,
      full_name: 'Fajar Nugraha',
      phone: '0812-9988-7766',
      email: 'fajar@gmail.com',
      room_code: 'A-01',
      room_id: 1,
      emergency_name: 'Bpk. Nugraha (Ayah)',
      emergency_phone: '0811-2233-4455',
      id_card_number: '3201012345678901',
      status: 'ACTIVE',
      lease_start: '2026-05-15',
      lease_end: '2026-12-15'
    },
    {
      id: 2,
      user_id: 3,
      full_name: 'Dimas Wicaksono',
      phone: '0819-3322-1100',
      email: 'dimas.w@gmail.com',
      room_code: 'A-03',
      room_id: 3,
      emergency_name: 'Ibu Ratna (Ibu)',
      emergency_phone: '0813-9900-1122',
      id_card_number: '3201098765432100',
      status: 'ACTIVE',
      lease_start: '2026-08-28',
      lease_end: '2026-11-28'
    }
  ],

  bills: [
    {
      id: 1,
      lease_id: 101,
      tenant_id: 1,
      tenant_name: 'Fajar Nugraha',
      room_code: 'A-01',
      bill_number: 'INV-202611-001',
      bill_type: 'RENT',
      period_start: '2026-11-15',
      period_end: '2026-12-15',
      total_amount: 950000,
      paid_amount: 950000,
      due_date: '2026-11-15',
      status: 'PAID', // UNPAID, PARTIAL, PAID, VOID
      paid_at: '2026-11-14 11:30:00'
    },
    {
      id: 2,
      lease_id: 102,
      tenant_id: 2,
      tenant_name: 'Dimas Wicaksono',
      room_code: 'A-03',
      bill_number: 'INV-202611-002',
      bill_type: 'RENT',
      period_start: '2026-11-28',
      period_end: '2026-12-28',
      total_amount: 1350000,
      paid_amount: 0,
      due_date: '2026-11-28',
      status: 'UNPAID',
      paid_at: null
    }
  ],

  payments: [
    {
      id: 1,
      bill_id: 1,
      bill_number: 'INV-202611-001',
      tenant_id: 1,
      tenant_name: 'Fajar Nugraha',
      amount: 950000,
      payment_method: 'TRANSFER',
      paid_date: '2026-11-14',
      proof_file_path: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      status: 'VERIFIED', // PENDING, VERIFIED, REJECTED
      verified_by: 'Admin',
      verified_at: '2026-11-14 11:30:00',
      rejection_reason: null
    }
  ],

  expenses: [
    {
      id: 1,
      category: 'Listrik & Utilitas',
      description: 'Pembayaran Tagihan Listrik PLN Area Fasilitas Umum & Pompa Air',
      amount: 450000,
      expense_date: '2026-11-05',
      created_by: 'Admin'
    },
    {
      id: 2,
      category: 'Internet Wi-Fi',
      description: 'Langganan Wi-Fi Dedicated Indihome 100 Mbps',
      amount: 550000,
      expense_date: '2026-11-10',
      created_by: 'Admin'
    },
    {
      id: 3,
      category: 'Kebersihan & Sampah',
      description: 'Iuran Retribusi Sampah & Pembersihan Toren Air',
      amount: 200000,
      expense_date: '2026-11-12',
      created_by: 'Admin'
    }
  ],

  complaints: [
    {
      id: 1,
      ticket_code: 'TKT-202611-01',
      tenant_id: 1,
      tenant_name: 'Fajar Nugraha',
      room_code: 'A-01',
      category: 'Kran Air / Pipa',
      title: 'Kran wastafel luar menetes air',
      description: 'Kran wastafel depan kamar A-01 tidak bisa ditutup rapat, air menetes pelan terus-menerus.',
      priority: 'NORMAL',
      status: 'IN_PROGRESS', // NEW, IN_PROGRESS, RESOLVED, REJECTED
      admin_note: 'Teknisi dijadwalkan datang besok Sabtu jam 10 pagi.',
      created_at: '2026-11-13 16:00:00'
    }
  ],

  announcements: [
    {
      id: 1,
      title: 'Pembersihan Toren & Pemeriksaan Saluran Air',
      content: 'Diberitahukan kepada seluruh penghuni Kost Shukoh, pada hari Minggu, 22 November 2026 pukul 09.00 - 12.00 WIB akan dilakukan pembersihan toren air. Pasokan air akan dimatikan sementara.',
      target_audience: 'ACTIVE_TENANTS',
      is_published: true,
      published_at: '2026-11-12'
    },
    {
      id: 2,
      title: 'Tata Tertib Tamu & Kunci Gerbang Malam',
      content: 'Demi keamanan dan kenyamanan bersama, gerbang utama dikunci mulai pukul 23.00 WIB. Penghuni yang pulang larut malam harap menggunakan kunci gerbang masing-masing dan menutup kembali dengan rapat.',
      target_audience: 'ALL',
      is_published: true,
      published_at: '2026-11-01'
    }
  ],

  rules: [
    { id: 1, category: 'Ketertiban', title: 'Jam Ketenangan', text: 'Jam tenang dimulai pukul 22.00 WIB. Harap mengecilkan volume suara TV, musik, dan obrolan demi kenyamanan istirahat penghuni lain.' },
    { id: 2, category: 'Tamu', title: 'Ketentuan Tamu', text: 'Tamu diperbolehkan berkunjung maksimal pukul 22.00 WIB di ruang tamu/teras bersama. Tamu dilarang menginap tanpa persetujuan pengelola.' },
    { id: 3, category: 'Kebersihan', title: 'Kebersihan Fasilitas Bersama', text: 'Setelah menggunakan dapur bersama, wajib mencuci peralatan makan/masak sendiri dan membersihkan kompor.' },
    { id: 4, category: 'Keamanan', title: 'Kunci & Kendaraan', text: 'Kunci kamar menjadi tanggung jawab masing-masing. Parkirkan motor dengan tertib dan gunakan kunci ganda.' },
    { id: 5, category: 'Larangan', title: 'Larangan Keras', text: 'Dilarang keras membawa/mengonsumsi miras, narkoba, senjata tajam, serta melakukan perbuatan yang melanggar hukum dan norma asusila.' }
  ]
};
