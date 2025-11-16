import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/css/main.css'
import 'vue-awesome-paginate/dist/style.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// Initialize theme store early to apply theme before mounting
import { useThemeStore } from './stores/theme'
useThemeStore() // Initialize the store to apply saved theme

app.mount('#app')
