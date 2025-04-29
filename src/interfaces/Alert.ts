export interface Alert {
  // Estado de visibilidad
  show: boolean

  // Tipo de alerta (define el color)
  type: 'success' | 'error' | 'warning' | 'info' | string

  // Mensaje principal
  message: string

  // Opcional: Título del alert
  title?: string

  // Opcional: Icono a mostrar
  icon?: string

  // Opcional: Tiempo de duración personalizado
  timeout?: number

  // Opcional: Posición en pantalla
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'

  // Opcional: Acciones personalizadas
  actions?: Array<{
    text: string
    color?: string
    handler: () => void
  }>
}
