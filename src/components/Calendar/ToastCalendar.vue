<template>
  <div class="calendar-container">
    <v-row class="controls-row" :style="rowStylesArriba">
      <!-- Contenido de la fila de controles -->
      <v-col
        cols="2"
        class="d-flex align-center justify-center"
        :style="{
          borderRight: `1px solid ${theme.global.current.value.colors.border}`,
        }"
      >
        <CrearButton @click="abrirDialogCrear" text="Nuevo Turno" />
      </v-col>
      <v-col cols="10" class="d-flex align-center justify-space-between" width="100%">
        <CalendarToolbar @go-prev="prev" @go-next="next" @go-today="setToCurrentDate" />
        <ViewSelector @view-changed="handleViewChange" @date-reset="setToCurrentDate" />
      </v-col>
    </v-row>

    <v-row class="calendar-content" :style="rowStylesAbajo">
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
      <v-col cols="10" class="pa-0 ma-0" style="max-height: 80vh; overflow: auto">
        <div v-show="mostrarCalendario" style="min-height: 100%">
          <tui-calendar
            v-show="currentView !== 'list'"
            ref="calendarRef"
            :class="['tui-calendar-basic', currentView]"
            :style="{
              '--border-color': theme.global.current.value.colors.border,
              '--background-list': theme.global.current.value.colors['background-list'],
              '--on-background': theme.global.current.value.colors.warning,
            }"
            :view="currentView"
            :calendars="calendars"
            :events="formattedEvents"
            :month="monthOptions"
            :template="calendarTemplate"
            :timezone="timezoneOptions"
            :week="weekOptions"
            :use-form-popup="false"
            :use-detail-popup="false"
            @selectDateTime="onCreateEvent"
            @beforeUpdateEvent="onUpdateEvent"
            @clickEvent="onClickEvent"
          />
          <AgendaCalendar
            v-show="currentView === 'list'"
            :currentDate="calendarStore.currentDate"
            @show-event="onClickEvent"
          />
        </div>
      </v-col>
    </v-row>
  </div>
  <DialogCrearEditar
    v-model="dialog.editar"
    :isEdit="isEdit"
    :consultorios="consultorios"
    :pacientes="pacientes"
    :turnoActivo="turnoActivo"
    @delete-turno="abrirDialogEliminar"
    @create-turno="guardarTurno"
    @cerrar="cerrarDialog"
  />
  <DialogEliminar
    v-model="dialog.eliminar"
    :entity="turnoActivo"
    entity-name="el turno"
    title="Eliminar Turno"
    confirm-text="Confirmar"
    @cerrar="cerrarDialog('eliminar')"
  />
</template>

<script lang="ts" setup>
// IMPORTS
import { storeToRefs } from 'pinia'
import { ref, onMounted, computed, watch } from 'vue'

// CALENDARIO
import TuiCalendar from 'toast-ui-calendar-vue3'
import 'toast-ui-calendar-vue3/styles.css'

// import { formatDate, formatTime } from '@/utils/formatDateTime'
import type { Turno } from '@/interfaces'
import { useCalendarOptions } from './CaledendarConfig/calendarOptions'

// COMPONENTS
import ViewSelector from './ViewSelector.vue'
import ChecklistFiltro from './ChecklistFiltro.vue'
import CrearButton from '../buttons/CrearButton.vue'
import DialogCrearEditar from './DialogCrearEditar.vue'
import CalendarToolbar from './CalendarToolbar.vue'
import DialogEliminar from '@/components/Dialogs/DialogEliminar.vue'
import AgendaCalendar from './AgendaCalendar.vue'

// Import theme
import { useTheme } from 'vuetify'

//Pinia
import { useCalendarStore } from '@/stores/calendarStore'
import { useCalendarEventsStore } from '@/stores/calendarEventsStore'
import { useConsultoriosStore } from '@/stores/consultoriosStores'
import { usePacientesStore } from '@/stores/pacientesStores'
import { createEventHandlers } from './CaledendarConfig/calendarEventHanlers'

