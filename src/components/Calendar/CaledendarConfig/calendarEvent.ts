import { computed } from 'vue'
import type { Ref } from 'vue'
import { darkenColor, lightenColor } from '@/utils/colorUtils'
import type { Turno, Calendar, FormattedEvent } from '@/interfaces/models'

export function useCalendarEvents(turnos: Ref<Turno[]>, consultorioFiltro: Ref<string[]>) {
  const consultoriosDisponibles = computed(() => {
    const set = new Set(turnos.value.map((t) => t.nombre_consultorio || 'Sin consultorio'))
    return Array.from(set)
  })

  const calendars = computed<Calendar[]>(() => {
    return consultoriosDisponibles.value.map((consultorio, index) => ({
      id: `consultorio-${index}`,
      name: consultorio,
    }))
  })

  const formattedEvents = computed<FormattedEvent[]>(() => {
    return turnos.value
      .filter((turno) => {
        if (consultorioFiltro.value.length === 0) return true
        return consultorioFiltro.value.includes(turno.nombre_consultorio || 'Sin consultorio')
      })
      .map((turno) => {
        const fechaHoraInicio = new Date(`${turno.fecha}T${turno.hora}`)
        const duracion = turno.duracion_tratamiento
        const fechaHoraFin = new Date(fechaHoraInicio.getTime() + duracion * 60000)
        const nombreConsultorio = turno.nombre_consultorio || 'Sin consultorio'
        const calendarId =
          calendars.value.find((c) => c.name === nombreConsultorio)?.id || 'consultorio-0'

        return {
          id: turno.id_turno.toString(),
          calendarId,
          title: `${turno.nombre_paciente} ${turno.apellido_paciente}`,
          body: turno.nombre_tratamiento,
          start: fechaHoraInicio,
          end: fechaHoraFin,
          category: 'time',
          isAllday: false,
          backgroundColor: lightenColor(turno.color_tratamiento, 0.4),
          dragBackgroundColor: darkenColor(turno.color_tratamiento, 0.3),
          color: darkenColor(turno.color_tratamiento, 0.6),
          borderColor: darkenColor(turno.color_tratamiento, 0.3),
          raw: {
            id_paciente: turno.id_paciente,
            id_consultorio: turno.id_consultorio,
            id_tratamiento: turno.id_tratamiento,
            estado: turno.estado,
          },
        }
      })
  })

  return {
    consultoriosDisponibles,
    calendars,
    formattedEvents,
  }
}
