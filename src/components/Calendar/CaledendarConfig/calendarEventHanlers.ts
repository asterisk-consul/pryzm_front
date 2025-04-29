// calendarEventHandlers.ts
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { Turno, Evento } from '@/interfaces'
import { useCalendarEventsStore } from '@/stores/calendarEventsStore'
// import { useCalendarStore } from '@/stores/calendarStore'

export const createEventHandlers = (
  turnoActivo: Ref<Turno>,
  isEdit: Ref<boolean>,
  dialog: Ref<{ editar: boolean; eliminar: boolean }>,
) => {
  // const calendarStore = useCalendarStore()
  const eventsStore = useCalendarEventsStore()
  const { formattedEvents, calendars } = storeToRefs(eventsStore)

  const onClickEvent = (clickedEvent: Evento) => {
    const realEvent = clickedEvent.event || clickedEvent
    const fullEvent = formattedEvents.value.find((e) => e.id === realEvent.id)

    if (!fullEvent) {
      console.error('Evento no encontrado en formattedEvents', realEvent)
      return
    }

    const raw = fullEvent.raw as {
      id_paciente: number | null
      id_consultorio: number | null
      id_tratamiento: number | null
      estado: string
      nombre_paciente: string
      apellido_paciente: string
      costo_tratamiento: number | null
    }

    const startDate = fullEvent.start instanceof Date ? fullEvent.start : new Date(fullEvent.start)
    const endDate = fullEvent.end instanceof Date ? fullEvent.end : new Date(fullEvent.end)

    const durationMinutes =
      endDate && startDate ? (endDate.getTime() - startDate.getTime()) / 60000 : 0

    const formatDate = (date: Date) => date.toISOString().split('T')[0]
    const formatTime = (date: Date) => date.toTimeString().slice(0, 5)

    turnoActivo.value = {
      id_turno: parseInt(fullEvent.id),
      id_paciente: raw.id_paciente,
      id_consultorio: raw.id_consultorio,
      id_tratamiento: raw.id_tratamiento,
      fecha: formatDate(startDate),
      hora: formatTime(startDate),
      nombre_tratamiento: fullEvent.body,
      color_tratamiento: fullEvent.backgroundColor,
      duracion_tratamiento: durationMinutes,
      nombre_consultorio: calendars.value.find((c) => c.id === fullEvent.calendarId)?.name || '',
      estado: raw.estado,
      nombre_paciente: raw.nombre_paciente,
      apellido_paciente: raw.apellido_paciente,
      costo_tratamiento: raw.costo_tratamiento,
    }

    isEdit.value = true
    dialog.value.editar = true
  }

  const onCreateEvent = (eventData: Evento) => {
    if (!eventData) {
      console.error('No se recibió eventData')
      return
    }

    const { start, calendarId, id_consultorio } = eventData
    const dateStart = start instanceof Date ? start : new Date(start)
    const fecha = dateStart.toISOString().split('T')[0]
    const hora = dateStart.toTimeString().slice(0, 5)

    const consultorio = calendars.value.find((c) => c.id === calendarId)?.name

    turnoActivo.value = {
      fecha: fecha,
      hora: hora,
      id_consultorio,
      estado: 'pendiente',
      id_paciente: null,
      id_tratamiento: null,
      nombre_consultorio: consultorio,
      nombre_tratamiento: '',
      duracion_tratamiento: null,
      nombre_paciente: '',
      apellido_paciente: '',
      costo_tratamiento: null,
      color_tratamiento: '',
      id_turno: null,
    }

    dialog.value.editar = true
    isEdit.value = true
  }

  const onUpdateEvent = async (updateData: { event: Evento; changes: Partial<Evento> }) => {
    const { event, changes } = updateData

    try {
      const originalEvent = formattedEvents.value.find((e) => e.id === event.id)
      if (!originalEvent) {
        console.error('Event not found for update:', event)
        return
      }

      const updatedEvent = {
        ...originalEvent,
        ...changes,
      }

      if (!updatedEvent.raw) {
        updatedEvent.raw = originalEvent.raw || {}
      }

      const raw = updatedEvent.raw as {
        id_paciente: number | null
        id_consultorio: number | null
        id_tratamiento: number | null
        estado: string
        nombre_paciente: string
        apellido_paciente: string
        costo_tratamiento: number | null
      }

      const startDate = new Date(updatedEvent.start as string | Date)
      const endDate = new Date(updatedEvent.end as string | Date)

      const durationMinutes = (endDate.getTime() - startDate.getTime()) / 60000

      const turnoToUpdate: Turno = {
        id_turno: parseInt(updatedEvent.id),
        id_paciente: raw.id_paciente,
        id_consultorio: raw.id_consultorio,
        id_tratamiento: raw.id_tratamiento,
        fecha: startDate.toISOString().split('T')[0],
        hora: startDate.toTimeString().slice(0, 5),
        nombre_tratamiento: updatedEvent.body,
        color_tratamiento: updatedEvent.backgroundColor,
        duracion_tratamiento: durationMinutes,
        nombre_consultorio:
          calendars.value.find((c) => c.id === updatedEvent.calendarId)?.name || '',
        estado: raw.estado || 'pendiente',
        nombre_paciente: raw.nombre_paciente || '',
        apellido_paciente: raw.apellido_paciente || '',
        costo_tratamiento: raw.costo_tratamiento || null,
      }

      await eventsStore.actualizarTurno(turnoToUpdate)
      await eventsStore.fetchTurnos()
    } catch (error) {
      console.error('Error updating event:', error)
    }
  }

  return {
    onClickEvent,
    onCreateEvent,
    onUpdateEvent,
  }
}
