<template>
  <div class="calendar-container">
    <v-row
      class="controls-row"
      :style="{
        color: theme.global.current.value.colors['on-background'],
        backgroundColor: theme.global.current.value.colors.background,
        border: `1px solid ${theme.global.current.value.colors.border}`,
        borderRadius: '10px 10px 0 0',
        width: '93vw',
        margin: '0 auto',
      }"
    >
      <!-- Contenido de la fila de controles -->
      <v-col
        cols="2"
        class="d-flex align-center justify-center"
        :style="{
          borderRight: `1px solid ${theme.global.current.value.colors.border}`,
        }"
      >
        <v-btn
          @click="handleCreateTurno"
          elevation="0"
          :style="{
            background: theme.global.current.value.colors.primary,
            color: theme.global.current.value.colors['on-primary'],
          }"
        >
          Nuevo Turno
        </v-btn>
      </v-col>
      <v-col cols="10" class="d-flex align-center justify-space-between" width="100%">
        <div class="d-flex align-center">
          <v-btn
            @click="setToCurrentDate"
            elevation="0"
            class="mr-3"
            :style="{
              fontWeight: 'bold',
              color: theme.global.current.value.colors['on-background'],
              background: theme.global.current.value.colors.background,
              border: `1px solid ${theme.global.current.value.colors.border}`,
            }"
            >Hoy</v-btn
          >
          <v-btn
            @click="prev"
            class="mr-1"
            :style="{
              color: theme.global.current.value.colors['on-background'],
              background: theme.global.current.value.colors.background,
              fontWeight: 'bold',
              border: `1px solid ${theme.global.current.value.colors.border}`,
            }"
            elevation="0"
            size="x-small"
            rounded="lg"
            icon="mdi-chevron-left"
          ></v-btn>
          <v-btn
            @click="next"
            elevation="0"
            class="mr-3"
            :style="{
              color: theme.global.current.value.colors['on-background'],
              background: theme.global.current.value.colors.background,
              fontWeight: 'bold',
              border: `1px solid ${theme.global.current.value.colors.border}`,
            }"
            size="x-small"
            rounded="lg"
            icon="mdi-chevron-right"
          ></v-btn>
          <span class="text-capitalize">
            {{
              currentView === 'day'
                ? currentDate.toLocaleDateString('es-AR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : currentDate.toLocaleDateString('es-AR', {
                    month: 'long',
                    year: 'numeric',
                  })
            }}
          </span>
        </div>

        <ViewSelector @view-changed="handleViewChange" @date-reset="setToCurrentDate" />
      </v-col>
    </v-row>

    <v-row
      class="calendar-content"
      :style="{
        borderBottom: `1px solid ${theme.global.current.value.colors.border}`,
        borderLeft: `1px solid ${theme.global.current.value.colors.border}`,
        borderRight: `1px solid ${theme.global.current.value.colors.border}`,
        borderRadius: ' 0 0 10px 10px',
        width: '93vw',
        margin: '0 auto',
      }"
    >
      <v-col
        cols="2"
        :style="{ borderRight: `1px solid ${theme.global.current.value.colors.border}` }"
      >
        <ChecklistFiltro
          v-model="consultorioFiltro"
          :items="consultoriosDisponibles.map((c) => ({ text: c, value: c }))"
          class="filtro-consultorios"
        />
      </v-col>
      <v-col cols="10" class="pa-0">
        <tui-calendar
          ref="calendarRef"
          class="tui-calendar-basic"
          :view="currentView"
          :calendars="calendars"
          :events="formattedEvents"
          :month="monthOptions"
          :timezone="timezoneOptions"
          :week="weekOptions"
          :use-form-popup="true"
          :use-detail-popup="true"
          @beforeCreateEvent="onCreateEvent"
          @beforeUpdateEvent="onUpdateEvent"
          @beforeDeleteEvent="onDeleteEvent"
          @clickEvent="onClickEvent"
        />
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts" setup>
// IMPORTS
import { ref, onMounted, watch } from 'vue'
import { useTheme } from 'vuetify'
import TuiCalendar from 'toast-ui-calendar-vue3'
import 'toast-ui-calendar-vue3/styles.css'
import {
  Turno,
  Consultorio,
  Tratamiento,
  Paciente,
  ViewType,
  Evento,
} from '../../interfaces/models'
import { formatDate, formatTime } from '@/utils/formatDateTime'

// CONFIG CALENDARIO
import { useCalendarEvents } from './CaledendarConfig/calendarEvent'
import { useCalendarActions } from './CaledendarConfig/calendarAccions'
import { useCalendarOptions } from './CaledendarConfig/calendarOptions'
import { useService } from './CaledendarConfig/useServices'

// COMPONENTS
import ViewSelector from './ViewSelector.vue'
import ChecklistFiltro from './ChecklistFiltro.vue'

const theme = useTheme()

// Datos reactivos
const dialog = ref(false)
const isEdit = ref(false)
const calendarRef = ref()
const currentDate = ref(new Date())
const turnos = ref<Turno[]>([])
const currentView = ref<ViewType>('month')
const consultorioFiltro = ref<string[]>([])
const nuevoTurno = ref<Turno>()
const pacientes = ref<Paciente[]>([])
const consultorios = ref<Consultorio[]>([])
const tratamientosDisponibles = ref<Tratamiento[]>([])
const tratamientoSeleccionado = ref({
  duracion: null as number | null,
  costo: null as number | null,
})

