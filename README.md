# Kost Shukoh Management System (KMS)

Sistem Informasi Manajemen Terpadu untuk Properti **Kost Shukoh**.

Mencakup 3 portal pengguna:
1. **Website Publik:** Informasi kamar, galeri foto, fasilitas bersama, tata tertib, formulir booking online tanpa DP wajib, dan pelacakan status booking via kode unik.
2. **Portal Pengelola (Admin):** Dashboard KPI okupansi & arus kas (pendapatan vs pengeluaran operasional), kelola kamar (tarif, status operasional, kapasitas), inbox permohonan booking, verifikasi bukti transfer pembayaran, tiket keluhan, dan **Mesin Pengaturan Dinamis** (mengubah aturan gender, pasutri, utilitas, deposit, denda secara fleksibel).
3. **Portal Mandiri Penghuni (Tenant):** Informasi kamar aktif, tagihan sewa bulanan, upload bukti transfer bank/QRIS, pelaporan kerusakan/keluhan, dan pengumuman pengelola.

---

## 🛠️ Stack Teknologi

* **Frontend:** HTML5, CSS3, Tailwind CSS (Design Tokens khusus Kost Shukoh), Vanilla/Modular JavaScript (ES Modules).
* **Backend:** Laravel REST API (PHP ^8.2) + Laravel Sanctum Token Auth.
* **Database:** MySQL (InnoDB, Foreign Keys, ACID Transaction Concurrency Guard).
* **Tooling:** Node.js, npm, Vite, Tailwind CSS CLI, Python Local Runner.

---

## 🚀 Cara Menjalankan Aplikasi Secara Cepat

### 1. Menjalankan Frontend (Live Preview & Local Server)

Pastikan dependensi npm sudah terpasang:
```bash
npm install
```

Jalankan server lokal dengan perintah:
```bash
npm start
# atau
python run_kms.py
```
Server akan aktif di `http://localhost:3000` dan otomatis membuka browser.

Tautan halaman penting:
* **Beranda Publik:** [http://localhost:3000/](http://localhost:3000/)
* **Formulir Booking:** [http://localhost:3000/public/booking.html](http://localhost:3000/public/booking.html)
* **Pelacakan Kode Booking:** [http://localhost:3000/public/booking-status.html](http://localhost:3000/public/booking-status.html)
* **Login Portal:** [http://localhost:3000/public/login.html](http://localhost:3000/public/login.html)
* **Dashboard Admin:** [http://localhost:3000/admin/index.html](http://localhost:3000/admin/index.html)
* **Portal Penghuni:** [http://localhost:3000/tenant/index.html](http://localhost:3000/tenant/index.html)

> **Kredensial Demo Cepat di Halaman Login:**
> * **Admin:** `shukohh21@gmail.com` (password: `FAFA17052007`)
> * **Penghuni:** `fajar@gmail.com` (password bebas)

---

### 2. Menjalankan Backend Laravel & MySQL (Saat Deploy / Pengembangan Backend)

Masuk ke direktori `backend/`:
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Sesuaikan konfigurasi database di file `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kost_shukoh
DB_USERNAME=root
DB_PASSWORD=
```

Jalankan migrasi database dan seeders:
```bash
php artisan migrate --seed
```

Jalankan server API backend:
```bash
php artisan serve --port=8000
```
Frontend akan secara otomatis mendeteksi server Laravel pada port 8000 dan mengalirkan data riil ke MySQL!

---

## 🧪 Pengujian Sistem (Automated Tests)

Untuk menjalankan rangkaian pengujian logika bisnis:
```bash
npm test
```
Menguji integritas data kamar, validitas tarif numerik, pencegahan status kamar ilegal, dan format kode booking unik.

---

## 📂 Struktur Direktori Proyek

```
Kost Shukoh/
├── index.html                   # Beranda Publik & Showroom Kamar
├── public/
│   ├── booking.html             # Formulir Pengajuan Reservasi Publik
│   ├── booking-status.html      # Cek Status Booking via Kode Unik
│   ├── login.html               # Login Terpadu (Admin & Tenant)
│   └── css/style.css            # Compiled Minified Tailwind CSS
│
├── admin/
│   └── index.html               # Dashboard Pengelola & Kontrol Aturan
│
├── tenant/
│   └── index.html               # Portal Layanan Mandiri Penghuni
│
├── src/
│   ├── css/input.css            # Tailwind Directives & Custom Utilities
│   └── js/
│       ├── config.js            # Konfigurasi Endpoint & State
│       ├── mock-data.js         # Initial Store Data Kost Shukoh
│       ├── storage.js           # Local Persistent Engine
│       ├── api.js               # REST API Client with Live/Fallback Switch
│       ├── auth.js              # Token Auth & Route Guarding
│       └── ui.js                # Format Rupiah, Toast & Badge Generator
│
├── backend/                     # Laravel REST API Project
│   ├── app/Models/              # Eloquent Models (Room, Booking, Bill, Payment, dll)
│   ├── app/Http/Controllers/Api # API Controllers
│   ├── database/migrations/     # Migrasi Skema MySQL
│   ├── routes/api.php           # Definisi Rute REST API
│   ├── composer.json            # PHP & Laravel Dependencies
│   └── .env.example             # Konfigurasi Database & CORS
│
├── tests/
│   └── system.test.mjs          # Automated System & Schema Tests
│
├── package.json                 # Node & Vite Build Configuration
├── tailwind.config.js           # Kost Shukoh Brand Tokens
└── run_kms.py                   # Local Server Runner Script
```
