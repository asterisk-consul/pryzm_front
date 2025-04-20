import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'
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

  // Sincronización inicial cuando se establece la referencia
  watchEffect(() => {
    if (calendarRef.value) {
      calendarInstance.value = calendarRef.value.getInstance()
      syncCalendarState()
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

    if (currentView.value === 'day') {
      calendarInstance.value?.setOptions(
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
  }
})
