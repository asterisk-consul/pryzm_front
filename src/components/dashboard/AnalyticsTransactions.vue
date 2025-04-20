<template>
  <VCard title="Turnos">
    <template #subtitle>
      <p class="text-body-1 mb-0">
        <span class="d-inline-block font-weight-medium text-high-emphasis">Resumen general de turnos</span> <span class="text-high-emphasis">📋</span>
      </p>
    </template>

    <template #append>
      <MoreBtn :menu-list="moreList" />
    </template>

    <VCardText class="pt-10">
      <VRow>
        <VCol
          v-for="item in statistics"
          :key="item.title"
          cols="12"
          sm="6"
          md="3"
        >
          <div class="d-flex align-center gap-x-3">
            <VAvatar
              :color="item.color"
              rounded
              size="40"
              class="elevation-2"
            >
              <VIcon
                size="24"
                :icon="item.icon"
              />
            </VAvatar>

            <div class="d-flex flex-column">
              <div class="text-body-1">
                {{ item.title }}
              </div>
              <h5 class="text-h5">
                {{ item.stats }}
              </h5>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Turno } from '@/interfaces/turnosInterface'
import { useServiceTurnos } from '@/services/turnosServices'

const turnos = ref<Turno[]>([])
const { cargarTurnos } = useServiceTurnos(turnos)

onMounted(async () => {
  try {
    await cargarTurnos()
  } catch (error) {
    console.error('Error cargando turnos:', error)
  }
})

// Computed stats
const totalTurnos = computed(() => turnos.value.length)

const turnosPendientes = computed(() =>
  turnos.value.filter(t => estado.toLowerCase() === 'pendiente').length
)

const turnosAprobados = computed(() =>
  turnos.value.filter(t => t.estado.toLowerCase() === 'aprobado').length
)

const turnosFinalizados = computed(() =>
  turnos.value.filter(t => estado.toLowerCase() === 'finalizado').length
)

const statistics = computed(() => [
  {
    title: 'Total de turnos',
    stats: totalTurnos.value,
    icon: 'ri-calendar-check-line',
    color: 'primary',
  },
  {
    title: 'Pendientes',
    stats: turnosPendientes.value,
    icon: 'ri-time-line',
    color: 'warning',
  },
  {
    title: 'Aprobados',
    stats: turnosAprobados.value,
    icon: 'ri-checkbox-circle-line',
    color: 'success',
  },
  {
    title: 'Finalizados',
    stats: turnosFinalizados.value,
    icon: 'ri-check-double-line',
    color: 'info',
  },
])

const moreList = [
  { title: 'Compartir', value: 'Share' },
  { title: 'Actualizar', value: 'Refresh' },
  { title: 'Editar', value: 'Update' },
]
</script>
