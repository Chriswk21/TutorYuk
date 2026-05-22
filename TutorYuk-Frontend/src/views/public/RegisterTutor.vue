<template>
  <div class="register-container">
    <div class="register-card">
      <div class="form-header">
        <h2>Daftar Jadi Tutor</h2>
        <p>Bagikan ilmumu dan bantu sesama mahasiswa.</p>
      </div>

      <form @submit.prevent="submitRegistration">
        <div class="form-grid">
          <div class="form-group">
            <label>Nama Lengkap</label>
            <input type="text" v-model="form.name" placeholder="Nama sesuai KTM" required />
          </div>

          <div class="form-group">
            <label>Email Mahasiswa</label>
            <input type="email" v-model="form.email" placeholder="contoh@binus.ac.id" required />
          </div>

          <div class="form-group">
            <label>No. WhatsApp</label>
            <input type="tel" v-model="form.phone_number" placeholder="628..." required />
          </div>

          <div class="form-group">
            <label>Pendidikan / Jurusan</label>
            <input type="text" v-model="form.education" placeholder="Contoh: S1 Informatika" required />
          </div>
        </div>

        <div class="form-group">
          <label>Link CV / Portofolio</label>
          <input type="url" v-model="form.cv_url" placeholder="https://example.com/cv" required />
        </div>

        <button type="submit" class="btn-submit">Kirim Pendaftaran</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { api } from '@/api'

const form = ref({
  name: '',
  email: '',
  phone_number: '',
  education: '',
  cv_url: '',
})

const submitRegistration = async () => {
  try {
    await api.post('/tutor-registration', form.value)
    window.$toast('Pendaftaran tutor berhasil dikirim. Tim akan meninjaunya.')
    form.value = {
      name: '',
      email: '',
      phone_number: '',
      education: '',
      cv_url: '',
    }
  } catch (error) {
    const message = error?.response?.data?.message || 'Gagal mengirim pendaftaran. Silakan coba lagi.'
    window.$toast(message)
  }
}
</script>

<style scoped>
.register-container { padding: 60px 20px; display: flex; justify-content: center; background: #f1f5f9; }
.register-card { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); width: 100%; max-width: 700px; }
.form-header { text-align: center; margin-bottom: 30px; }
.form-header h2 { font-weight: 800; color: #0f172a; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.form-group { margin-bottom: 20px; text-align: left; }
label { display: block; font-weight: 600; margin-bottom: 8px; font-size: 0.9rem; color: #1e293b; }
input, select, textarea { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; outline: none; font-family: inherit; }
input:focus, select:focus, textarea:focus { border-color: #16a34a; }
.btn-submit { width: 100%; background: #16a34a; color: white; padding: 15px; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: background 0.3s; margin-top: 10px; }
.btn-submit:hover { background: #15803d; }

@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
</style>