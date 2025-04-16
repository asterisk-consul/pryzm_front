import axios from '../../../config/axios'

export const fetchPacientes = async () => {
  try {
    const response = await axios.get('/pacientes')
    return response.data
  } catch (error) {
    console.error('Error al obtener pacientes:', error)
    throw error
  }
}

export const fetchPacienteId = async (id) => {
  try {
    const response = await axios.get(`/pacientes/${id}`)
    return response.data
  } catch (error) {
    console.error('Error al obtener el paciente:', error)
    throw error
  }
}

export const savePaciente = async (paciente) => {
  try {
    const response = await axios.post('/pacientes', paciente)
    return response.data
  } catch (error) {
    console.error('Error al guardar el paciente:', error)
    throw error
  }
}

export const deletePaciente = async (id) => {
  try {
    const response = await axios.delete(`/pacientes/${id}`)
    return response.data
  } catch (error) {
    console.error('Error al eliminar el paciente:', error)
    throw error
  }
}

export const updatePaciente = async (id, paciente) => {
  try {
    const response = await axios.put(`/pacientes/${id}`, paciente)
    return response.data
  } catch (error) {
    console.error('Error al actualizar el paciente:', error)
    throw error
  }
}
