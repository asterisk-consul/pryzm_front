import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { darkenColor, lightenColor } from '@/utils/colorUtils'
import { useServiceTurnos } from '@/services/turnosServices'
import { isAxiosError } from 'axios'
import type { Turno } from '@/interfaces/turnosInterface'
import type { Calendar, Evento } from '@/interfaces/calendarInterface'

export const useCalendarEventsStore = defineStore('calendarEvents', () => {
  // Estado
  const turnos = ref<Turno[]>([])
  const consultorioFiltro = ref<string[]>([])
  const isLoading = ref(false)
  const fetchError = ref<string | null>(null)
  const turnosService = useServiceTurnos()
  const currentMonth = ref<number>(new Date().getMonth())
  const currentYear = ref<number>(new Date().getFullYear())

  function setCurrentMonth(month: number) {
    currentMonth.value = month
  }

  function setCurrentYear(year: number) {
    currentYear.value = year
  }

  function navigateMonth(offset: number) {
    const newDate = new Date(currentYear.value, currentMonth.value + offset)
    currentMonth.value = newDate.getMonth()
    currentYear.value = newDate.getFullYear()
  }
  // Getters computados
  const consultoriosDisponibles = computed(() => {
    const consultoriosUnicos = new Set(
      turnos.value.map((t) => t.nombre_consultorio).filter(Boolean), // Filtra valores nulos/undefined
    )
    return Array.from(consultoriosUnicos).length > 0
      ? Array.from(consultoriosUnicos)
      : ['Sin consultorio']
  })

  const eventsForMonth = computed(() => {
    return formattedEvents.value.filter((event) => {
      const eventDate = new Date(event.start)
      return (
        eventDate.getMonth() === currentMonth.value && eventDate.getFullYear() === currentYear.value
      )
    })
  })
  const calendars = computed<Calendar[]>(() => {
    return consultoriosDisponibles.value.map((consultorio, index) => ({
      id: `consultorio-${index}`,
      name: consultorio,
      color: getColorForConsultorio(consultorio), // Función para asignar colores
    }))
  })

  const formattedEvents = computed<Evento[]>(() => {
    return turnos.value
      .filter((turno) => shouldDisplayTurno(turno))
      .map((turno) => formatTurnoToEvent(turno))
      .filter((event): event is Evento => event !== null)
  })

  // Acciones
  async function agregarTurno(turno: Turno) {
    try {
      isLoading.value = true
      const nuevoTurno = await turnosService.guardarTurno(turno)
      turnos.value.push(nuevoTurno)
      return nuevoTurno
    } catch (error) {
      console.error('Error al agregar turno:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function actualizarTurno(turno: Turno) {
    try {
      if (!turno.id_turno) throw new Error('ID de turno no proporcionado')

      isLoading.value = true
      const turnoActualizado = await turnosService.updateTurno(turno.id_turno, turno)

      // Actualiza el turno en el array
      const index = turnos.value.findIndex((t) => t.id_turno === turno.id_turno)
      if (index !== -1) {
        turnos.value[index] = turnoActualizado
      }

      return turnoActualizado
    } catch (error) {
      console.error('Error al actualizar turno:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function fetchTurnos() {
    isLoading.value = true
    fetchError.value = null
    try {
      const datos = await turnosService.getCalendarTurnos()
      console.log('Turnos obtenidos:', datos)
      turnos.value = Array.isArray(datos) ? datos : []
    } catch (error: unknown) {
      handleFetchError(error)
    } finally {
      isLoading.value = false
    }
  }

  function setConsultorioFiltro(filtro: string[]) {
    consultorioFiltro.value = filtro
  }

  // Helpers
  function shouldDisplayTurno(turno: Turno): boolean {
    if (consultorioFiltro.value.length === 0) return true
    const consultorio = turno.nombre_consultorio || 'Sin consultorio'
    return consultorioFiltro.value.includes(consultorio)
  }

  function formatTurnoToEvent(turno: Turno): Evento | null {
    try {
      // Add null checks for required fields
      if (!turno?.fecha || !turno?.hora) {
        console.warn('Turno sin fecha u hora:', turno)
        return null
      }

      // Safe date formatting
      const fechaFormateada =
        typeof turno.fecha === 'string' && turno.fecha.includes('T')
          ? turno.fecha.split('T')[0]
          : turno.fecha

      // Safe time formatting
      let horaFormateada = turno.hora
      if (typeof turno.hora === 'string') {
        horaFormateada = turno.hora.includes(':')
          ? turno.hora
          : `${turno.hora.slice(0, 2)}:${turno.hora.slice(2)}`
      }

      // Validate and create date
      const fechaHoraStr = `${fechaFormateada}T${horaFormateada}`
      const fechaHoraInicio = new Date(fechaHoraStr)

      if (isNaN(fechaHoraInicio.getTime())) {
        console.warn('Fecha/hora inválida:', fechaHoraStr)
        return null
      }

      // Duration handling
      const duracion = turno.duracion_tratamiento || 30
      const fechaHoraFin = new Date(fechaHoraInicio.getTime() + duracion * 60000)

      // Calendar ID resolution
      const nombreConsultorio = turno.nombre_consultorio || 'Sin consultorio'
      const calendarId =
        calendars.value.find((c) => c.name === nombreConsultorio)?.id || 'consultorio-0'
      const colorBase = turno.color_tratamiento || getColorForConsultorio(nombreConsultorio)

      return {
        id: turno.id_turno?.toString() || '',
        calendarId,
        title:
          `${turno.nombre_paciente || ''} ${turno.apellido_paciente || ''}`.trim() || 'Nuevo turno',
        body: turno.nombre_tratamiento || 'Sin tratamiento',
        start: fechaHoraInicio,
        end: fechaHoraFin,
        category: 'time',
        isAllday: false,
        backgroundColor: lightenColor(colorBase, 0.4),
        dragBackgroundColor: darkenColor(colorBase, 0.3),
        color: darkenColor(colorBase, 0.6),
        borderColor: darkenColor(colorBase, 0.3),
        raw: {
          id_paciente: turno.id_paciente,
          id_consultorio: turno.id_consultorio,
          id_tratamiento: turno.id_tratamiento,
          estado: turno.estado,
          nombre_paciente: turno.nombre_paciente,
          apellido_paciente: turno.apellido_paciente,
          costo_tratamiento: turno.costo_tratamiento,
        },
      }
    } catch (error) {
      console.error('Error formateando turno:', turno, error)
      return null
    }
  }
  function handleFetchError(error: unknown) {
    if (isAxiosError(error)) {
      fetchError.value = error.response?.data?.message || error.message
    } else {
      fetchError.value = 'Error desconocido al obtener turnos'
    }
    console.error('Error fetching turnos:', error)
    turnos.value = [] // Limpiar en caso de error
  }

  function getColorForConsultorio(consultorio: string): string {
    // Puedes implementar una lógica para asignar colores únicos por consultorio
    const colors = ['#4b90ff', '#ff7043', '#66bb6a', '#ffa726', '#26c6da']
    const index = consultoriosDisponibles.value.indexOf(consultorio) % colors.length
    return colors[index]
  }
  // dashboard 
  const turnosDelMesActual = computed(() => {
    return turnos.value.filter(turno => {
      if (!turno.fecha) return false
      const fechaTurno = new Date(turno.fecha)
      return (
        fechaTurno.getMonth() === currentMonth.value &&
        fechaTurno.getFullYear() === currentYear.value
      )
    })
  })

  const totalTurnos = computed(() => turnosDelMesActual.value.length)

const turnosPorEstado = computed(() => {
  return turnosDelMesActual.value.reduce((acc: Record<string, number>, turno) => {
    const estado = turno.estado || 'sin estado'
    acc[estado] = (acc[estado] || 0) + 1
    return acc
  }, {})
})

  return {
    // Estado
    totalTurnos,
    turnosDelMesActual,
    turnosPorEstado,
    turnos,
    consultorioFiltro,
    isLoading,
    fetchError,
    currentMonth,
    currentYear,

    // Getters
    consultoriosDisponibles,
    calendars,
    formattedEvents,
    eventsForMonth,

    // Acciones
    agregarTurno,
    actualizarTurno,
    fetchTurnos,
    setConsultorioFiltro,
    setCurrentMonth,
    setCurrentYear,
    navigateMonth,
  }
})
