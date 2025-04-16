import axios from '@/config/axios'

import type { Tratamiento } from '../interfaces/tratamientosInterface'

export const useServiceTratamientos = () => {
  const addTratamiento = async (
    nombre: string,
    descripcion: string,
    costo: number,
    duracion: number,
    color: string,
  ) => {
    try {
      await axios.post(`/tratamientos/`, {
        nombre,
        descripcion,
        costo,
        duracion,
        color,
      })
    } catch (error) {
      console.error('Error al crear el tratamiento:', error)
    }
  }
  const updateTratamiento = async (Tratamiento: Tratamiento) => {
    console.log('Tratamiento a actualizar:', Tratamiento)
    const { id_tratamiento, nombre, descripcion, costo, duracion, color } = Tratamiento

    try {
      await axios.put(`/tratamientos/${id_tratamiento}`, {
        nombre,
        descripcion,
        costo,
        duracion,
        color,
      })
    } catch (error) {
      console.error('Error al actualizar el tratamiento:', error)
    }
  }
  const eliminarTratamiento = async (tratamiento: Tratamiento) => {
    try {
      await axios.delete(`/tratamientos/${tratamiento.id_tratamiento}`)
    } catch (error) {
      if (error.response) {
        // Manejar errores específicos del backend
        if (error.response.status === 400) {
          alert(error.response.data.message) // Mostrar mensaje de error
        } else if (error.response.status === 404) {
          alert('Tratamiento no encontrado')
        } else {
          alert('Error al eliminar el tratamiento')
        }
      } else {
        console.error('Error desconocido:', error.message)
      }
    }
  }

  return {
    addTratamiento,
    updateTratamiento,
    eliminarTratamiento,
  }
}
