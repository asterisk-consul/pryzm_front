import axios from '@/config/axios'
import type { AxiosError } from 'axios'

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
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Error nativo de JavaScript
        console.error('Error:', error.message)
        alert('Error de conexión')
        return
      }

      // Type assertion para error de Axios
      const axiosError = error as AxiosError<{
        message?: string
      }>

      if (axiosError.response) {
        // Manejo de errores HTTP
        switch (axiosError.response.status) {
          case 400:
            alert(axiosError.response.data?.message || 'Datos inválidos')
            break
          case 404:
            alert('Tratamiento no encontrado')
            break
          case 500:
            alert('Error en el servidor')
            break
          default:
            alert('Error al procesar la solicitud')
        }
      } else if (axiosError.request) {
        // La solicitud fue hecha pero no hubo respuesta
        alert('No se recibió respuesta del servidor')
      } else {
        // Error al configurar la solicitud
        alert('Error al enviar la solicitud')
      }
    }
  }

  return {
    addTratamiento,
    updateTratamiento,
    eliminarTratamiento,
  }
}
