import { computed } from 'vue'
import { useTheme } from 'vuetify'

import type { Evento } from '@/interfaces/index'
import { formatTime } from '@/utils/formatDateTime'
import { ColorUtils } from '@/utils/colorUtils'

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
    dayNames: ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'],
    startDayOfWeek: 1,
    visibleWeeksCount: 6,
    isAlways6Weeks: true,
    visibleEventCount: 4,
  }))

  const weekOptions = computed(() => ({
    startDayOfWeek: 1,
    dayNames: ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'],
    showNowIndicator: true,
    taskView: false,
    eventView: ['time'],
    calendars: [],
  }))

  const calendarTemplate = {
    // Template para eventos en la vista mensual
    monthDayName(model) {
      return `
          <div style=" font-size: 1rem; padding-top: 9px;
                display: flex; justify-content: center; align-items: center;
                height: 100%; text-align: center;">
      ${model.label}
    </div>`
    },
    monthMoreTitleDate(moreTitle) {
      const { date, day } = moreTitle

      // Mapa de días de la semana en español
      const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
      const dayName = daysOfWeek[day] // Accede al nombre del día según el valor de `day`

      return `<span>Eventos del día ${dayName} ${date}</span>` // Aquí personalizas el título
    },
    monthMoreClose() {
      const colors = theme.global.current.value.colors
      return `
        <button
          class="toastui-calendar-template-monthMoreClose"
          style="color:${colors['on-background']}; --hover-bg: ${colors['background-list']};"
        >
          <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:currentColor">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
      `
    },
    monthGridHeaderExceed(hiddenEvents) {
      return `<span>${hiddenEvents} more</span>`
    },

    weekGridFooterExceed(hiddenEvents) {
      return `+${hiddenEvents}`
    },

    timegridDisplayPrimaryTime({ time }) {
      // Formatea la hora para mostrar cada 30 minutos claramente
      const hours = time.getHours()
      const minutes = time.getMinutes()
      return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`
    },
    weekDayName(model) {
      const dateObj = model.dateInstance.d
      const day = dateObj.getDate()
      const month = dateObj.getMonth() + 1
      const dayName = model.dayName.charAt(0).toUpperCase() + model.dayName.slice(1).toLowerCase()
      return `<span style="font-weight: bold; font-size: 1.2rem">${day}/${month}</span>&nbsp;&nbsp;<span style=" font-size: 1.2rem">${dayName}</span>`
    },
    time(event: Evento) {
      return `<div class="toastui-calendar-weekday-event" style="--border-color: ${event.color};color: ${ColorUtils.increaseVibrancy(event.dragBackgroundColor, 0.2)}; font-weight: bold; --bg-color: ${ColorUtils.reduceOpacity(ColorUtils.darkenColor(event.backgroundColor, 0.3), 0.2)}; border-radius: 4px; padding: 2px;"><div class="toastui-calendar-weekday-event-title">
      ${formatTime(new Date(event.start))} : ${event.title.toUpperCase()}
    </div></div>`
    },
  }
  const myTheme = computed(() => {
    const colors = theme.global.current.value.colors

    return {
      common: {
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.background,
        holiday: { color: colors.error },
        saturday: { color: colors.primary },
        dayName: { color: colors['on-background'] },
        today: { color: colors.primary },
        gridSelection: {
          backgroundColor: colors['background-list'],
          border: `1px solid ${colors.primary}`,
        },
        gridSelectionBorder: { border: `1px solid ${colors.primary}` },
      },
      month: {
        dayName: {
          backgroundColor: 'inherit',
        },
        today: {
          color: colors.warning,
          backgroundColor: colors['background-list'],
        },
        pastDay: { color: colors['th-grey-600'] },
        holidayExceptThisMonth: { color: colors['error-darken-1'] },
        dayExceptThisMonth: { color: colors['th-grey-500'] },
        weekend: { backgroundColor: colors['th-grey-50'] },

        moreView: {
          border: `1px solid ${colors.border}`,
          boxShadow: '0 2px 6px 0 rgba(0, 0, 0, 0.1)',
          backgroundColor: colors.background,
          width: 500,
          height: 'fit-content',
        },
        moreViewTitle: {
          backgroundColor: colors.background,
        },
      },
      week: {
        dayName: {
          borderTop: `1px solid ${colors.border}`,
          borderBottom: `1px solid ${colors.border}`,
          borderLeft: `1px solid ${colors.border}`,
          backgroundColor: 'inherit',
        },

        today: {
          color: colors.warning,
          backgroundColor: 'inherit',
        },
        pastDay: { color: colors['th-grey-600'] },
        panelResizer: { border: `1px solid ${colors.border}` },
        dayGrid: { borderRight: `1px solid ${colors.border}` },
        dayGridLeft: {
          width: '100px',
          backgroundColor: 'inherit',
          borderRight: `1px solid ${colors.border}`,
        },
        weekend: { backgroundColor: 'inherit' },
        timeGridLeft: {
          width: '70px',
          backgroundColor: colors['on-surface-variant'],
          borderRight: `1px solid ${colors.border}`,
        },
        timeGridLeftAdditionalTimezone: {
          backgroundColor: "colors['th-grey-100']",
        },
        timeGridHourLine: {
          borderBottom: `1px solid ${colors['th-grey-200']}`,
        },
        timeGridHalfHourLine: {
          borderBottom: `1px dotted ${colors.border}`,
        },
        timeGrid: { borderRight: `1px solid ${colors.border}` },
        nowIndicatorLabel: { color: colors.primary },
        nowIndicatorPast: {
          border: '1px solid rgba(19, 93, 230, 0.3)',
        },
        nowIndicatorBullet: { backgroundColor: colors.primary },
        nowIndicatorToday: { border: `1px solid ${colors.primary}` },
        nowIndicatorFuture: { border: `1px solid ${colors.primary}` },
        pastTime: { color: colors['th-grey-600'] },
        futureTime: { color: colors['th-grey-900'] },
        gridSelection: { color: colors.primary },
      },
    }
  })

  // Tema reactivo controlado (shallowRef para evitar reactividad profunda)

  return {
    timezoneOptions,
    monthOptions,
    weekOptions,
    myTheme,
    calendarTemplate,
  }
}
