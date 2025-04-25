import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Turno } from '@/interfaces/turnosInterface'
import { useServiceTurnos } from '@/services/turnosServices'

export const useTurnosStore = defineStore('turnos', () => {
  const turnos = ref<Turno[]>([])
  const { getTurnos } = useServiceTurnos()

  const cargarTurnos = async () => {
    try {
      const data = await getTurnos()
      turnos.value = data
    } catch (error) {
      console.error('Error al cargar turnos:', error)
    }
  }

  return {
    turnos,
    cargarTurnos
  }
})