// Lógica de calendario
const { consultoriosDisponibles, calendars, formattedEvents } = useCalendarEvents(
  turnos,
  consultorioFiltro,
)
// Acciones de calendario}
const { prev, next, setToCurrentDate, handleViewChange } = useCalendarActions(
  calendarRef,
  currentDate,
  currentView,
)
// Configuraciones de calendario
const { timezoneOptions, monthOptions, weekOptions } = useCalendarOptions()

// Servicios
const { cargarTurnos, cargarPacientes, fetchConsultoriosyTratamientos } = useService(
  pacientes,
  turnos,
  consultorios,
  isEdit,
  nuevoTurno,
  tratamientosDisponibles,
  tratamientoSeleccionado,
)

// Métodos

const onClickEvent = (clickedEvent: Evento) => {
  const fullEvent = formattedEvents.value.find((e) => e.id === clickedEvent.event.id)

  if (!fullEvent) {
    console.error('Evento no encontrado en formattedEvents', clickedEvent)
    return
  }

  // 2. Extrae/calcula los datos necesarios
  const durationMinutes =
    fullEvent.end && fullEvent.start
      ? (new Date(fullEvent.end).getTime() - new Date(fullEvent.start).getTime()) / 60000
      : 0

  // 3. Estructura los datos para showEvent
  showEvent({
    id_turno: parseInt(fullEvent.id),
    start: fullEvent.start,
    end: fullEvent.end,
    title: fullEvent.title,
    id_paciente: fullEvent.raw?.id_paciente as number,
    id_consultorio: fullEvent.raw?.id_consultorio as number,
    id_tratamiento: fullEvent.raw?.id_tratamiento as number,
    nombre_tratamiento: fullEvent.body,
    color_tratamiento: fullEvent.backgroundColor,
    duracion_tratamiento: durationMinutes,
    nombre_consultorio: calendars.value.find((c) => c.id === fullEvent.calendarId)?.name,
  })
}

const showEvent = (turno: Evento) => {
  console.log('Datos completos del turno:', turno)
  // Abrir modal, guardar en store, etc.
}

const onCreateEvent = (eventData: any) => {
  const { title, start, end, calendarId } = eventData
  const consultorio = calendars.value.find((c) => c.id === calendarId)?.name

  nuevoTurno.value = {
    fecha: formatDate(start),
    hora: formatTime(start),
    id_consultorio:
      consultorios.value.find((c) => c.nombre === consultorio)?.id_consultorio || null,
    estado: 'pendiente',
  }

  // Aquí puedes abrir tu diálogo de creación de turno
  dialog.value = true
}

const onUpdateEvent = ({ event, changes }: { event: any; changes: any }) => {
  const turnoActualizado = {
    id_turno: parseInt(event.id),
    fecha: formatDate(changes.start || event.start),
    hora: formatTime(changes.start || event.start),
    id_consultorio: event.raw.id_consultorio,
    id_tratamiento: event.raw.id_tratamiento,
    id_paciente: event.raw.id_paciente,
    estado: event.raw.estado,
  }

  updateTurno(turnoActualizado)
}

const onDeleteEvent = (eventData: any) => {
  if (confirm('¿Estás seguro de eliminar este turno?')) {
    eliminarTurno(parseInt(eventData.id))
  }
}
// - createTurno/updateTurno/eliminarTurno
// const guardarTurno = () => {
//   if (isEdit.value) {
//     updateTurno(nuevoTurno.value)
//   } else {
//     createTurno(nuevoTurno.value)
//   }
// }

// const createTurno = async (turno: Turno) => {
//   try {
//     await axios.post('/turnos', turno)
//     await cargarTurnos()
//     dialog.value = false
//   } catch (error: any) {
//     const errorMessage = error.response?.data?.message || 'Error al crear el turno.'
//     console.error(errorMessage)
//   }
// }

// const updateTurno = async (turno: Turno) => {
//   try {
//     await axios.put(`/turnos/${turno.id_turno}`, turno)
//     await cargarTurnos()
//     dialog.value = false
//   } catch (error: any) {
//     const errorMessage = error.response?.data?.message || 'Error al actualizar el turno.'
//     console.error(errorMessage)
//   }
// }

// const eliminarTurno = async () => {
//   if (nuevoTurno.value.id_turno) {
//     try {
//       await axios.delete(`/turnos/${nuevoTurno.value.id_turno}`)
//       await cargarTurnos()
//       dialog.value = false
//     } catch (error) {
//       console.error('Error al eliminar el turno:', error)
//     }
//   }
//   elimiarTurno.value = false
// }
// // - handleCreateTurno/showEvent
// const handleCreateTurno = () => {
//   isEdit.value = false
//   dialog.value = true
// }

// Hooks
onMounted(async () => {
  await fetchConsultoriosyTratamientos()
  await cargarTurnos()
  await cargarPacientes()
})

watch(turnos, () => {
  // Actualizar automáticamente cuando cambian los turnos
})
</script>

<style scoped>
.calendar-container {
  width: 93vw;
  margin: 0 auto; /* Centra el contenedor */
}

.controls-row {
  margin-bottom: 16px; /* Espacio entre controles y calendario */
}

.calendar-content {
  width: 100%;
}

.tui-calendar-basic {
  width: 100%;
  height: 100vh;
}
</style>

<style></style>
