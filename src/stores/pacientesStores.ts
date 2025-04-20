import { defineStore } from 'pinia'
import { Ref, ref, computed } from 'vue'
import { Paciente } from '@/interfaces'
import axios from '@/config/axios'

export const usePacientesStore = defineStore('pacientes', () => {
  const pacientes: Ref<Paciente[]> = ref([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchPacientes = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response = await axios.get('/pacientes')
      pacientes.value = response.data
    } catch (err) {
      error.value = 'Error al obtener los pacientes'
      console.error('Error al obtener los pacientes:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Opcional: Método para obtener pacientes disponibles (filtrados)
  const pacientesDisponibles = computed(() => {
    return pacientes.value.filter((pacientes) => pacientes.estado === null)
  })

  return {
    pacientes,
    pacientesDisponibles,
    isLoading,
    error,
    fetchPacientes,
  }
})
