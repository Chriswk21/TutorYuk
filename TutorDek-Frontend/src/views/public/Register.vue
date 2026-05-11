<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Buat Akun</h2>
      <p>Pilih peranmu di TutorDek</p>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Nama Lengkap</label>
          <input type="text" v-model="name" placeholder="Nama Lengkap" required />
        </div>

        <div class="form-group">
          <label>Email Mahasiswa</label>
          <input type="email" v-model="email" placeholder="nim@binus.ac.id" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" placeholder="Min. 8 Karakter" required />
        </div>

        <div class="form-group">
          <label>Daftar Sebagai</label>
          <div class="role-grid">
            <label class="role-item" :class="{ active: role === 'tutee' }">
              <input type="radio" v-model="role" value="tutee" />
              <span>Mahasiswa (Tutee)</span>
            </label>
            <label class="role-item" :class="{ active: role === 'tutor' }">
              <input type="radio" v-model="role" value="tutor" />
              <span>Tutor</span>
            </label>
          </div>
        </div>

        <button type="submit" class="btn-reg">Daftar Sekarang</button>
      </form>

      <div class="reg-footer">
        Sudah punya akun? <router-link to="/login">Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api'

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('tutee')
const router = useRouter()

const handleRegister = async () => {
  try {
    await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value === 'tutor' ? 'TUTOR' : 'USER',
    })

    alert('Akun berhasil dibuat. Silahkan login.')

    if (role.value === 'tutor') {
      router.push('/register-tutor')
    } else {
      router.push('/login')
    }
  } catch (error) {
    const message = error?.response?.data?.message || 'Registrasi gagal. Coba lagi.'
    alert(message)
  }
}
</script>

<style scoped>
.register-container { display: flex; justify-content: center; align-items: center; min-height: 85vh; background: #f8fafc; }
.register-card { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); width: 450px; text-align: center; }
.form-group { text-align: left; margin-bottom: 20px; }
label { display: block; font-weight: 600; margin-bottom: 8px; font-size: 0.9rem; }
input[type="text"], input[type="email"], input[type="password"] {
  width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #e2e8f0; outline: none;
}
.role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.role-item {
  border: 1px solid #e2e8f0; padding: 10px; border-radius: 12px; cursor: pointer; text-align: center; font-size: 0.85rem;
}
.role-item.active { border-color: #3b82f6; background: #eff6ff; color: #3b82f6; }
.role-item input { display: none; }
.btn-reg { width: 100%; background: #3b82f6; color: white; padding: 14px; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; }
.reg-footer { margin-top: 20px; font-size: 0.9rem; }
</style>