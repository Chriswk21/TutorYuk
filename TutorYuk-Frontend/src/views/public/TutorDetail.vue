<template>
  <!-- Loading -->
  <div v-if="isLoading" class="detail-container empty-state">
    <div class="spinner"></div>
    <p>Memuat profil tutor...</p>
  </div>

  <!-- Error -->
  <div v-else-if="errorMessage" class="detail-container empty-state">
    <p>{{ errorMessage }}</p>
    <router-link to="/search" class="btn-back">← Kembali</router-link>
  </div>

  <!-- Profile -->
  <div class="detail-container" v-else-if="tutor">
    <div class="back-nav">
      <router-link to="/search" class="btn-back">← Kembali ke Pencarian</router-link>
    </div>

    <div class="detail-grid">
      <!-- LEFT SIDEBAR -->
      <aside class="profile-sidebar">
        <div class="profile-card-top">
          <div class="detail-avatar">{{ getInitials(tutor.name) }}</div>
          <h2>{{ tutor.name }}</h2>
          <span class="category-tag">{{ tutor.category }}</span>

          <div class="rating-large">
            <span class="star">★</span>
            <span class="rating-value">{{ tutor.rating !== null ? tutor.rating : '-' }}</span>
            <span class="rating-count">({{ tutor.total_schedule }} sesi)</span>
          </div>
        </div>

        <div class="contact-box">
          <p class="info-text">
            Request sesi belajar sekarang. Setelah di-approve tutor, kamu bisa chat WhatsApp untuk nego detailnya.
          </p>

          <!-- TOMBOL REQUEST (ganti dari WhatsApp) -->
          <button
            class="btn-request-full"
            @click="openRequestModal"
          >
            📋 Request Sesi Belajar
          </button>

          <p v-if="!isLoggedIn" class="login-hint">
            <router-link to="/login">Login</router-link> dulu untuk request tutor
          </p>
        </div>
      </aside>

      <!-- RIGHT CONTENT -->
      <main class="info-content">
        <section class="info-section">
          <h3>Tentang Saya</h3>
          <p class="bio-text">{{ tutor.bio }}</p>
        </section>

        <section class="info-section">
          <h3>Pengalaman & Keahlian</h3>
          <div class="exp-box">
            <p>{{ tutor.experience }}</p>
          </div>
        </section>

        <section class="info-section">
          <h3>Ulasan Mahasiswa ({{ reviews.length }})</h3>

          <div v-if="reviews.length === 0" class="empty-reviews">
            <p>Belum ada review untuk tutor ini.</p>
          </div>

          <div v-else>
            <div v-for="review in reviews" :key="review.id" class="review-card">
              <div class="review-stars">
                <span v-for="n in 5" :key="n" :class="['star-icon', { active: n <= review.rating }]">★</span>
              </div>
              <p v-if="review.comment" class="review-text">"{{ review.comment }}"</p>
              <div class="reviewer-info">
                <div class="reviewer-avatar">{{ getInitials(review.booking?.user?.name || 'A') }}</div>
                <div>
                  <h4>{{ review.booking?.user?.name || 'Anonim' }}</h4>
                  <span>{{ formatDate(review.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- MODAL REQUEST -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Request Sesi Belajar</h3>
          <button class="btn-close" @click="closeModal">✕</button>
        </div>

        <form @submit.prevent="submitRequest" class="modal-body">
          <div class="form-group">
            <label>Mata Pelajaran <span class="required">*</span></label>
            <select v-model="form.category_id" required>
              <option value="" disabled>Pilih mata pelajaran</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Tanggal & Jam Preferensi <span class="required">*</span></label>
            <input
              type="datetime-local"
              v-model="form.schedule_date"
              :min="minDateTime"
              required
            />
            <small>Bisa di-nego ulang sama tutor setelah di-approve</small>
          </div>

          <div class="form-group">
            <label>Catatan / Topik yang Mau Dipelajari</label>
            <textarea
              v-model="form.notes"
              rows="3"
              placeholder="Contoh: Mau belajar bab Limit dan Turunan"
            ></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="closeModal">Batal</button>
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Mengirim...' : 'Kirim Request' }}
            </button>
          </div>

          <p v-if="formError" class="error-msg">{{ formError }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../../api'

const route = useRoute()
const router = useRouter()

const tutor = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const reviews = ref([])
const categories = ref([])

const showModal = ref(false)
const isSubmitting = ref(false)
const formError = ref('')
const form = ref({
  category_id: '',
  schedule_date: '',
  notes: '',
})

const isLoggedIn = computed(() => !!localStorage.getItem('token'))

// Min datetime = sekarang (tidak bisa request tanggal yang udah lewat)
const minDateTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
})

onMounted(async () => {
  isLoading.value = true
  try {
    const id = route.params.id
    const [profileRes, reviewsRes, categoriesRes] = await Promise.all([
      api.get(`/tutor-profile/public/${id}`),
      api.get(`/reviews/tutor/${id}`).catch(() => ({ data: [] })),
      api.get('/categories').catch(() => ({ data: [] })),
    ])

    const profile = profileRes.data
    if (!profile) {
      errorMessage.value = 'Tutor tidak ditemukan.'
      return
    }

    tutor.value = {
      id: profile.id,
      name: profile.user?.name || 'Nama tidak tersedia',
      phone_number: profile.phone_number || '',
      category: profile.education || 'Umum',
      bio: profile.bio || '',
      experience: profile.experience || '',
      rating: profile.rating ?? null,
      total_schedule: profile.total_schedule ?? 0,
    }

    reviews.value = reviewsRes.data || []
    categories.value = categoriesRes.data || []
  } catch (error) {
    console.error('Gagal:', error)
    errorMessage.value = 'Gagal memuat profil tutor.'
  } finally {
    isLoading.value = false
  }
})

const openRequestModal = () => {
  if (!isLoggedIn.value) {
    window.$toast('Silakan login dulu untuk request tutor')
    router.push('/login')
    return
  }
  showModal.value = true
  formError.value = ''
}

const closeModal = () => {
  showModal.value = false
  form.value = { category_id: '', schedule_date: '', notes: '' }
}

const submitRequest = async () => {
  if (!form.value.category_id || !form.value.schedule_date) {
    formError.value = 'Mata pelajaran dan tanggal wajib diisi'
    return
  }

  isSubmitting.value = true
  formError.value = ''

  try {
    await api.post('/bookings', {
      tutor_profile_id: Number(tutor.value.id),
      category_id: Number(form.value.category_id),
      schedule_date: new Date(form.value.schedule_date).toISOString(),
      notes: form.value.notes,
    })

    window.$toast('Request berhasil dikirim! 🎉 Tunggu approval dari tutor di dashboard kamu.')
    closeModal()
    router.push('/tutee/dashboard')
  } catch (error) {
    console.error('Gagal kirim request:', error)
    formError.value = error.response?.data?.message || 'Gagal kirim request. Coba lagi.'
  } finally {
    isSubmitting.value = false
  }
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.detail-container { max-width: 1100px; margin: 0 auto; padding: 20px 15px; }
.back-nav { margin-bottom: 20px; }
.btn-back {
  display: inline-block; text-decoration: none; color: #64748b;
  font-weight: 600; font-size: 0.95rem;
}
.btn-back:hover { color: #1e40af; }

.detail-grid { display: flex; flex-direction: column; gap: 20px; }

.profile-sidebar { width: 100%; }

.profile-card-top {
  background: white; padding: 25px; border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); text-align: center;
  margin-bottom: 15px;
}
.detail-avatar {
  width: 80px; height: 80px; background: #eff6ff; color: #1e40af;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 2rem; font-weight: 700; margin: 0 auto 12px;
}
.profile-card-top h2 { margin: 0 0 5px; color: #0f172a; font-size: 1.4rem; }
.category-tag {
  display: inline-block; background: #dbeafe; color: #1e40af;
  padding: 4px 12px; border-radius: 8px; font-size: 0.8rem;
  font-weight: 700; margin-top: 8px;
}
.rating-large {
  display: flex; align-items: center; gap: 6px; justify-content: center;
  margin-top: 12px; font-weight: 700; color: #0f172a;
}
.star { color: #f59e0b; font-size: 1.2rem; }
.rating-value { font-size: 1.1rem; }
.rating-count { color: #64748b; font-weight: 500; font-size: 0.85rem; }

.contact-box {
  background: white; padding: 20px; border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}
.info-text { color: #64748b; font-size: 0.85rem; margin-bottom: 15px; line-height: 1.5; }

.btn-request-full {
  width: 100%; background: #1e40af; color: white;
  padding: 14px; border-radius: 10px; border: none;
  font-weight: 700; font-size: 1rem; cursor: pointer;
  transition: background 0.2s; min-height: 48px;
}
.btn-request-full:hover { background: #1e3a8a; }
.login-hint { text-align: center; font-size: 0.85rem; color: #64748b; margin-top: 10px; }
.login-hint a { color: #1e40af; font-weight: 700; }

.info-content { display: flex; flex-direction: column; gap: 15px; }
.info-section {
  background: white; padding: 20px; border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}
.info-section h3 { margin: 0 0 12px; color: #0f172a; font-size: 1.1rem; }
.bio-text { color: #475569; line-height: 1.6; font-size: 0.95rem; }
.exp-box { background: #eff6ff; padding: 15px; border-radius: 10px; color: #475569; }

.empty-reviews { text-align: center; color: #94a3b8; padding: 20px; }

.review-card {
  background: #eff6ff; padding: 15px; border-radius: 12px;
  margin-bottom: 12px;
}
.review-stars { display: flex; gap: 2px; margin-bottom: 8px; }
.star-icon { color: #cbd5e1; font-size: 1rem; }
.star-icon.active { color: #f59e0b; }
.review-text { color: #475569; line-height: 1.5; margin: 8px 0; font-style: italic; font-size: 0.9rem; }
.reviewer-info { display: flex; align-items: center; gap: 12px; margin-top: 10px; }
.reviewer-avatar {
  width: 36px; height: 36px; background: #e2e8f0; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: #64748b; font-size: 0.85rem;
}
.reviewer-info h4 { font-size: 0.9rem; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
.reviewer-info span { font-size: 0.75rem; color: #94a3b8; }

/* === MODAL === */
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); display: flex;
  align-items: flex-end; justify-content: center;
  z-index: 1000; padding: 0;
}
.modal-content {
  background: white; width: 100%; max-width: 500px;
  border-radius: 20px 20px 0 0; max-height: 90vh; overflow-y: auto;
  animation: slideUp 0.3s ease;
}
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px; border-bottom: 1px solid #e2e8f0;
  position: sticky; top: 0; background: white; z-index: 1;
}
.modal-header h3 { margin: 0; color: #0f172a; }
.btn-close {
  background: none; border: none; font-size: 1.5rem;
  cursor: pointer; color: #64748b; padding: 0; width: 32px; height: 32px;
}

.modal-body { padding: 20px; }
.form-group { margin-bottom: 18px; }
.form-group label {
  display: block; font-weight: 600; color: #0f172a;
  margin-bottom: 6px; font-size: 0.9rem;
}
.required { color: #ef4444; }
.form-group select,
.form-group input,
.form-group textarea {
  width: 100%; padding: 12px; border: 1px solid #e2e8f0;
  border-radius: 10px; font-family: inherit; font-size: 0.95rem;
  box-sizing: border-box; outline: none;
}
.form-group select:focus,
.form-group input:focus,
.form-group textarea:focus { border-color: #1e40af; }
.form-group small { color: #64748b; font-size: 0.8rem; margin-top: 4px; display: block; }

.modal-footer {
  display: flex; gap: 10px; margin-top: 20px;
}
.btn-cancel, .btn-submit {
  flex: 1; padding: 12px; border-radius: 10px; border: none;
  font-weight: 700; cursor: pointer; font-size: 0.95rem; min-height: 44px;
}
.btn-cancel { background: #f1f5f9; color: #475569; }
.btn-submit { background: #1e40af; color: white; }
.btn-submit:disabled { background: #94a3b8; cursor: not-allowed; }
.error-msg { color: #ef4444; font-size: 0.85rem; margin-top: 10px; text-align: center; }

.empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; min-height: 60vh; text-align: center; padding: 20px;
}
.spinner {
  width: 40px; height: 40px; border: 4px solid #e2e8f0;
  border-top-color: #1e40af; border-radius: 50%;
  animation: spin 1s linear infinite; margin-bottom: 15px;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* DESKTOP */
@media (min-width: 768px) {
  .detail-container { padding: 40px 20px; }
  .detail-grid { display: grid; grid-template-columns: 320px 1fr; gap: 40px; }
  .profile-sidebar { position: sticky; top: 20px; align-self: start; }
  .modal-overlay { align-items: center; padding: 20px; }
  .modal-content { border-radius: 20px; max-width: 500px; }
  .profile-card-top { padding: 30px; }
  .profile-card-top h2 { font-size: 1.5rem; }
  .detail-avatar { width: 100px; height: 100px; font-size: 2.5rem; }
  .info-section { padding: 30px; }
  .info-section h3 { font-size: 1.25rem; }
  .info-content { gap: 30px; }
}
</style>
