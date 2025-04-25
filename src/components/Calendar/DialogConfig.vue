<template>
  <v-navigation-drawer
    v-model="dialog"
    :hide-overlay="true"
    absolute
    temporary
    location="right"
    expand-on-hover
    close-delay="100"
    scrim="#00000000"
    width="350"
    transition="slide-x-reverse-transition"
    :style="{ overflow: 'visible', zIndex: '2000', top: '0', height: '100%' }"
  >
    <v-toolbar
      :style="{
        backgroundColor: theme.global.current.value.colors.background,
        borderBottom: `1px solid ${theme.global.current.value.colors.border}`,
        paddingLeft: '15px',
        paddingTop: '5px',
        height: '70px',
      }"
    >
      <div class="mr-1">
        <span
          :style="{ color: theme.global.current.value.colors['on-background'], fontSize: '20px' }"
          >Configurar calendario</span
        >
        <br />
        <span
          :style="{ color: theme.global.current.value.colors['on-background'], fontSize: '14px' }"
          >Personalizar y Previsualizar en Tiempo Real</span
        >
      </div>
      <v-btn icon dark @click="cerrarDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <div class="pa-4 mt-10">
      <v-select
        class="high-z-index-menu"
        v-model="workweek"
        :items="booleanOptions"
        item-title="title"
        item-value="value"
        variant="outlined"
        label="Mostrar solo días hábiles"
        content-class="menu-z"
      ></v-select>

      <v-select
        v-model="narrowWeekend"
        :items="booleanOptions"
        label="Fin de semana angosto"
        dense
        variant="outlined"
        attach="body"
      ></v-select>

      <div :style="{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem' }">
        <v-select
          v-model="horainicio"
          :items="horas"
          label="Hora de inicio"
          variant="outlined"
          dense
        ></v-select>

        <v-select
          v-model="horafin"
          :items="horas"
          label="Hora de fin"
          variant="outlined"
          dense
        ></v-select>
      </div>

      <v-slider
        v-model="calendarHeight"
        :min="100"
        :max="400"
        :step="25"
        label="Tamaño de intervalo"
        thumb-label="always"
        @end="saveCalendarHeight"
      />
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue'
import { useTheme } from 'vuetify'
import { useCalendarStore } from '@/stores/calendarStore'

const calendarStore = useCalendarStore()

const calendarHeight = computed({
  get: () => parseInt(calendarStore.calendarHeight) || 300, // Ej: "300vh" -> 300
  set: (val) => calendarStore.setCalendarHeight(`${val}vh`), // Ej: 350 -> "350vh"
})

const saveCalendarHeight = () => {
  localStorage.setItem('calendar_height', calendarStore.calendarHeight)
  calendarStore.updateCalendarHeight()
}

const horas = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

const horainicio = computed({
  get: () => calendarStore.horainicio,
  set: (val) => (calendarStore.horainicio = val),
})

const horafin = computed({
  get: () => calendarStore.horafin,
  set: (val) => (calendarStore.horafin = val),
})

const workweek = computed({
  get: () => calendarStore.workweek,
  set: (val) => (calendarStore.workweek = val),
})

const narrowWeekend = computed({
  get: () => calendarStore.narrowWeekend,
  set: (val) => (calendarStore.narrowWeekend = val),
})

const booleanOptions = [
  { title: 'Sí', value: true },
  { title: 'No', value: false },
]

const theme = useTheme()
const props = defineProps<{
  dialog: boolean
}>()

const { dialog } = toRefs(props)

const emit = defineEmits(['cerrar'])

const cerrarDialog = () => {
  emit('cerrar')
}
</script>

<style scoped></style>
<style>
.menu-z {
  z-index: 9999 !important;
}
</style>
