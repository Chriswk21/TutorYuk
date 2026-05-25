<template>
  <div class="tutor-container">
    <!-- JIKA BELUM PUNYA PROFIL (BELUM APPROVED) -->
    <div v-if="!hasProfile" class="registration-flow-container">
      <header class="tutor-header">
        <div class="header-info">
          <div class="avatar">{{ getInitials(tutorData.name) }}</div>
          <div>
            <h2>Hi, {{ tutorData.name }}!</h2>
            <p>Dashboard Tutor • Pendaftaran</p>
          </div>
        </div>
        <button class="btn-logout" @click="handleLogout">Keluar</button>
      </header>

      <!-- JIKA ADA PENDAFTARAN PENDING -->
      <div v-if="registrationData && registrationData.status === 'PENDING'" class="pending-notice-card">
        <div class="notice-icon">⏳</div>
        <h2>Pendaftaran Sedang Ditinjau</h2>
        <p class="notice-desc">
          Terima kasih telah mendaftar sebagai tutor di TutorYuk! Pengajuan pendaftaran Anda sedang ditinjau oleh Admin. 
          Kami akan memverifikasi CV dan kualifikasi Anda segera.
        </p>

        <div class="registration-details">
          <h3>Ringkasan Pengajuan:</h3>
          <div class="detail-row">
            <span class="label">Nama Lengkap:</span>
            <span class="val">{{ registrationData.name }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Email:</span>
            <span class="val">{{ registrationData.email }}</span>
          </div>
          <div class="detail-row">
            <span class="label">WhatsApp:</span>
            <span class="val">{{ registrationData.phone_number }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Jurusan/Pendidikan:</span>
            <span class="val">{{ registrationData.education }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Status:</span>
            <span class="val status-pill pending">MENUNGGU PERSETUJUAN</span>
          </div>
        </div>
      </div>

      <!-- JIKA TIDAK ADA PENDAFTARAN ATAU DITOLAK -->
      <div v-else class="registration-form-card">
        <div v-if="registrationData && registrationData.status === 'REJECTED'" class="rejected-alert">
          <strong>⚠️ Pengajuan Sebelumnya Ditolak</strong>
          <p>Mohon maaf, berkas CV atau kualifikasi Anda belum memenuhi kriteria admin. Silakan lengkapi berkas dan kirimkan pengajuan baru di bawah ini.</p>
        </div>

        <div class="form-header">
          <h2>Lengkapi Pendaftaran Tutor</h2>
          <p>Sebelum dapat mengakses fitur lengkap dashboard tutor, Anda wajib melengkapi pendaftaran terlebih dahulu.</p>
        </div>

        <form @submit.prevent="submitTutorRegistration">
          <div class="form-grid">
            <div class="form-group">
              <label>Nama Lengkap</label>
              <input type="text" v-model="regForm.name" placeholder="Nama lengkap sesuai KTM" required />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="regForm.email" placeholder="contoh@binus.ac.id" required />
            </div>

            <div class="form-group">
              <label>No. WhatsApp</label>
              <input type="tel" v-model="regForm.phone_number" placeholder="Contoh: 08xxxxxxxxxx" required />
            </div>

            <div class="form-group">
              <label>Pendidikan / Jurusan</label>
              <input type="text" v-model="regForm.education" placeholder="Contoh: S1 Informatika" required />
            </div>
          </div>

          <div class="form-group">
            <label>Link CV / Portofolio (Google Drive/Dropbox)</label>
            <input type="url" v-model="regForm.cv_url" placeholder="https://example.com/cv" required />
          </div>

          <button type="submit" class="btn-submit" :disabled="isSubmittingRegistration">
            {{ isSubmittingRegistration ? 'Mengirim...' : 'Kirim Pendaftaran Tutor' }}
          </button>
        </form>
      </div>
    </div>

    <!-- JIKA SUDAH APPROVED & PUNYA PROFIL -->
    <div v-else>
      <header class="tutor-header">
        <div class="header-info">
          <div class="avatar">{{ getInitials(tutorData.name) }}</div>
          <div>
            <h2>Hi, {{ tutorData.name }}!</h2>
            <p>Dashboard Tutor</p>
          </div>
        </div>
        <button class="btn-logout" @click="handleLogout">Keluar</button>
      </header>

      <div class="stats-grid">
        <div class="stat-box">
          <span class="stat-label">Rating</span>
          <span class="stat-value">⭐ {{ tutorData.rating !== null ? tutorData.rating : '-' }}</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">Total Sesi</span>
          <span class="stat-value">{{ tutorData.total_schedule || 0 }}</span>
        </div>
      </div>

      <div class="tabs-container">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span v-if="getCount(tab.key) > 0" class="tab-badge">{{ getCount(tab.key) }}</span>
        </button>
      </div>

      <div class="tab-content">
        <!-- EDIT PROFIL TAB -->
        <section v-if="activeTab === 'profile'" class="edit-profile-card">
          <h3>Kelola Informasi Publik</h3>
          <form @submit.prevent="saveProfile">
            <div class="form-group">
              <label>Bio Profesional</label>
              <textarea v-model="tutorData.bio" rows="4"></textarea>
            </div>
            <div class="form-group">
              <label>Pengalaman & Keahlian</label>
              <textarea v-model="tutorData.experience" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>No. WhatsApp</label>
              <input type="text" v-model="tutorData.phone_number" placeholder="08xxxxxxxxxx" />
            </div>
            <button type="submit" class="btn-save">Simpan Perubahan</button>
          </form>
        </section>

        <!-- KALENDER TAB -->
        <BookingCalendar
          v-else-if="activeTab === 'calendar'"
          :bookings="calendarBookings"
          perspective="tutor"
        />

        <!-- BOOKING LIST TABS -->
        <div v-else>
          <div v-if="isLoading" class="empty-state">
            <div class="spinner"></div>
            <p>Memuat data...</p>
          </div>

          <div v-else-if="filteredBookings.length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <p>{{ getEmptyMessage() }}</p>
          </div>

          <div v-else class="booking-list">
            <div v-for="b in filteredBookings" :key="b.id" class="booking-card">
              <div class="booking-header">
                <div class="tutee-info">
                  <div class="small-avatar">{{ getInitials(b.user?.name) }}</div>
                  <div>
                    <h3>{{ b.user?.name || 'Tutee' }}</h3>
                    <span class="category">{{ b.category?.name || 'Mata Pelajaran' }}</span>
                  </div>
                </div>
                <span :class="['status-badge', `status-${b.status.toLowerCase()}`]">
                  {{ getStatusLabel(b.status) }}
                </span>
              </div>

              <div class="booking-info">
                <div class="info-row">
                  <span class="label">📅 Tanggal:</span>
                  <span>{{ formatDateTime(b.schedule_date) }}</span>
                </div>
                <div v-if="b.location_or_link" class="info-row">
                  <span class="label">📍 Lokasi:</span>
                  <span class="location-text">{{ b.location_or_link }}</span>
                </div>
                <div v-if="b.notes" class="info-row">
                  <span class="label">📝 Notes:</span>
                  <span>{{ b.notes }}</span>
                </div>
              </div>

              <div class="booking-actions">
                <template v-if="b.status === 'PENDING'">
                  <button class="btn-success" @click="openAcceptModal(b)">✅ Accept</button>
                  <button class="btn-danger" @click="rejectBooking(b.id)">❌ Reject</button>
                </template>

                <template v-if="b.status === 'ACCEPTED'">
                  <a
                    v-if="b.user?.phone_number"
                    :href="getWALink(b.user.phone_number)"
                    target="_blank"
                    class="btn-wa"
                  >
                    💬 Chat WhatsApp
                  </a>
                  <button class="btn-primary" @click="completeBooking(b.id)">
                    🎓 Mark as Complete
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ACCEPT MODAL -->
    <div v-if="showAcceptModal" class="modal-overlay" @click.self="closeAcceptModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Accept Request</h3>
          <button class="btn-close" @click="closeAcceptModal">✕</button>
        </div>
        <div class="modal-body">
          <div class="tutee-summary">
            <strong>{{ acceptingBooking?.user?.name }}</strong>
            <small>{{ acceptingBooking?.category?.name }}</small>
          </div>
          <div class="form-group">
            <label>Lokasi / Link Zoom <span class="required">*</span></label>
            <input v-model="acceptForm.location_or_link" placeholder="Contoh: BINUS Anggrek Lt.5 / Zoom: meet.google.com/xxx" />
          </div>
          <div class="form-group">
            <label>Tanggal & Jam</label>
            <input type="datetime-local" v-model="acceptForm.schedule_date" />
            <small>Preferensi tutee: {{ formatDateTime(acceptingBooking?.schedule_date) }}</small>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="closeAcceptModal">Batal</button>
            <button class="btn-submit" :disabled="!acceptForm.location_or_link || isAccepting" @click="confirmAccept">
              {{ isAccepting ? 'Memproses...' : 'Accept Request' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api'
import BookingCalendar from '@/components/BookingCalendar.vue'

const router = useRouter()
const activeTab = ref('incoming')
const isLoading = ref(false)
const bookings = ref([])

const tutorData = ref({
  name: localStorage.getItem('userName') || 'Tutor',
  bio: '', experience: '', phone_number: '',
  rating: null, total_schedule: 0,
})

// Registration States
const hasProfile = ref(false)
const registrationData = ref(null)
const isSubmittingRegistration = ref(false)
const regForm = ref({
  name: localStorage.getItem('userName') || '',
  email: '',
  phone_number: '',
  education: '',
  cv_url: '',
})

const tabs = [
  { key: 'incoming', label: 'Request Masuk' },
  { key: 'active', label: 'Sesi Aktif' },
  { key: 'completed', label: 'Selesai' },
  { key: 'calendar', label: '📅 Kalender' },
  { key: 'profile', label: 'Edit Profil' },
]

const showAcceptModal = ref(false)
const acceptingBooking = ref(null)
const isAccepting = ref(false)
const acceptForm = ref({ location_or_link: '', schedule_date: '' })

onMounted(async () => {
  if (!localStorage.getItem('token')) {
    window.$toast('Silakan login terlebih dahulu.', 'error')
    router.push('/login')
    return
  }
  await loadProfile()
})

const loadProfile = async () => {
  try {
    const res = await api.get('/tutor-profile')
    if (res.data && res.data.id) {
      hasProfile.value = true
      tutorData.value.bio = res.data.bio || ''
      tutorData.value.experience = res.data.experience || ''
      tutorData.value.phone_number = res.data.phone_number || ''
      tutorData.value.rating = res.data.rating ?? null
      tutorData.value.total_schedule = res.data.total_schedule ?? 0
      
      // Load bookings as well since they are approved
      await loadBookings()
    } else {
      hasProfile.value = false
      await checkRegistrationStatus()
    }
  } catch (error) {
    console.error('Gagal load profile:', error)
    hasProfile.value = false
    await checkRegistrationStatus()
  }
}

const checkRegistrationStatus = async () => {
  try {
    const res = await api.get('/tutor-registration/my-status')
    if (res.data) {
      registrationData.value = res.data
    } else {
      registrationData.value = null
    }
  } catch (error) {
    console.error('Gagal load registration status:', error)
    registrationData.value = null
  }
}

const submitTutorRegistration = async () => {
  isSubmittingRegistration.value = true
  try {
    await api.post('/tutor-registration', regForm.value)
    window.$toast('Pendaftaran tutor berhasil dikirim! Silakan tunggu konfirmasi admin.', 'success')
    await checkRegistrationStatus()
  } catch (error) {
    const message = error?.response?.data?.message || 'Gagal mengirim pendaftaran. Silakan coba lagi.'
    window.$toast(message, 'error')
  } finally {
    isSubmittingRegistration.value = false
  }
}

const loadBookings = async () => {
  isLoading.value = true
  try {
    const res = await api.get('/bookings/tutor-incoming')
    bookings.value = res.data || []
  } catch (error) {
    console.error('Gagal load bookings:', error)
    bookings.value = []
  } finally {
    isLoading.value = false
  }
}

const filteredBookings = computed(() => {
  switch (activeTab.value) {
    case 'incoming': return bookings.value.filter(b => b.status === 'PENDING')
    case 'active': return bookings.value.filter(b => b.status === 'ACCEPTED')
    case 'completed': return bookings.value.filter(b => b.status === 'COMPLETED')
    default: return []
  }
})

const calendarBookings = computed(() => {
  return bookings.value.filter(b =>
    ['PENDING', 'ACCEPTED', 'COMPLETED'].includes(b.status)
  )
})

const getCount = (tabKey) => {
  switch (tabKey) {
    case 'incoming': return bookings.value.filter(b => b.status === 'PENDING').length
    case 'active': return bookings.value.filter(b => b.status === 'ACCEPTED').length
    default: return 0
  }
}

const getEmptyMessage = () => {
  const messages = {
    incoming: 'Belum ada request masuk dari tutee.',
    active: 'Belum ada sesi aktif.',
    completed: 'Belum ada sesi yang selesai.',
  }
  return messages[activeTab.value] || ''
}

const openAcceptModal = (booking) => {
  acceptingBooking.value = booking
  const d = new Date(booking.schedule_date)
  const localISO = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString().slice(0, 16)
  acceptForm.value = { location_or_link: '', schedule_date: localISO }
  showAcceptModal.value = true
}

const closeAcceptModal = () => {
  showAcceptModal.value = false
  acceptingBooking.value = null
}

const confirmAccept = async () => {
  if (!acceptForm.value.location_or_link) {
    window.$toast('Lokasi/link wajib diisi')
    return
  }
  isAccepting.value = true
  try {
    const payload = { location_or_link: acceptForm.value.location_or_link }
    if (acceptForm.value.schedule_date) {
      payload.schedule_date = new Date(acceptForm.value.schedule_date).toISOString()
    }
    await api.patch(`/bookings/${acceptingBooking.value.id}/accept`, payload)
    window.$toast('Request berhasil di-accept! 🎉')
    closeAcceptModal()
    await loadBookings()
  } catch (error) {
    window.$toast(error.response?.data?.message || 'Gagal accept request')
  } finally { isAccepting.value = false }
}

const rejectBooking = async (id) => {
  if (!(await window.$confirm('Yakin mau tolak request ini?'))) return
  try {
    await api.patch(`/bookings/${id}/reject`)
    window.$toast('Request ditolak')
    await loadBookings()
  } catch (error) { window.$toast(error.response?.data?.message || 'Gagal reject') }
}

const completeBooking = async (id) => {
  if (!(await window.$confirm('Tandai sesi ini sebagai selesai? Tutee bisa kasih rating setelah ini.'))) return
  try {
    await api.patch(`/bookings/${id}/complete`)
    window.$toast('Sesi ditandai sebagai selesai 🎓')
    await loadBookings()
  } catch (error) { window.$toast(error.response?.data?.message || 'Gagal mark complete') }
}

const saveProfile = async () => {
  try {
    await api.put('/tutor-profile', {
      bio: tutorData.value.bio,
      experience: tutorData.value.experience,
      phone_number: tutorData.value.phone_number,
    })
    window.$toast('Profil berhasil disimpan!')
  } catch (error) {
    window.$toast('Gagal simpan profil. Pastikan kamu udah login.')
  }
}

const handleLogout = () => {
  localStorage.clear()
  router.push('/login')
}

const getStatusLabel = (status) => {
  const labels = {
    PENDING: '🟡 Pending', ACCEPTED: '✅ Aktif',
    REJECTED: '❌ Ditolak', COMPLETED: '🎓 Selesai', CANCELLED: '⊘ Dibatalkan',
  }
  return labels[status] || status
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatDateTime = (dt) => {
  if (!dt) return '-'
  const d = new Date(dt)
  return d.toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const getWALink = (phone) => {
  let clean = (phone || '').replace(/\D/g, '')
  if (clean.startsWith('0')) clean = '62' + clean.slice(1)
  return `https://wa.me/${clean}`
}
</script>

<style scoped>
.tutor-container { max-width: 900px; margin: 0 auto; padding: 20px 15px; }
.tutor-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px; gap: 12px; flex-wrap: wrap;
}
.header-info { display: flex; align-items: center; gap: 12px; }
.avatar {
  width: 50px; height: 50px; background: #16a34a; color: white;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; font-weight: 800;
}
.tutor-header h2 { margin: 0; color: #0f172a; font-size: 1.2rem; }
.tutor-header p { color: #64748b; margin: 2px 0 0; font-size: 0.85rem; }
.btn-logout {
  background: #fef2f2; color: #ef4444;
  padding: 8px 16px; border: 1px solid #fee2e2;
  border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.85rem;
}

.stats-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
  margin-bottom: 20px;
}
.stat-box {
  background: white; padding: 18px; border-radius: 14px;
  text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.stat-label { display: block; color: #64748b; font-size: 0.85rem; margin-bottom: 6px; }
.stat-value { font-size: 1.4rem; font-weight: 800; color: #0f172a; }

.tabs-container {
  display: flex; gap: 6px; overflow-x: auto;
  border-bottom: 1px solid #e2e8f0; margin-bottom: 20px;
  -webkit-overflow-scrolling: touch;
}
.tabs-container::-webkit-scrollbar { display: none; }
.tab-btn {
  background: none; border: none; padding: 12px 14px;
  cursor: pointer; font-weight: 600; color: #64748b;
  border-bottom: 3px solid transparent; white-space: nowrap;
  font-size: 0.85rem; min-height: 44px; display: flex; align-items: center; gap: 6px;
}
.tab-btn.active { color: #16a34a; border-bottom-color: #16a34a; }
.tab-badge {
  background: #ef4444; color: white;
  font-size: 0.7rem; padding: 2px 7px; border-radius: 10px;
  font-weight: 700; min-width: 18px; text-align: center;
}

.empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 50px 20px; text-align: center;
}
.empty-icon { font-size: 3rem; margin-bottom: 12px; }
.empty-state p { color: #64748b; }
.spinner {
  width: 40px; height: 40px; border: 4px solid #e2e8f0;
  border-top-color: #16a34a; border-radius: 50%;
  animation: spin 1s linear infinite; margin-bottom: 15px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.booking-list { display: flex; flex-direction: column; gap: 12px; }
.booking-card {
  background: white; padding: 18px; border-radius: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;
}
.booking-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 12px; gap: 10px; flex-wrap: wrap;
}
.tutee-info { display: flex; gap: 12px; align-items: center; }
.small-avatar {
  width: 42px; height: 42px; background: #f0fdf4; color: #16a34a;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.95rem;
}
.tutee-info h3 { margin: 0; font-size: 1rem; color: #0f172a; }
.category {
  display: inline-block; background: #dcfce7; color: #16a34a;
  padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600;
}

.status-badge {
  padding: 4px 10px; border-radius: 8px;
  font-size: 0.75rem; font-weight: 700; white-space: nowrap;
}
.status-pending { background: #f0fdf4; color: #15803d; }
.status-accepted { background: #dcfce7; color: #15803d; }
.status-rejected { background: #fee2e2; color: #991b1b; }
.status-completed { background: #dcfce7; color: #15803d; }
.status-cancelled { background: #f1f5f9; color: #64748b; }

.booking-info {
  background: #f0fdf4; padding: 12px; border-radius: 10px;
  margin-bottom: 12px; display: flex; flex-direction: column; gap: 6px;
}
.info-row { display: flex; gap: 8px; font-size: 0.85rem; color: #475569; flex-wrap: wrap; }
.info-row .label { font-weight: 600; color: #0f172a; min-width: 75px; }
.location-text { word-break: break-all; }

.booking-actions { display: flex; flex-direction: column; gap: 8px; }
.btn-primary, .btn-success, .btn-danger, .btn-wa {
  padding: 12px 20px; border-radius: 10px; border: none;
  font-weight: 700; cursor: pointer; text-decoration: none;
  text-align: center; font-size: 0.9rem; min-height: 44px;
  display: flex; align-items: center; justify-content: center;
}
.btn-primary { background: #16a34a; color: white; }
.btn-success { background: #16a34a; color: white; }
.btn-danger { background: #fef2f2; color: #ef4444; border: 1px solid #fee2e2; }
.btn-wa { background: #25D366; color: white; }

.edit-profile-card {
  background: white; padding: 25px; border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.edit-profile-card h3 { margin: 0 0 20px; color: #0f172a; }
.form-group { margin-bottom: 18px; }
.form-group label {
  display: block; font-weight: 600; color: #0f172a;
  margin-bottom: 6px; font-size: 0.9rem;
}
.form-group input, .form-group textarea {
  width: 100%; padding: 12px; border: 1px solid #e2e8f0;
  border-radius: 10px; font-family: inherit; font-size: 0.95rem;
  box-sizing: border-box; outline: none; resize: vertical;
}
.form-group input:focus, .form-group textarea:focus { border-color: #16a34a; }
.btn-save {
  background: #16a34a; color: white; padding: 12px 24px;
  border: none; border-radius: 10px; font-weight: 700;
  cursor: pointer; font-size: 0.95rem;
}

.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); display: flex;
  align-items: flex-end; justify-content: center; z-index: 1000;
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
}
.modal-header h3 { margin: 0; color: #0f172a; }
.btn-close {
  background: none; border: none; font-size: 1.5rem;
  cursor: pointer; color: #64748b; width: 32px; height: 32px;
}
.modal-body { padding: 20px; }
.tutee-summary {
  background: #f0fdf4; padding: 12px; border-radius: 10px;
  margin-bottom: 18px; display: flex; flex-direction: column; gap: 4px;
}
.tutee-summary strong { color: #0f172a; }
.tutee-summary small { color: #64748b; font-size: 0.85rem; }
.required { color: #ef4444; }
.form-group small { color: #64748b; font-size: 0.8rem; margin-top: 4px; display: block; }
.modal-footer { display: flex; gap: 10px; margin-top: 20px; }
.btn-cancel, .btn-submit {
  flex: 1; padding: 12px; border-radius: 10px; border: none;
  font-weight: 700; cursor: pointer; font-size: 0.95rem; min-height: 44px;
}
.btn-cancel { background: #f1f5f9; color: #475569; }
.btn-submit { background: #16a34a; color: white; }
.btn-submit:disabled { background: #94a3b8; cursor: not-allowed; }

/* CSS BARU: Alur Registrasi Tutor */
.registration-flow-container {
  max-width: 700px;
  margin: 0 auto;
}

.pending-notice-card {
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  text-align: center;
  border: 1px solid #e2e8f0;
  margin-top: 30px;
}

.notice-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.pending-notice-card h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 15px;
}

.notice-desc {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 30px;
}

.registration-details {
  background: #f8fafc;
  border-radius: 16px;
  padding: 25px;
  text-align: left;
  border: 1px solid #e2e8f0;
}

.registration-details h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin-top: 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 10px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px dashed #e2e8f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .label {
  font-weight: 600;
  color: #475569;
}

.detail-row .val {
  color: #0f172a;
  font-weight: 700;
}

.status-pill {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
}

.status-pill.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.registration-form-card {
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
  margin-top: 30px;
}

.rejected-alert {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fca5a5;
  padding: 18px;
  border-radius: 12px;
  margin-bottom: 25px;
  text-align: left;
  font-size: 0.95rem;
}

.rejected-alert strong {
  display: block;
  margin-bottom: 6px;
}

.rejected-alert p {
  margin: 0;
  line-height: 1.5;
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-header h2 {
  font-size: 1.7rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 10px;
}

.form-header p {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.btn-submit {
  width: 100%;
  background: #16a34a;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 1rem;
}

.btn-submit:hover:not(:disabled) {
  background: #15803d;
}

.btn-submit:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .registration-form-card, .pending-notice-card {
    padding: 25px 20px;
  }
}

@media (min-width: 768px) {
  .tutor-container { padding: 40px 20px; }
  .tutor-header h2 { font-size: 1.5rem; }
  .avatar { width: 60px; height: 60px; font-size: 1.3rem; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .stat-value { font-size: 1.7rem; }
  .booking-actions { flex-direction: row; }
  .booking-actions > * { flex: 1; }
  .modal-overlay { align-items: center; padding: 20px; }
  .modal-content { border-radius: 20px; }
  .booking-card { padding: 22px; }
  .small-avatar { width: 50px; height: 50px; font-size: 1.05rem; }
  .edit-profile-card { padding: 35px; }
}
</style>
