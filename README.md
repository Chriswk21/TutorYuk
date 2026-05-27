# 🎓 TutorYuk: Platform On-Demand Peer Tutoring

**TutorYuk** adalah platform on-demand peer tutoring premium yang dirancang untuk menghubungkan mahasiswa dengan tutor sebaya secara instan, transparan, dan efisien. Aplikasi ini memisahkan Frontend dan Backend secara penuh (*decoupled architecture*) guna menghadirkan performa maksimal, skalabilitas tinggi, serta kemudahan pemeliharaan kode (*maintainability*).

---

## 🏗️ Arsitektur Perangkat Lunak (Software Architecture)

TutorYuk mengadopsi pendekatan arsitektur modern berstandar industri dengan pemisahan tanggung jawab (*separation of concerns*) yang sangat ketat.

```mermaid
graph TD
    subgraph Frontend [Vue 3 SPA]
        A[Vue Router] --> B[Views / Components]
        B --> C[Axios API Client]
    end

    subgraph Backend [NestJS Layered REST API]
        C --> D[JWT / Roles Guard]
        D --> E[Controllers Layer]
        E --> F[Services Layer]
        F --> G[TypeORM Repositories]
    end

    subgraph Database [PostgreSQL Cloud]
        G --> H[(Supabase Instance)]
    end

    style Frontend fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
    style Backend fill:#eff6ff,stroke:#3b82f6,stroke-width:2px
    style Database fill:#fef2f2,stroke:#ef4444,stroke-width:2px
```

### 1. Backend Layered Architecture (NestJS)
Arsitektur backend dibagi menjadi 4 lapisan utama untuk menjaga kode tetap modular, testable, dan terstruktur:
* **Controllers Layer**: Pintu masuk request API (REST). Bertanggung jawab melakukan pemetaan endpoint, parsing parameter, serta validasi data masukan menggunakan **DTO (Data Transfer Object)** dan `class-validator`.
* **Guards & Decorators Layer**: Menangani keamanan sistem sebelum request mencapai logika bisnis. Menggunakan **JWT Auth Guard** untuk memeriksa token akses, dan **Roles Guard** untuk melakukan otorisasi berbasis peran (Role-Based Access Control).
* **Services Layer (Business Logic)**: Pusat dari seluruh aturan bisnis aplikasi (seperti kalkulasi *running average rating* tutor, alur validasi status transaksi, serta otomatisasi pembuatan profil saat disetujui admin).
* **Repositories Layer (TypeORM & Data Access)**: Berkomunikasi dengan PostgreSQL di Supabase menggunakan ORM untuk memastikan keamanan tipe (*Type Safety*) dan mencegah kerentanan SQL Injection.

### 2. Frontend Component-Driven SPA (Vue 3)
* **Single Page Application (SPA)**: Memanfaatkan Vue 3 dengan reactivity API (`ref`, `computed`, `watch`) untuk menghasilkan rendering halaman secepat kilat tanpa reload.
* **Axios Interceptors**: Secara otomatis menyisipkan JWT token dari `localStorage` pada setiap request API dan menangani penolakan request secara global jika token kedaluwarsa.
* **Responsive Layouts & Aesthetics**: Didesain dengan estetika modern (*glassmorphism*, gradien halus, bayangan elevasi, dan mikro-animasi pada hover/klik) guna memberikan impresi visual kelas atas bagi pengguna di perangkat desktop maupun mobile.

---

## 💾 Skema Database & Relasi Tabel (Database Schema)

Database PostgreSQL dikelola di cloud via **Supabase**. Struktur relasi antar entitas dirancang secara optimal untuk mendukung integritas data:

