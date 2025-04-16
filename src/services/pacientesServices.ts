import axios from '@/config/axios'
import { Ref } from 'vue'
import { Paciente } from '@/interfaces/pacientesInterface'

export const useServicePacientes = (pacientes: Ref<Paciente[]>) => {
  const cargarPacientes = async () => {
    try {
      const response = await axios.get('/pacientes')
      pacientes.value = response.data
      return response.data
    } catch (error) {
      console.error('Error al obtener pacientes:', error)
      throw error
    }
  }

  const cargarPacientesId = async (id: number) => {
    try {
      const response = await axios.get(`/pacientes/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener el paciente:', error)
      throw error
    }
  }

  const guardarPaciente = async (pacientes: Paciente) => {
    try {
      const response = await axios.post('/pacientes', pacientes)
      return response.data
    } catch (error) {
      console.error('Error al guardar el paciente:', error)
      throw error
    }
  }

  const deletePaciente = async (id: number) => {
    try {
      const response = await axios.delete(`/pacientes/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al eliminar el paciente:', error)
      throw error
    }
  }

  const updatePaciente = async (id: number, pacientes: Paciente) => {
    try {
      const response = await axios.put(`/pacientes/${id}`, pacientes)
      return response.data
    } catch (error) {
      console.error('Error al actualizar el paciente:', error)
      throw error
    }
  }
  return {
    cargarPacientes,
    guardarPaciente,
    deletePaciente,
    updatePaciente,
    cargarPacientesId,
  }
}
