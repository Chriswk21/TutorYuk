<template>
  <div class="tutee-container">
    <header class="tutee-header">
      <div>
        <h1>Hi, {{ userName }}! 👋</h1>
        <p>Kelola request dan jadwal belajarmu di sini.</p>
      </div>
      <button class="btn-logout" @click="handleLogout">Keluar</button>
    </header>

    <!-- TABS -->
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

    <!-- TAB CONTENT -->
    <div class="tab-content">
      <!-- LOADING -->
      <div v-if="isLoading" class="empty-state">
        <div class="spinner"></div>
        <p>Memuat data...</p>
      </div>

      <!-- KALENDER TAB -->
      <BookingCalendar
        v-else-if="activeTab === 'calendar'"
        :bookings="calendarBookings"
        perspective="tutee"
      />

      <!-- LIST TABS -->
      <template v-else>
        <!-- EMPTY -->
        <div v-if="filteredBookings.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <p>{{ getEmptyMessage() }}</p>
          <router-link v-if="activeTab === 'pending'" to="/search" class="btn-primary">
            Cari Tutor
          </router-link>
        </div>

        <!-- BOOKING CARDS -->
        <div v-else class="booking-list">
          <div v-for="b in filteredBookings" :key="b.id" class="booking-card">
            <div class="booking-header">
              <div class="tutor-info">
                <div class="avatar">{{ getInitials(b.tutorProfile?.user?.name) }}</div>
                <div>
                  <h3>{{ b.tutorProfile?.user?.name || 'Tutor' }}</h3>
                  <span class="category">{{ b.category?.name || 'Mata Pelajaran' }}</span>
                </div>
              </div>
              <span :class="['status-badge', `status-${b.status.toLowerCase()}`]">
                {{ getStatusLabel(b.status) }}
              </span>
            </div>

            <div class="booking-info">
              <div class="info-row">
                <span class="label"> Tanggal:</span>
                <span>{{ formatDateTime(b.schedule_date) }}</span>
              </div>
              <div v-if="b.location_or_link" class="info-row">
                <span class="label"> Lokasi:</span>
                <span class="location-text">{{ b.location_or_link }}</span>
              </div>
              <div v-if="b.notes" class="info-row">
                <span class="label"> Notes:</span>
                <span>{{ b.notes }}</span>
              </div>
            </div>

            <!-- ACTIONS -->
            <div class="booking-actions">
              <button v-if="b.status === 'PENDING'" class="btn-danger" @click="cancelBooking(b.id)">
                Batalin Request
              </button>

              <a
                v-if="b.status === 'ACCEPTED' && b.tutorProfile?.phone_number"
                :href="getWALink(b.tutorProfile.phone_number)"
                target="_blank"
                class="btn-wa"
              >
                 Chat WhatsApp Tutor
              </a>

              <button
                v-if="b.status === 'COMPLETED' && !ratedBookingIds.has(b.id)"
                class="btn-primary"
                @click="openRatingModal(b)"
              >
                 Beri Rating
              </button>
              <div
                v-if="b.status === 'COMPLETED' && ratedBookingIds.has(b.id)"
                class="rated-badge"
              >
                ✓ Sudah di-rating
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- RATING MODAL -->
    <div v-if="showRatingModal" class="modal-overlay" @click.self="closeRatingModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Beri Rating</h3>
          <button class="btn-close" @click="closeRatingModal">✕</button>
        </div>
        <div class="modal-body">
          <p class="rating-target">
            untuk <strong>{{ ratingBooking?.tutorProfile?.user?.name }}</strong><br>
            <small>{{ ratingBooking?.category?.name }} - {{ formatDateTime(ratingBooking?.schedule_date) }}</small>
          </p>
          <div class="star-picker">
            <button
              v-for="n in 5" :key="n" type="button"
              :class="['star-btn-big', { active: n <= ratingForm.rating }]"
              @click="ratingForm.rating = n"
            >★</button>
          </div>
          <p class="rating-label">
            {{ ratingForm.rating === 0 ? 'Pilih bintang' : getRatingLabel(ratingForm.rating) }}
          </p>
          <div class="form-group">
            <label>Komentar (opsional)</label>
            <textarea v-model="ratingForm.comment" rows="3" placeholder="Ceritakan pengalamanmu..."></textarea>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="closeRatingModal">Batal</button>
            <button
              class="btn-submit"
              :disabled="ratingForm.rating === 0 || isSubmittingRating"
              @click="submitRating"
            >
              {{ isSubmittingRating ? 'Mengirim...' : 'Kirim Rating' }}
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
const userName = ref(localStorage.getItem('userName') || 'Tutee')
const bookings = ref([])
const isLoading = ref(false)
const ratedBookingIds = ref(new Set())

const activeTab = ref('pending')
const tabs = [
  { key: 'pending', label: 'Menunggu' },
  { key: 'active', label: 'Aktif' },
  { key: 'completed', label: 'Selesai' },
  { key: 'calendar', label: ' Kalender' },
  { key: 'history', label: 'Riwayat' },
]

