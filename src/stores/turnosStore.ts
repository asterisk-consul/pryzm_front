import { defineStore } from 'pinia'

import { useServiceTurnos } from '@/services/turnosServices'
const { getTurnos } = useServiceTurnos()

export const useTurnosStore = defineStore('turnos', () => {
  const cagarTurnos = async () => {
    await getTurnos()
  }
  return { cagarTurnos }
})
