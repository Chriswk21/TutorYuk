<template>
  <div class="search-container">
    <section class="search-header">
      <h1>Temukan Tutor Pilihanmu</h1>
      <p>Cari berdasarkan mata kuliah, rating, atau keahlian spesifik.</p>
      
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
            placeholder="Cari nama, 'Java', 'Algorithm', atau 'Biology'..."
          />
        </div>

        <div class="filter-controls">
          <select v-model="selectedCategory" class="filter-select">
            <option value="">Semua Mata Kuliah</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>

          <select v-model="minRating" class="filter-select">
            <option value="0">Semua Rating</option>
            <option value="4.5">Bintang 4.5 ke atas</option>
            <option value="4.8">Bintang 4.8 ke atas</option>
            <option value="5">Bintang 5.0 (Sempurna)</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Tutor Grid -->
    <div class="tutor-grid" v-if="!isLoading && !errorMessage && filteredTutors.length > 0">
      <router-link 
        v-for="tutor in filteredTutors" 
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

            <span class="initials">{{ getInitials(tutor.name) }}</span>
            
            <!-- Badge Rating dengan SVG Star -->
            <div class="rating-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="star-icon">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              {{ tutor.rating !== null ? tutor.rating : '-' }}
            </div>
          </div>
          
          <div class="tutor-info">
            <div class="category-badge">{{ tutor.category }}</div>
            <h3>{{ tutor.name }}</h3>
            <p class="bio">{{ tutor.bio }}</p>
            <div class="experience">
              <strong>Pengalaman:</strong> {{ tutor.experience }}
            </div>
            
            <div class="card-footer">
              <div class="price-info">
                <span class="price-label">Estimasi Biaya</span>
                <span class="price-value">{{ tutor.priceRange }}</span>
              </div>
              
              <a 
                :href="'https://wa.me/' + tutor.phone_number" 
                target="_blank" 
                class="btn-wa"
                @click.stop
              >
                Chat WA
              </a>
            </div>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="empty-state">
      <svg class="spin-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1e40af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
      </svg>
      <p>Memuat data tutor...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage" class="empty-state error-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isLoading && filteredTutors.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 15px;">
        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <p>Tutor tidak ditemukan. Coba ganti filter atau kata kunci pencarianmu.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '../../api'

const searchQuery = ref('')
const selectedCategory = ref('')
const minRating = ref('0')
const isLoading = ref(false)
const errorMessage = ref('')

const savedTutorIds = ref([])

const categories = computed(() => {
  const cats = tutors.value.map(t => t.category).filter(Boolean)
  return [...new Set(cats)].sort()
})

const tutors = ref([])

onMounted(async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await api.get('/tutor-profile/public')
    tutors.value = response.data.map(profile => ({
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

    try {
      const savedResponse = await api.get('/saved-tutors')
      savedTutorIds.value = savedResponse.data.map(item => Number(item.tutor_profile_id))
    } catch (saveError) {
      if (saveError.response?.status !== 401) {
        console.error('Gagal mengambil data bookmark:', saveError)
      }
    }

  } catch (error) {
    console.error('Gagal mengambil data tutor:', error)
    errorMessage.value = 'Gagal memuat data tutor. Pastikan server backend berjalan.'
  } finally {
    isLoading.value = false
  }
})

const toggleSaveTutor = async (tutorProfileId) => {
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
    if (error.response && error.response.status === 401) {
      window.$toast('Silakan login terlebih dahulu untuk menyimpan tutor favorit Anda.')
    } else {
      window.$toast('Terjadi kesalahan saat memproses bookmark.')
    }
  }
}

const filteredTutors = computed(() => {
  return tutors.value.filter(tutor => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = tutor.name.toLowerCase().includes(q) ||
                          tutor.category.toLowerCase().includes(q) ||
                          tutor.experience.toLowerCase().includes(q) ||
                          tutor.bio.toLowerCase().includes(q)
    
    const matchesCategory = selectedCategory.value === '' || tutor.category === selectedCategory.value
    const matchesRating = parseFloat(minRating.value) === 0 || (tutor.rating !== null && tutor.rating >= parseFloat(minRating.value))

    return matchesSearch && matchesCategory && matchesRating
  })
})

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}
</script>

<style scoped>
.search-container {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-header {
  text-align: center;
  margin-bottom: 50px;
}

.search-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0f172a;
}

.search-header p {
  color: #64748b;
  font-size: 1.1rem;
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
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search-bar input:focus {
  border-color: #1e40af;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.filter-controls {
  display: flex;
  gap: 15px;
}

.filter-select {
  padding: 12px 18px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  font-family: inherit;
  cursor: pointer;
  font-weight: 600;
  color: #475569;
  outline: none;
}

.filter-select:focus {
  border-color: #1e40af;
}

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
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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

/* PEMBARUAN: Badge Rating */
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

.initials {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e40af;
}

.tutor-info {
  padding: 25px;
}

.category-badge {
  display: inline-block;
  padding: 6px 14px;
  background: #dbeafe;
  color: #1e40af;
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
  margin-bottom: 15px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.experience {
  font-size: 0.85rem;
  color: #475569;
  background: #eff6ff;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 20px;
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

.btn-wa {
  background: #25d366;
  color: white;
  padding: 10px 18px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 700;
  transition: background 0.3s;
}

.btn-wa:hover {
  background: #1eb954;
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

/* Responsivitas Layar HP */
@media (max-width: 640px) {
  .filter-controls {
    flex-direction: column;
    width: 100%;
  }
  
  .filter-select {
    width: 100%;
  }
}
</style>