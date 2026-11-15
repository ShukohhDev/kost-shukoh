# Spec: Fitur Tema Gelap & Tema Terang (Dark & Light Mode) — Kost Shukoh

## 1. Objective (Tujuan)
Menambahkan dukungan sistem tema ganda (**Tema Terang / Light Mode** dan **Tema Gelap / Dark Mode**) pada sistem Kost Shukoh Management System (KMS), mencakup:
1. **Halaman Utama Publik** (`index.html`)
2. **Dashboard Pengelola (Admin)** (`admin/index.html`)
3. **Portal Mandiri Penghuni (Tenant)** (`tenant/index.html`)
4. **Halaman Login & Formulir Publik** (`public/login.html`, `public/booking.html`, dll.)

Fitur ini harus:
- Memberikan tombol pengalih tema (Sun ☀️ / Moon 🌙) yang elegan, responsif, dan mudah dijangkau di navbar/header.
- Menyimpan preferensi pengguna di `localStorage` (`kms_theme = 'dark' | 'light'`) sehingga pilihan tema tetap bertahan saat berpindah halaman atau membuka website kembali.
- Mencegah *Flash of Unstyled/White Content* (FOUC) saat halaman pertama kali dimuat dengan menggunakan anti-flicker bootstrap script di `<head>`.
- Mendeteksi preferensi sistem operasi pengguna (`prefers-color-scheme`) sebagai fallback default saat pertama kali berkunjung.

---

## 2. Tech Stack & Commands
- **Framework & CSS:** Tailwind CSS (`darkMode: 'class'`), CSS Variables, SVG Icons.
- **JavaScript:** ES Module (`src/js/theme.js`), Vanilla JS interaktivitas.
- **Storage:** `localStorage` key `'kms_theme'`.
- **Commands:**
  - Build CSS: `npm run build:css`
  - Build Bundle: `npm run build`
  - Automated Tests: `npm test`
  - Deploy: `deploy_cloudflare.bat` / `npx wrangler pages deploy dist --project-name kost-shukoh --branch main`
  - Git Push: `upload_ke_github.bat` / `git push origin main`

---

## 3. Palet Warna & Desain (Apple HIG & Anti-Slop Guidelines)
Sesuai standar desain Apple HIG dan panduan anti-slop, mode gelap tidak boleh menggunakan warna hitam pekat (*pure pitch black* `#000000`) karena menyebabkan kontras berlebihan dan melelahkan mata. Kami menggunakan gradasi *deep slate/charcoal*:

| Elemen UI | Tema Terang (Light Mode) | Tema Gelap (Dark Mode) |
| :--- | :--- | :--- |
| **Canvas Background** | `#F8FAFC` (`bg-surface-canvas`) | `#020617` (`bg-slate-950`) |
| **Card / Surface Panel** | `#FFFFFF` (`bg-white`) | `#0F172A` (`bg-slate-900`) |
| **Card Subtle / Sub-surface**| `#F1F5F9` (`bg-slate-100`) | `#1E293B` (`bg-slate-800`) |
| **Borders & Dividers** | `rgba(226, 232, 240, 0.8)` (`border-slate-200`) | `rgba(255, 255, 255, 0.08)` (`border-slate-800`) |
| **Text Primary** | `#0F172A` (`text-slate-900`) | `#F8FAFC` (`text-slate-50`) |
| **Text Secondary / Muted**| `#64748B` (`text-slate-500`) | `#94A3B8` (`text-slate-400`) |
| **Brand Primary Accent** | `#2563EB` (`bg-brand-600`) | `#3B82F6` (`bg-brand-500`) / `#60A5FA` |

---

## 4. Rencana Implementasi Bertahap (Incremental Slices)

```
Slice 1: Fondasi Engine & Config
  ├── tailwind.config.js (darkMode: 'class')
  ├── src/css/input.css (Dark Mode base & component styles)
  ├── src/js/theme.js (Module: init, toggle, get, set, listener)
  └── tests/theme.test.mjs (Automated unit test)
       │
Slice 2: Halaman Utama Publik & Login
  ├── index.html (Theme toggle button di navbar + mobile menu)
  └── public/login.html (Theme toggle button di sudut atas)
       │
Slice 3: Dashboard Pengelola (Admin)
  └── admin/index.html (Theme toggle di header admin + penyesuaian kontras tabel & modal)
       │
Slice 4: Portal Layanan Mandiri Penghuni (Tenant) & Subhalaman
  ├── tenant/index.html (Theme toggle di header tenant + kartu sewa & tagihan)
  └── public/booking.html & booking-status.html (Sinkronisasi tema)
       │
Slice 5: Verifikasi Akhir, Pengujian, Build & Deploy
  ├── npm test (Memastikan seluruh 15+ test lolos tanpa regresi)
  ├── Build CSS & Vite dist
  ├── Deploy ke Cloudflare Pages (kost-shukoh.shukohdev.web.id)
  └── Git commit & push ke GitHub
```

---

## 5. Testing Strategy
- Unit test baru `tests/theme.test.mjs`:
  1. Verifikasi inisialisasi default membaca `localStorage` atau `prefers-color-scheme`.
  2. Verifikasi fungsi `toggleTheme()` mengubah state dari `'light'` ke `'dark'` dan sebaliknya.
  3. Verifikasi class `'dark'` dipasang pada `document.documentElement`.
  4. Verifikasi seluruh 15 tes bisnis eksisting tetap hijau (100% pass).

---

## 6. Boundaries (Batasan)
- **Always do:** Pertahankan logika bisnis (sewa kamar, booking, autentikasi admin/tenant) tetap utuh tanpa perubahan yang merusak.
- **Ask first:** Jangan mengubah skema database atau kredensial akun admin/tenant yang telah disepakati.
- **Never do:** Jangan gunakan inline styling hardcoded warna gelap yang tidak dapat diatur via Tailwind class `dark:`.

---

## 7. Open Questions / Assumptions
1. **Asumsi:** Tombol toggle tema diletakkan di navbar (sebelah tombol login / profil) agar selalu terlihat jelas dan konsisten di semua halaman.
2. **Asumsi:** Tombol menggunakan ikon Sun (Matahari) saat mode gelap aktif (untuk beralih ke terang) dan Moon (Bulan) saat mode terang aktif (untuk beralih ke gelap).
