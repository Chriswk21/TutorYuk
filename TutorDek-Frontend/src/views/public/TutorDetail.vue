<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="detail-container loading-state">
    <p>⏳ Memuat profil tutor...</p>
  </div>

  <!-- Error State -->
  <div v-else-if="errorMessage" class="detail-container error-state">
    <router-link to="/search" class="btn-back">← Kembali ke Pencarian</router-link>
    <p>⚠️ {{ errorMessage }}</p>
  </div>

  <div class="detail-container" v-else-if="tutor">
    <div class="back-nav">
      <router-link to="/search" class="btn-back">← Kembali ke Pencarian</router-link>
    </div>

    <div class="detail-grid">
      <!-- Kolom Kiri: Profil & Kontak -->
      <aside class="profile-sidebar">
        <div class="profile-card-top">
          <div class="detail-avatar">
            {{ getInitials(tutor.name) }}
          </div>
          <h2>{{ tutor.name }}</h2>
          <span class="category-tag">{{ tutor.category }}</span>
          <div class="rating-large">⭐ {{ tutor.rating }} <span>(12 Review)</span></div>
        </div>

        <div class="contact-box">
          <div class="price-detail">
            <span class="label">Tarif Sesi</span>
            <span class="value">Rp {{ tutor.priceRange }}</span>
          </div>
          <a :href="'https://wa.me/' + tutor.phone_number" target="_blank" class="btn-wa-full">
            Hubungi via WhatsApp
          </a>
          <p class="disclaimer">*Jadwal belajar ditentukan setelah diskusi via WA.</p>
        </div>
      </aside>

      <!-- Kolom Kanan: Detail Info -->
      <main class="info-content">
        <section class="info-section">
          <h3>Tentang Saya</h3>
          <p>{{ tutor.bio }}</p>
        </section>

        <section class="info-section">
          <h3>Pengalaman & Keahlian</h3>
          <div class="exp-box">
            <p>{{ tutor.experience }}</p>
          </div>
          <!-- Kamu bisa tambah list spesifik di sini nanti -->
          <ul class="skill-list">
            <li>Keahlian dalam analisis data sekuens</li>
            <li>Pemahaman mendalam Object-Oriented Programming</li>
            <li>Penerapan SOLID Principles dalam project</li>
          </ul>
        </section>

        <section class="info-section">
          <h3>Ulasan Mahasiswa</h3>
          <div class="review-placeholder">
            <p>"Penjelasannya enak banget, materi yang tadinya susah jadi gampang dimengerti!"</p>
            <span class="reviewer">- Mahasiswa Binusian</span>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../../api'

const route = useRoute()
const tutor = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const id = route.params.id
    const response = await api.get(`/tutor-profile/public/${id}`)
    const profile = response.data

    if (!profile) {
      errorMessage.value = 'Tutor tidak ditemukan.'
      return
    }

    // Mapping dari shape API ke shape yang dipakai template
    tutor.value = {
      id: profile.id,
      name: profile.user?.name || 'Nama tidak tersedia',
      phone_number: profile.phone_number || '',
      // Sementara: education dipakai sebagai category sampai tabel categories terintegrasi
      category: profile.education || 'Umum',
      bio: profile.bio || '',
      experience: profile.experience || '',
      teaching_preference: profile.teaching_preference || '',
      // Default values karena belum ada di DB
      rating: 5.0,
      priceRange: 'Diskusikan via WA',
    }
  } catch (error) {
    console.error('Gagal mengambil detail tutor:', error)
    errorMessage.value = 'Gagal memuat profil tutor. Pastikan server backend berjalan.'
  } finally {
    isLoading.value = false
  }
})

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}
</script>

<style scoped>
.detail-container { max-width: 1100px; margin: 0 auto; padding: 40px 20px; }
.back-nav { margin-bottom: 30px; }
.btn-back { text-decoration: none; color: #64748b; font-weight: 600; font-size: 0.9rem; }

.detail-grid { display: grid; grid-template-columns: 350px 1fr; gap: 40px; align-items: start; }

.profile-sidebar { background: white; border-radius: 24px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); position: sticky; top: 100px; }
.profile-card-top { text-align: center; margin-bottom: 30px; border-bottom: 1px solid #f1f5f9; padding-bottom: 25px; }

.detail-avatar { width: 100px; height: 100px; background: #eff6ff; color: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 800; margin: 0 auto 20px auto; }

h2 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 10px; }
.category-tag { background: #dbeafe; color: #1e40af; padding: 5px 15px; border-radius: 50px; font-size: 0.8rem; font-weight: 700; }
.rating-large { margin-top: 15px; font-weight: 700; font-size: 1.1rem; }
.rating-large span { font-weight: 400; color: #94a3b8; font-size: 0.9rem; }

.contact-box { background: #f8fafc; padding: 20px; border-radius: 16px; }
.price-detail { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.price-detail .label { color: #64748b; font-size: 0.9rem; }
.price-detail .value { font-weight: 800; color: #0f172a; font-size: 1.2rem; }

.btn-wa-full { display: block; text-align: center; background: #25d366; color: white; padding: 15px; border-radius: 12px; text-decoration: none; font-weight: 700; transition: transform 0.2s; }
.btn-wa-full:hover { transform: scale(1.02); }
.disclaimer { font-size: 0.7rem; color: #94a3b8; margin-top: 15px; text-align: center; }

.info-content { background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
.info-section { margin-bottom: 40px; }
.info-section h3 { font-size: 1.3rem; font-weight: 800; margin-bottom: 15px; color: #0f172a; border-left: 4px solid #3b82f6; padding-left: 15px; }
.info-section p { color: #475569; line-height: 1.7; }

.exp-box { background: #f1f5f9; padding: 20px; border-radius: 12px; margin-bottom: 15px; }
.skill-list { margin-top: 20px; padding-left: 20px; color: #475569; }
.skill-list li { margin-bottom: 10px; }

@media (max-width: 850px) {
  .detail-grid { grid-template-columns: 1fr; }
  .profile-sidebar { position: static; }
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 1.1rem;
  color: #64748b;
}

.error-state {
  padding-top: 60px;
  text-align: center;
  color: #ef4444;
}

.error-state p {
  margin-top: 20px;
  font-size: 1rem;
}
</style>