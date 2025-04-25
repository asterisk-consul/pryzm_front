<template>
  <v-btn-toggle
    v-model="calendarStore.currentView"
    mandatory
    borderless
    class="view-selector"
    :color="theme.global.current.value.colors['background-list']"
  >
    <v-btn
      v-for="view in viewOptions"
      :key="view.value"
      :value="view.value"
      :color="
        calendarStore.currentView === view.value
          ? theme.global.current.value.colors.primary
          : theme.global.current.value.colors['background-list']
      "
      :style="{
        color: theme.global.current.value.colors.primary,
        border: `1px solid ${theme.global.current.value.colors.primary}`,
        background:
          calendarStore.currentView === view.value
            ? theme.global.current.value.colors['background-list']
            : theme.global.current.value.colors.background,
        height: '2.5rem',
        fontSize: '1.0rem',
        fontWeight: 'bold',
      }"
      class="text-capitalize"
      variant="text"
      @click="handleChange(view.value)"
    >
      {{ view.label }}
    </v-btn>
  </v-btn-toggle>
</template>

<script setup lang="ts">
import { useCalendarStore } from '@/stores/calendarStore'
import type { ViewOption, ViewType } from '@/interfaces/calendarInterface'
import { useTheme } from 'vuetify'

const theme = useTheme()
const calendarStore = useCalendarStore()

const viewOptions: ViewOption[] = [
  { value: 'month', label: 'Mes' },
  { value: 'week', label: 'Semana' },
  { value: 'day', label: 'Día' },
  { value: 'list', label: 'Agenda' },
]

// Cambiar vista
const handleChange = (newView: ViewType) => {
  if (newView !== 'list') {
    calendarStore.handleViewChange(newView)
    localStorage.setItem('calendar_view', newView)
  }
}
</script>

<style scoped>
.view-selector {
  border-radius: 8px;
  padding: 4px;
}
.view-selector .v-btn {
  min-width: 50px;
  transition: all 0.3s ease;
}
.view-selector .v-btn--active {
  font-weight: 600;
}
</style>
