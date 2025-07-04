import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const basePath = process.env.VITE_APP_ENV === 'dev' ? '/dev/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base: basePath,
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
