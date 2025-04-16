<template>
  <v-btn-toggle
    v-model="currentView"
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
        currentView === view.value
          ? theme.global.current.value.colors.primary
          : theme.global.current.value.colors['background-list']
      "
      :style="{
        color: theme.global.current.value.colors.primary,
        border: `1px solid ${theme.global.current.value.colors.primary}`,
        background:
          currentView === view.value
            ? theme.global.current.value.colors['background-list']
            : theme.global.current.value.colors.background,
        height: '2.5rem',
        fontSize: '1.0rem',
        fontWeight: 'bold',
      }"
      class="text-capitalize"
      variant="text"
    >
      {{ view.label }}
    </v-btn>
  </v-btn-toggle>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ViewOption, ViewType } from '@/interfaces/models'
import { useTheme } from 'vuetify'

const theme = useTheme()

const viewOptions: ViewOption[] = [
  { value: 'month', label: 'Mes' },
  { value: 'week', label: 'Semana' },
  { value: 'day', label: 'Día' },
  { value: 'list', label: 'Agenda' },
]

// Cargar vista guardada
const loadSavedView = (): ViewType => {
  const saved = localStorage.getItem('calendar_view')
  return saved && viewOptions.some((v) => v.value === saved) ? (saved as ViewType) : 'week'
}

const currentView = ref<ViewType>(loadSavedView())
const emit = defineEmits<{ (e: 'viewChanged', view: ViewType): void }>()

// Guardar cambios y notificar
watch(currentView, (newView) => {
  localStorage.setItem('calendar_view', newView)
  emit('viewChanged', newView)
})

// Exponer funcionalidad
defineExpose({
  currentView,
  toggleView: () => {
    const currentIndex = viewOptions.findIndex((v) => v.value === currentView.value)
    const nextIndex = (currentIndex + 1) % viewOptions.length
    currentView.value = viewOptions[nextIndex].value
  },
})
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
