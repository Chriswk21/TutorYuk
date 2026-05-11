import { createRouter, createWebHistory } from 'vue-router'

// Import views
// Kita gunakan lazy loading supaya aplikasi lebih ringan
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
    component: () => import('../views/public/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/public/Register.vue')
  },
  {
    path: '/register-tutor',
    name: 'RegisterTutor',
    component: () => import('../views/public/RegisterTutor.vue')
  }
  ,
  {
  path: '/admin/dashboard',
  name: 'AdminDashboard',
  component: () => import('../views/admin/AdminDashboard.vue')
  }
  ,
  {
  path: '/tutor/dashboard',
  name: 'TutorDashboard',
  component: () => import('../views/tutor/TutorDashboard.vue')
  }
  ,
  {
  path: '/tutee/dashboard',
  name: 'TuteeDashboard',
  component: () => import('../views/tutee/TuteeDashboard.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Agar setiap pindah halaman otomatis scroll ke paling atas
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router