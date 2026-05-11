# 🎓 TutorDek: Platform On-Demand Tutoring

**TutorDek** adalah platform inovatif yang dirancang untuk menghubungkan mahasiswa dengan tutor secara efisien. Sistem ini mengintegrasikan manajemen profil, alur pendaftaran tutor

---

## 🏗️ Software Architecture

Project ini mengadopsi pendekatan **Decoupled Architecture**, memisahkan Frontend dan Backend secara total untuk meningkatkan *scalability* dan kemudahan *maintenance*.

### 1. Backend Architecture (NestJS)
Backend dibangun menggunakan **Layered Architecture** (Arsitektur Berlapis) untuk menerapkan prinsip *Separation of Concerns*:

* **Controller Layer**: Menangani *incoming request* (REST API) dan mengelola *response* melalui DTO (Data Transfer Object).
* **Service Layer (Business Logic)**: Pusat logika aplikasi, mengelola alur pendaftaran tutor, pengecekan status, hingga validasi *booking*.
* **Data Access Layer (TypeORM/Prisma)**: Mengabstraksi kueri database untuk menjaga integritas relasi antar tabel (contoh: relasi `Users` ke `TutorProfiles`).
* **Database Layer**: Menggunakan **PostgreSQL (via Supabase)** yang mendukung data relasional kompleks seperti *Review* dan *History Booking*.



---

## 🔐 Authentication & Security

Keamanan data pengguna diimplementasikan dengan standar industri:

* **JWT (JSON Web Token)**: Implementasi *stateless authentication*. Pengguna yang terautentikasi akan menerima token untuk mengakses *protected routes*.
* **RBAC (Role-Based Access Control)**: Menggunakan **Guards** di NestJS untuk membatasi akses berdasarkan peran (`ADMIN`, `TUTOR`, `USER`).
* **Password Security**: Hashing satu arah menggunakan **Bcrypt** untuk melindungi kredensial pengguna di database.

---

## 📊 Data Persistence

Sistem menggunakan skema database relasional yang robust:

* **TypeORM/Prisma**: Digunakan untuk menjamin *Type Safety* pada tingkat kode, meminimalisir kesalahan kueri saat pengembangan.
* **Entity Relationships**: Mengelola hubungan *One-to-One* (User ke Profile) dan *One-to-Many* (Tutor ke Reviews/Bookings) secara konsisten.

---

## 💻 Frontend Integration

Bagian Frontend dirancang untuk memberikan pengalaman pengguna yang responsif:

* **Tech Stack**: Vue.js / JavaScript.
* **HTTP Client**: Menggunakan **Axios** untuk berkomunikasi secara asinkron dengan REST API Backend.
* **State Management**: Mengelola status autentikasi dan *caching* data tutor untuk optimasi performa.

---

## 🛠️ Cara Menjalankan Project

### Prerequisites
- Node.js installed
- Supabase account & Database URL

### Setup Backend
1. Masuk ke direktori backend: `cd tutordek-backend`
2. Install dependensi: `npm install`
3. Jalankan server: `npm run start:dev`

### Setup Frontend
1. Masuk ke direktori frontend: `cd tutordek-frontend`
2. Install dependensi: `npm install`
3. Jalankan aplikasi: `npm run dev`

---
"# TutorYuk" 
