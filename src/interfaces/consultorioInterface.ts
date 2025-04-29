import type { Tratamiento } from './tratamientosInterface'

// export interface Consultorio {
//   id_consultorio: number
//   nombre_consultorio: string
//   id_tratamiento?: number
//   nombre_tratamiento?: string
//   descripcion_tratamiento?: string
//   tratamientos: Tratamiento[]
//   costo_tratamiento?: number
//   duracion_tratamiento?: string
//   color_tratamiento?: string
// }

export interface Consultorio {
  id_consultorio?: number
  nombre_consultorio: string
  tratamientos: Tratamiento[]
  displayText?: string
}
