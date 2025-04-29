export interface User {
  // Información básica
  nombre?: string
  email?: string

  // Datos de contacto
  telefono?: string
  ciudad?: string // Opcional
  direccion?: string // Opcional
  pais?: string // Opcional

  // Seguridad
  password?: string
  confirmPassword?: string // Para formularios de registro

  // Roles y permisos
  rol_id?: number
  isActive?: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
}
export type SignupField = {
  name: keyof User
  label: string
  icon: string
  rules?: ValidationRule[] // Más específico que any[]
}

export type ValidationRule = (value: any) => boolean | string
