<template>
    <VCard>
      <VDataTable
      
        :headers="headers"
        :items="userData"
        :loading="store.turnos.length === 0"
        item-value="id"
        class="text-no-wrap"
      >
        <!-- Celda personalizada para Paciente -->
        <template #item.paciente="{ item }">
          <div class="d-flex flex-column">
            <h6 class="text-h6 font-weight-medium user-list-name">
              {{ item.paciente }}
            </h6>
          </div>
        </template>
  
        <!-- Celda personalizada para Estado -->
        <template #item.estado="{ item }">
          <VChip
            :color="item.estado === 'finalizado' ? 'success' : item.estado === 'pendiente' ? 'warning' : 'default'"
            size="small"
            class="text-capitalize"
          >
            {{ item.estado }}
          </VChip>
        </template>

        <template #item.tratamiento="{ item }">
          <div class="d-flex flex-column">
            <h6 class="text-h6 font-weight-medium user-list-name">
              {{ item.tratamiento }}
            </h6>
          </div>
        </template>

        <template #item.costo="{ item }">
          <div class="d-flex flex-column">
            <h6 class="text-h6 font-weight-medium user-list-name">
              {{ item.costo }}
            </h6>
          </div>
        </template>
  
        <template #bottom />
      </VDataTable>
    </VCard>
  </template>
  
  <script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { useTurnosStore } from '@/stores/turnosStore'

const store = useTurnosStore()

onMounted(async () => {
  await store.cargarTurnos()

  console.log('Transformados:', store.value)
})

const userData = computed(() =>
  store.turnos.map(t => ({
    paciente: t.nombre_paciente,
    tratamiento: t.nombre_tratamiento,
    estado: t.estado,
    costo: t.costo_tratamiento
  }))
)

const headers = [
  { title: 'Paciente', key: 'paciente' },
  { title: 'Tratamiento', key: 'tratamiento' },
  { title: 'Estado', key: 'estado' },
  { title: 'Costo', key: 'costo' }
]
</script>