<template>
  <div class="search-page-wrapper">
    <div class="search-container">
      <section class="search-header">
        <h1>Temukan <span>Tutor Terbaik</span> Pilihanmu</h1>
        <p>Mulai tingkatkan IPK-mu dengan bimbingan rekan tanding sebaya yang terverifikasi dan berpengalaman di bidangnya.</p>
        
        <div class="filter-section">
          <!-- Search Bar dengan Icon SVG -->
          <div class="search-bar">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Cari nama tutor, keahlian, atau bio..."
            />
          </div>

          <div class="filter-controls">
            <select v-model="minRating" class="filter-select">
              <option value="0">⭐ Semua Rating</option>
              <option value="4.5">⭐ 4.5 ke atas</option>
              <option value="4.8">⭐ 4.8 ke atas</option>
              <option value="5">⭐ 5.0 (Sempurna)</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Tutor Grid -->
      <div class="tutor-grid" v-if="!isLoading && !errorMessage && tutors.length > 0">
        <router-link 
          v-for="tutor in tutors" 
          :key="tutor.id" 
          :to="'/tutor/' + tutor.id" 
          class="tutor-card-link"
        >
          <div class="tutor-card">
            <div class="tutor-image">
              <!-- Tombol Bookmark dengan SVG Heart -->
              <button 
                class="bookmark-btn" 
                @click.prevent="toggleSaveTutor(tutor.id)"
                title="Simpan Tutor"
              >
                <!-- Heart Filled (Merah) -->
                <svg v-if="savedTutorIds.includes(tutor.id)" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <!-- Heart Outline (Abu-abu) -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>

              <div class="avatar-glow"></div>
              <span class="initials">{{ getInitials(tutor.name) }}</span>
              
              <!-- Badge Rating dengan SVG Star -->
              <div class="rating-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="star-icon">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                {{ tutor.rating !== null ? tutor.rating : '-' }}
                <span v-if="tutor.rating !== null" class="rating-count">({{ tutor.total_schedule }})</span>
              </div>
            </div>
            
            <div class="tutor-info">
              <span class="category-badge">{{ tutor.category }}</span>
              <h3>{{ tutor.name }}</h3>
              <p class="bio">{{ tutor.bio }}</p>
              <div class="experience">
                <strong>💡 Keahlian & Pengalaman:</strong>
                <p>{{ tutor.experience }}</p>
              </div>
              
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

      <!-- Pagination Section -->
      <div class="pagination-container" v-if="lastPage > 1 && !isLoading">
        <button 
          class="page-btn" 
          :disabled="currentPage === 1" 
          @click="changePage(currentPage - 1)"
        >
          ←
        </button>
        
        <span class="page-info">
          Halaman <strong>{{ currentPage }}</strong> dari <strong>{{ lastPage }}</strong>
        </span>
        
        <button 
          class="page-btn" 
          :disabled="currentPage === lastPage" 
          @click="changePage(currentPage + 1)"
        >
          →
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="empty-state">
        <svg class="spin-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        </svg>
        <p>Memuat data tutor terbaik...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="empty-state error-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>{{ errorMessage }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!isLoading && tutors.length === 0" class="empty-state no-tutors-card">
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 15px;">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3>Tutor tidak ditemukan</h3>
        <p>Coba ketik kata kunci lain atau setel ulang filter rating Anda.</p>
        <button class="btn-reset" @click="resetFilters">Setel Ulang Filter</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { api } from '../../api'

const searchQuery = ref('')
const minRating = ref('0')
const isLoading = ref(false)
const errorMessage = ref('')

const savedTutorIds = ref([])
const tutors = ref([])

// Pagination States
const currentPage = ref(1)
const lastPage = ref(1)
const totalTutors = ref(0)
const limit = 6 // 6 items per page