const showRatingModal = ref(false)
const ratingBooking = ref(null)
const isSubmittingRating = ref(false)
const ratingForm = ref({ rating: 0, comment: '' })

onMounted(async () => { await loadBookings() })

const loadBookings = async () => {
  isLoading.value = true
  try {
    const res = await api.get('/bookings/my-requests')
    bookings.value = res.data || []
    const completed = bookings.value.filter(b => b.status === 'COMPLETED')
    const checks = await Promise.all(
      completed.map(b =>
        api.get(`/reviews/booking/${b.id}/check`).catch(() => ({ data: { hasReview: false } }))
      )
    )
    const rated = new Set()
    completed.forEach((b, i) => { if (checks[i].data?.hasReview) rated.add(b.id) })
    ratedBookingIds.value = rated
  } catch (error) {
    console.error('Gagal load bookings:', error)
  } finally {
    isLoading.value = false
  }
}

const filteredBookings = computed(() => {
  switch (activeTab.value) {
    case 'pending': return bookings.value.filter(b => b.status === 'PENDING')
    case 'active': return bookings.value.filter(b => b.status === 'ACCEPTED')
    case 'completed': return bookings.value.filter(b => b.status === 'COMPLETED')
    case 'history': return bookings.value.filter(b => ['REJECTED', 'CANCELLED'].includes(b.status))
    default: return []
  }
})

// Bookings buat kalender: ACCEPTED + COMPLETED + PENDING (yg punya tanggal)
const calendarBookings = computed(() => {
  return bookings.value.filter(b =>
    ['PENDING', 'ACCEPTED', 'COMPLETED'].includes(b.status)
  )
})

const getCount = (tabKey) => {
  switch (tabKey) {
    case 'pending': return bookings.value.filter(b => b.status === 'PENDING').length
    case 'active': return bookings.value.filter(b => b.status === 'ACCEPTED').length
    case 'completed': return bookings.value.filter(b => b.status === 'COMPLETED' && !ratedBookingIds.value.has(b.id)).length
    default: return 0
  }
}

const getEmptyMessage = () => {
  const messages = {
    pending: 'Belum ada request yang menunggu approval.',
    active: 'Belum ada sesi aktif. Tunggu approval dari tutor.',
    completed: 'Belum ada sesi yang selesai.',
    history: 'Belum ada riwayat.',
  }
  return messages[activeTab.value] || ''
}

const cancelBooking = async (id) => {
  if (!(await window.$confirm('Yakin mau batalin request ini?'))) return
  try {
    await api.patch(`/bookings/${id}/cancel`)
    window.$toast('Request berhasil dibatalkan')
    await loadBookings()
  } catch (error) {
    window.$toast(error.response?.data?.message || 'Gagal cancel request')
  }
}

const openRatingModal = (booking) => {
  ratingBooking.value = booking
  ratingForm.value = { rating: 0, comment: '' }
  showRatingModal.value = true
}

const closeRatingModal = () => {
  showRatingModal.value = false
  ratingBooking.value = null
}

const submitRating = async () => {
  isSubmittingRating.value = true
  try {
    await api.post(`/reviews/booking/${ratingBooking.value.id}`, {
      rating: ratingForm.value.rating,
      comment: ratingForm.value.comment,
    })
    window.$toast('Rating berhasil dikirim! Terima kasih 🎉')
    closeRatingModal()
    await loadBookings()
  } catch (error) {
    window.$toast(error.response?.data?.message || 'Gagal kirim rating')
  } finally {
    isSubmittingRating.value = false
  }
}

const getStatusLabel = (status) => {
  const labels = {
    PENDING: '🟡 Menunggu', ACCEPTED: '✅ Diterima',
    REJECTED: '❌ Ditolak', COMPLETED: '🎓 Selesai', CANCELLED: '⊘ Dibatalkan',
  }
  return labels[status] || status
}

