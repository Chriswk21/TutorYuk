<template>
  <div class="tutor-container">
    <aside class="tutor-sidebar">
      <div class="tutor-profile-img">
        <div class="avatar">{{ getInitials(tutorData.name) }}</div>
        <h3>{{ tutorData.name }}</h3>
        <p>{{ tutorData.category }}</p>
      </div>
      <nav class="tutor-nav">
        <button :class="{ active: activeTab === 'profile' }" @click="activeTab = 'profile'">
          Edit Profil
        </button>
        <button :class="{ active: activeTab === 'stats' }" @click="activeTab = 'stats'">
          Statistik
        </button>
      </nav>
      <div class="sidebar-footer">
        <button class="btn-logout" @click="handleLogout">Keluar Akun</button>
      </div>
    </aside>

    <main class="tutor-main">
      <header class="tutor-header">
        <h2>Dashboard Tutor</h2>
        <div class="status-badge" :class="tutorData.status">
          Status: {{ tutorData.status === 'active' ? 'Aktif & Terverifikasi' : 'Pending' }}
        </div>
      </header>

      <section v-if="activeTab === 'profile'" class="edit-profile-card">
        <h3>Kelola Informasi Publik</h3>
        <form @submit.prevent="saveProfile">
          <div class="form-group">
            <label>Bio Profesional</label>
            <textarea v-model="tutorData.bio" rows="4"></textarea>
            <small>Tuliskan keahlianmu (contoh: Java, SOLID, atau Bioinformatics) agar tutee tertarik.</small>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Estimasi Biaya (Range)</label>
              <input type="text" v-model="tutorData.priceRange" placeholder="Contoh: 100k - 200k">
            </div>
            <div class="form-group">
              <label>No. WhatsApp</label>
              <input type="text" v-model="tutorData.phone_number">
            </div>
          </div>

          <div class="form-group">
            <label>Pengalaman Detail</label>
            <textarea v-model="tutorData.experience" rows="4"></textarea>
          </div>

          <button type="submit" class="btn-save">Simpan Perubahan</button>
        </form>
      </section>

      <section v-else class="stats-grid">
        <div class="stat-box">
          <span class="label">Total Review</span>
          <span class="value">12</span>
        </div>
        <div class="stat-box">
          <span class="label">Rating Rata-rata</span>
          <span class="value">⭐ {{ tutorData.rating }}</span>
        </div>
        <div class="stat-box">
          <span class="label">Klik WhatsApp</span>
          <span class="value">45</span>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api'

const router = useRouter()
const activeTab = ref('profile')

// Data Tutor
const tutorData = ref({
  name: localStorage.getItem('userName') || 'Tutor',
  category: 'Computer Science', // Ini mungkin ditarik dari API user/category nanti
  bio: '',
  experience: '',
  priceRange: '',
  phone_number: '',
  rating: 0,
  status: 'active'
})

onMounted(async () => {
  try {
    const response = await api.get('/tutor-profile')
    if (response.data) {
      const data = response.data
      tutorData.value.bio = data.bio || ''
      tutorData.value.experience = data.experience || ''
      tutorData.value.phone_number = data.phone_number || ''
      // tutorData.value.priceRange = data.priceRange // Kalo ada di DB
    }
  } catch (error) {
    console.error('Gagal mengambil data profil:', error)
  }
})

const saveProfile = async () => {
  try {
    await api.put('/tutor-profile', {
      bio: tutorData.value.bio,
      experience: tutorData.value.experience,
      phone_number: tutorData.value.phone_number,
    })
    alert('Profil berhasil diperbarui dan disimpan di database!')
  } catch (error) {
    console.error('Gagal update profil:', error)
    alert('Gagal menyimpan profil. Pastikan kamu sudah login.')
  }
}

const handleLogout = () => {
  localStorage.removeItem('userLoggedIn')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userName')
  localStorage.removeItem('token')
  router.push('/login')
}

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}
</script>

<style scoped>
.tutor-container { display: grid; grid-template-columns: 280px 1fr; min-height: 100vh; background: #f8fafc; }

.tutor-sidebar { background: white; border-right: 1px solid #e2e8f0; padding: 40px 20px; display: flex; flex-direction: column; }
.tutor-profile-img { text-align: center; margin-bottom: 40px; }
.avatar { width: 80px; height: 80px; background: #3b82f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; margin: 0 auto 15px; }
.tutor-profile-img h3 { font-size: 1.1rem; color: #0f172a; margin-bottom: 5px; }
.tutor-profile-img p { font-size: 0.85rem; color: #64748b; }

.tutor-nav { flex-grow: 1; display: flex; flex-direction: column; gap: 10px; }
.tutor-nav button { padding: 12px; border: none; background: transparent; text-align: left; border-radius: 10px; cursor: pointer; font-weight: 600; color: #64748b; }
.tutor-nav button.active { background: #eff6ff; color: #3b82f6; }

.sidebar-footer { border-top: 1px solid #f1f5f9; padding-top: 20px; }
.btn-logout { width: 100%; padding: 10px; background: #fef2f2; color: #ef4444; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }

.tutor-main { padding: 40px; }
.tutor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.status-badge { padding: 6px 12px; border-radius: 50px; font-size: 0.8rem; font-weight: 700; }
.status-badge.active { background: #dcfce7; color: #166534; }

.edit-profile-card { background: white; padding: 30px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
.form-group { margin-bottom: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 8px; color: #1e293b; }
input, textarea { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-family: inherit; }
small { color: #94a3b8; font-size: 0.75rem; margin-top: 5px; display: block; }

.btn-save { background: #3b82f6; color: white; padding: 12px 25px; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; }

.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.stat-box { background: white; padding: 25px; border-radius: 20px; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
.stat-box .label { display: block; color: #64748b; font-size: 0.9rem; margin-bottom: 10px; }
.stat-box .value { font-size: 1.5rem; font-weight: 800; color: #0f172a; }
</style>