const calendarStore = useCalendarStore()
const eventsStore = useCalendarEventsStore()
const consultorioStore = useConsultoriosStore()
const pacientesStore = usePacientesStore()

// STORE ACCIONES
const { currentView, calendarRef, calendarInstance } = storeToRefs(calendarStore)
const { prev, next, setToCurrentDate, handleViewChange } = calendarStore

const { consultorios } = storeToRefs(consultorioStore)
const { consultoriosDisponibles, calendars, formattedEvents, consultorioFiltro } =
  storeToRefs(eventsStore)
const { pacientes } = storeToRefs(pacientesStore)

// CONFIG CALENDARIO

const theme = useTheme()
// Configuraciones de calendario
const { timezoneOptions, monthOptions, weekOptions, myTheme, calendarTemplate } =
  useCalendarOptions()

// Datos reactivos
const dialog = ref({
  editar: false,
  eliminar: false,
})
const isEdit = ref(false)
const turnoActivo = ref<Turno>({
  id_turno: null,
  id_paciente: null,
  id_consultorio: null,
  id_tratamiento: null,
  fecha: '',
  hora: '',
  nombre_consultorio: '',
  nombre_tratamiento: '',
  duracion_tratamiento: null,
  estado: '',
  nombre_paciente: '',
  apellido_paciente: '',
  costo_tratamiento: null,
  color_tratamiento: '',
})

// Métodos

const guardarTurno = async (turno: Turno) => {
  try {
    if (isEdit.value) {
      await eventsStore.actualizarTurno(turno)
    } else {
      await eventsStore.agregarTurno(turno)
    }
    // Mostrar notificación de éxito
    // showSuccessNotification(
    //   isEdit.value ? 'Turno actualizado correctamente' : 'Turno creado correctamente',
    // )

    // Cerrar el diálogo o resetear el formulario
    dialog.value.editar = false

    // Recargar los turnos si es necesario
    await eventsStore.fetchTurnos()
  } catch (error) {
    console.error('Error al guardar turno:', error)
    // showErrorNotification(isEdit.value ? 'Error al actualizar el turno' : 'Error al crear el turno')
  }
}

const abrirDialogCrear = () => {
  dialog.value.editar = true
  isEdit.value = false
}
const abrirDialogEliminar = (turno: Turno) => {
  turnoActivo.value = turno
  dialog.value.eliminar = true
}
const cerrarDialog = (tipo?: 'editar' | 'eliminar') => {
  if (!tipo) {
    dialog.value = { editar: false, eliminar: false }
    return
  }
  dialog.value[tipo] = false
}
const { onClickEvent, onCreateEvent, onUpdateEvent } = createEventHandlers(
  turnoActivo,
  isEdit,
  dialog,
)

// const onClickEvent = (clickedEvent: Evento) => {
//   // ✅ Si viene envuelto en { event: {...} }, usá ese
//   const realEvent = clickedEvent.event || clickedEvent

//   const fullEvent = formattedEvents.value.find((e) => e.id === realEvent.id)

//   if (!fullEvent) {
//     console.error('Evento no encontrado en formattedEvents', realEvent)
//     return
//   }

//   const raw = fullEvent.raw as {
//     id_paciente: number | null
//     id_consultorio: number | null
//     id_tratamiento: number | null
//     estado: string
//     nombre_paciente: string
//     apellido_paciente: string
//     costo_tratamiento: number | null
//   }

//   const startDate = fullEvent.start instanceof Date ? fullEvent.start : new Date(fullEvent.start)
//   const endDate = fullEvent.end instanceof Date ? fullEvent.end : new Date(fullEvent.end)

//   const durationMinutes =
//     endDate && startDate ? (endDate.getTime() - startDate.getTime()) / 60000 : 0

//   const formatDate = (date: Date) => date.toISOString().split('T')[0]
//   const formatTime = (date: Date) => date.toTimeString().slice(0, 5)

