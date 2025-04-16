import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
  const theme = useTheme()
  const selectedTheme = ref<string>(localStorage.getItem('theme') || 'light')
  const systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)')

  // Aplica el tema según la selección
  const applyTheme = () => {
    if (selectedTheme.value === 'system') {
      const systemTheme = systemDarkQuery.matches ? 'dark' : 'light'
      theme.global.name.value = systemTheme
    } else {
      theme.global.name.value = selectedTheme.value
    }
  }

  // Detectar cambios en el sistema
  const handleSystemChange = (e: MediaQueryListEvent) => {
    if (selectedTheme.value === 'system') {
      theme.global.name.value = e.matches ? 'dark' : 'light'
    }
  }

  // Ejecutar una vez al cargar el store
  applyTheme()
  systemDarkQuery.addEventListener('change', handleSystemChange)

  // Cambiar tema
  const setTheme = (newTheme: string) => {
    selectedTheme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme()
  }

  return {
    selectedTheme,
    setTheme,
    currentTheme: computed(() => theme.global.name.value),
  }
})