const fetchTutors = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await api.get('/tutor-profile/public', {
      params: {
        page: currentPage.value,
        limit: limit,
        searchQuery: searchQuery.value,
        minRating: Number(minRating.value),
      }
    })
    
    const result = response.data
    tutors.value = result.data.map(profile => ({
      id: Number(profile.id),
      name: profile.user?.name || 'Nama tidak tersedia',
      phone_number: profile.phone_number || '',
      category: profile.education || 'Umum',
      bio: profile.bio || '',
      experience: profile.experience || '',
      teaching_preference: profile.teaching_preference || '',
      rating: profile.rating ?? null,
      total_schedule: profile.total_schedule ?? 0,
      priceRange: 'Diskusikan via WA',
    }))

    totalTutors.value = result.total
    lastPage.value = result.lastPage
    currentPage.value = result.page

  } catch (error) {
    console.error('Gagal mengambil data tutor:', error)
    errorMessage.value = 'Gagal memuat data tutor. Pastikan server backend berjalan.'
  } finally {
    isLoading.value = false
  }
}

// Setel ulang filter pencarian
const resetFilters = () => {
  searchQuery.value = ''
  minRating.value = '0'
  currentPage.value = 1
  fetchTutors()
}

// Watchers for reactive query-based filtering
let debounceTimeout = null
watch(searchQuery, () => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchTutors()
  }, 300)
})

watch(minRating, () => {
  currentPage.value = 1
  fetchTutors()
})

const changePage = (page) => {
  if (page >= 1 && page <= lastPage.value) {
    currentPage.value = page
    fetchTutors()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(async () => {
  await fetchTutors()

  if (localStorage.getItem('token')) {
    try {
      const savedResponse = await api.get('/saved-tutors')
      savedTutorIds.value = savedResponse.data.map(item => Number(item.tutor_profile_id))
    } catch (saveError) {
      console.error('Gagal mengambil data bookmark:', saveError)
    }
  }
})

const toggleSaveTutor = async (tutorProfileId) => {
  if (!localStorage.getItem('token')) {
    window.$toast('Silakan login terlebih dahulu untuk menyimpan tutor favorit Anda.', 'info')
    return
  }
  try {
    const isSaved = savedTutorIds.value.includes(tutorProfileId)
    
    if (isSaved) {
      await api.delete(`/saved-tutors/${tutorProfileId}`)
      savedTutorIds.value = savedTutorIds.value.filter(id => id !== tutorProfileId)
    } else {
      await api.post(`/saved-tutors/${tutorProfileId}`)
      savedTutorIds.value.push(tutorProfileId)
    }
  } catch (error) {
    console.error('Gagal memproses bookmark tutor:', error)
    window.$toast('Terjadi kesalahan saat memproses bookmark.')
  }
}

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>

<style scoped>
.search-page-wrapper {
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
  padding: 40px 0;
}

.search-container {
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-header {
  text-align: center;
  margin-bottom: 50px;
  animation: fadeInDown 0.8s ease;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.search-header h1 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.search-header h1 span {
  color: #16a34a;
  background: linear-gradient(120deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0) 100%);
  padding: 0 8px;
  border-radius: 8px;
}

.search-header p {
  color: #64748b;
  font-size: 1.05rem;
  max-width: 600px;
  margin: 0 auto 30px auto;
  line-height: 1.6;
}

.filter-section {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

/* PEMBARUAN: Search Bar dengan Ikon */
.search-bar {
  width: 100%;
  max-width: 600px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-bar input {
  width: 100%;
  padding: 16px 20px 16px 48px; /* Padding kiri ditambah untuk space ikon */
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  outline: none;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.01);
}

.search-bar input:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.15);
}

.filter-controls {
  display: flex;
  width: 100%;
  max-width: 600px;
  justify-content: center;
}

.filter-select {
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  font-family: inherit;
  cursor: pointer;
  font-weight: 700;
  color: #475569;
  outline: none;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0,0,0,0.01);
  transition: all 0.3s ease;
}

.filter-select:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.15);
}

.tutor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.tutor-card-link {
  text-decoration: none;
  color: inherit;
}

.tutor-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.03);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(226, 232, 240, 0.7);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tutor-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 35px rgba(15, 23, 42, 0.08);
  border-color: rgba(34, 197, 94, 0.3);
}

