import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useServiceConsultorios } from '@/services/consultoriosServices'
const { fetchConsultoriosyTratamientos, fetchTratamientos, fetchTratamientosPorConsultorio } =
  useServiceConsultorios()
import type { Consultorio } from '@/interfaces/consultorioInterface'
import type { Tratamiento } from '@/interfaces/tratamientosInterface'

export const useConsultoriosStore = defineStore('consultorios', () => {
  // Estado (equivalente a "data")
  const consultorios = ref<Consultorio[]>([])
  const tratamientos = ref<Tratamiento[]>([])
  const tratamientosPorConsultorio = ref<Record<number, Tratamiento[]>>({})

  // Acción para cargar datos (equivalente a "methods")
  const cargarDatos = async () => {
    await Promise.all([
      fetchConsultoriosyTratamientos(consultorios),

      fetchTratamientos(tratamientos),
    ])
  }
  const cargarTratamientosPorConsultorio = async (id_consultorio: number) => {
    if (!id_consultorio) return []

    if (!tratamientosPorConsultorio.value[id_consultorio]) {
      tratamientosPorConsultorio.value[id_consultorio] =
        await fetchTratamientosPorConsultorio(id_consultorio)
    }

    return tratamientosPorConsultorio.value[id_consultorio]
  }

  return {
    consultorios,
    tratamientos,
    tratamientosPorConsultorio, // Asegúrate de incluir esta propiedad
    cargarDatos,
    cargarTratamientosPorConsultorio,
  }
})
