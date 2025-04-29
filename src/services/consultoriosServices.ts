import type { Ref } from 'vue'

import axios from '@/config/axios'

import type { Consultorio } from '@/interfaces/consultorioInterface'
import type { Tratamiento } from '@/interfaces/tratamientosInterface'

export const useServiceConsultorios = () => {
  const addConsultorio = async (nombre: string, tratamientos) => {
    try {
      await axios.post('/consultorios', { nombre, tratamientos })
      // Actualiza la lista de consultorios
      // console.log('Consultorio creado:', response.data)
    } catch (error) {
      console.error('Error al crear el consultorio:', error)
    }
  }

  const updateConsultorio = async (consultorio: Consultorio) => {
    console.log('Consultorio a actualizar:', consultorio)
    if (!consultorio) return

    const nombre = consultorio.nombre_consultorio
    const tratamientos = consultorio.tratamientos
    const id = consultorio.id_consultorio

    if (!Array.isArray(tratamientos)) {
      console.error('Error: tratamientos debe ser un array.')
      return
    }

    try {
      await axios.put(`/consultorios/${id}`, {
        nombre,
        tratamientos, // Enviamos solo los IDs
      })
      // Agrega aquí cualquier lógica post-actualización (recargar datos, etc.)
    } catch (error) {
      console.error('Error al actualizar el consultorio:', error)
      // Manejo de errores (mostrar mensaje al usuario, etc.)
    }
  }
  const deleteConsultorio = async (consultorio: Consultorio) => {
    // console.log('ID del consultorio a eliminar:', consultorio.id_consultorio)
    try {
      await axios.delete(`/consultorios/${consultorio.id_consultorio}`)
      // Actualiza la lista de consultorios
    } catch (error) {
      console.error('Error al eliminar el consultorio:', error)
    }
  }
  const fetchConsultoriosyTratamientos = async (consultorios: Ref<Consultorio[]>) => {
    try {
      const response = await axios.get('/consultorios/tratamientos')
      // console.log(response)
      // Add null/undefined checks and provide fallbacks
      consultorios.value = (response.data || [])
        .map((consultorio: Consultorio) => ({
          id_consultorio: consultorio.id_consultorio,
          nombre_consultorio: consultorio.nombre_consultorio,
          tratamientos: consultorio.tratamientos.map((tratamiento: Tratamiento) => ({
            id_tratamiento: tratamiento.id_tratamiento,
            nombre: tratamiento.nombre,
            descripcion: tratamiento.descripcion,
            costo: tratamiento.costo,
            duracion: tratamiento.duracion,
            color: tratamiento.color,
          })),
        }))
        .sort((a: Consultorio, b: Consultorio) => a.id_consultorio - b.id_consultorio)
    } catch (error) {
      console.error('Error fetching consultorios and tratamientos:', error)
      // Consider setting consultorios.value to an empty array here if you want to clear the list on error
      // consultorios.value = []
    }
  }

  const fetchTratamientos = async (Tratamientos: Ref<Tratamiento[]>) => {
    try {
      const response = await axios.get('/tratamientos')
      Tratamientos.value = response.data.sort(
        (a: Tratamiento, b: Tratamiento) => a.id_tratamiento - b.id_tratamiento,
      )
    } catch (error) {
      console.error('Error fetching tratamientos:', error)
    }
  }
  const fetchTratamientosPorConsultorio = async (
    id_consultorio: number,
  ): Promise<Tratamiento[]> => {
    try {
      const response = await axios.get(`/tratamientos/tratamientosconsul/${id_consultorio}`)

      // Transforma la respuesta para cambiar nombre_tratamiento a nombre
      const tratamientos =
        response.data?.map((tratamiento: Tratamiento) => ({
          ...tratamiento,
          nombre: tratamiento.nombre_tratamiento, // Mapea nombre_tratamiento a nombre
          // Elimina el campo nombre_tratamiento si lo deseas (opcional)
          // nombre_tratamiento: undefined
        })) || []

      console.log('Tratamientos por consultorio:', tratamientos)
      return tratamientos
    } catch (error) {
      console.error('Error al cargar tratamientos por consultorio:', error)
      return []
    }
  }

  return {
    addConsultorio,
    updateConsultorio,
    deleteConsultorio,
    fetchConsultoriosyTratamientos,
    fetchTratamientos,
    fetchTratamientosPorConsultorio,
  }
}
