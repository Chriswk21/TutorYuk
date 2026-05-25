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

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stat-item">
          <h2>100+</h2>
          <p>Tutor Aktif Terverifikasi</p>
        </div>
        <div class="stat-item">
          <h2>1,200+</h2>
          <p>Sesi Kelas Selesai</p>
        </div>
        <div class="stat-item">
          <h2>500+</h2>
          <p>Mahasiswa Terbantu</p>
        </div>
        <div class="stat-item">
          <h2>4.9★</h2>
          <p>Rating Kepuasan Kelas</p>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works">
      <div class="section-header">
        <span class="sub-title">ALUR BELAJAR</span>
        <h2>Bagaimana TutorYuk Membantumu?</h2>
        <p>Proses pencarian dan pemesanan kelas dirancang sesederhana mungkin agar kamu bisa langsung mulai belajar.</p>
      </div>
      
      <div class="steps-grid">
        <div class="step-card">
          <div class="step-num">01</div>
          <h3>Cari & Pilih Tutor</h3>
          <p>Filter tutor berdasarkan mata kuliah yang kamu butuhkan, nilai rating, dan ulasan mahasiswa lain.</p>
        </div>
        <div class="step-card">
          <div class="step-num">02</div>
          <h3>Ajukan Request Sesi</h3>
          <p>Tentukan jadwal belajar dan preferensi lokasi (online/offline) lalu kirim request ke tutor pilihanmu.</p>
        </div>
        <div class="step-card">
          <div class="step-num">03</div>
          <h3>Mulai Belajar</h3>
          <p>Setelah disetujui, hubungi tutor langsung melalui WhatsApp dan laksanakan sesi belajar impianmu.</p>
        </div>
      </div>
    </section>

    <!-- Popular Subjects Section -->
    <section class="popular-subjects">
      <div class="section-header">
        <span class="sub-title">MATA KULIAH POPULER</span>
        <h2>Pelajari Topik Apa Saja, Kapan Saja</h2>
        <p>Tutor terbaik kami siap membantumu menguasai materi-materi tersulit di kelas.</p>
      </div>

      <div class="subjects-grid">
        <div class="subject-card">
          <div class="subject-icon">💻</div>
          <h3>Algoritma & Pemrograman</h3>
          <p>C, C++, Java, Python, OOP, & Analisis Kompleksitas</p>
        </div>
        <div class="subject-card">
          <div class="subject-icon">📊</div>
          <h3>Struktur Data</h3>
          <p>Stack, Queue, Tree, Graph, Hashing, & LinkedList</p>
        </div>
        <div class="subject-card">
          <div class="subject-icon">📐</div>
          <h3>Matematika Diskrit</h3>
          <p>Logika, Relasi, Graf, Kombinatorika, & Aljabar Boolean</p>
        </div>
        <div class="subject-card">
          <div class="subject-icon">🌐</div>
          <h3>Web Development</h3>
          <p>HTML, CSS, JS, Vue, React, Node.js, & Database Integration</p>
        </div>
        <div class="subject-card">
          <div class="subject-icon">📈</div>
          <h3>Statistika & Probabilitas</h3>
          <p>Distribusi, Regresi, Hipotesis, & Analisis Data Kampus</p>
        </div>
        <div class="subject-card">
          <div class="subject-icon">🔒</div>
          <h3>Jaringan Komputer</h3>
          <p>IP Addressing, OSI Layer, Routing, Switching, & Security</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-banner">
      <div class="cta-content">
        <h2>Siap Untuk Meningkatkan IPK Kampus Kamu?</h2>
        <p>Bergabunglah dengan ratusan mahasiswa lainnya dan taklukkan ujian sulit dengan bimbingan tutor pilihanmu.</p>
        <div class="cta-actions">
          <router-link to="/search" class="btn-cta-primary">Cari Tutor Sekarang</router-link>
          <router-link to="/register" class="btn-cta-secondary">Buat Akun Gratis</router-link>
        </div>
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
  min-height: 85vh; 
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: url('../../assets/belajardek.webp');
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
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(20, 83, 45, 0.75) 100%);
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
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.4);
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
  letter-spacing: -1px;
}

.hero h1 span {
  color: #4ade80;
}

.hero p {
  font-size: 1.15rem;
  color: #f1f5f9;
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
  box-shadow: 0 4px 15px rgba(22, 163, 74, 0.4);
}

.btn-primary:hover {
  background: #15803d;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(22, 163, 74, 0.5);
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
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f1f5f9;
}

.info-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.info-icon {
  margin-bottom: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: #f0fdf4;
  color: #16a34a;
  border-radius: 20px;
  transition: transform 0.3s ease, background 0.3s ease;
}

.info-card:hover .info-icon {
  transform: scale(1.1) rotate(-5deg);
  background: #16a34a;
  color: white;
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

/* Stats Section Styles */
.stats-section {
  background: #0f172a;
  color: white;
  padding: 60px 20px;
  margin-bottom: 80px;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.stat-item h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: #4ade80;
  margin-bottom: 8px;
}

.stat-item p {
  color: #94a3b8;
  font-size: 0.95rem;
  font-weight: 600;
}

/* How It Works Section Styles */
.how-it-works {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto 80px auto;
}

.section-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 50px auto;
}

.sub-title {
  color: #16a34a;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 2px;
  display: block;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 15px;
}

.section-header p {
  color: #64748b;
  line-height: 1.6;
}

.steps-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

.step-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  border: 1px solid #f1f5f9;
  position: relative;
  transition: all 0.3s ease;
}

.step-card:hover {
  transform: translateY(-5px);
  border-color: #4ade80;
}

.step-num {
  font-size: 3rem;
  font-weight: 900;
  color: #f0fdf4;
  position: absolute;
  top: 20px;
  right: 30px;
  line-height: 1;
}

.step-card h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 12px;
  position: relative;
  z-index: 2;
}

.step-card p {
  color: #64748b;
  line-height: 1.6;
  position: relative;
  z-index: 2;
}

/* Popular Subjects Styles */
.popular-subjects {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto 80px auto;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.subject-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.subject-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  border-color: #f1f5f9;
}

.subject-icon {
  font-size: 2.2rem;
  margin-bottom: 18px;
}

.subject-card h3 {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 10px;
}

.subject-card p {
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* CTA Section Styles */
.cta-banner {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
  border-radius: 0;
  margin-top: 40px;
}

.cta-content {
  max-width: 700px;
  margin: 0 auto;
}

.cta-banner h2 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.2;
}

.cta-banner p {
  font-size: 1.1rem;
  color: #dcfce7;
  margin-bottom: 40px;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-cta-primary {
  background: white;
  color: #16a34a;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.05rem;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.btn-cta-primary:hover {
  transform: translateY(-3px);
  background: #f8fafc;
}

.btn-cta-secondary {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.05rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s;
}

.btn-cta-secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-3px);
}

/* Media Queries */
@media (min-width: 768px) {
  .steps-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .stats-container {
    grid-template-columns: repeat(4, 1fr);
  }
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

  .btn-primary, .btn-secondary, .btn-cta-primary, .btn-cta-secondary {
    width: 100%;
  }
  
  .cta-actions {
    flex-direction: column;
    width: 100%;
  }
}
</style>