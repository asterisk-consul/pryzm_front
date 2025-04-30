import type { Paciente } from './pacientesInterface'
import type { Tratamiento } from './tratamientosInterface'
import type { Turno } from './turnosInterface'
import type { Consultorio } from './consultorioInterface'
import type { Evento, FormattedEvent } from './calendarInterface'

// Tipos y interfaces del calendario
export type { CalendarView, ViewType } from './calendarInterface'
export type { ViewOption } from './calendarInterface'
export type { CalendarRef } from './calendarInterface'
export type { CalendarInstance } from './calendarInterface'
export type { Calendar } from './calendarInterface'
export type { Evento } from './calendarInterface'
export type { FormattedEvent } from './calendarInterface'
export type { TemplateMonthDayName } from './interfacesTuiCalendar'
export type { TemplateMoreTitleDate } from './interfacesTuiCalendar'
export type { TemplateNow } from './interfacesTuiCalendar'

// Interfaces de entidades principales
export type { Consultorio } from './consultorioInterface'
export type { Paciente } from './pacientesInterface'
export type { Tratamiento } from './tratamientosInterface'
export type { Turno } from './turnosInterface'

export type { Alert } from './Alert'
export type { User, SignupField, ValidationRule } from './authInterfaces'

// Tipos compuestos (opcional, puedes agregar más según necesites)
export interface TurnoCompleto extends Turno {
  paciente?: Paciente
  consultorio?: Consultorio
  tratamiento?: Tratamiento
}

export interface EventoConDetalles extends Evento {
  paciente?: Paciente
  tratamiento?: Tratamiento
  consultorio?: Consultorio
}

// Tipos utilitarios para el calendario
export type CalendarEvent = Evento | FormattedEvent

export type ModalType = 'create' | 'edit' | 'view' | 'delete'

// Tipo para los filtros
export interface FiltrosCalendario {
  consultorios?: string[]
  tratamientos?: string[]
  estados?: string[]
  fechaInicio?: Date
  fechaFin?: Date
}
