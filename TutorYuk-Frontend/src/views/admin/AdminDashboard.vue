<template>
  <div class="admin-container">
    <!-- SIDEBAR -->
    <aside class="admin-sidebar">
      <div class="admin-brand">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
        TutorYuk <span>Admin</span>
      </div>
      <nav class="admin-nav">
        <button 
          :class="['nav-btn', { active: activeTab === 'pending' }]" 
          @click="activeTab = 'pending'"
        >
          <span class="icon">📥</span>
          Pendaftar Baru
          <span v-if="pendingRegistrations.length > 0" class="badge-count">{{ pendingRegistrations.length }}</span>
        </button>
        <button 
          :class="['nav-btn', { active: activeTab === 'active' }]" 
          @click="activeTab = 'active'"
        >
          <span class="icon">✅</span>
          Tutor Aktif
        </button>
        <button 
          :class="['nav-btn', { active: activeTab === 'rejected' }]" 
          @click="activeTab = 'rejected'"
        >
          <span class="icon">❌</span>
          Pendaftar Ditolak
        </button>
      </nav>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="admin-main">
      <header class="admin-header">
        <div>
          <h2>{{ getHeaderTitle() }}</h2>
          <p class="header-subtitle">Kelola verifikasi pendaftaran pengajar secara praktis dan transparan.</p>
        </div>
        <div class="user-profile">
          <div class="admin-avatar">AD</div>
          <div>
            <h4>Administrator</h4>
            <span>Super Admin</span>
          </div>
        </div>
      </header>

      <!-- STATS GRID -->
      <section class="stats-grid">
        <div class="stat-card pending">
          <div class="stat-icon">📥</div>
          <div class="stat-info">
            <span class="stat-label">Pendaftar Baru</span>
            <span class="stat-value">{{ pendingRegistrations.length }}</span>
          </div>
          <div class="stat-glow"></div>
        </div>
        <div class="stat-card active">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <span class="stat-label">Tutor Aktif</span>
            <span class="stat-value">{{ activeRegistrations.length }}</span>
          </div>
          <div class="stat-glow"></div>
        </div>
        <div class="stat-card rejected">
          <div class="stat-icon">❌</div>
          <div class="stat-info">
            <span class="stat-label">Total Ditolak</span>
            <span class="stat-value">{{ rejectedRegistrations.length }}</span>
          </div>
          <div class="stat-glow"></div>
        </div>
      </section>

      <!-- FILTER & SEARCH BAR -->
      <div class="controls-card">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Cari berdasarkan nama, email, atau jurusan..." 
          />
        </div>
      </div>

      <!-- DATA SECTION -->
      <div class="table-card">
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Memuat data pendaftaran...</p>
        </div>

        <div v-else-if="getCurrentList().length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>Tidak ada data</h3>
          <p>Tidak ada pendaftar tutor dengan kata kunci tersebut.</p>
        </div>

        <div v-else class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Nama Lengkap & Info</th>
                <th>Jurusan & Universitas</th>
                <th>No. WhatsApp</th>
                <th>Tanggal Daftar</th>
                <th>Dokumen CV</th>
                <th class="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="reg in getCurrentList()" 
                :key="reg.id"
                class="fade-in-row"
              >
                <td>
                  <div class="tutor-identity">
                    <div class="initial-avatar">{{ getInitials(reg.name) }}</div>
                    <div>
                      <strong>{{ reg.name }}</strong>
                      <span class="email-text">{{ reg.email }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="education-badge">{{ reg.education || 'N/A' }}</span>
                </td>
                <td>
                  <a :href="'https://wa.me/' + formatWhatsApp(reg.phone_number)" target="_blank" class="wa-link">
                    {{ reg.phone_number }}
                  </a>
                </td>
                <td>
                  <span class="date-text">{{ formatDate(reg.created_at) }}</span>
                </td>
                <td>
                  <a 
                    v-if="reg.cv_url" 
                    :href="reg.cv_url" 
                    target="_blank" 
                    class="cv-btn"
                  >
                    📄 Lihat CV
                  </a>
                  <span v-else class="no-cv">Tidak ada CV</span>
                </td>
                <td class="actions text-right">
                  <div v-if="reg.status === 'PENDING'" class="actions-group">
                    <button class="btn-approve" @click="approveTutor(reg)">
                      <span>✓</span> Approve
                    </button>
                    <button class="btn-reject" @click="rejectTutor(reg)">
                      <span>✕</span> Reject
                    </button>
                  </div>
                  <div v-else-if="reg.status === 'APPROVED'" class="actions-group">
                    <button class="btn-revoke" @click="revokeTutor(reg)">
                      🚨 Blokir / Batalkan
                    </button>
                  </div>
                  <div v-else-if="reg.status === 'REJECTED'" class="actions-group">
                    <button class="btn-reconsider" @click="reconsiderTutor(reg)">
                      🔄 Pertimbangkan Lagi
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api'

const router = useRouter()
const activeTab = ref('pending')
const isLoading = ref(false)
const searchQuery = ref('')

const pendingRegistrations = ref([])
const activeRegistrations = ref([])
const rejectedRegistrations = ref([])

const fetchRegistrations = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/tutor-registration')
    const all = response.data || []
    pendingRegistrations.value = all.filter(r => r.status === 'PENDING')
    activeRegistrations.value = all.filter(r => r.status === 'APPROVED')
    rejectedRegistrations.value = all.filter(r => r.status === 'REJECTED')
  } catch (error) {
    console.error('Gagal mengambil data pendaftar:', error)
    window.$toast('Gagal memuat data pendaftaran tutor.', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (!localStorage.getItem('token')) {
    window.$toast('Silakan login terlebih dahulu.', 'error')
    router.push('/login')
    return
  }
  fetchRegistrations()
})

