import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { Paciente } from '@/interfaces'
import { useServicePacientes } from '@/services/pacientesServices'

export const usePacientesStore = defineStore('pacientes', () => {
  const pacientes: Ref<Paciente[]> = ref([])
  const PacientesService = useServicePacientes(pacientes)
  const currentPaciente: Ref<Paciente | null> = ref(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchPacientes = async () => {
    try {
      isLoading.value = true
      error.value = null
      pacientes.value = await PacientesService.cargarPacientes()
    } catch (err) {
      error.value = 'Error al obtener los pacientes'
      console.error('Error al obtener los pacientes:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchPacienteById = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      currentPaciente.value = await PacientesService.cargarPacientesId(id)
    } catch (err) {
      error.value = 'Error al obtener el paciente'
      console.error('Error al obtener el paciente:', err)
    } finally {
      isLoading.value = false
    }
  }

  const savePaciente = async (paciente: Paciente) => {
    try {
      isLoading.value = true
      error.value = null
      const newPaciente = await PacientesService.guardarPaciente(paciente)
      pacientes.value.push(newPaciente)
      return newPaciente
    } catch (err) {
      error.value = 'Error al crear el paciente'
      console.error('Error al crear el paciente:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updatePaciente = async (paciente: Paciente) => {
    try {
      isLoading.value = true
      error.value = null
      const updatedPaciente = await PacientesService.updatePaciente(paciente.id_paciente, paciente)
      const index = pacientes.value.findIndex((p) => p.id_paciente === paciente.id_paciente)
      if (index !== -1) {
        pacientes.value[index] = updatedPaciente
      }
      return updatedPaciente
    } catch (err) {
      error.value = 'Error al actualizar el paciente'
      console.error('Error al actualizar el paciente:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deletePaciente = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      await PacientesService.deletePaciente(id)
      pacientes.value = pacientes.value.filter((p) => p.id_paciente !== id)
    } catch (err) {
      error.value = 'Error al eliminar el paciente'
      console.error('Error al eliminar el paciente:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const pacientesDisponibles = computed(() => {
    return pacientes.value.filter((paciente) => paciente.estado === null)
  })

  return {
    pacientes,
    currentPaciente,
    pacientesDisponibles,
    isLoading,
    error,
    fetchPacientes,
    fetchPacienteById,
    savePaciente,
    updatePaciente,
    deletePaciente,
  }
})
