<template>
  <div class="d-flex align-center">
    <v-btn @click="setToCurrentDate" elevation="0" class="mr-3" :style="buttonStyles"> Hoy </v-btn>

    <v-btn
      @click="prev"
      class="mr-1"
      :style="buttonStyles"
      elevation="0"
      size="x-small"
      rounded="lg"
      icon="mdi-chevron-left"
    />

    <v-btn
      @click="next"
      elevation="0"
      class="mr-3"
      :style="buttonStyles"
      size="x-small"
      rounded="lg"
      icon="mdi-chevron-right"
    />

    <span
      class="text-capitalize"
      :style="{
        fontSize: '1.7rem',
        color: theme.global.current.value.colors['th-grey-800'],
      }"
    >
      {{ formattedDate }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import { storeToRefs } from 'pinia'
import { useCalendarStore } from '@/stores/calendarStore'

const calendarStore = useCalendarStore()
const { currentDate, currentView } = storeToRefs(calendarStore)
const theme = useTheme()

const emit = defineEmits<{
  (e: 'go-today'): void
  (e: 'go-prev'): void
  (e: 'go-next'): void
}>()

const prev = () => emit('go-prev')
const next = () => emit('go-next')
const setToCurrentDate = () => emit('go-today')

const formattedDate = computed(() => {
  return currentView.value === 'day'
    ? currentDate.value.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : currentDate.value.toLocaleDateString('es-AR', {
        month: 'long',
        year: 'numeric',
      })
})

const buttonStyles = computed(() => ({
  fontWeight: 'bold',
  color: theme.global.current.value.colors['on-background'],
  background: theme.global.current.value.colors.background,
  border: `1px solid ${theme.global.current.value.colors.border}`,
}))
</script>
