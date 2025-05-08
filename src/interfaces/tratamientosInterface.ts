export interface Tratamiento {
  id_tratamiento?: number
  nombre?: string
  descripcion?: string
  costo?: number | null
  duracion?: string | number | null // Ajustado para coincidir con los datos del backend
  color?: string | null
}

export interface TratamientoApi {
  id_tratamiento: number
  nombre_tratamiento: string
  descripcion_tratamiento: string
  costo_tratamiento: number | null
  duracion_tratamiento: string | number | null // Ajustado para coincidir con los datos del backend
  color_tratamiento: string | null
}
