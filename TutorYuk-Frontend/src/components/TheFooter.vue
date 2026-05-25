<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Kolom 1: Brand -->
      <div class="footer-brand">
        <div class="brand-logo">
          <img src="../assets/logo.png" alt="Logo" class="f-logo">
          <span class="f-name">Tutor<span>Yuk</span></span>
        </div>
        <p>Platform marketplace tutor sebaya untuk membantu mahasiswa meraih prestasi akademik terbaik.</p>
      </div>

      <!-- Kolom 2: Quick Links -->
      <div class="footer-links">
        <h4>Navigasi</h4>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/search">Cari Tutor</router-link></li>
          <li><router-link to="/about">Tentang Kami</router-link></li>
        </ul>
      </div>

      <!-- Kolom 3: Contact -->
      <div class="footer-contact">
        <h4>Hubungi Kami</h4>
        <p>📍 BINUS University, Jakarta</p>
        <p>📧 support@tutoryuk.com</p>
        <p>📱 +62 812-3456-7890</p>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2026 TutorYuk. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #0f172a;
  color: #f8fafc;
  padding: 60px 0 20px 0;
  margin-top: 50px;
}

.footer-container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 50px;
}

.f-logo {
  height: 70px;
  border-radius: 5px;
  margin-right: 10px;
}

.brand-logo {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.f-name {
  font-size: 1.5rem;
  font-weight: 800;
}

.f-name span { color: #22c55e; }

.footer-brand p {
  color: #cbd5e1;
  max-width: 300px;
  line-height: 1.6;
}

.footer-links h4, .footer-contact h4 {
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.footer-links ul { list-style: none; }

.footer-links li { margin-bottom: 10px; }

.footer-links a {
  color: #cbd5e1;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover { color: #22c55e; }

.footer-contact p {
  color: #cbd5e1;
  margin-bottom: 10px;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 50px;
  padding-top: 20px;
  text-align: center;
  color: #cbd5e1;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .footer-container { grid-template-columns: 1fr; gap: 30px; }
}
</style>