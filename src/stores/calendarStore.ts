import { defineStore } from 'pinia'
import { ref, watchEffect, watch } from 'vue'
import type {
  CalendarView,
  ViewType,
  CalendarRef,
  CalendarInstance,
} from '@/interfaces/calendarInterface'

export const useCalendarStore = defineStore('calendar', () => {
  const currentDate = ref<Date>(new Date())
  const savedView = localStorage.getItem('calendar_view') as ViewType | null
  const currentView = ref<CalendarView>(savedView || 'month')
  const calendarRef = ref<CalendarRef | null>(null)
  const calendarInstance = ref<CalendarInstance | null>(null)
  const calendarHeight = ref(localStorage.getItem('calendar_height') || '300vh')

  // Configuración de horarios

  const horainicio = ref(JSON.parse(localStorage.getItem('calendar_horainicio') || '7'))
  const horafin = ref(JSON.parse(localStorage.getItem('calendar_horafin') || '22'))

  // controla como ver la semana
  const savedWorkweek = localStorage.getItem('calendar_workweek')
  const savedNarrowWeekend = localStorage.getItem('calendar_narrow_weekend')
  const workweek = ref(savedWorkweek !== null ? JSON.parse(savedWorkweek) : true)
  const narrowWeekend = ref(savedNarrowWeekend !== null ? JSON.parse(savedNarrowWeekend) : true)

  watch(workweek, (val) => {
    localStorage.setItem('calendar_workweek', JSON.stringify(val))
    updateOptions()
  })

  watch(narrowWeekend, (val) => {
    localStorage.setItem('calendar_narrow_weekend', JSON.stringify(val))
    updateOptions()
  })
  function updateOptions() {
    if (calendarInstance.value) {
      calendarInstance.value.setOptions(
        {
          month: { workweek: workweek.value, narrowWeekend: narrowWeekend.value },
          week: { workweek: workweek.value, narrowWeekend: narrowWeekend.value },
        },
        true,
      )
    }
  }

  const setCalendarHeight = (height: string) => {
    calendarHeight.value = height
    localStorage.setItem('calendar_height', height) // Persistencia
    updateCalendarHeight() // Actualización en tiempo real
  }

  // Actualiza la instancia del calendario (si existe)
  const updateCalendarHeight = () => {
    syncCalendarState() // Forzar recarga de la vista
  }

  watch(horainicio, (val) => {
    localStorage.setItem('calendar_horainicio', JSON.stringify(val))
    updateHoras()
  })
  watch(horafin, (val) => {
    localStorage.setItem('calendar_horafin', JSON.stringify(val))
    updateHoras()
  })

  function updateHoras() {
    if (calendarInstance.value) {
      calendarInstance.value.setOptions(
        {
          week: {
            hourStart: horainicio.value,
            hourEnd: horafin.value,
          },
        },
        true,
      )
    }
  }

  // Sincronización inicial cuando se establece la referencia
  watchEffect(() => {
    if (calendarRef.value) {
      calendarInstance.value = calendarRef.value.getInstance()
      syncCalendarState()
      updateOptions()
    }
  })

  // Sincroniza el estado del store con el calendario
  function syncCalendarState() {
    if (!calendarInstance.value) return

    calendarInstance.value.setDate(currentDate.value)
    calendarInstance.value.changeView(currentView.value)
  }

  // Métodos de navegación
  function prev() {
    navigate(-1)
  }

  function next() {
    navigate(1)
  }

  function setToCurrentDate() {
    calendarInstance.value?.today()

    updateCurrentDate()
  }
  function navigate(offset: number) {
    const newDate = new Date(currentDate.value)

    switch (currentView.value) {
      case 'day':
        newDate.setDate(newDate.getDate() + offset)
        break
      case 'week':
        newDate.setDate(newDate.getDate() + 7 * offset)
        break
      case 'month':
      case 'list': // Tratamos 'list' igual que 'month'
        newDate.setMonth(newDate.getMonth() + offset)
        break
    }

    currentDate.value = newDate

    // Sincroniza con el calendario TUI si no estamos en vista 'list'
    if (currentView.value !== 'list' && calendarInstance.value) {
      calendarInstance.value.setDate(currentDate.value)
    }

    localStorage.setItem('calendar_current_date', currentDate.value.toISOString())
  }

  function setCurrentDate(date: Date) {
    // Si estamos en vista mensual, ajustar al primer día del mes
    if (currentView.value === 'month') {
      date = new Date(date.getFullYear(), date.getMonth(), 1)
    }

    currentDate.value = date

    if (currentView.value !== 'list' && calendarInstance.value) {
      calendarInstance.value.setDate(date)
    }
  }
  function handleViewChange(view: ViewType) {
    currentView.value = view
    calendarInstance.value?.changeView(view)
    if (view !== 'list') {
      setToCurrentDate()
    }
  }

  function updateCurrentDate() {
    if (calendarInstance.value) {
      const timestamp = calendarInstance.value.getDate()
      currentDate.value = new Date(timestamp)
    }
  }

  return {
    horainicio,
    horafin,
    workweek,
    narrowWeekend,
    currentDate,
    currentView,
    calendarRef,
    calendarInstance,
    prev,
    next,
    setToCurrentDate,
    handleViewChange,
    syncCalendarState,
    navigate,
    setCurrentDate,
    updateHoras,
    setCalendarHeight,
    calendarHeight,
    updateCalendarHeight,
  }
})
