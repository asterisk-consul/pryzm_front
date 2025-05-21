import { defineStore } from 'pinia'

export const useCajaStore = defineStore('caja', {
    state: () => ({
      abierta: false,
      movimientos: [],
      total: 0,
    }),
    actions: {
      async abrirCaja(montoInicial: number) {
        const res = await cajaService.abrirCaja(montoInicial)
        this.abierta = true
        this.total = montoInicial
      },
      async registrarMovimiento(tipo: 'ingreso' | 'egreso', monto: number, descripcion: string) {
        const res = await cajaService.registrarMovimiento({ tipo, monto, descripcion })
        this.movimientos.push(res.data)
        this.total += tipo === 'ingreso' ? monto : -monto
      }
    }
  })
  