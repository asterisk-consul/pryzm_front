import { defineStore } from 'pinia'
import { Ref } from 'vue'

import type { Turno } from '@/interfaces/turnosInterface'
import { useServiceTurnos } from '@/services/turnosServices'
const { getTurnos } = useServiceTurnos()

export const useTurnosStore = defineStore('turnos', () => {
  const cagarTurnos = async (turnos: Ref<Turno[]>) => {
    await getTurnos(turnos)
  }
  return { cagarTurnos }
})