const getRatingLabel = (rating) => {
  const labels = {
    1: '⭐ Buruk', 2: '⭐⭐ Kurang', 3: '⭐⭐⭐ Cukup',
    4: '⭐⭐⭐⭐ Bagus', 5: '⭐⭐⭐⭐⭐ Sangat Bagus',
  }
  return labels[rating]
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

const handleLogout = () => {
  localStorage.clear()
  router.push('/')
}
</script>

<style scoped>
.tutee-container { max-width: 900px; margin: 0 auto; padding: 20px 15px; }

.tutee-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 25px; gap: 15px; flex-wrap: wrap;
}
.tutee-header h1 { margin: 0; color: #0f172a; font-size: 1.3rem; }
.tutee-header p { color: #64748b; margin: 5px 0 0; font-size: 0.9rem; }
.btn-logout {
  background: #fef2f2; color: #ef4444;
  padding: 8px 16px; border: 1px solid #fee2e2;
  border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.9rem;
}

.tabs-container {
  display: flex; gap: 8px; overflow-x: auto;
  border-bottom: 1px solid #e2e8f0; margin-bottom: 20px;
  -webkit-overflow-scrolling: touch;
}
.tabs-container::-webkit-scrollbar { display: none; }
.tab-btn {
  background: none; border: none; padding: 12px 16px;
  cursor: pointer; font-weight: 600; color: #64748b;
  border-bottom: 3px solid transparent; white-space: nowrap;
  font-size: 0.9rem; min-height: 44px; display: flex; align-items: center; gap: 6px;
}
.tab-btn.active { color: #1e40af; border-bottom-color: #1e40af; }
.tab-badge {
  background: #ef4444; color: white;
  font-size: 0.7rem; padding: 2px 8px; border-radius: 10px;
  font-weight: 700; min-width: 18px; text-align: center;
}

.empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 50px 20px; text-align: center;
}
.empty-icon { font-size: 3rem; margin-bottom: 12px; }
.empty-state p { color: #64748b; margin-bottom: 15px; }
.spinner {
  width: 40px; height: 40px; border: 4px solid #e2e8f0;
  border-top-color: #1e40af; border-radius: 50%;
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
.tutor-info { display: flex; gap: 12px; align-items: center; }
.avatar {
  width: 45px; height: 45px; background: #eff6ff; color: #1e40af;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 1rem;
}
.tutor-info h3 { margin: 0; font-size: 1rem; color: #0f172a; }
.category {
  display: inline-block; background: #dbeafe; color: #1e40af;
  padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600;
}

.status-badge {
  padding: 4px 10px; border-radius: 8px;
  font-size: 0.75rem; font-weight: 700; white-space: nowrap;
}
.status-pending { background: #eff6ff; color: #1e3a8a; }
.status-accepted { background: #dbeafe; color: #1e3a8a; }
.status-rejected { background: #fee2e2; color: #991b1b; }
.status-completed { background: #dbeafe; color: #1e3a8a; }
.status-cancelled { background: #f1f5f9; color: #64748b; }

.booking-info {
  background: #eff6ff; padding: 12px; border-radius: 10px;
  margin-bottom: 12px; display: flex; flex-direction: column; gap: 6px;
}
.info-row { display: flex; gap: 8px; font-size: 0.85rem; color: #475569; flex-wrap: wrap; }
.info-row .label { font-weight: 600; color: #0f172a; min-width: 75px; }
.location-text { word-break: break-all; }

.booking-actions { display: flex; flex-direction: column; gap: 8px; }
.btn-primary, .btn-wa, .btn-danger, .rated-badge {
  padding: 12px 20px; border-radius: 10px; border: none;
  font-weight: 700; cursor: pointer; text-decoration: none;
  text-align: center; font-size: 0.9rem; min-height: 44px;
  display: flex; align-items: center; justify-content: center;
}
.btn-primary { background: #1e40af; color: white; }
.btn-wa { background: #25D366; color: white; }
.btn-danger { background: #fef2f2; color: #ef4444; border: 1px solid #fee2e2; }
.rated-badge { background: #eff6ff; color: #1e40af; }

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
.rating-target { text-align: center; color: #64748b; margin-bottom: 20px; }
.rating-target strong { color: #0f172a; }
.star-picker { display: flex; justify-content: center; gap: 8px; margin-bottom: 10px; }
.star-btn-big {
  background: none; border: none; font-size: 2.5rem;
  color: #cbd5e1; cursor: pointer; padding: 4px;
  transition: all 0.15s;
}
.star-btn-big:hover, .star-btn-big.active { color: #f59e0b; transform: scale(1.1); }
.rating-label { text-align: center; color: #64748b; margin-bottom: 20px; font-size: 0.9rem; }
.form-group { margin-bottom: 18px; }
.form-group label {
  display: block; font-weight: 600; color: #0f172a;
  margin-bottom: 6px; font-size: 0.9rem;
}
.form-group textarea {
  width: 100%; padding: 12px; border: 1px solid #e2e8f0;
  border-radius: 10px; font-family: inherit; font-size: 0.95rem;
  box-sizing: border-box; outline: none; resize: vertical;
}
.form-group textarea:focus { border-color: #1e40af; }
.modal-footer { display: flex; gap: 10px; margin-top: 20px; }
.btn-cancel, .btn-submit {
  flex: 1; padding: 12px; border-radius: 10px; border: none;
  font-weight: 700; cursor: pointer; font-size: 0.95rem; min-height: 44px;
}
.btn-cancel { background: #f1f5f9; color: #475569; }
.btn-submit { background: #1e40af; color: white; }
.btn-submit:disabled { background: #94a3b8; cursor: not-allowed; }

@media (min-width: 768px) {
  .tutee-container { padding: 40px 20px; }
  .tutee-header h1 { font-size: 1.6rem; }
  .booking-actions { flex-direction: row; }
  .booking-actions > * { flex: 1; }
  .modal-overlay { align-items: center; padding: 20px; }
  .modal-content { border-radius: 20px; }
  .booking-card { padding: 22px; }
  .avatar { width: 55px; height: 55px; font-size: 1.1rem; }
}
</style>
