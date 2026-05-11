<template>
  <div class="landing-container">
    <!-- Hero Section dengan Background Image -->
    <section class="hero">
      <div class="hero-overlay"></div>
      
      <div class="hero-content">
        <span class="badge">#1 Peer-to-Peer Tutoring Marketplace</span>
        <h1>Taklukkan Mata Kuliah Sulit Bersama <span>Tutor Terbaik</span></h1>
        <p>TutorDek menghubungkan mahasiswa yang butuh bantuan dengan tutor berpengalaman. Belajar langsung via WhatsApp, harga fleksibel mahasiswa.</p>
        
        <div class="hero-actions">
          <router-link to="/search" class="btn-primary">Mulai Cari Tutor</router-link>
          <router-link to="/register-tutor" class="btn-secondary">Daftar Jadi Tutor</router-link>
        </div>
      </div>
    </section>

    <!-- Quick Features Section -->
    <section class="quick-info">
      <div class="info-card">
        <div class="info-icon">🎯</div>
        <h3>Tepat Sasaran</h3>
        <p>Cari tutor berdasarkan mata kuliah spesifik di kampus kamu.</p>
      </div>
      <div class="info-card">
        <div class="info-icon">⚡</div>
        <h3>Fast Response</h3>
        <p>Hubungi tutor langsung via WhatsApp tanpa perantara.</p>
      </div>
      <div class="info-card">
        <div class="info-icon">🤝</div>
        <h3>Harga Fleksibel</h3>
        <p>Tentukan sendiri tarif belajar atau negosiasikan langsung dengan tutor sesuai budget mahasiswa.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing-container {
  width: 100%;
}

.hero {
  position: relative;
  height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* Memanggil background image kamu */
  background-image: url('../../assets/belajardek.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 0 20px;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.65); /* Overlay gelap supaya teks kebaca */
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 850px;
  color: white;
}

.badge {
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 8px 18px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero h1 {
  font-size: clamp(2.5rem, 5vw, 4rem); /* Responsive font size */
  font-weight: 800;
  margin: 25px 0;
  line-height: 1.1;
}

.hero h1 span {
  color: #60a5fa;
}

.hero p {
  font-size: 1.2rem;
  color: #cbd5e1;
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
  background: #3b82f6;
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.05rem;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
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
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Info Section Styling */
.quick-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  width: 90%;
  max-width: 1200px;
  margin: -60px auto 60px auto; /* Menarik section ke atas hero */
  position: relative;
  z-index: 10;
}

.info-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  text-align: center;
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
}

.info-icon {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.info-card h3 {
  font-size: 1.25rem;
  margin-bottom: 12px;
  color: #0f172a;
}

.info-card p {
  color: #64748b;
  font-size: 0.95rem;
}
</style>