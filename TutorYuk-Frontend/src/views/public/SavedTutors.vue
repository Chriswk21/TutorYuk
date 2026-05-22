<template>
  <div class="saved-container">
    <div class="header-section">
      <h1>
        Tutor Tersimpan
      </h1>
      <p>Daftar tutor favorit yang sudah Anda simpan untuk dihubungi nanti.</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="empty-state">
      <svg class="spin-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
      </svg>
      <p>Memuat daftar tutor favoritmu...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage" class="empty-state error-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Empty State (Jika belum ada yang disave) -->
    <div v-else-if="!isLoading && savedTutors.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 20px;">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <h3>Belum ada tutor yang disimpan</h3>
      <p>Cari dan temukan tutor terbaikmu di halaman pencarian.</p>
      <router-link to="/search" class="btn-primary">Cari Tutor Sekarang</router-link>
    </div>

    <!-- Tutor Grid -->
    <div v-else class="tutor-grid">
      <router-link 
        v-for="tutor in savedTutors" 
        :key="tutor.id" 
        :to="'/tutor/' + tutor.id" 
        class="tutor-card-link"
      >
        <div class="tutor-card">
          <div class="tutor-image">
            <!-- Tombol untuk menghapus dari simpanan (Unsave) -->
            <button 
              class="bookmark-btn active" 
              @click.prevent="removeSavedTutor(tutor.id)"
              title="Hapus dari simpanan"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>

            <span class="initials">{{ getInitials(tutor.name) }}</span>
            
            <div class="rating-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="star-icon">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              {{ tutor.rating !== null ? tutor.rating : '-' }}
              <span v-if="tutor.rating !== null" class="rating-count">({{ tutor.total_schedule }})</span>
            </div>
          </div>
          
          <div class="tutor-info">

            <h3>{{ tutor.name }}</h3>
            <p class="bio">{{ tutor.bio }}</p>
            
            <div class="card-footer">
              <div class="price-info">
                <span class="price-label">Estimasi Biaya</span>
                <span class="price-value">{{ tutor.priceRange }}</span>
              </div>
              
              <span class="btn-detail">
                Lihat Detail
              </span>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../../api'

const savedTutors = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const fetchSavedTutors = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await api.get('/saved-tutors')
    
    savedTutors.value = response.data.map(item => {
      const profile = item.tutorProfile
      return {
        id: Number(profile.id),
        name: profile.user?.name || 'Nama tidak tersedia',
        category: profile.education || 'Umum',
        bio: profile.bio || '',
        experience: profile.experience || '',
        phone_number: profile.phone_number || '',
        rating: profile.rating ?? null,
        total_schedule: profile.total_schedule ?? 0,
        priceRange: 'Diskusikan via WA',
      }
    })
  } catch (error) {
    console.error('Gagal mengambil data:', error)
    if (error.response && error.response.status === 401) {
      errorMessage.value = 'Sesi Anda telah habis. Silakan login kembali.'
    } else {
      errorMessage.value = 'Gagal memuat daftar tutor. Coba lagi nanti.'
    }
  } finally {
    isLoading.value = false
  }
}

const removeSavedTutor = async (tutorProfileId) => {
  try {
    await api.delete(`/saved-tutors/${tutorProfileId}`)
    savedTutors.value = savedTutors.value.filter(tutor => tutor.id !== tutorProfileId)
  } catch (error) {
    console.error('Gagal menghapus tutor:', error)
    window.$toast('Terjadi kesalahan saat menghapus tutor.')
  }
}

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

onMounted(() => {
  fetchSavedTutors()
})
</script>

<style scoped>
.saved-container {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  text-align: left;
  margin-bottom: 40px;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 20px;
}

.header-section h1 {
  font-size: 2rem;
  color: #0f172a;
  margin-bottom: 10px;
}

.header-section p {
  color: #64748b;
  font-size: 1.1rem;
}

/* Card Styling Identik dengan TutorSearch */
.tutor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.tutor-card-link {
  text-decoration: none;
  color: inherit;
}

.tutor-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #f1f5f9;
  height: 100%;
}

.tutor-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.1);
}

.tutor-image {
  height: 120px;
  background: #f0fdf4;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.initials {
  font-size: 2.5rem;
  font-weight: 800;
  color: #16a34a;
}

.bookmark-btn {
  position: absolute;
  top: 12px;
  left: 12px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 10;
}

.bookmark-btn:hover {
  transform: scale(1.15);
}

.bookmark-btn:active {
  transform: scale(0.9);
}

.rating-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: white;
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 4px;
}

.star-icon {
  margin-top: -2px;
}

.rating-count {
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 2px;
}

.tutor-info {
  padding: 25px;
}

.category-badge {
  display: inline-block;
  padding: 6px 14px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 15px;
}

.tutor-info h3 {
  font-size: 1.25rem;
  margin-bottom: 10px;
  color: #0f172a;
  font-weight: 800;
}

.bio {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 20px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f1f5f9;
  padding-top: 15px;
}

.price-info {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 0.7rem;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.price-value {
  font-weight: 800;
  color: #0f172a;
  font-size: 1rem;
}

.btn-detail {
  background: #16a34a;
  color: white;
  padding: 10px 18px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 700;
  transition: background 0.3s;
}

.btn-detail:hover {
  background: #15803d;
}

/* State Styling (Identik dengan TutorSearch) */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: #f0fdf4;
  border-radius: 20px;
  border: 2px dashed #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #334155;
  margin-bottom: 5px;
}

.empty-state p {
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.btn-primary {
  background: #16a34a;
  color: white;
  padding: 12px 25px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  display: inline-block;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #15803d;
}

.error-state {
  border-color: #fca5a5;
  background: #fef2f2;
  color: #ef4444;
}

@keyframes spin { 100% { transform: rotate(360deg); } }
.spin-icon { animation: spin 2s linear infinite; }
</style>