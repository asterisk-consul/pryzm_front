import { computed } from 'vue'
import { useTheme } from 'vuetify'

import type { Evento } from '@/interfaces/index'
import { formatTime } from '@/utils/formatDateTime'

// import { formatTime } from '@/utils/formatDateTime' // ruta según tu proyecto
// import { Calendar } from '@/interfaces/models'

export function useCalendarOptions() {
  const theme = useTheme()
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
    dayNames: ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'],
    startDayOfWeek: 1,
    visibleWeeksCount: 6,
    isAlways6Weeks: true,
    visibleEventCount: 4,
    narrowWeekend: true,
    workweek: true,
  }))

  const weekOptions = computed(() => ({
    startDayOfWeek: 1,
    dayNames: ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'],
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

  const calendarTemplate = {
    // Template para eventos en la vista mensual

    timezoneDisplayLabel({ timezoneOffset }) {
      const sign = timezoneOffset < 0 ? '-' : '+'
      const hours = Math.abs(timezoneOffset / 60)
      const minutes = Math.abs(timezoneOffset % 60)

      return `GMT${sign}${hours}:${minutes}`
    },
    time(event: Evento) {
      return `<div style="color: ${event.color}; font-weight: bold; background-color: ${event.backgroundColor}; border-radius: 4px; padding: 2px;">${formatTime(new Date(event.start))} : ${event.title.toUpperCase()}</div>`
    },
  }
  const myTheme = computed(() => ({
    common: {
      border: '1px solid ' + theme.global.current.value.colors.border,
      backgroundColor: theme.global.current.value.colors.background,
      holiday: { color: theme.global.current.value.colors.error }, // reemplaza #f54f3d
      saturday: { color: theme.global.current.value.colors.primary }, // reemplaza #135de6
      dayName: { color: theme.global.current.value.colors['on-background'] },
      today: { color: theme.global.current.value.colors.success }, // reemplaza #009688
      // reemplaza #009688
      gridSelection: {
        backgroundColor: theme.global.current.value.colors['background-list'],
        border: '1px solid ' + theme.global.current.value.colors.primary,
      },
      gridCell: {
        footerHeight: 31,
      },
    },
    month: {
      dayName: {
        border: '1px solid ' + theme.global.current.value.colors.border,
        color: theme.global.current.value.colors['on-background'],
      },
      today: {
        color: theme.global.current.value.colors.success, // reemplaza #009688
        backgroundColor: theme.global.current.value.colors['background-list'],
      },
      pastDay: { color: theme.global.current.value.colors['th-grey-600'] }, // reemplaza #999
      holidayExceptThisMonth: { color: theme.global.current.value.colors['error-darken-1'] }, // reemplaza #f3acac
      dayExceptThisMonth: { color: theme.global.current.value.colors['th-grey-500'] }, // reemplaza #bbb
      weekend: { backgroundColor: theme.global.current.value.colors['th-grey-50'] }, // reemplaza #fafafa
      moreView: {
        border: '1px solid' + theme.global.current.value.colors.border,
        boxShadow: '0 2px 6px 0 rgba(0, 0, 0, 0.1)',
        backgroundColor: theme.global.current.value.colors.surface,
        width: null,
        height: null,
      },
      moreViewTitle: {
        backgroundColor: theme.global.current.value.colors['on-background'],
      }, // reemplaza #f4f4f4
    },
    week: {
      dayName: {
        borderTop: '1px solid ' + theme.global.current.value.colors.border,
        borderBottom: '1px solid ' + theme.global.current.value.colors.border,
        borderLeft: '1px solid ' + theme.global.current.value.colors.border,
        backgroundColor: 'inherit',
      },
      today: {
        color: theme.global.current.value.colors.success, // reemplaza #009688
        backgroundColor: 'inherit',
      },
      pastDay: { color: theme.global.current.value.colors['th-grey-600'] }, // reemplaza #999
      panelResizer: { border: '1px solid ' + theme.global.current.value.colors.border },
      dayGrid: { borderRight: '1px solid ' + theme.global.current.value.colors.border },
      dayGridLeft: {
        width: '100px',
        backgroundColor: 'inherit',
        borderRight: '1px solid ' + theme.global.current.value.colors.border,
      },
      weekend: { backgroundColor: 'inherit' },
      timeGridLeft: {
        width: '100px',
        backgroundColor: theme.global.current.value.colors['th-grey-50'], // reemplaza #fafafa
        borderRight: '1px solid ' + theme.global.current.value.colors.border,
      },
      timeGridLeftAdditionalTimezone: {
        backgroundColor: theme.global.current.value.colors['th-grey-100'], // reemplaza #fdfdfd
      },
      timeGridHourLine: {
        borderBottom: '1px solid ' + theme.global.current.value.colors['th-grey-200'], // reemplaza #eee
      },
      timeGridHalfHourLine: {
        borderBottom: '1px dotted ' + theme.global.current.value.colors['th-grey-100'], // reemplaza #f9f9f9
      },
      timeGrid: { borderRight: '1px solid ' + theme.global.current.value.colors.border },
      nowIndicatorLabel: { color: theme.global.current.value.colors.primary },
      nowIndicatorPast: {
        border: '1px solid rgba(19, 93, 230, 0.3)', // podrías dejarlo así o ajustar
      },
      nowIndicatorBullet: { backgroundColor: theme.global.current.value.colors.primary },
      nowIndicatorToday: { border: '1px solid ' + theme.global.current.value.colors.primary },
      nowIndicatorFuture: { border: '1px solid ' + theme.global.current.value.colors.primary },
      pastTime: { color: theme.global.current.value.colors['th-grey-600'] }, // reemplaza #999
      futureTime: { color: theme.global.current.value.colors['th-grey-900'] }, // reemplaza #333
      gridSelection: { color: theme.global.current.value.colors.primary }, // reemplaza #135de6
    },
  }))

  return {
    timezoneOptions,
    monthOptions,
    weekOptions,
    myTheme,
    calendarTemplate,
  }
}