.tutor-image {
  height: 140px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.avatar-glow {
  position: absolute;
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0) 70%);
  border-radius: 50%;
  z-index: 1;
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
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.3s;
  z-index: 10;
}

.bookmark-btn:hover {
  transform: scale(1.15);
}

.bookmark-btn:active {
  transform: scale(0.9);
}

/* PEMBARUAN: Badge Rating */
.rating-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: white;
  padding: 6px 12px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 5px;
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

.initials {
  font-size: 2.8rem;
  font-weight: 900;
  color: #16a34a;
  position: relative;
  z-index: 2;
  text-shadow: 0 2px 10px rgba(22, 163, 74, 0.1);
  transition: transform 0.3s ease;
}

.tutor-card:hover .initials {
  transform: scale(1.1);
}

.tutor-info {
  padding: 25px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.category-badge {
  display: inline-block;
  padding: 6px 14px;
  background: #f0fdf4;
  color: #16a34a;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 15px;
  border: 1px solid rgba(22, 163, 74, 0.15);
  width: fit-content;
}

.tutor-info h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #0f172a;
  font-weight: 800;
}

.bio {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 18px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.experience {
  font-size: 0.85rem;
  color: #475569;
  background: #f8fafc;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 22px;
  border: 1px solid #e2e8f0;
}

.experience strong {
  display: block;
  margin-bottom: 6px;
  color: #0f172a;
}

.experience p {
  line-height: 1.5;
  color: #64748b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f1f5f9;
  padding-top: 18px;
  margin-top: auto;
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
  font-size: 1.05rem;
}

.btn-detail {
  background: #16a34a;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 700;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(22, 163, 74, 0.15);
}

.tutor-card:hover .btn-detail {
  background: #15803d;
  box-shadow: 0 6px 15px rgba(22, 163, 74, 0.3);
}

/* PEMBARUAN: Empty & Loading States */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.empty-state p {
  font-size: 1.1rem;
  font-weight: 500;
}

.no-tutors-card {
  background: white;
  border-radius: 20px;
  border: 1px dashed #cbd5e1;
  padding: 60px 40px;
  max-width: 500px;
  margin: 40px auto 0 auto;
  box-shadow: 0 4px 15px rgba(0,0,0,0.01);
}

.no-tutors-card h3 {
  font-size: 1.3rem;
  font-weight: 800;
  color: #334155;
  margin: 0;
}

.no-tutors-card p {
  color: #64748b;
  margin: 0 0 10px 0;
  font-size: 0.95rem;
}

.btn-reset {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #dcfce7;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-reset:hover {
  background: #16a34a;
  color: white;
}

.error-state {
  color: #ef4444;
  background: #fef2f2;
  border-radius: 16px;
  padding: 40px;
  border: 1px dashed #fca5a5;
  max-width: 600px;
  margin: 0 auto;
}

/* Animasi Putar untuk Loading */
@keyframes spin {
  100% { transform: rotate(360deg); }
}
.spin-icon {
  animation: spin 2s linear infinite;
}

/* PEMBARUAN: CSS Pagination Premium */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 50px auto 20px auto;
  padding: 12px 24px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  border: 1px solid #f1f5f9;
  width: fit-content;
}

.page-btn {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #dcfce7;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.page-btn:hover:not(:disabled) {
  background: #16a34a;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25);
}

.page-btn:disabled {
  background: #f1f5f9;
  color: #94a3b8;
  border-color: #e2e8f0;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: #475569;
}

.page-info strong {
  color: #0f172a;
}

/* Responsivitas Layar HP & Tablet */
@media (min-width: 768px) {
  .filter-section {
    flex-direction: row;
    justify-content: center;
    gap: 15px;
    width: 100%;
    max-width: 800px;
    margin: 30px auto 0 auto;
  }

  .search-bar {
    flex-grow: 1;
    max-width: 550px;
  }

  .filter-controls {
    width: auto;
    flex-shrink: 0;
  }

  .filter-select {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .filter-section {
    width: 100%;
    gap: 12px;
  }
  
  .search-bar, .filter-controls, .filter-select {
    width: 100%;
    max-width: 100%;
  }
}
</style>