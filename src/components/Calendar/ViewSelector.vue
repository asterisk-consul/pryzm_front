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

  <v-dialog
    v-model="dialog"
    scrollable
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <DialogCrearEditar />
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'
import type { ViewOption, ViewType } from '@/interfaces/calendarInterface'
import DialogCrearEditar from './DialogCrearEditar.vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const calendarStore = useCalendarStore()
const dialog = ref(false)

const viewOptions: ViewOption[] = [
  { value: 'month', label: 'Mes' },
  { value: 'week', label: 'Semana' },
  { value: 'day', label: 'Día' },
  { value: 'list', label: 'Agenda' },
]

// Cambiar vista
const handleChange = (newView: ViewType) => {
  if (calendarStore.currentView !== newView) {
    calendarStore.handleViewChange(newView)
    localStorage.setItem('calendar_view', newView) // guardar en localStorage
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
