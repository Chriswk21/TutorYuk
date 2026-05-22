<template>
  <div class="landing-container">
    <!-- Hero Section dengan Background Image -->
    <section class="hero">
      <div class="hero-overlay"></div>
      
      <div class="hero-content">
        <span class="badge">#1 Peer-to-Peer Tutoring Marketplace</span>
        <h1>Taklukkan Mata Kuliah Sulit Bersama <span>Tutor Terbaik</span></h1>
        <p>TutorYuk menghubungkan mahasiswa yang butuh bantuan dengan tutor berpengalaman. Belajar langsung via WhatsApp, harga fleksibel mahasiswa.</p>
        
        <div class="hero-actions">
          <router-link to="/search" class="btn-primary">Mulai Cari Tutor</router-link>
          <router-link to="/register-tutor" class="btn-secondary">Daftar Jadi Tutor</router-link>
        </div>
      </div>
    </section>

    <!-- Quick Features Section dengan Ikon SVG Profesional -->
    <section class="quick-info">
      <div class="info-card">
        <div class="info-icon">
          <!-- Ikon Target (Tepat Sasaran) -->
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
          </svg>
        </div>
        <h3>Tepat Sasaran</h3>
        <p>Cari tutor berdasarkan mata kuliah spesifik di kampus kamu.</p>
      </div>

      <div class="info-card">
        <div class="info-icon">
          <!-- Ikon Pesawat Kertas (Fast Response) -->
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </div>
        <h3>Fast Response</h3>
        <p>Hubungi tutor langsung via WhatsApp tanpa perantara.</p>
      </div>

      <div class="info-card">
        <div class="info-icon">
          <!-- Ikon Dompet/Harga Fleksibel -->
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
          </svg>
        </div>
        <h3>Harga Fleksibel</h3>
        <p>Tentukan sendiri tarif belajar atau negosiasikan langsung dengan tutor.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* SEMUA CSS DI BAWAH INI SAMA DENGAN SEBELUMNYA, KECUALI BAGIAN '.info-icon' */
.landing-container {
  width: 100%;
}

.hero {
  position: relative;
  min-height: 85vh; 
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: url('../../assets/belajardek.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 80px 20px;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.7);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 850px;
  color: white;
  animation: fadeInUp 1s ease-out forwards;
}

@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}

.badge {
  background: rgba(59, 130, 246, 0.2);
  color: #22c55e;
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 8px 18px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-block;
  margin-bottom: 20px;
}

.hero h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin: 0 0 25px 0;
  line-height: 1.2;
}

.hero h1 span {
  color: #08df5a;
}

.hero p {
  font-size: 1.15rem;
  color: #e2e8f0;
  max-width: 650px;
  margin: 0 auto 40px auto;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: #16a34a;
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.05rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}

.btn-primary:hover {
  background: #15803d;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.05rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.quick-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  width: 90%;
  max-width: 1200px;
  margin: -60px auto 60px auto;
  position: relative;
  z-index: 10;
}

.info-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f1f5f9;
}

.info-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
}

/* STYLING UNTUK IKON SVG BARU */
.info-icon {
  margin-bottom: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: #f0fdf4; /* Latar biru super muda */
  color: #16a34a; /* Warna ikon biru primer */
  border-radius: 20px; /* Bentuk kotak melengkung (squircle) */
  transition: transform 0.3s ease, background 0.3s ease;
}

.info-card:hover .info-icon {
  transform: scale(1.1) rotate(-5deg);
  background: #16a34a;
  color: white; /* Ikon berubah putih saat di-hover */
}

.info-card h3 {
  font-size: 1.25rem;
  margin-bottom: 12px;
  color: #0f172a;
  font-weight: 800;
}

.info-card p {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .quick-info {
    margin-top: -30px;
    gap: 20px;
  }
  
  .hero {
    padding-top: 100px;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn-primary, .btn-secondary {
    width: 100%;
  }
}
</style>