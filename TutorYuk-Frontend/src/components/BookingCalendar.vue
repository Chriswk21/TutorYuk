<template>
  <div class="calendar-wrapper">
    <!-- Header: Month nav -->
    <div class="cal-header">
      <button class="nav-btn" @click="prevMonth" aria-label="Previous month">‹</button>
      <h3>{{ monthYearLabel }}</h3>
      <button class="nav-btn" @click="nextMonth" aria-label="Next month">›</button>
    </div>

    <!-- Today button -->
    <div class="today-row">
      <button class="btn-today" @click="goToday">Hari Ini</button>
    </div>

    <!-- Day labels -->
    <div class="day-labels">
      <div v-for="d in dayLabels" :key="d" class="day-label">{{ d }}</div>
    </div>

    <!-- Calendar grid -->
    <div class="cal-grid">
      <div
        v-for="(day, idx) in calendarDays"
        :key="idx"
        :class="[
          'cal-day',
          {
            'other-month': !day.currentMonth,
            'is-today': day.isToday,
            'has-events': day.events.length > 0,
            'selected': day.isSelected,
          }
        ]"
        @click="selectDay(day)"
      >
        <span class="day-number">{{ day.date.getDate() }}</span>
        <div v-if="day.events.length > 0" class="dots">
          <span
            v-for="(ev, i) in day.events.slice(0, 3)"
            :key="i"
            :class="['dot', `dot-${ev.status.toLowerCase()}`]"
          ></span>
          <span v-if="day.events.length > 3" class="more-count">+{{ day.events.length - 3 }}</span>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="legend">
      <div class="legend-item"><span class="dot dot-pending"></span> Menunggu</div>
      <div class="legend-item"><span class="dot dot-accepted"></span> Aktif</div>
      <div class="legend-item"><span class="dot dot-completed"></span> Selesai</div>
    </div>

    <!-- Selected day events -->
    <div v-if="selectedDay" class="day-detail">
      <h4>{{ formatLongDate(selectedDay.date) }}</h4>
      <div v-if="selectedDay.events.length === 0" class="empty-day">
        Tidak ada jadwal pada hari ini.
      </div>
      <div v-else class="event-list">
        <div
          v-for="ev in selectedDay.events"
          :key="ev.id"
          :class="['event-card', `event-${ev.status.toLowerCase()}`]"
        >
          <div class="event-time">
            🕐 {{ formatTime(ev.schedule_date) }}
          </div>
          <div class="event-info">
            <h5>
              {{ getPersonName(ev) }}
              <span :class="['status-tag', `status-${ev.status.toLowerCase()}`]">
                {{ getStatusLabel(ev.status) }}
              </span>
            </h5>
            <p class="event-category">{{ ev.category?.name || 'Mata pelajaran' }}</p>
            <p v-if="ev.location_or_link" class="event-location">
              📍 {{ ev.location_or_link }}
            </p>
            <p v-if="ev.notes" class="event-notes">📝 {{ ev.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  bookings: { type: Array, default: () => [] },
  perspective: { type: String, default: 'tutee' }, // 'tutee' atau 'tutor'
})

const currentMonth = ref(new Date())
const selectedDay = ref(null)

const dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const monthYearLabel = computed(() => {
  return `${monthNames[currentMonth.value.getMonth()]} ${currentMonth.value.getFullYear()}`
})

// Generate calendar grid (7 cols × 6 rows = 42 cells)
const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay()) // mundur ke hari Minggu

  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    date.setHours(0, 0, 0, 0)

    const events = props.bookings.filter(b => {
      const bookingDate = new Date(b.schedule_date)
      bookingDate.setHours(0, 0, 0, 0)
      return bookingDate.getTime() === date.getTime()
    }).sort((a, b) => new Date(a.schedule_date) - new Date(b.schedule_date))

    days.push({
      date,
      currentMonth: date.getMonth() === month,
      isToday: date.getTime() === today.getTime(),
      isSelected: selectedDay.value && selectedDay.value.date.getTime() === date.getTime(),
      events,
    })
  }

  return days
})

const prevMonth = () => {
  const d = new Date(currentMonth.value)
  d.setMonth(d.getMonth() - 1)
  currentMonth.value = d
  selectedDay.value = null
}

const nextMonth = () => {
  const d = new Date(currentMonth.value)
  d.setMonth(d.getMonth() + 1)
  currentMonth.value = d
  selectedDay.value = null
}

const goToday = () => {
  currentMonth.value = new Date()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayInGrid = calendarDays.value.find(d => d.date.getTime() === today.getTime())
  if (todayInGrid) selectedDay.value = todayInGrid
}

const selectDay = (day) => {
  selectedDay.value = day
}

const formatLongDate = (date) => {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

const formatTime = (dt) => {
  return new Date(dt).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit'
  })
}

const getPersonName = (booking) => {
  // Dari sisi tutee: tampilin nama tutor
  // Dari sisi tutor: tampilin nama tutee
  if (props.perspective === 'tutee') {
    return booking.tutorProfile?.user?.name || 'Tutor'
  }
  return booking.user?.name || 'Tutee'
}

const getStatusLabel = (status) => {
  const labels = {
    PENDING: 'Menunggu',
    ACCEPTED: 'Aktif',
    REJECTED: 'Ditolak',
    COMPLETED: 'Selesai',
    CANCELLED: 'Dibatalkan',
  }
  return labels[status] || status
}

