# Roomify - Sistem Booking Ruang Meeting

Aplikasi frontend React.js dengan Tailwind CSS untuk sistem booking ruang meeting perusahaan **Roomify**.

## 🚀 Fitur

- **Booking Multi-Step**: Form booking dengan 4 langkah yang mudah diikuti
- **Manajemen Ruang**: Tampilkan daftar ruang meeting dengan status real-time
- **Jadwal Booking**: Lihat dan filter jadwal booking
- **Responsive Design**: Tampilan yang optimal di desktop dan mobile
- **UI/UX Clean**: Desain sederhana dan mudah digunakan

## 🎨 Desain

- **Warna Dominan**: Maroon (#800000) dan Navy (#001f3f)
- **Framework**: React.js + Tailwind CSS
- **Routing**: React Router DOM
- **Bahasa**: Semua teks dalam Bahasa Indonesia

## 📁 Struktur Folder

```
src/
├── assets/           # Logo dan assets
├── components/       # Komponen reusable
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── RoomCard.jsx
│   ├── Stepper.jsx
│   ├── FormInput.jsx
│   └── Modal.jsx
├── layouts/
│   └── MainLayout.jsx
├── pages/
│   ├── Home.jsx
│   ├── Booking/
│   │   ├── BookingForm.jsx
│   │   ├── Step1InfoDasar.jsx
│   │   ├── Step2Tamu.jsx
│   │   ├── Step3Kebutuhan.jsx
│   │   └── Step4Konfirmasi.jsx
│   ├── Schedule.jsx
│   └── BookingSummary.jsx
├── data/            # Dummy data
│   ├── rooms.js
│   └── bookings.js
├── utils/
│   ├── formatDate.js
│   └── constants.js
└── router.jsx
```

## 🛠️ Instalasi & Menjalankan

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

3. **Build untuk Production**
   ```bash
   npm run build
   ```

## 📱 Halaman & Fungsionalitas

### 1. **Beranda (/)** - Home.jsx
- Hero section dengan CTA "Pesan Ruang Meeting"
- Daftar ruang meeting dengan status
- Fitur-fitur aplikasi

### 2. **Form Booking (/booking)** - BookingForm.jsx
**Step 1: Informasi Dasar**
- Nama pemesan, perusahaan, pilih ruang
- Tanggal, jam mulai/selesai, jumlah peserta

**Step 2: Jenis Tamu & Prioritas**
- Jenis tamu (Internal/Eksternal)
- Priority role (Reguler/VIP/Staff)
- Kontak tamu (jika eksternal)

**Step 3: Kebutuhan & Tata Ruang**
- Checklist kebutuhan tambahan
- Pilihan tata ruang (Theater, Classroom, U-Shape, Boardroom)
- Catatan tambahan

**Step 4: Konfirmasi**
- Upload SPK (wajib)
- Ringkasan semua input
- Persetujuan syarat & ketentuan

### 3. **Jadwal (/schedule)** - Schedule.jsx
- Tabel jadwal booking
- Filter berdasarkan ruang dan tanggal
- Status booking (Terisi, Dibatalkan)

### 4. **Ringkasan (/summary)** - BookingSummary.jsx
- Konfirmasi booking berhasil
- Detail lengkap booking
- Tombol "Buat Booking Baru"

## 🗂️ Dummy Data

Aplikasi menggunakan dummy data yang tersimpan di:
- `src/data/rooms.js` - Data ruang meeting
- `src/data/bookings.js` - Data booking

## 🎯 Catatan Penting

- **Backend belum ada** → Semua data menggunakan dummy data
- **Upload SPK** → File disimpan di state, tidak upload ke server
- **Validasi dasar** → Jam mulai < jam selesai, SPK wajib, dll
- **Mobile friendly** → Responsive design dengan Tailwind CSS

## 🚀 Teknologi

- **React.js** - Frontend framework
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Vite** - Build tool
- **ESLint** - Code linting