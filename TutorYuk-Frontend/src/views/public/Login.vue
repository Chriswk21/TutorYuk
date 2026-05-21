<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Selamat Datang</h2>
        <p>Masuk ke akun TutorDek kamu</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email Mahasiswa</label>
          <input 
            type="email" 
            v-model="email" 
            placeholder="nim@binus.ac.id" 
            required 
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input 
            type="password" 
            v-model="password" 
            placeholder="••••••••" 
            required 
          />
        </div>

        <button type="submit" class="btn-login-submit">Masuk Sekarang</button>
      </form>

      <div class="login-footer">
        Belum punya akun? <router-link to="/register">Daftar di sini</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api'

const email = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      pass: password.value,
    })

    const user = response.data.user
    const role = user.role === 'TUTOR' ? 'tutor' : user.role === 'ADMIN' ? 'admin' : 'tutee'

    localStorage.setItem('userLoggedIn', 'true')
    localStorage.setItem('userRole', role)
    localStorage.setItem('userName', user.name)
    localStorage.setItem('userId', user.id)
    localStorage.setItem('token', response.data.access_token)

    window.$toast(`Berhasil masuk sebagai ${role.toUpperCase()}`)

    if (role === 'admin') router.push('/admin/dashboard')
    else if (role === 'tutor') router.push('/tutor/dashboard')
    else router.push('/tutee/dashboard')
  } catch (error) {
    const message = error?.response?.data?.message || 'Login gagal. Cek email dan password.'
    window.$toast(message)
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #dbeafe;
  padding: 20px;
}
.login-card {
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 400px;
}
.login-header { text-align: center; margin-bottom: 30px; }
.login-header h2 { font-weight: 800; color: #0f172a; }
.form-group { margin-bottom: 20px; }
label { display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 8px; }
input {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  outline: none;
  box-sizing: border-box;
  font-size: 1rem;
}
input:focus { border-color: #1e40af; }
.btn-login-submit {
  width: 100%;
  background: #1e40af;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
}
.login-footer { margin-top: 25px; text-align: center; font-size: 0.9rem; }
.login-footer a { color: #1e40af; text-decoration: none; font-weight: 700; }

@media (max-width: 480px) {
  .login-card { padding: 25px; }
}
</style>