// Auto-select hari ini saat pertama kali load
watch(() => props.bookings, () => {
  if (!selectedDay.value) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayInGrid = calendarDays.value.find(d => d.date.getTime() === today.getTime())
    if (todayInGrid) selectedDay.value = todayInGrid
  }
}, { immediate: true })
</script>

<style scoped>
.calendar-wrapper {
  background: white;
  padding: 18px;
  border-radius: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* HEADER */
.cal-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
}
.cal-header h3 {
  margin: 0; color: #0f172a; font-size: 1.05rem; font-weight: 700;
}
.nav-btn {
  background: #f1f5f9; border: none; width: 36px; height: 36px;
  border-radius: 8px; cursor: pointer; color: #475569;
  font-size: 1.3rem; font-weight: 700;
}
.nav-btn:hover { background: #e2e8f0; }

.today-row { display: flex; justify-content: flex-end; margin-bottom: 12px; }
.btn-today {
  background: #f0fdf4; color: #16a34a; border: 1px solid #dcfce7;
  padding: 6px 14px; border-radius: 8px; font-weight: 600;
  cursor: pointer; font-size: 0.85rem;
}
.btn-today:hover { background: #dcfce7; }

/* DAY LABELS */
.day-labels {
  display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px;
  margin-bottom: 6px;
}
.day-label {
  text-align: center; padding: 6px 0;
  font-size: 0.7rem; font-weight: 700; color: #64748b;
  text-transform: uppercase;
}

/* GRID */
.cal-grid {
  display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;
}
.cal-day {
  aspect-ratio: 1; background: #f0fdf4;
  border-radius: 8px; padding: 4px;
  display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
  cursor: pointer; position: relative;
  transition: all 0.15s; min-height: 40px;
}
.cal-day:hover { background: #e2e8f0; }
.cal-day.other-month { opacity: 0.35; }
.cal-day.is-today {
  background: #f0fdf4; border: 2px solid #16a34a;
}
.cal-day.is-today .day-number { color: #16a34a; font-weight: 800; }
.cal-day.has-events { background: #f0fdf4; }
.cal-day.has-events.is-today { background: #f0fdf4; }
.cal-day.selected {
  background: #16a34a !important; color: white;
}
.cal-day.selected .day-number { color: white; }
.cal-day.selected .dot { box-shadow: 0 0 0 1px white; }

.day-number {
  font-size: 0.85rem; font-weight: 600; color: #0f172a;
}

.dots {
  display: flex; gap: 2px; margin-top: auto; padding-bottom: 2px;
  align-items: center; flex-wrap: wrap; justify-content: center;
}
.dot {
  width: 6px; height: 6px; border-radius: 50%; display: inline-block;
}
.dot-pending { background: #22c55e; }
.dot-accepted { background: #16a34a; }
.dot-completed { background: #15803d; }
.dot-rejected { background: #ef4444; }
.dot-cancelled { background: #94a3b8; }
.more-count {
  font-size: 0.6rem; color: #64748b; font-weight: 700;
}

/* LEGEND */
.legend {
  display: flex; gap: 12px; margin-top: 14px;
  flex-wrap: wrap; padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}
.legend-item {
  display: flex; align-items: center; gap: 5px;
  font-size: 0.75rem; color: #64748b;
}
.legend-item .dot { width: 8px; height: 8px; }

/* DAY DETAIL */
.day-detail {
  margin-top: 18px; padding-top: 18px;
  border-top: 2px solid #f1f5f9;
}
.day-detail h4 {
  margin: 0 0 12px; color: #0f172a; font-size: 0.95rem;
}
.empty-day {
  text-align: center; color: #94a3b8; padding: 20px 10px;
  background: #f0fdf4; border-radius: 10px; font-size: 0.9rem;
}
.event-list { display: flex; flex-direction: column; gap: 8px; }
.event-card {
  display: flex; gap: 12px; padding: 12px; border-radius: 10px;
  background: #f0fdf4; border-left: 3px solid #cbd5e1;
}
.event-pending { border-left-color: #22c55e; }
.event-accepted { border-left-color: #16a34a; }
.event-completed { border-left-color: #15803d; }
.event-rejected { border-left-color: #ef4444; opacity: 0.7; }
.event-cancelled { border-left-color: #94a3b8; opacity: 0.7; }

.event-time {
  font-weight: 700; color: #0f172a; font-size: 0.85rem;
  min-width: 70px; padding-top: 2px;
}
.event-info { flex: 1; }
.event-info h5 {
  margin: 0 0 4px; font-size: 0.9rem; color: #0f172a;
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
}
.status-tag {
  font-size: 0.65rem; font-weight: 700;
  padding: 2px 6px; border-radius: 5px;
}
.status-pending { background: #f0fdf4; color: #15803d; }
.status-accepted { background: #dcfce7; color: #15803d; }
.status-rejected { background: #fee2e2; color: #991b1b; }
.status-completed { background: #dcfce7; color: #15803d; }
.status-cancelled { background: #f1f5f9; color: #64748b; }

.event-category {
  margin: 0 0 4px; font-size: 0.8rem; color: #16a34a; font-weight: 600;
}
.event-location, .event-notes {
  margin: 4px 0 0; font-size: 0.78rem; color: #64748b; line-height: 1.4;
}

/* DESKTOP */
@media (min-width: 768px) {
  .calendar-wrapper { padding: 24px; }
  .cal-header h3 { font-size: 1.2rem; }
  .cal-day { min-height: 55px; padding: 6px; }
  .day-number { font-size: 0.95rem; }
  .dot { width: 7px; height: 7px; }
  .day-label { font-size: 0.78rem; }
}
</style>
