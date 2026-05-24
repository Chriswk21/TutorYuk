<template>
  <div class="admin-container">
    <aside class="admin-sidebar">
      <div class="admin-brand">TutorYuk <span>Admin</span></div>
      <nav class="admin-nav">
        <button :class="{ active: activeTab === 'pending' }" @click="activeTab = 'pending'">
          Pendaftar Baru
        </button>
        <button :class="{ active: activeTab === 'active' }" @click="activeTab = 'active'">
          Tutor Aktif
        </button>
      </nav>
    </aside>

    <main class="admin-main">
      <header class="admin-header">
        <h2>{{ activeTab === 'pending' ? 'Verifikasi Tutor Baru' : 'Daftar Tutor Aktif' }}</h2>
      </header>

      <div class="table-card">
        <table v-if="activeTab === 'pending'">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Email</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reg in pendingRegistrations" :key="reg.id">
              <td><strong>{{ reg.name }}</strong></td>
              <td><span class="badge">{{ reg.education || 'N/A' }}</span></td>
              <td>{{ reg.email }}</td>
              <td class="actions">
                <button class="btn-approve" @click="approveTutor(reg)">Approve</button>
                <button class="btn-reject" @click="rejectTutor(reg.id)">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else class="empty-state">
          <p>Belum ada data untuk ditampilkan.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/api'

const activeTab = ref('pending')
const pendingRegistrations = ref([])

const fetchRegistrations = async () => {
  try {
    const response = await api.get('/tutor-registration')
    // Filter hanya yang masih PENDING
    pendingRegistrations.value = response.data.filter(r => r.status === 'PENDING')
  } catch (error) {
    console.error('Gagal mengambil data pendaftar:', error)
  }
}

onMounted(() => {
  fetchRegistrations()
})

const approveTutor = async (tutor) => {
  try {
    await api.patch(`/tutor-registration/${tutor.id}/status`, { status: 'APPROVED' })
    window.$toast(`${tutor.name} sekarang resmi disetujui!`)
    pendingRegistrations.value = pendingRegistrations.value.filter(r => r.id !== tutor.id)
  } catch (error) {
    console.error('Gagal approve tutor:', error)
    window.$toast('Terjadi kesalahan saat menyetujui tutor.')
  }
}

const rejectTutor = async (id) => {
  if(await window.$confirm('Yakin ingin menolak pendaftaran ini?')) {
    try {
      await api.patch(`/tutor-registration/${id}/status`, { status: 'REJECTED' })
      pendingRegistrations.value = pendingRegistrations.value.filter(r => r.id !== id)
    } catch (error) {
      console.error('Gagal reject tutor:', error)
      window.$toast('Terjadi kesalahan saat menolak tutor.')
    }
  }
}
</script>

<style scoped>
.admin-container { display: grid; grid-template-columns: 250px 1fr; min-height: 100vh; background: #f1f5f9; }

.admin-sidebar { background: #0f172a; color: white; padding: 30px 20px; }
.admin-brand { font-size: 1.5rem; font-weight: 800; margin-bottom: 40px; }
.admin-brand span { color: #16a34a; }

.admin-nav { display: flex; flex-direction: column; gap: 10px; }
.admin-nav button { 
  background: transparent; border: none; color: #94a3b8; padding: 12px; 
  text-align: left; border-radius: 8px; cursor: pointer; font-weight: 600;
}
.admin-nav button.active { background: #1e293b; color: white; }

.admin-main { padding: 40px; }
.admin-header { margin-bottom: 30px; }

.table-card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; padding: 15px; border-bottom: 2px solid #f1f5f9; color: #64748b; font-size: 0.85rem; }
td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; }

.badge { background: #dcfce7; color: #16a34a; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; }

.actions { display: flex; gap: 10px; }
.btn-approve { background: #16a34a; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
.btn-reject { background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; }
</style>