export interface Tratamiento {
  id_tratamiento: number
  nombre: string
  descripcion: string
  costo: number
  duracion: string | number // Ajustado para coincidir con los datos del backend
  color: string
}
