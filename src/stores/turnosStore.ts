
// stores/turnosStore.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Turno } from '@/interfaces/turnosInterface'
import { useServiceTurnos } from '@/services/turnosServices'

export const useTurnosStore = defineStore('turnos', () => {
  const turnos = ref<Turno[]>([])
  const { getTurnos } = useServiceTurnos()

  const cargarTurnos = async () => {
    const data = await getTurnos()
    turnos.value = data
  }

  return {
    turnos,
    cargarTurnos
  }
})


