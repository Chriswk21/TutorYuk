<template>
  <div class="search-container">
    <section class="search-header">
      <h1>Temukan Tutor Pilihanmu</h1>
      <p>Cari berdasarkan mata kuliah, rating, atau keahlian spesifik.</p>
      
      <div class="filter-section">
        <!-- Search Bar Utama -->
        <div class="search-bar">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Cari nama, 'Java', 'Algorithm', atau 'Biology'..."
          />
        </div>

        <!-- Filter Dropdowns -->
        <div class="filter-controls">
          <select v-model="selectedCategory" class="filter-select">
            <option value="">Semua Mata Kuliah</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>

          <select v-model="minRating" class="filter-select">
            <option value="0">Semua Rating</option>
            <option value="4.5">⭐ 4.5 ke atas</option>
            <option value="4.8">⭐ 4.8 ke atas</option>
            <option value="5">⭐ 5.0 (Sempurna)</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Tutor Grid -->
    <div class="tutor-grid" v-if="!isLoading && !errorMessage && filteredTutors.length > 0">
      <!-- Navigasi ke Detail menggunakan ID -->
      <router-link 
        v-for="tutor in filteredTutors" 
        :key="tutor.id" 
        :to="'/tutor/' + tutor.id" 
        class="tutor-card-link"
      >
        <div class="tutor-card">
          <div class="tutor-image">
            <span class="initials">{{ getInitials(tutor.name) }}</span>
            <div class="rating-badge">⭐ {{ tutor.rating }}</div>
          </div>
          
          <div class="tutor-info">
            <div class="category-badge">{{ tutor.category }}</div>
            <h3>{{ tutor.name }}</h3>
            <p class="bio">{{ tutor.bio }}</p>
            <div class="experience">
              <strong>Pengalaman:</strong> {{ tutor.experience }}
            </div>
            
            <div class="card-footer">
              <!-- Range Harga -->
              <div class="price-info">
                <span class="price-label">Estimasi Biaya</span>
                <span class="price-value">{{ tutor.priceRange }}</span>
              </div>
              
              <!-- Tombol WA (stopPropagation agar tidak trigger router-link) -->
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
      <p>⏳ Memuat data tutor...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage" class="empty-state error-state">
      <p>⚠️ {{ errorMessage }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isLoading && filteredTutors.length === 0" class="empty-state">
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

// Daftar kategori untuk filter dropdown (dinamis dari data tutor)
const categories = computed(() => {
  const cats = tutors.value.map(t => t.category).filter(Boolean)
  return [...new Set(cats)].sort()
})

// State data tutor dari API
const tutors = ref([])

// Fetch data dari backend saat komponen di-mount
onMounted(async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await api.get('/tutor-profile/public')
    // Mapping data dari DB ke shape yang dipakai frontend
    tutors.value = response.data.map(profile => ({
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
    }))
  } catch (error) {
    console.error('Gagal mengambil data tutor:', error)
    errorMessage.value = 'Gagal memuat data tutor. Pastikan server backend berjalan.'
  } finally {
    isLoading.value = false
  }
})

// Logika Filter Gabungan: Search + Category + Rating
const filteredTutors = computed(() => {
  return tutors.value.filter(tutor => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = tutor.name.toLowerCase().includes(q) ||
                          tutor.category.toLowerCase().includes(q) ||
                          tutor.experience.toLowerCase().includes(q) ||
                          tutor.bio.toLowerCase().includes(q)
    
    const matchesCategory = selectedCategory.value === '' || tutor.category === selectedCategory.value
    const matchesRating = tutor.rating >= parseFloat(minRating.value)

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

.filter-section {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.search-bar {
  width: 100%;
  max-width: 600px;
}

.search-bar input {
  width: 100%;
  padding: 15px 25px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.search-bar input:focus {
  border-color: #3b82f6;
}

.filter-controls {
  display: flex;
  gap: 15px;
}

.filter-select {
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  font-family: inherit;
  cursor: pointer;
  font-weight: 600;
  color: #475569;
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

.rating-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.8rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.initials {
  font-size: 2.5rem;
  font-weight: 800;
  color: #3b82f6;
}

.tutor-info {
  padding: 25px;
}

.category-badge {
  display: inline-block;
  padding: 4px 12px;
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
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.experience {
  font-size: 0.85rem;
  color: #475569;
  background: #f8fafc;
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

.empty-state {
  text-align: center;
  padding: 100px 20px;
  color: #94a3b8;
}

.error-state {
  color: #ef4444;
  background: #fef2f2;
  border-radius: 12px;
  padding: 40px;
}
</style>