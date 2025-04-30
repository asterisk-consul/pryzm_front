import type { User } from '@/interfaces'
import { ref } from 'vue'

const isAuthenticated = ref(!!sessionStorage.getItem('session'))
const user = ref(JSON.parse(sessionStorage.getItem('session') ?? 'null') || null)

export function useAuth() {
  // Función para iniciar sesión
  const login = (userData: User) => {
    user.value = userData
    isAuthenticated.value = true
    sessionStorage.setItem('session', JSON.stringify(userData))
  }

  // Función para cerrar sesión
  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    sessionStorage.removeItem('session')
  }

  // Observa cambios en la sesión (por si quieres alguna lógica extra)
  const refreshAuth = () => {
    user.value = JSON.parse(sessionStorage.getItem('session') ?? 'null') || null
    isAuthenticated.value = !!user.value
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
    refreshAuth,
  }
}
