export interface Tratamiento {
  id_tratamiento?: number
  nombre?: string
  descripcion?: string
  costo?: number | null
  duracion?: string | number | null // Ajustado para coincidir con los datos del backend
  color?: string | null
}
