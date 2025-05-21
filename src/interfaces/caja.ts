export interface Caja {
    id: number
    nombre: string
    descripcion: string
    sucursal_id: number
  }
  
  export interface AperturaCajaPayload {
    caja_id: number
    usuario_id: number
    monto_inicial: number
    observaciones?: string
  }
  
  export interface MovimientoCajaPayload {
    apertura_caja_id: number
    tipo_movimiento: 'ingreso' | 'egreso'
    origen: string
    origen_id?: number
    descripcion: string
    monto: number
    medio_pago: string
  }
  
  export interface CierreCajaPayload {
    apertura_caja_id: number
    monto_final: number
    observaciones?: string
  }
  