```mermaid
erDiagram
    USERS {
        bigint id PK
        string name
        string email
        string password
        string role
        timestamp created_at
    }
    TUTOR_REGISTRATIONS {
        bigint id PK
        bigint user_id FK
        string name
        string email
        string phone_number
        string education
        string cv_url
        string status
        timestamp created_at
    }
    TUTOR_PROFILES {
        bigint id PK
        bigint user_id FK
        string bio
        string experience
        string phone_number
        float rating
        int total_schedule
        timestamp created_at
    }
    BOOKINGS {
        bigint id PK
        bigint user_id FK "Tutee ID"
        bigint tutor_profile_id FK
        timestamp schedule_date
        string location_or_link
        string status
        text notes
        timestamp created_at
    }
    REVIEWS {
        bigint id PK
        bigint booking_id FK
        int rating
        text comment
        timestamp created_at
    }
    SAVED_TUTORS {
        bigint id PK
        bigint user_id FK
        bigint tutor_profile_id FK
        timestamp created_at
    }

    USERS ||--o| TUTOR_PROFILES : "has one"
    USERS ||--o{ TUTOR_REGISTRATIONS : "submits"
    USERS ||--o{ BOOKINGS : "requests"
    USERS ||--o{ SAVED_TUTORS : "bookmarks"
    TUTOR_PROFILES ||--o{ BOOKINGS : "receives"
    TUTOR_PROFILES ||--o{ SAVED_TUTORS : "bookmarked_in"
    BOOKINGS ||--o| REVIEWS : "has review"
```

### Relasi Kunci:
1. **`users` ↔ `tutor_registrations` & `tutor_profiles`**: 
   * Saat pendaftar disetujui oleh Admin, sistem secara otomatis mengaitkan data pendaftaran ke `user_id` yang bersangkutan dan membuat entitas baru di `tutor_profiles`.
2. **`bookings` ↔ `reviews`**:
   * Sesi belajar yang telah diselesaikan (`COMPLETED`) dapat diulas oleh tutee. Relasi ini terikat secara unik (`booking_id`) untuk mencegah double-review pada sesi yang sama.

---

## 🔄 Status State Machine & Alur Bisnis (State Machine Flows)

Sistem melacak siklus hidup booking sesi belajar dan registrasi tutor menggunakan *status transition* yang ketat:

### 1. Siklus Booking Sesi Belajar
```mermaid
stateDiagram-v2
    [*] --> PENDING : Tutee Request Sesi
    PENDING --> ACCEPTED : Tutor Menyetujui & Isi Lokasi/Link Zoom
    PENDING --> REJECTED : Tutor Menolak Request
    PENDING --> CANCELLED : Tutee Membatalkan Sesi
    ACCEPTED --> COMPLETED : Tutor Menyelesaikan Sesi Belajar
    COMPLETED --> [*] : Tutee Memberikan Ulasan/Rating
```

### 2. Siklus Pendaftaran & Aktivasi Tutor
```mermaid
stateDiagram-v2
    [*] --> PENDING : User Submit Data Registrasi
    PENDING --> APPROVED : Admin Menyetujui Aplikasi
    PENDING --> REJECTED : Admin Menolak Aplikasi
    APPROVED --> REJECTED : Admin Memblokir/Menarik Akses Tutor
    REJECTED --> PENDING : Admin Mempertimbangkan Ulang
```

---

## ✨ Fitur-Fitur Unggulan (Core Features)

### 👨‍🎓 Sisi Mahasiswa (Tutee)
* **Pencarian Tutor Pintar**: Menampilkan katalog tutor terverifikasi dengan fitur pencarian instan nama/bio, penyaringan rating bintang (4.5+, 4.8+, 5.0), serta pagination server-side.
* **Sistem Request Sesi Belajar**: Mengajukan jadwal bimbingan secara fleksibel lengkap dengan preferensi tanggal, jam, serta catatan materi yang ingin dibahas.
* **Unified History (Riwayat Komprehensif)**: Tab tunggal yang cerdas untuk memantau semua riwayat sesi. Dilengkapi dengan **badge notifikasi ulasan** dan tombol **Beri Rating** interaktif jika ada sesi yang selesai tetapi belum diulas.
* **Bookmark Tutor**: Menyimpan profil tutor favorit untuk diakses dengan mudah kemudian hari.