//   turnoActivo.value = {
//     id_turno: parseInt(fullEvent.id),
//     id_paciente: raw.id_paciente,
//     id_consultorio: raw.id_consultorio,
//     id_tratamiento: raw.id_tratamiento,
//     fecha: formatDate(startDate),
//     hora: formatTime(startDate),
//     nombre_tratamiento: fullEvent.body,
//     color_tratamiento: fullEvent.backgroundColor,
//     duracion_tratamiento: durationMinutes,
//     nombre_consultorio: calendars.value.find((c) => c.id === fullEvent.calendarId)?.name || '',
//     estado: raw.estado,
//     nombre_paciente: raw.nombre_paciente,
//     apellido_paciente: raw.apellido_paciente,
//     costo_tratamiento: raw.costo_tratamiento,
//   }

//   // console.log('Turno activo:', turnoActivo.value)

//   isEdit.value = true
//   dialog.value.editar = true
// }

// const onCreateEvent = (eventData: Evento) => {
//   console.log('Evento creado:', eventData) // Verifica que se imprima el evento

//   if (!eventData) {
//     console.error('No se recibió eventData')
//     return
//   }

//   const { start, calendarId, id_consultorio } = eventData
//   const dateStart = start instanceof Date ? start : new Date(start)
//   const fecha = dateStart.toISOString().split('T')[0]
//   const hora = dateStart.toTimeString().slice(0, 5)

//   console.log('fecha', fecha)
//   const consultorio = calendars.value.find((c) => c.id === calendarId)?.name

//   turnoActivo.value = {
//     fecha: fecha,
//     hora: hora,
//     id_consultorio,
//     estado: 'pendiente',
//     id_paciente: null,
//     id_tratamiento: null,
//     nombre_consultorio: consultorio,
//     nombre_tratamiento: '',
//     duracion_tratamiento: null,
//     nombre_paciente: '',
//     apellido_paciente: '',
//     costo_tratamiento: null,
//     color_tratamiento: '',
//     id_turno: null,
//   }

//   dialog.value.editar = true
//   isEdit.value = true
// }

// const onUpdateEvent = async (updateData: { event: Evento; changes: Partial<Evento> }) => {
//   const { event, changes } = updateData

//   try {
//     const originalEvent = formattedEvents.value.find((e) => e.id === event.id)
//     if (!originalEvent) {
//       console.error('Event not found for update:', event)
//       return
//     }

//     const updatedEvent = {
//       ...originalEvent,
//       ...changes,
//     }

//     if (!updatedEvent.raw) {
//       updatedEvent.raw = originalEvent.raw || {}
//     }

//     // Cast raw

//     const raw = updatedEvent.raw as {
//       id_paciente: number | null
//       id_consultorio: number | null
//       id_tratamiento: number | null
//       estado: string
//       nombre_paciente: string
//       apellido_paciente: string
//       costo_tratamiento: number | null
//     }

//     const startDate = new Date(updatedEvent.start as string | Date)
//     const endDate = new Date(updatedEvent.end as string | Date)

//     const durationMinutes = (endDate.getTime() - startDate.getTime()) / 60000

//     const turnoToUpdate: Turno = {
//       id_turno: parseInt(updatedEvent.id),
//       id_paciente: raw.id_paciente,
//       id_consultorio: raw.id_consultorio,
//       id_tratamiento: raw.id_tratamiento,
//       fecha: startDate.toISOString().split('T')[0],
//       hora: startDate.toTimeString().slice(0, 5),
//       nombre_tratamiento: updatedEvent.body,
//       color_tratamiento: updatedEvent.backgroundColor,
//       duracion_tratamiento: durationMinutes,
//       nombre_consultorio: calendars.value.find((c) => c.id === updatedEvent.calendarId)?.name || '',
//       estado: raw.estado || 'pendiente',
//       nombre_paciente: raw.nombre_paciente || '',
//       apellido_paciente: raw.apellido_paciente || '',
//       costo_tratamiento: raw.costo_tratamiento || null,
//     }

