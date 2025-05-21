<template>
    <form @submit.prevent="abrirCaja">
      <input v-model="form.caja_id" type="number" placeholder="Caja ID" />
      <input v-model="form.monto_inicial" type="number" placeholder="Monto inicial" />
      <textarea v-model="form.observaciones" placeholder="Observaciones"></textarea>
      <button type="submit">Abrir caja</button>
    </form>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import { useCajaStore } from '@/stores/cajaStores'
  
  const store = useCajaStore()
  const form = ref({
    caja_id: 1,
    usuario_id: 1,
    monto_inicial: 0,
    observaciones: ''
  })
  
  const abrirCaja = async () => {
    await store.abrirCaja(form.value)
  }
  </script>
  