### 👨‍🏫 Sisi Pengajar (Tutor Sebaya)
* **Pencegahan Registrasi Ganda**: Halaman `/register-tutor` secara cerdas memantau status aplikasi user. Jika statusnya pending atau approved, pengajar secara otomatis diredireksi ke dashboard dengan peringatan agar tidak terjadi double-submission.
* **Manajemen Request Masuk**: Melihat, menolak, atau menerima request belajar dari tutee disertai form pengisian lokasi pertemuan fisik atau link ruang virtual (Zoom/Google Meet).
* **Kalender Jadwal Interaktif**: Komponen kalender visual yang memetakan seluruh sesi belajar aktif agar agenda mengajar terorganisir dengan rapi.
* **⭐ Tab Ulasan & Rating**: Tab khusus yang menyajikan umpan balik (rating bintang dan review tertulis) secara transparan dari seluruh tutee yang pernah diajar.
* **Profil Dinamis**: Mengelola bio profesional, bidang keahlian, dan nomor WhatsApp publik.

### 👑 Sisi Administrator (Super Admin)
* **Antrean Verifikasi Real-Time**: Menerima pengajuan tutor baru lengkap dengan data pendidikan, dokumen CV, dan kontak WhatsApp.
* **Quick WhatsApp Integration**: Menghubungi pendaftar secara instan menggunakan tombol pintas WhatsApp yang otomatis terformat ke API resmi WhatsApp Web.
* **Kontrol Administratif Penuh**: 
  * Menyetujui pendaftaran (otomatis mengonversi user biasa menjadi peran `TUTOR` dan membuat profil publiknya).
  * Melakukan tindakan pemblokiran/penarikan akses tutor aktif jika melanggar ketentuan.
  * Mengembalikan status penolakan pelamar kembali ke antrean (*reconsider*).

---

## 🛠️ Cara Menjalankan Project (Local Setup Guide)

> [!NOTE]
> Pastikan komputer Anda sudah terinstal **Node.js** (versi 16 atau lebih baru) dan memiliki koneksi database **PostgreSQL/Supabase**.

### 1. Setup Backend (NestJS)
1. Buka folder backend:
   ```bash
   cd tutoryuk-backend
   ```
2. Buat file `.env` di direktori root backend dan lengkapi variabel berikut:
   ```env
   DATABASE_URL="postgresql://username:password@host:port/database"
   JWT_SECRET="tutoryuk_super_secure_secret_key"
   ```
3. Install dependensi:
   ```bash
   npm install
   ```
4. Jalankan server dalam mode development:
   ```bash
   npm run start:dev
   ```

### 2. Setup Frontend (Vue 3)
1. Buka folder frontend di terminal baru:
   ```bash
   cd TutorYuk-Frontend
   ```
2. Install dependensi:
   ```bash
   npm install
   ```
3. Jalankan aplikasi:
   ```bash
   npm run dev
   ```
4. Buka browser di alamat `http://localhost:5173`.

---

## 🔒 Keamanan & Praktik Terbaik (Security & Best Practices)

1. **Stateless JWT Authorization**: Setiap request ke protected resource diverifikasi secara real-time di sisi server menggunakan enkripsi kunci rahasia guna mencegah manipulasi session.
2. **TypeORM Integrity Constraints**: Seluruh penghapusan relasi penting (seperti menghapus akun user) menerapkan cascade delete (`ON DELETE CASCADE`) untuk mencegah terjadinya data yatim piatu (*orphaned records*) di database.
3. **Optimasi Kueri**: Menghindari pemborosan memori database dengan hanya menyeleksi kolom-kolom yang krusial pada tabel relasional saat melakukan kueri yang berat (seperti kueri daftar ulasan).
