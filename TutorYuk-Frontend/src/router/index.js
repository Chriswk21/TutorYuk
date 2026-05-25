import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/public/LandingPage.vue')
  },
  {
    path: '/search',
    name: 'TutorSearch',
    component: () => import('../views/public/TutorSearch.vue')
  },
  {
    path: '/tutor/:id',
    name: 'TutorDetail',
    component: () => import('../views/public/TutorDetail.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/public/Login.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/public/Register.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/register-tutor',
    name: 'RegisterTutor',
    component: () => import('../views/public/RegisterTutor.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('../views/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/tutor/dashboard',
    name: 'TutorDashboard',
    component: () => import('../views/tutor/TutorDashboard.vue'),
    meta: { requiresAuth: true, role: 'tutor' }
  },
  {
    path: '/tutee/dashboard',
    name: 'TuteeDashboard',
    component: () => import('../views/tutee/TuteeDashboard.vue'),
    meta: { requiresAuth: true, role: 'tutee' }
  },
  {
    path: '/saved-tutors',
    name: 'SavedTutors',
    component: () => import('../views/public/SavedTutors.vue'),
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')
  const isLoggedIn = !!token

  // Handle routes that require authentication
  if (to.meta.requiresAuth && !isLoggedIn) {
    window.$toast?.('Silakan login terlebih dahulu untuk mengakses halaman ini.', 'error')
    return next('/login')
  }

  // Handle guest-only routes (login, register)
  if (to.meta.guestOnly && isLoggedIn) {
    if (userRole === 'admin') return next('/admin/dashboard')
    if (userRole === 'tutor') return next('/tutor/dashboard')
    return next('/tutee/dashboard')
  }

  // Handle role-specific routes
  if (to.meta.role && to.meta.role !== userRole) {
    window.$toast?.('Akses ditolak. Anda tidak memiliki izin ke halaman ini.', 'error')
    return next('/')
  }

  next()
})

export default router