//     await eventsStore.actualizarTurno(turnoToUpdate)
//     await eventsStore.fetchTurnos()
//   } catch (error) {
//     console.error('Error updating event:', error)
//   }
// }

// STYLES CALENDARIO

const rowStylesAbajo = computed(() => ({
  borderBottom: `1px solid ${theme.global.current.value.colors.border}`,
  borderLeft: `1px solid ${theme.global.current.value.colors.border}`,
  borderRight: `1px solid ${theme.global.current.value.colors.border}`,
  borderRadius: ' 0 0 10px 10px',
  width: '93vw',
  margin: '0 auto',
}))

const rowStylesArriba = computed(() => ({
  color: theme.global.current.value.colors['on-background'],
  backgroundColor: theme.global.current.value.colors.background,
  border: `1px solid ${theme.global.current.value.colors.border}`,
  borderRadius: '10px 10px 0 0',
  width: '93vw',
  margin: '0 auto',
}))

const mostrarCalendario = ref(false)

watch(myTheme, (nuevoTema) => {
  if (calendarInstance.value) {
    const editableTheme = JSON.parse(JSON.stringify(nuevoTema))
    calendarInstance.value.setTheme(editableTheme)
  }
})
// Hooks
onMounted(async () => {
  await consultorioStore.cargarDatos()
  await eventsStore.fetchTurnos()
  await pacientesStore.fetchPacientes()
  const editableTheme = JSON.parse(JSON.stringify(myTheme.value))
  calendarInstance.value.setTheme(editableTheme)
  // console.log('consultorioFiltro', eventsStore.fetchTurnos())
  mostrarCalendario.value = true
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
  min-height: 100%;
  height: auto;
  box-sizing: border-box;
}

.tui-calendar-basic.month {
  position: relative;
  height: 150vh;
}

.tui-calendar-basic.week {
  height: 300vh;
}

.tui-calendar-basic.day {
  height: 300vh;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style>
.toastui-calendar-see-more-container {
  position: fixed !important; /* o absolute si depende de un contenedor */
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  z-index: 9999;

  .toastui-calendar-see-more {
    border-radius: 1rem;
    padding: 0.5rem 1rem 2.5rem 1rem;

    .toastui-calendar-see-more-header {
      text-align: center;
      font-size: 1.5rem;
    }
    .toastui-calendar-popup-button.toastui-calendar-popup-close {
      background-color: transparent !important;
      top: 0 !important;
      right: 5px !important;
      width: 30px !important;
      height: 30px !important;
      border-radius: 50% !important;

      .toastui-calendar-template-monthMoreClose {
        button {
          font-size: 1.4rem;
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 50%;
          background-color: transparent;
          cursor: pointer;
          transition: background-color 0.2s ease;

          &:hover {
            background-color: var(--hover-bg, #222);
          }
        }
      }
    }
  }
}

.toastui-calendar-daygrid-cell + .toastui-calendar-daygrid-cell {
  border-left: var(--border-color) 0.1px solid !important;
}
.toastui-calendar-month-week-item:last-child {
  .toastui-calendar-daygrid-cell {
    border-bottom: var(--border-color) 0.1px solid !important;
  }
}

.toastui-calendar-grid-cell-date
  .toastui-calendar-weekday-grid-date.toastui-calendar-weekday-grid-date-decorator {
  border: 1px solid var(--on-background) !important;
  background-color: var(--background-list) !important;
  color: var(--on-background) !important;
}

.toastui-calendar-weekday-event {
  .toastui-calendar-weekday-event {
    border-radius: 0.8rem 0.8rem 0.8rem 0.8rem !important;
    background-color: var(--bg-color) !important;
    font-size: 0.75rem;
    line-height: 1rem;
    padding: 0;
    div {
      padding: 2px 4px !important;
    }
  }
  .toastui-calendar-weekday-event-dot {
    display: none;
  }
  .toastui-calendar-weekday-resize-handle.toastui-calendar-handle-y {
    display: none;
  }
}
</style>
