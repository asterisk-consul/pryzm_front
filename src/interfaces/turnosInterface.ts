export interface Turno {
  id_paciente: number | null
  id_turno?: number
  nombre_consultorio: string | null
  duracion_tratamiento: number
  fecha: string
  hora: string
  estado: string
  nombre_paciente: string
  apellido_paciente: string
  nombre_tratamiento: string
  color_tratamiento: string
  id_consultorio: number | null
  id_tratamiento: number | null
}
