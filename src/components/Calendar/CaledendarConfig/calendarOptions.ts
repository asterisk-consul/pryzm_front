import { computed } from 'vue'
// import { formatTime } from '@/utils/formatDateTime' // ruta según tu proyecto
// import { Calendar } from '@/interfaces/models'

export function useCalendarOptions() {
  const timezoneOptions = {
    zones: [
      {
        timezoneName: 'America/Argentina/Buenos_Aires',
        displayLabel: 'Hora Argentina',
      },
    ],
    displayLabel: 'ART',
    tooltip: 'Hora estándar de Argentina (UTC-3)',
  }

  const monthOptions = computed(() => ({
    dayNames: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    startDayOfWeek: 1,
    visibleWeeksCount: 6,
    isAlways6Weeks: true,
    narrowWeekend: true,
    workweek: true,
  }))

  const weekOptions = computed(() => ({
    startDayOfWeek: 1,
    dayNames: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    narrowWeekend: true,
    workweek: true,
    showNowIndicator: true,
    hourStart: 7,
    hourEnd: 22,
    taskView: false,
    eventView: ['time'],
    timeGrid: {
      column: 7,
      interval: 30,
      displayHour: true,
      displayCurrentTime: true,
    },
  }))

  // const calendarTemplates = {
  //   popupDetailTitle: (event: Evento) => {
  //     return `
  //       <div style="font-weight:bold; margin-bottom:8px;">
  //         ${event.nombre_tratamiento}
  //       </div>
  //     `
  //   },
  //   popupDetailBody: (event: Evento) => {
  //     const calendarName = calendars.find((c) => c.id === event.calendarId)?.name || 'No definido'
  //     return `
  //       <div>
  //         <div><strong>Tratamiento:</strong> ${event.nombre_tratamiento}</div>
  //         <div><strong>Consultorio:</strong> ${calendarName}</div>
  //         <div><strong>Hora:</strong> ${formatTime(event.start)} - ${formatTime(event.end)}</div>
  //       </div>
  //     `
  //   },
  // }

  return {
    timezoneOptions,
    monthOptions,
    weekOptions,
    // calendarTemplates,
  }
}
