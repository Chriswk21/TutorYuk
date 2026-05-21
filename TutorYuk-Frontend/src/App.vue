<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="brand-container">
          <img src="./assets/logo.png" alt="TutorDek Logo" class="nav-logo">
          <span class="brand-name">Tutor<span>Dek</span></span>
        </router-link>

        <div class="nav-links">
          <router-link to="/" class="nav-item">Home</router-link>
          <router-link to="/search" class="nav-item">Cari Tutor</router-link>

          <template v-if="!isLoggedIn">
            <router-link to="/register" class="nav-item">Daftar</router-link>
            <router-link to="/login" class="btn-login">Login</router-link>
          </template>

          <template v-else>
            <router-link to="/saved-tutors" class="nav-item">
              Tersimpan
            </router-link>

            <router-link v-if="userRole === 'tutee'" to="/tutee/dashboard" class="nav-item dash-link">
              My Learning
            </router-link>
            
            <router-link v-if="userRole === 'tutor'" to="/tutor/dashboard" class="nav-item dash-link">
              Tutor Panel
            </router-link>
            
            <router-link v-if="userRole === 'admin'" to="/admin/dashboard" class="nav-item dash-link">
              Admin Panel
            </router-link>

            <!-- Tombol Logout -->
            <button @click="handleLogout" class="btn-logout-nav">Logout</button>
          </template>
        </div>
      </div>
    </nav>

    <!-- Konten Halaman -->
    <main class="main-content">
      <router-view />
    </main>

    <TheFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TheFooter from './components/TheFooter.vue'

const router = useRouter()
const route = useRoute()

const isLoggedIn = ref(false)
const userRole = ref('')

const checkLoginStatus = () => {
  const status = localStorage.getItem('userLoggedIn')
  const role = localStorage.getItem('userRole')
  
  if (status === 'true') {
    isLoggedIn.value = true
    userRole.value = role
  } else {
    isLoggedIn.value = false
    userRole.value = ''
  }
}

onMounted(() => {
  checkLoginStatus()
})

watch(() => route.path, () => {
  checkLoginStatus()
})

const handleLogout = async () => {
  if (await window.$confirm('Yakin ingin keluar?')) {
    localStorage.clear()
    checkLoginStatus()
    router.push('/login')
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background-color: #dbeafe; color: #1e293b; }

.navbar {
  background: white;
  height: 75px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 15px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-container { display: flex; align-items: center; gap: 12px; text-decoration: none; }
.nav-logo { height: 60px; width: auto; object-fit: contain; }
.brand-name { font-size: 1.5rem; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
.brand-name span { color: #93c5fd; }

.nav-links { display: flex; align-items: center; gap: 25px; }
.nav-item {
  text-decoration: none;
  color: #64748b;
  font-weight: 600;
  font-size: 0.95rem;
  transition: color 0.3s;
}

.nav-item:hover, .router-link-active { color: #1e40af; }

.dash-link {
  color: #1e40af;
  background: #eff6ff;
  padding: 8px 16px;
  border-radius: 8px;
}

.btn-login {
  background: #1e40af;
  color: white;
  padding: 10px 24px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s;
}

.btn-logout-nav {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fee2e2;
  padding: 8px 18px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-family: inherit;
  transition: all 0.2s;
}

.btn-logout-nav:hover { background: #fee2e2; }

.main-content { min-height: calc(100vh - 75px); }
</style>