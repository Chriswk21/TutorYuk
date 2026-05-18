<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="detail-container empty-state">
    <svg class="spin-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6ba846" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
    </svg>
    <p>Memuat profil tutor...</p>
  </div>

  <!-- Error State -->
  <div v-else-if="errorMessage" class="detail-container empty-state error-state">
    <div class="back-nav">
      <router-link to="/search" class="btn-back">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Kembali ke Pencarian
      </router-link>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-top: 40px;">
      <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    <p>{{ errorMessage }}</p>
  </div>

  <!-- Konten Profil -->
  <div class="detail-container" v-else-if="tutor">
    <div class="back-nav">
      <router-link to="/search" class="btn-back">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Kembali ke Pencarian
      </router-link>
    </div>

    <div class="detail-grid">
      <!-- Kolom Kiri: Sidebar Profil -->
      <aside class="profile-sidebar">
        <div class="profile-card-top">
          <div class="detail-avatar">
            {{ getInitials(tutor.name) }}
          </div>
          <h2>{{ tutor.name }}</h2>
          <span class="category-tag">{{ tutor.category }}</span>
          
          <div class="rating-large">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="star-icon">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            {{ tutor.rating }} <span>(12 Review)</span>
          </div>
        </div>

        <div class="contact-box">
          <div class="price-detail">
            <span class="label">Tarif Sesi</span>
            <span class="value">{{ tutor.priceRange }}</span>
          </div>
          
          <a :href="'https://wa.me/' + tutor.phone_number" target="_blank" class="btn-wa-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            Hubungi via WhatsApp
          </a>
          <p class="disclaimer">*Jadwal belajar ditentukan setelah diskusi via WA.</p>
        </div>
      </aside>

      <!-- Kolom Kanan: Detail Info -->
      <main class="info-content">
        <section class="info-section">
          <h3>Tentang Saya</h3>
          <p class="bio-text">{{ tutor.bio }}</p>
        </section>

        <section class="info-section">
          <h3>Pengalaman & Keahlian</h3>
          <div class="exp-box">
            <p>{{ tutor.experience }}</p>
          </div>
          
          <!-- Diubah menjadi gaya UI "Chips" agar lebih modern -->
          <div class="skill-tags">
            <span class="skill-chip">Analisis Data Sekuens</span>
            <span class="skill-chip">Object-Oriented Programming (OOP)</span>
            <span class="skill-chip">SOLID Principles</span>
            <span class="skill-chip">System Architecture</span>
          </div>
        </section>

        <section class="info-section">
          <h3>Ulasan Mahasiswa</h3>
          <!-- Diubah menjadi format kartu review -->
          <div class="review-card">
            <svg class="quote-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p class="review-text">"Penjelasannya enak banget, materi yang tadinya susah jadi gampang dimengerti! Sangat direkomendasikan buat yang mau paham konsep dari dasarnya."</p>
            <div class="reviewer-info">
              <div class="reviewer-avatar">MB</div>
              <div class="reviewer-details">
                <h4>Mahasiswa Binusian</h4>
                <span>Semester 2</span>
              </div>
            </div>
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

    tutor.value = {
      id: profile.id,
      name: profile.user?.name || 'Nama tidak tersedia',
      phone_number: profile.phone_number || '',
      category: profile.education || 'Umum',
      bio: profile.bio || '',
      experience: profile.experience || '',
      teaching_preference: profile.teaching_preference || '',
      rating: 5.0,
      priceRange: 'Rp 50.000 - Rp 100.000', // Dibuat lebih realistis
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
.btn-back { 
  display: inline-flex; 
  align-items: center; 
  gap: 8px; 
  text-decoration: none; 
  color: #64748b; 
  font-weight: 600; 
  font-size: 0.95rem; 
  transition: color 0.2s;
}
.btn-back:hover { color: #6ba846; }

.detail-grid { display: grid; grid-template-columns: 350px 1fr; gap: 40px; align-items: start; }

/* SIDEBAR STYLING */
.profile-sidebar { 
  background: white; 
  border-radius: 24px; 
  padding: 30px; 
  box-shadow: 0 4px 20px rgba(0,0,0,0.05); 
  position: sticky; 
  top: 100px; 
  border: 1px solid #f1f5f9;
}

.profile-card-top { text-align: center; margin-bottom: 30px; border-bottom: 1px solid #f1f5f9; padding-bottom: 25px; }

.detail-avatar { 
  width: 120px; 
  height: 120px; 
  background: #f1f8ed; 
  color: #6ba846; 
  border-radius: 50%; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-size: 3rem; 
  font-weight: 800; 
  margin: 0 auto 20px auto; 
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.15);
}

h2 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
.category-tag { background: #dbeafe; color: #1e40af; padding: 6px 16px; border-radius: 50px; font-size: 0.85rem; font-weight: 700; display: inline-block;}

.rating-large { margin-top: 20px; font-weight: 800; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; gap: 6px; color: #0f172a;}
.rating-large span { font-weight: 500; color: #94a3b8; font-size: 0.9rem; }
.star-icon { margin-top: -3px; }

.contact-box { background: #f8fafc; padding: 25px; border-radius: 16px; border: 1px solid #e2e8f0;}
.price-detail { display: flex; flex-direction: column; align-items: center; margin-bottom: 20px; gap: 5px;}
.price-detail .label { color: #64748b; font-size: 0.85rem; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;}
.price-detail .value { font-weight: 800; color: #0f172a; font-size: 1.3rem; }

.btn-wa-full { 
  display: flex; 
  align-items: center; 
  justify-content: center;
  gap: 10px;
  background: #25d366; 
  color: white; 
  padding: 16px; 
  border-radius: 12px; 
  text-decoration: none; 
  font-weight: 700; 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
}
.btn-wa-full:hover { background: #1eb954; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);}
.disclaimer { font-size: 0.75rem; color: #94a3b8; margin-top: 15px; text-align: center; line-height: 1.5;}

/* KONTEN KANAN STYLING */
.info-content { background: white; border-radius: 24px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;}
.info-section { margin-bottom: 40px; }
.info-section:last-child { margin-bottom: 0; }
.info-section h3 { font-size: 1.3rem; font-weight: 800; margin-bottom: 20px; color: #0f172a; border-left: 4px solid #6ba846; padding-left: 15px; }

.bio-text { color: #475569; line-height: 1.8; font-size: 1.05rem; }

.exp-box { background: #f8fafc; padding: 25px; border-radius: 16px; margin-bottom: 25px; color: #475569; line-height: 1.7; border: 1px solid #e2e8f0;}

/* SKILL CHIPS */
.skill-tags { display: flex; flex-wrap: wrap; gap: 10px; }
.skill-chip { 
  background: white; 
  color: #6ba846; 
  padding: 8px 16px; 
  border-radius: 8px; 
  font-size: 0.9rem; 
  font-weight: 600; 
  border: 1px solid #bfdbfe;
  transition: all 0.2s;
}
.skill-chip:hover { background: #f1f8ed; transform: translateY(-2px); }

/* REVIEW CARD */
.review-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 30px;
  position: relative;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
}
.quote-icon { position: absolute; top: 25px; right: 30px; opacity: 0.5; }
.review-text { font-size: 1.05rem; font-style: italic; color: #475569; line-height: 1.7; margin-bottom: 20px; padding-right: 40px; }
.reviewer-info { display: flex; align-items: center; gap: 15px; }
.reviewer-avatar { width: 45px; height: 45px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #64748b; }
.reviewer-details h4 { font-size: 0.95rem; font-weight: 700; color: #0f172a; margin-bottom: 3px;}
.reviewer-details span { font-size: 0.8rem; color: #94a3b8; }

/* STATE STYLING */
.empty-state { display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 400px; color: #64748b; gap: 15px; text-align: center;}
.empty-state p { font-size: 1.1rem; font-weight: 500; }
@keyframes spin { 100% { transform: rotate(360deg); } }
.spin-icon { animation: spin 2s linear infinite; }

.error-state { background: white; border-radius: 24px; border: 1px solid #fca5a5; max-width: 600px; margin: 40px auto; min-height: 300px;}
.error-state p { color: #ef4444; }
.error-state .back-nav { width: 100%; text-align: left; padding: 20px; border-bottom: 1px solid #f1f5f9; margin-bottom: 0;}

@media (max-width: 850px) {
  .detail-grid { grid-template-columns: 1fr; }
  .profile-sidebar { position: static; margin-bottom: 30px;}
}
</style>