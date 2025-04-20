export interface Evento {
  event?: Evento
  id?: string
  calendarId?: string
  title?: string
  body?: string
  isAllday?: boolean
  start?: Date | string | number
  end?: Date | string | number
  goingDuration?: number
  comingDuration?: number
  location?: string
  attendees?: string[]
  category?: 'milestone' | 'task' | 'allday' | 'time'
  recurrenceRule?: string
  state?: 'Busy' | 'Free'
  isVisible?: boolean
  isPending?: boolean
  isFocused?: boolean
  isReadOnly?: boolean
  isPrivate?: boolean
  color?: string
  backgroundColor?: string
  dragBackgroundColor?: string
  borderColor?: string
  customStyle?: Partial<CSSStyleDeclaration>
  raw?: Record<string, unknown>
  id_consultorio?: number
}

export interface FormattedEvent {
  id: string
  calendarId: string
  title: string
  body: string
  start: Date
  end: Date
  category: string
  isAllday: boolean
  backgroundColor: string
  borderColor: string
  raw: {
    id_paciente: number
    id_consultorio: number
    id_tratamiento: number
    estado: string
  }
}

export interface CalendarInstance {
  prev: () => void
  next: () => void
  today: () => void
  changeView: (view: ViewType) => void
  getDate: () => Date
  setDate: (date: Date) => void
  setOptions: (options: Calendar, silent?: boolean) => void
  // ... otros métodos que uses
}
export type CalendarView = 'month' | 'week' | 'day' | 'list'
export interface CalendarRef {
  getInstance: () => CalendarInstance
}
export type ViewType = CalendarView
export interface ViewOption {
  value: ViewType
  label: string
  needsDateReset?: boolean
}

export interface Calendar {
  id: string
  name: string
}