const getHeaderTitle = () => {
  const titles = {
    pending: 'Verifikasi Pendaftar Tutor Baru',
    active: 'Daftar Pengajar Tutor Aktif',
    rejected: 'Daftar Pengajuan Ditolak',
  }
  return titles[activeTab.value] || ''
}

const getCurrentList = () => {
  let list = []
  if (activeTab.value === 'pending') list = pendingRegistrations.value
  else if (activeTab.value === 'active') list = activeRegistrations.value
  else if (activeTab.value === 'rejected') list = rejectedRegistrations.value

  if (!searchQuery.value) return list
  const query = searchQuery.value.toLowerCase()
  return list.filter(r => 
    r.name.toLowerCase().includes(query) ||
    r.email.toLowerCase().includes(query) ||
    r.education.toLowerCase().includes(query)
  )
}

const approveTutor = async (tutor) => {
  if (!(await window.$confirm(`Setujui pendaftaran ${tutor.name} sebagai tutor?`))) return
  try {
    await api.patch(`/tutor-registration/${tutor.id}/status`, { status: 'APPROVED' })
    window.$toast(`${tutor.name} sekarang resmi disetujui!`, 'success')
    await fetchRegistrations()
  } catch (error) {
    console.error('Gagal approve tutor:', error)
    window.$toast('Terjadi kesalahan saat menyetujui tutor.', 'error')
  }
}

const rejectTutor = async (tutor) => {
  if (!(await window.$confirm(`Yakin ingin menolak pendaftaran ${tutor.name}?`))) return
  try {
    await api.patch(`/tutor-registration/${tutor.id}/status`, { status: 'REJECTED' })
    window.$toast(`Pendaftaran ${tutor.name} ditolak.`, 'info')
    await fetchRegistrations()
  } catch (error) {
    console.error('Gagal reject tutor:', error)
    window.$toast('Terjadi kesalahan saat menolak tutor.', 'error')
  }
}

const revokeTutor = async (tutor) => {
  if (!(await window.$confirm(`PERINGATAN: Yakin ingin menonaktifkan status tutor aktif ${tutor.name}? Profil tutornya akan diarsipkan.`))) return
  try {
    await api.patch(`/tutor-registration/${tutor.id}/status`, { status: 'REJECTED' })
    window.$toast(`Status tutor ${tutor.name} berhasil dibatalkan.`, 'info')
    await fetchRegistrations()
  } catch (error) {
    console.error('Gagal menonaktifkan tutor:', error)
    window.$toast('Gagal memproses penonaktifan tutor.', 'error')
  }
}

const reconsiderTutor = async (tutor) => {
  if (!(await window.$confirm(`Pertimbangkan ulang pendaftaran ${tutor.name}? Statusnya akan dikembalikan ke PENDING.`))) return
  try {
    await api.patch(`/tutor-registration/${tutor.id}/status`, { status: 'PENDING' })
    window.$toast(`Pendaftaran ${tutor.name} dikembalikan ke status antrean verifikasi.`, 'success')
    await fetchRegistrations()
  } catch (error) {
    console.error('Gagal mempertimbangkan ulang tutor:', error)
    window.$toast('Gagal memproses perubahan status.', 'error')
  }
}

