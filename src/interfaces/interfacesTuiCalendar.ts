import type { TZDate } from 'toast-ui-calendar-vue3'

export interface TemplateMonthDayName {
  day: number // The day of the week for that date
  label: string // Basic English abbreviation string for the day of the week
}

export interface TemplateWeekDayName {
  date: number // day of the week
  day: number // The day of the week
  dayName: string // Basic English abbreviation string for the day of the week
  isToday: boolean // Whether the day of the week is today
  renderDate: string // Base date of weekly/daily view rendering
  dateInstance: TZDate // `Date` object for the day of the week
}

export interface TemplateMoreTitleDate {
  ymd: string // `YYYY-MM-DD` string format data of the date
  date: number // Date number of the date
  day: number // Day of the week for the date
}

type TimeUnit = 'second' | 'minute' | 'hour' | 'date' | 'month' | 'year'
export interface TemplateNow {
  unit: TimeUnit // Unit of time
  time: TZDate // the time
  format: string // format of the time
}
