<template>
  <VCard title="Turnos">
    <template #subtitle>
      <p class="text-body-1 mb-0">
        <span class="d-inline-block font-weight-medium text-high-emphasis">Resumen general de turnos del mes </span> <span class="text-high-emphasis">📋</span>
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
          <div class="d-flex align-center custom-gap">
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
<style>
.custom-gap {
  column-gap: 20px !important; /* fuerza separación horizontal */
}
</style>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useCalendarEventsStore } from '@/stores/calendarEventsStore'

const store = useCalendarEventsStore()

onMounted(async () => {
  try {
    await store.fetchTurnos()
  } catch (error) {
    console.error('Error cargando turnos:', error)
  }
})

const totalTurnos = computed(() => store.turnos.length)
const turnosDelMesActual = computed(() => store.eventsForMonth.length)

const turnosPendientes = computed(() =>
  store.turnos.filter(t => t.estado?.toLowerCase() === 'pendiente').length
)

const turnosAprobados = computed(() =>
  store.turnos.filter(t => t.estado?.toLowerCase() === 'aprobado').length
)

const turnosFinalizados = computed(() =>
  store.turnos.filter(t => t.estado?.toLowerCase() === 'finalizado').length
)

const statistics = computed(() => [
  {
    title: 'Total de turnos',
    stats: turnosDelMesActual.value,
    icon: 'ri-pie-chart-2-line',
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