const handleLogout = () => {
  localStorage.clear()
  window.$toast('Logout berhasil.', 'success')
  router.push('/login')
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatWhatsApp = (phone) => {
  if (!phone) return ''
  return phone.replace(/[^0-9]/g, '')
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.admin-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* SIDEBAR STYLES */
.admin-sidebar {
  background: #0f172a;
  color: white;
  padding: 35px 24px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #1e293b;
}

.admin-brand {
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 45px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f8fafc;
  letter-spacing: -0.5px;
}

.admin-brand span {
  color: #16a34a;
}

.admin-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
}

.nav-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 14px 18px;
  text-align: left;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.03);
  color: #f8fafc;
  transform: translateX(4px);
}

.nav-btn.active {
  background: #16a34a;
  color: white;
  box-shadow: 0 4px 15px rgba(22, 163, 74, 0.3);
}

.badge-count {
  position: absolute;
  right: 18px;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
}

/* MAIN CONTENT STYLES */
.admin-main {
  padding: 40px 48px;
  overflow-y: auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
  text-align: left;
}

.admin-header h2 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
}

.header-subtitle {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 8px 18px;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  border: 1px solid #e2e8f0;
}

.admin-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0fdf4;
  color: #16a34a;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.user-profile h4 {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.user-profile span {
  font-size: 0.75rem;
  color: #64748b;
  display: block;
}

/* STATS GRID */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 35px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
  border: 1px solid #e2e8f0;
  text-align: left;
}

.stat-icon {
  font-size: 2.2rem;
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
}

/* Color theme stats */
.stat-card.pending .stat-icon { background: #fef3c7; }
.stat-card.active .stat-icon { background: #dcfce7; }
.stat-card.rejected .stat-icon { background: #fee2e2; }

/* CONTROLS CARD */
.controls-card {
  background: white;
  border-radius: 16px;
  padding: 16px 24px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.01);
  border: 1px solid #e2e8f0;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-icon {
  font-size: 1.1rem;
}

.search-box input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 0.95rem;
  color: #0f172a;
}

.search-box input::placeholder {
  color: #94a3b8;
}

/* TABLE STYLES */
.table-card {
  background: white;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px rgba(0,0,0,0.02);
  overflow: hidden;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f8fafc;
  padding: 18px 24px;
  text-align: left;
  color: #475569;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
}

td {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.95rem;
  color: #0f172a;
  text-align: left;
}

.tutor-identity {
  display: flex;
  align-items: center;
  gap: 14px;
}

.initial-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #475569;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.email-text {
  display: block;
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 2px;
  font-weight: 400;
}

.education-badge {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid rgba(22, 163, 74, 0.15);
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-block;
}

.wa-link {
  color: #16a34a;
  text-decoration: none;
  font-weight: 700;
  transition: opacity 0.2s;
}

.wa-link:hover {
  opacity: 0.8;
}

.date-text {
  color: #64748b;
  font-size: 0.85rem;
}

.cv-btn {
  background: #f1f5f9;
  color: #475569;
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  transition: all 0.3s;
  display: inline-block;
  border: 1px solid #e2e8f0;
}

.cv-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.no-cv {
  color: #94a3b8;
  font-size: 0.8rem;
  font-style: italic;
}

.text-right {
  text-align: right !important;
}

/* ACTIONS BUTTONS */
.actions-group {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-approve {
  background: #16a34a;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(22, 163, 74, 0.15);
}

.btn-approve:hover {
  background: #15803d;
  box-shadow: 0 6px 15px rgba(22, 163, 74, 0.25);
}

.btn-reject {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.15);
}

.btn-reject:hover {
  background: #dc2626;
  box-shadow: 0 6px 15px rgba(239, 68, 68, 0.25);
}

.btn-revoke {
  background: #fff5f5;
  color: #e53e3e;
  border: 1px solid #fed7d7;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-revoke:hover {
  background: #e53e3e;
  color: white;
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.2);
}

.btn-reconsider {
  background: #ebf8ff;
  color: #3182ce;
  border: 1px solid #bee3f8;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-reconsider:hover {
  background: #3182ce;
  color: white;
  box-shadow: 0 4px 12px rgba(49, 130, 206, 0.2);
}

/* STATES */
.loading-state, .empty-state {
  padding: 60px 40px;
  text-align: center;
  color: #64748b;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: #0f172a;
  margin-top: 15px;
  margin-bottom: 5px;
}

.empty-state p {
  margin: 0;
}

.empty-icon {
  font-size: 3rem;
}

/* SPINNER */
.spinner {
  border: 3px solid #f1f5f9;
  border-top: 3px solid #16a34a;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ANIMATION */
.fade-in-row {
  animation: fadeIn 0.4s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1024px) {
  .admin-container {
    grid-template-columns: 1fr;
  }
  .admin-sidebar {
    padding: 20px;
  }
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .admin-main {
    padding: 25px 20px;
  }
}
</style>