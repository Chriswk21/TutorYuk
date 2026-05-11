import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Ini harus ada

const app = createApp(App)
app.use(router) // Ini harus ada
app.mount('#app')