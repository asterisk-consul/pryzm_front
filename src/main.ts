import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './config/vuetify'
import '@fontsource-variable/roboto-flex/full.css'
import { Toast, toastOptions } from './config/toast-config'
import axios from './config/axios'

// Crea la instancia de la aplicación
const pinia = createPinia()
const app = createApp(App)

// Agrega axios a las propiedades globales con tipado
app.config.globalProperties.$axios = axios

// Usa las configuraciones adicionales
app
  .use(vuetify)
  .use(Toast, toastOptions) // Configura vue-toastification
  .use(router)
  .use(pinia)
  .mount('#app')
