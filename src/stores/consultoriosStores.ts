import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useServiceConsultorios } from '@/services/consultoriosServices'
const { fetchConsultoriosyTratamientos, fetchTratamientos } = useServiceConsultorios()
import type { Consultorio } from '@/interfaces/consultorioInterface'
import type { Tratamiento } from '@/interfaces/tratamientosInterface'

export const useConsultoriosStore = defineStore('consultorios', () => {
  // Estado (equivalente a "data")
  const consultorios = ref<Consultorio[]>([])
  const tratamientos = ref<Tratamiento[]>([])

  // Acción para cargar datos (equivalente a "methods")
  const cargarDatos = async () => {
    await Promise.all([
      fetchConsultoriosyTratamientos(consultorios),
      fetchTratamientos(tratamientos),
    ])
  }

  return { consultorios, tratamientos, cargarDatos }
})
