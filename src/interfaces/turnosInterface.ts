export interface Turno {
  id_turno?: number | null
  id_paciente: number | null
  id_consultorio: number | null
  id_tratamiento: number | null
  fecha: string
  hora: string
  nombre_consultorio: string
  nombre_tratamiento: string
  duracion_tratamiento: number | null
  estado: string
  nombre_paciente: string
  apellido_paciente: string
  costo_tratamiento: number | null
  color_tratamiento: string
}
