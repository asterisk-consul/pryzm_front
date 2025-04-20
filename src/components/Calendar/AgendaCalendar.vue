<template>
  <v-card class="mt-4">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Eventos del mes</span>
    </v-card-title>

    <v-list class="overflow-y-auto" style="max-height: 500px">
      <template v-if="Object.keys(groupedEventsByMonth).length === 0">
        <v-list-item>
          <v-alert type="info" density="compact" class="mb-0">
            No hay eventos para este mes.
          </v-alert>
        </v-list-item>
      </template>

      <template v-else>
        <div v-for="(events, day) in groupedEventsByMonth" :key="day">
          <!-- Día -->
          <div :style="styleSubtitle">
            <div
              class="d-flex align-center px-4 py-2"
              :style="{
                color: theme.global.current.value.colors['on-surface'],
                gap: '10px',
              }"
            >
              <span>{{ getDay(day) }}</span>
              de
              <span>{{ getMonthName(day) }}</span>
              <span>{{ getYear(day) }}</span>
            </div>
            <span class="text-capitalize">{{ getWeekday(day) }}</span>
          </div>

          <!-- Lista de eventos -->
          <v-list-item
            v-for="(event, idx) in sortedEvents(events)"
            :key="`event-${day}-${idx}`"
            @click="showEvent(event)"
            style="min-height: 45px; cursor: pointer"
            :style="{
              borderBottom: `1px solid ${theme.global.current.value.colors.border}`,
            }"
            class="d-flex align-center"
          >
            <v-list-item-content>
              <v-list-item-title class="d-flex align-center">
                <span
                  class="me-10"
                  :style="{
                    color: theme.global.current.value.colors['th-grey-600'],
                    fontSize: '0.9rem',
                  }"
                  >{{
                    formatTime(new Date(event.start)) + ' - ' + formatTime(new Date(event.end))
                  }}</span
                >
                <v-avatar :color="event.backgroundColor" size="10" class="me-3"></v-avatar>
                <span
                  class="font-weight-medium"
                  :style="{
                    fontSize: '0.9rem',
                    color: theme.global.current.value.colors['th-grey-600'],
                  }"
                  >{{ event.title }}</span
                >
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </template>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, toRefs } from 'vue'
import { useCalendarEventsStore } from '@/stores/calendarEventsStore'
import { Evento } from '../../interfaces/calendarInterface'

// Import theme
import { useTheme } from 'vuetify'
const theme = useTheme()

// Utils
import { formatTime, getDay, getMonthName, getWeekday, getYear } from '@/utils/formatDateTime'

// Props
const props = defineProps<{
  currentDate: Date
}>()

const emit = defineEmits(['show-event'])

const { currentDate } = toRefs(props)

// Store
const eventsStore = useCalendarEventsStore()
const { formattedEvents: events } = storeToRefs(eventsStore)

// Agrupar eventos del mes actual, organizados por día
const groupedEventsByMonth = computed(() => {
  const grouped: Record<string, Evento[]> = {}

  const targetMonth = currentDate.value.getMonth()
  const targetYear = currentDate.value.getFullYear()

  for (const event of events.value) {
    const date = new Date(event.start)
    const eventMonth = date.getMonth()
    const eventYear = date.getFullYear()

    if (eventMonth === targetMonth && eventYear === targetYear) {
      const dayKey = date.toISOString().split('T')[0]
      if (!grouped[dayKey]) grouped[dayKey] = []
      grouped[dayKey].push(event)
    }
  }

  return grouped
})

// Ordenar eventos por hora
const sortedEvents = (events: Evento[] = []) => {
  if (!Array.isArray(events)) return []
  return [...events].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}

const showEvent = (event: Evento) => {
  console.log('Evento a mostrar:', event)
  emit('show-event', event)
}

const styleSubtitle = computed(() => {
  return {
    background: theme.global.current.value.colors['on-surface-variant'],
    color: theme.global.current.value.colors['on-surface'],
    border: `1px solid ${theme.global.current.value.colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 1.5rem 0 0 ',
    alignItems: 'center',
  }
})
</script>
