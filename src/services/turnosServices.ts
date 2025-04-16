import axios from '@/config/axios'
import { Ref } from 'vue'
import { Turno } from '@/interfaces/turnosInterface'

export const useServiceTurnos = (turnos: Ref<Turno[]>) => {
  const cargarTurnos = async () => {
    try {
      const response = await axios.get('/turnos')
      turnos.value = response.data
      return response.data
    } catch (error) {
      console.error('Error al obtener turnos:', error)
      throw error
    }
  }
  const getCalendarTurnos = async () => {
    try {
      const response = await axios.get('/turnos/calendario')
      return response.data
    } catch (error) {
      console.error('Error al obtener turnos:', error)
      throw error
    }
  }

  const cargarTurnosId = async (id: number) => {
    try {
      const response = await axios.get(`/turnos/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener el turno:', error)
      throw error
    }
  }

  const guardarTurno = async (turnos: Turno) => {
    try {
      const response = await axios.post('/turnos', turnos)
      return response.data
    } catch (error) {
      console.error('Error al guardar el turno:', error)
      throw error
    }
  }

  const updateTurno = async (id: number, turnos: Turno) => {
    try {
      const response = await axios.put(`/turnos/${id}`, turnos)
      return response.data
    } catch (error) {
      console.error('Error al actualizar el turno:', error)
      throw error
    }
  }

  const deleteTurno = async (id: number) => {
    try {
      const response = await axios.delete(`/turnos/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al eliminar el turno:', error)
      throw error
    }
  }

  return {
    cargarTurnos,
    cargarTurnosId,
    guardarTurno,
    updateTurno,
    deleteTurno,
    getCalendarTurnos,
  }
}
