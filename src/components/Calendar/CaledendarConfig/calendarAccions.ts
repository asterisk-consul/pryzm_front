import type { Ref } from 'vue'
import type { CalendarView, ViewType, CalendarRef } from '@/interfaces/models'

export function useCalendarActions(
  calendarRef: Ref<CalendarRef | null>,
  currentDate: Ref<Date>,
  currentView: Ref<CalendarView>,
) {
  /**
   * Navega a la fecha anterior en el calendario
   * @example prev() // Retrocede un mes/semana/día según la vista actual
   */
  const prev = () => {
    const calendarInstance = calendarRef.value?.getInstance()
    if (!calendarInstance) return

    calendarInstance.prev()
    const timestamp = calendarInstance.getDate()
    currentDate.value = new Date(timestamp)
  }

  /**
   * Navega a la fecha siguiente en el calendario
   * @example next() // Avanza un mes/semana/día según la vista actual
   */
  const next = () => {
    const calendarInstance = calendarRef.value?.getInstance()
    if (!calendarInstance) return

    calendarInstance.next()
    const timestamp = calendarInstance.getDate()
    currentDate.value = new Date(timestamp)
  }

  /**
   * Establece el calendario en la fecha actual
   * @example setToCurrentDate() // Centra el calendario en hoy
   */
  const setToCurrentDate = () => {
    const calendarInstance = calendarRef.value?.getInstance()
    if (!calendarInstance) return

    calendarInstance.today()
    const timestamp = calendarInstance.getDate()
    currentDate.value = new Date(timestamp)

    if (currentView.value === 'day') {
      calendarInstance.setOptions(
        {
          week: {
            hourStart: 7,
            hourEnd: 22,
          },
        },
        true,
      )
    }
  }
  /**
   * Maneja el cambio de vista del calendario
   * @param {ViewType} view - Nueva vista ('day' | 'week' | 'month')
   * @example handleViewChange('week') // Cambia a vista semanal
   */
  const handleViewChange = (view: ViewType) => {
    currentView.value = view
    if (view !== 'list') {
      setToCurrentDate() // Solo resetear fecha para vistas temporales
    }
  }

  return {
    prev,
    next,
    setToCurrentDate,
    handleViewChange,
  }
}
