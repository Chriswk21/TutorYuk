<template>
  <div class="tutee-container">
    <header class="tutee-header">
      <h1>Halo, {{ user.name }}! 👋</h1>
      <p>Lanjutkan belajarmu dengan tutor-tutor terbaik.</p>
    </header>

    <section class="tutee-content">
      <div class="stats-row">
        <div class="stat-card">
          <span class="val">3</span>
          <span class="desc">Tutor Dihubungi</span>
        </div>
        <div class="stat-card">
          <span class="val">5</span>
          <span class="desc">Tutor Favorit</span>
        </div>
      </div>

      <div class="history-section">
        <h3>Terakhir Kamu Hubungi</h3>
        <div class="history-list">
          <!-- Data diambil dari histori klik WhatsApp di TutorSearch -->
          <div v-for="item in history" :key="item.id" class="history-item">
            <div class="avatar">{{ item.name[0] }}</div>
            <div class="info">
              <h4>{{ item.name }}</h4>
              <span>{{ item.category }} • {{ item.date }}</span>
            </div>
            <router-link :to="'/tutor/' + item.tutorId" class="btn-revisit">Profil</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const user = ref({ name: 'Andi Mahasiswa' }) // Akun dummy Tutee

const history = ref([
  { id: 1, tutorId: 1, name: 'Chris William', category: 'Computer Science', date: '5 Mei 2026' },
  { id: 2, tutorId: 3, name: 'Siti Aminah', category: 'Mathematics', date: '3 Mei 2026' }
])
</script>

<style scoped>
.tutee-container { max-width: 1000px; margin: 0 auto; padding: 40px 20px; }
.tutee-header { margin-bottom: 30px; }
.stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
.stat-card { background: white; padding: 20px; border-radius: 15px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.stat-card .val { display: block; font-size: 2rem; font-weight: 800; color: #6ba846; }

.history-list { background: white; border-radius: 15px; padding: 10px; margin-top: 15px; }
.history-item { display: flex; align-items: center; padding: 15px; border-bottom: 1px solid #f1f5f9; }
.avatar { width: 45px; height: 45px; background: #f1f8ed; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #6ba846; margin-right: 15px; }
.info { flex-grow: 1; }
.info h4 { margin: 0; font-size: 1rem; }
.info span { font-size: 0.8rem; color: #64748b; }
.btn-revisit { text-decoration: none; font-size: 0.85rem; font-weight: 700; color: #6ba846; border: 1px solid #6ba846; padding: 5px 15px; border-radius: 8px; }
</style>